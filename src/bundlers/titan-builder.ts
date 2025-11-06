import { type Hash, type Hex, keccak256, type PrivateKeyAccount, toHex } from 'viem'

// https://docs.titanbuilder.xyz/api/eth_sendbundle
export async function sendTitanBuilderBundle(
  serializeTransaction: Hex,
  wallet: PrivateKeyAccount,
  targetBlockNumber: bigint,
): Promise<Hash> {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_sendBundle',
    params: [{ txs: [serializeTransaction], blockNumber: `0x${targetBlockNumber.toString(16)}` }],
    id: 1,
  })
  const signature = `${wallet.address}:${await wallet.signMessage({ message: keccak256(toHex(body)) })}`
  const response = await fetch('https://rpc.titanbuilder.xyz', {
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
