import 'dotenv/config'
import { type Hex, parseGwei, parseUnits } from 'viem'

export const path = process.env.DERIVATION_PATH ?? "m/44'/60'/0'/0/0"

export const feePerGas = parseGwei(process.env.FEE_PER_GAS ?? '10')

export const amount = parseUnits(process.env.AMOUNT ?? '99999', 6)

export const transaction = process.env.TRANSACTION as Hex
