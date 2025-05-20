// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.22;

import { ONFT721 } from "@layerzerolabs/onft-evm/contracts/onft721/ONFT721.sol";

contract MyONFT721 is ONFT721 {
    uint256 private _tokenIdCounter;

    constructor(
        string memory _name,
        string memory _symbol,
        address _lzEndpoint,
        address _delegate
    ) ONFT721(_name, _symbol, _lzEndpoint, _delegate) {}

    function mint(address to) public onlyOwner {
        _tokenIdCounter += 1;
        _mint(to, _tokenIdCounter);
    }
}
