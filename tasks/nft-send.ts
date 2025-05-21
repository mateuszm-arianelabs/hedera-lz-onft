import {task} from 'hardhat/config';
import {addressToBytes32, Options} from '@layerzerolabs/lz-v2-utilities'
import {BigNumberish, BytesLike} from 'ethers';

interface SendParam {
    dstEid: BigNumberish     // Destination LayerZero EndpointV2 ID.
    to: BytesLike            // Recipient address.
    tokenId: BigNumberish    // Token ID of the NFT to send.
    extraOptions: BytesLike  // Additional options supplied by the caller to be used in the LayerZero message.
    composeMsg: BytesLike    // The composed message for the send() operation.
    onftCmd: BytesLike       // The ONFT command to be executed, unused in default ONFT implementations.
}

task('onft:sendFromFuji', 'Sends an NFT from chain A to chain B using MyONFTAdapter')
    .addParam('recipient', 'Recipient on the destination chain')
    .addParam('tokenid', 'Token ID to send')
    .setAction(async (taskArgs, { ethers, deployments }) => {
        const { recipient, tokenid } = taskArgs
        const [signer] = await ethers.getSigners()
        const onftDeployment = await deployments.get('MyONFT721')
        const eid = 40285

        // Get adapter contract instance
        const onft = new ethers.Contract(onftDeployment.address, onftDeployment.abi, signer)

        const options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes()

        // Build the parameters
        const sendParam: SendParam = {
            dstEid: Number(eid),
            to: addressToBytes32(recipient), // convert to bytes32
            tokenId: ethers.BigNumber.from(tokenid),
            extraOptions: options,   // If you want to pass custom options
            composeMsg: '0x',     // If you want additional logic on the remote chain
            onftCmd: '0x',
        }

        // Get quote for the transfer
        const quotedFee = await onft.quoteSend(sendParam, false)

        // Send the NFT, using the returned quoted fee in msg.value
        const tx = await onft.send(
            sendParam,
            { nativeFee: quotedFee.nativeFee, lzTokenFee: 0 },
            signer.address,
            { value: quotedFee.nativeFee }
        )

        const receipt = await tx.wait()
        console.log('🎉 NFT sent! Transaction hash:', receipt.transactionHash)
    })

task('onft:sendFromHedera', 'Sends an NFT from chain A to chain B using MyONFTAdapter')
    .addParam('recipient', 'Recipient on the destination chain')
    .addParam('tokenid', 'Token ID to send')
    .setAction(async (taskArgs, { ethers, deployments }) => {
        const { recipient, tokenid } = taskArgs
        const [signer] = await ethers.getSigners()
        const onftDeployment = await deployments.get('MyONFT721')
        const eid = 40106;

        // Get adapter contract instance
        const onft = new ethers.Contract(onftDeployment.address, onftDeployment.abi, signer)

        const options = Options.newOptions().addExecutorLzReceiveOption(65000, 0).toBytes()

        // Build the parameters
        const sendParam: SendParam = {
            dstEid: Number(eid),
            to: addressToBytes32(recipient), // convert to bytes32
            tokenId: ethers.BigNumber.from(tokenid),
            extraOptions: options,   // If you want to pass custom options
            composeMsg: '0x',     // If you want additional logic on the remote chain
            onftCmd: '0x',
        }

        // Get quote for the transfer
        const quotedFee = await onft.quoteSend(sendParam, false)

        const adjustedNativeFee = quotedFee.nativeFee.mul(ethers.BigNumber.from(10).pow(10))

        // Send the NFT, using the returned quoted fee in msg.value
        const tx = await onft.send(
            sendParam,
            { nativeFee: quotedFee.nativeFee, lzTokenFee: 0 },
            signer.address,
            { value: adjustedNativeFee }
        )

        const receipt = await tx.wait()
        console.log('🎉 NFT sent! Transaction hash:', receipt.transactionHash)
    })