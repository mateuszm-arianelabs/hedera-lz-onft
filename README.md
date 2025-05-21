# Layer Zero (ONFT) usage with Hedera

This repo contains a test setup for bridging a NFT from Hedera to another EVM chain (Avalanche Fuji) using LayerZero’s ONFT.
Contracts are in `contracts/`, deploy scripts in `deploy/`, and token send/mint scripts in `tasks/`.

## Run locally
1. Install dependencies `pnpm install`
2. Create `.env` file and set `PRIVATE_KEY`
3. Compile contracts `pnpm run compile:hardhat`
4. Deploy contracts `npx hardhat lz:deploy` (select hedera testnet, and avalanche testnet)
5. Wire (set peers) `npx hardhat lz:oapp:wire --oapp-config layerzero.config.ts`

After this configuration, the contracts are ready for NFT transfer. Before initiating a transfer, make sure to mint some NFT on the chain you intend to send them from.

## Interaction with contracts

⚠️ For testing purposes, it's recommended to use the same recipient as the one associated with the private key in your config (provide it as an EVM address).


__Mint NFT on Avalanche Fuji__
```bash
npx hardhat onft:mint --network avalanche-testnet --to <RECEIVER>
```

__Mint NFT on Hedera testnet__
```bash
npx hardhat oft:mint --network hedera-testnet --amount <AMOUNT> --to <RECEIVER>
```

__Send NFT from Avalanche Fuji -> Hedera Testnet__
```bash
npx hardhat onft:sendFromFuji --network avalanche-testnet --recipient <RECEIVER> --tokenid <TOKEN_ID>
```

__Send tokens from Hedera Testnet -> Avalanche Fuji__
```bash
npx hardhat onft:sendFromHedera --network hedera-testnet --recipient <RECEIVER> --tokenid <TOKEN_ID>
```

## Example transactions
- [Avalanche Fuji -> Hedera Testnet](https://testnet.layerzeroscan.com/tx/0x0aa283a5395b810dc4863367932d320b1d4f6983162426f846d4db79cbf6199d)
- [Hedera Testnet -> Avalanche Fuji](https://testnet.layerzeroscan.com/tx/0x10cbffcf9b9fc081a8ce3c4b613ee22743fa8c412b2265ac0e6d850424b15239)
