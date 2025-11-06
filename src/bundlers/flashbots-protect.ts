import type { Hash, Hex } from 'viem'
import { builders } from '../builders'

// https://docs.flashbots.net/flashbots-protect/settings-guide
export async function sendFlashbotsProtect(serializeTransaction: Hex) {
  const body = JSON.stringify({
    jsonrpc: '2.0',
    method: 'eth_sendRawTransaction',
    params: [serializeTransaction],
    id: 1,
  })
  const response = await fetch(
    `https://rpc.flashbots.net?${builders.map(({ name }) => `builder=${encodeURIComponent(name)}`).join('&')}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
    },
  )
  const json = (await response.json()) as
    | { result: Hash }
    | { error: { code: number; message: string } }
  if ('error' in json) {
    throw new Error(json.error.message)
  }
  return json.result
}
