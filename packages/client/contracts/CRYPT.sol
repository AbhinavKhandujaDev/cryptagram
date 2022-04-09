// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./NFTStore.sol";

contract CRYPT is ERC721URIStorage {
    uint256 private tokenId;
    address private storeOwner;

    event random(string msg, address addr);

    constructor(address marketplaceAddress) ERC721("Cryptverse", "CRYPT") {
        tokenId = 0;
        storeOwner = marketplaceAddress;
    }

    function getLastTokenId() public view returns(uint256) {
        uint256 nToken = tokenId - 1;
        return nToken;
    }
    
    function getStoreOwner() public view returns(address) {
        return storeOwner;
    }

    function createToken(string calldata tokenURI, address creator) public returns(uint256) {
        uint256 newItemId = tokenId;

        // _safeMint protects token to be recreated if already created based on tokenId
        _safeMint(creator, newItemId);

        // setting the image/media url to the token
        _setTokenURI(newItemId, tokenURI);

        tokenId++;

        return newItemId;
    }
    // function createToken(string calldata tokenURI) public {
    //     uint256 newItemId = tokenId;

    //     // _safeMint protects token to be recreated if already created based on tokenId
    //     _safeMint(msg.sender, newItemId);

    //     // setting the image/media url to the token
    //     _setTokenURI(newItemId, tokenURI);

    //     tokenId++;
    // }

    function isApprovedForAll(address owner, address operator)
        public
        view
        virtual
        override
        returns (bool) 
    {
        // preapproved marketplace
        require(operator == storeOwner || operator == owner, "operator != storeAddress");
        return super.isApprovedForAll(owner, operator) || operator == storeOwner;
    }

    function transferToken(uint256 id, address buyer) public payable {
        address currentOwner = ownerOf(id);
        transferFrom(currentOwner, buyer, id);
        address newOwner = ownerOf(id);
        require(newOwner == buyer, "Token not transferred");
    }
}