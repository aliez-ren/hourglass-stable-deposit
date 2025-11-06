import 'dotenv/config'
import type { Hex } from 'viem'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sendFlashbotsBundle } from './bundlers/flashbots'
import { sendFlashbotsProtect } from './bundlers/flashbots-protect'
import { sendMevShareBundle } from './bundlers/mev-share'
import { sendTitanBuilderBundle } from './bundlers/titan-builder'
import { client } from './constant'

const serializedTransaction = process.env.SERIALIZED_TRANSACTION as Hex

if (!serializedTransaction) {
  process.exit(-1)
}

async function onBlockNumber(blockNumber: bigint) {
  try {
    const wallet = privateKeyToAccount(generatePrivateKey())
    const targetBlockNumber = blockNumber + 1n
    const hashes = await Promise.all([
      sendFlashbotsProtect(serializedTransaction),
      sendFlashbotsBundle(serializedTransaction, wallet, targetBlockNumber),
      sendMevShareBundle(serializedTransaction, wallet, targetBlockNumber),
      sendTitanBuilderBundle(serializedTransaction, wallet, targetBlockNumber),
    ])
    console.log(blockNumber, ...hashes)
  } catch (err) {
    console.error(blockNumber, err)
  }
}

client.watchBlockNumber({
  onBlockNumber,
  emitMissed: true,
  emitOnBegin: true,
  pollingInterval: 3_000,
})
