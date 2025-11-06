# Hourglass Stable Deposit

## Links

- Vault: https://etherscan.io/address/0xd9b2cb2fbad204fc548787ef56b918c845fcce40
- Safe: https://app.safe.global/transactions/queue?safe=eth:0xD058F0203977Cc1380D41EB963B7d5890aebb679

## Prepare

- A OneKey Hardware Wallet

  [Get 5% OFF](https://onekey.so/r/TAOLITOOLS)

- Install [Bun](https://bun.sh/)
  ```bash
  curl -fsSL https://bun.sh/install | bash
  ```

- Clone Repo
  ```bash
  git clone https://github.com/aliez-ren/hourglass-stable-deposit.git
  cd hourglass-stable-deposit.git
  ```
- Install dependencies
  ```bash
  bun i
  ```

## Run

- Approve USDC
  ```bash
  bun run approve
  ```

- Prepare Deposit Transaction
  ```bash
  bun run pre-deposit
  ```

- Loop Deposit Transaction
  ```bash
  bun run loop-deposit
  ```
