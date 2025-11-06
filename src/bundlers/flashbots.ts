import { type Address, type Hash, type Hex, keccak256, type PrivateKeyAccount, toHex } from 'viem'

// https://docs.flashbots.net/flashbots-auction/advanced/rpc-endpoint#eth_sendbundle
export async function sendFlashbotsBundle(
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

// https://docs.flashbots.net/flashbots-auction/advanced/rpc-endpoint#eth_callbundle
export async function simulateFlashbotsBundle(
  serializeTransaction: Hex,
  wallet: PrivateKeyAccount,
  targetBlockNumber: bigint,
): Promise<string> {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_callBundle',
    params: [
      {
        txs: [serializeTransaction],
        blockNumber: `0x${targetBlockNumber.toString(16)}`,
        stateBlockNumber: `0x${(targetBlockNumber - 1n).toString(16)}`,
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
    | {
        result: {
          bundleGasPrice: string
          bundleHash: Hash
          coinbaseDiff: string
          ethSentToCoinbase: string
          gasFees: string
          results: [
            {
              coinbaseDiff: string
              ethSentToCoinbase: string
              fromAddress: Address
              gasFees: string
              gasPrice: string
              gasUsed: number
              revert: Hex
              toAddress: Address
              txHash: Hash
              value: null
            },
          ]
          stateBlockNumber: number
          totalGasUsed: number
        }
      }
    | { error: { code: number; message: string } }
  if ('error' in json) {
    throw new Error(json.error.message)
  }
  return json.result.results[0].revert
}
