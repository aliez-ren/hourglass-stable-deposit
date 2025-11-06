import pMap from 'p-map'
import { generatePrivateKey, privateKeyToAccount } from 'viem/accounts'
import { sendFlashbotsBundle } from './bundlers/flashbots'
import { sendFlashbotsProtect } from './bundlers/flashbots-protect'
import { sendMevShareBundle } from './bundlers/mev-share'
import { sendTitanBuilderBundle } from './bundlers/titan-builder'
import { client } from './utils/constant'
import { transactions } from './utils/env'

if (!transactions.length) {
  console.error('env TRANSACTIONS not set')
  process.exit(-1)
}

async function onBlockNumber(blockNumber: bigint) {
  await pMap(transactions, async (transaction) => {
    try {
      const wallet = privateKeyToAccount(generatePrivateKey())
      const targetBlockNumber = blockNumber + 1n
      const hashes = await Promise.all([
        sendFlashbotsProtect(transaction),
        sendFlashbotsBundle(transaction, wallet, targetBlockNumber),
        sendMevShareBundle(transaction, wallet, targetBlockNumber),
        sendTitanBuilderBundle(transaction, wallet, targetBlockNumber),
      ])
      console.log(blockNumber, ...hashes)
    } catch (err) {
      console.error(blockNumber, err)
    }
  })
}

client.watchBlockNumber({
  onBlockNumber,
  emitMissed: true,
  emitOnBegin: true,
  pollingInterval: 3_000,
})
