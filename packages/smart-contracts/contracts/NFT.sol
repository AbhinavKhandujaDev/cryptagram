// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private tokenId;
    address private contractAddress;

    constructor(address marketplaceAddress) ERC721("Cryptverse", "CRYPT") {
        tokenId = 0;
        contractAddress = marketplaceAddress;
    }

    function getCurrentId() public view returns(uint256) {
        return tokenId;
    }

    function createToken(string calldata tokenURI) public {
        uint256 newItemId = tokenId;

        // _safeMint protects token to be recreated if already created based on tokenId
        _safeMint(msg.sender, newItemId);

        // setting the image/media url to the token
        _setTokenURI(newItemId, tokenURI);

        // without setApprovalForAll NFTMarket does not have authority to transfer the token's ownership on ite's behalf
        setApprovalForAll(contractAddress, true);
        
        tokenId++;
    }

    function getTokenURI(uint256 token) public view returns(string memory) {
        require(token >= 0, "Token id is required");
        require(msg.sender != address(0), "Account address id is required");
        string memory uri = tokenURI(token);
        return uri;
    }
}