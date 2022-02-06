// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
    uint256 private tokenId;

    constructor() ERC721("Cryptverse", "CRYPT") {
        tokenId = 0;
    }

    function getCurrentId() public view returns(uint256) {
        return tokenId;
    }

    function getToken() public view {
        ERC721(address(this));
    }

    function createToken(string calldata tokenURI) public {
        uint256 newItemId = tokenId;

        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        setApprovalForAll(address(this), true);
        
        tokenId++;
    }

    function getTokenURI(uint256 token) public view returns(string memory) {
        require(token >= 0, "Token id is required");
        require(msg.sender != address(0), "Account address id is required");
        // address owner = ERC721(nftContract).ownerOf(token);
        // require(owner == msg.sender, "Not authorised to view the token uri");
        string memory uri = tokenURI(token);
        return uri;
    }
}