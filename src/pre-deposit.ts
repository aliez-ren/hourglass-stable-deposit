import 'dotenv/config'
import {
  encodeFunctionData,
  formatEther,
  formatUnits,
  type Hash,
  parseGwei,
  parseTransaction,
  serializeTransaction,
} from 'viem'
import { abi, amount, chainId, client, gas, value, vault } from './constant'
import { address, connectId, deviceId, passphraseState, path, SDK } from './wallet'

const feePerGas = parseGwei(process.env.FEE_PER_GAS ?? '10')

console.log(formatEther(feePerGas * gas), 'ETH')

const nonce = await client.getTransactionCount({ address })

console.log(formatUnits(amount, 6), 'USDC')

const data = encodeFunctionData({
  abi,
  functionName: 'deposit',
  args: [amount, address],
})

console.log('waiting for signing')
const signedTransaction = await SDK.evmSignTransaction(connectId, deviceId, {
  path,
  passphraseState,
  transaction: {
    chainId,
    to: vault,
    value: `0x${value.toString(16)}`,
    gasLimit: `0x${gas.toString(16)}`,
    maxFeePerGas: `0x${feePerGas.toString(16)}`,
    maxPriorityFeePerGas: `0x${feePerGas.toString(16)}`,
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
    to: vault,
    value,
    gas,
    maxFeePerGas: feePerGas,
    maxPriorityFeePerGas: feePerGas,
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
