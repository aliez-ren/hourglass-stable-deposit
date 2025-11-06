import 'dotenv/config'
import SDK from '@onekeyfe/hd-common-connect-sdk'
import {
  encodeFunctionData,
  erc20Abi,
  type Hash,
  parseTransaction,
  serializeTransaction,
} from 'viem'
import { chainId, client, gas, usdc, value, vault } from './constant'
import { address, connectId, deviceId, passphraseState, path } from './wallet'

const { maxFeePerGas, maxPriorityFeePerGas } = await client.estimateFeesPerGas()

const nonce = await client.getTransactionCount({ address })

const data = encodeFunctionData({
  abi: erc20Abi,
  functionName: 'approve',
  args: [vault, 0n],
})

console.log('waiting for signing')
const signedTransaction = await SDK.evmSignTransaction(connectId, deviceId, {
  path,
  passphraseState,
  transaction: {
    chainId,
    to: usdc,
    value: `0x${value.toString(16)}`,
    gasLimit: `0x${gas.toString(16)}`,
    maxFeePerGas: `0x${maxFeePerGas.toString(16)}`,
    maxPriorityFeePerGas: `0x${maxPriorityFeePerGas.toString(16)}`,
    nonce: `0x${nonce.toString(16)}`,
    data,
  },
})

if ('error' in signedTransaction.payload) {
  console.error(signedTransaction)
  process.exit(-4)
}

const serializedTransaction = serializeTransaction(
  {
    chainId,
    to: usdc,
    value,
    gas,
    maxFeePerGas,
    maxPriorityFeePerGas,
    nonce,
    data,
  },
  {
    r: signedTransaction.payload.r as Hash,
    s: signedTransaction.payload.s as Hash,
    v: BigInt(signedTransaction.payload.v),
  },
)

console.log(parseTransaction(serializedTransaction))

console.log(serializedTransaction)

const hash = await client.sendRawTransaction({ serializedTransaction })

console.log(`https://etherscan.io/tx/${hash}`)

process.exit(0)
