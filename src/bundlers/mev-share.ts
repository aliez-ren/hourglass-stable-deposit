import { type Hash, type Hex, keccak256, type PrivateKeyAccount, toHex } from 'viem'
import { builders } from '../builders'

// https://docs.flashbots.net/flashbots-auction/advanced/rpc-endpoint#mev_sendbundle
export async function sendMevShareBundle(
  serializeTransaction: Hex,
  wallet: PrivateKeyAccount,
  targetBlockNumber: bigint,
): Promise<Hash> {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'mev_sendBundle',
    params: [
      {
        version: 'v0.1',
        inclusion: { block: `0x${targetBlockNumber.toString(16)}` },
        body: [{ tx: serializeTransaction, canRevert: false }],
        privacy: { builders: builders.map(({ name }) => name) },
      },
    ],
    id: 1,
  })
  const signature = `${wallet.address}:${await wallet.signMessage({ message: keccak256(toHex(body)) })}`
  const response = await fetch('https://relay.flashbots.net', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-flashbots-signature': signature },
    body,
  })
  const json = (await response.json()) as
    | { result: { bundleHash: Hash } }
    | { error: { code: number; message: string } }
  if ('error' in json) {
    throw new Error(json.error.message)
  }
  return json.result.bundleHash
}
