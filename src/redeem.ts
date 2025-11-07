import { encodeFunctionData, erc20Abi, type Hash, serializeTransaction } from 'viem'
import { abi, chainId, client, gas, preUSDT, value, vault } from './utils/constant'
import { path } from './utils/env'
import { address, connectId, deviceId, passphraseState, SDK } from './utils/wallet'

const { maxFeePerGas, maxPriorityFeePerGas } = await client.estimateFeesPerGas()

const amount = await client.readContract({
  address: preUSDT,
  abi: erc20Abi,
  functionName: 'balanceOf',
  args: [address],
})

const nonce = await client.getTransactionCount({ address })

const data = encodeFunctionData({
  abi,
  functionName: 'redeemNonKyc',
  args: [amount, address, address],
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
    to: vault,
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

const hash = await client.sendRawTransaction({ serializedTransaction })

console.log(`https://etherscan.io/tx/${hash}`)

process.exit(0)
