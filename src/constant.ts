import { createPublicClient, fallback, http, parseAbi, parseUnits } from 'viem'
import { mainnet as ethereum } from 'viem/chains'

export const chainId = ethereum.id

export const vault = '0xd9b2CB2FBAD204Fc548787EF56B918c845FCce40'

export const usdc = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'

export const value = 0n

export const gas = 500_000n

export const amount = parseUnits('99999', 6)

export const client = createPublicClient({
  chain: ethereum,
  transport: fallback([
    http('https://eth.merkle.io'),
    http('https://mainnet.gateway.tenderly.co'),
    http('https://eth.llamarpc.com'),
    http('https://eth.drpc.org'),
    http('https://ethereum-rpc.publicnode.com'),
  ]),
})

export const abi = parseAbi(['function deposit(uint256 assets, address receiver) public'])
