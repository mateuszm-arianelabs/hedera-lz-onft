import { task } from 'hardhat/config'

import { types } from '@layerzerolabs/devtools-evm-hardhat'

task('onft:mint', 'Mints new NFTs')
    .addParam('to', 'Address to receive minted token', undefined, types.string)
    .setAction(async (taskArgs, { ethers, deployments }) => {
        const { to, amount } = taskArgs
        // Fetch the deployment info
        const { address: contractAddress, abi } = await deployments.get('MyONFT721')
        // Use the first signer (must be the owner)
        const [owner] = await ethers.getSigners()
        // Attach to your deployed contract
        const onft = new ethers.Contract(contractAddress, abi, owner)
        // Read token decimals so we can parse the user‐supplied amount
        // Call mint()
        const tx = await onft.mint(to)
        console.log(`🚀 Mint transaction sent: ${tx.hash}`)
        await tx.wait()
        console.log(`✅ Successfully minted NF token to ${to}`)
    })
