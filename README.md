# Hourglass Stable Deposit

## Links

- Vault: https://etherscan.io/address/0xd9b2cb2fbad204fc548787ef56b918c845fcce40
- Safe: https://app.safe.global/transactions/queue?safe=eth:0xD058F0203977Cc1380D41EB963B7d5890aebb679

## Prepare

1. A OneKey hardware wallet. [Get 5% OFF](https://onekey.so/r/TAOLITOOLS)

2. Install [Bun](https://bun.sh/)
```bash
curl -fsSL https://bun.sh/install | bash
```

3. Clone repo
```bash
git clone https://github.com/aliez-ren/hourglass-stable-deposit.git
cd hourglass-stable-deposit.git
```

4. Install dependencies
```bash
bun i
```

## Run

1. Approve USDC
```bash
bun run approve
```

2. Prepare deposit transaction, then copy the transaction hex
```bash
bun run pre-deposit
```

3. Create a `.env` file (you can copy from `.env.example`)
  - `DERIVATION_PATH` keep default if you don't understand
  - `FEE_PER_GAS` unit is Gwei
  - `AMOUNT` is the USDC amount you want to deposit
  - `TRANSACTIONS` **paste transaction hex here**. You can set multiple transaction hexes split by `,`

4. Loop deposit transaction. The program will send your transaction hexes to flashbots and other mev builders once per block height.
```bash
bun run loop-deposit
```

5. ⚠️ Do not use your wallet to send any other transactions before deposit success, or the nonce will become invalid.
