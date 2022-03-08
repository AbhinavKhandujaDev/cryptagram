// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CRYPT is ERC721URIStorage {
    uint256 private tokenId;
    address private storeAddress;

    event random(string msg, address addr);

    constructor(address marketplaceAddress) ERC721("Cryptverse", "CRYPT") {
        tokenId = 0;
        storeAddress = marketplaceAddress;
    }

    function getLastTokenId() public view returns(uint256) {
        uint256 nToken = tokenId - 1;
        return nToken;
    }
    
    function getStoreAddress() public view returns(address) {
        return storeAddress;
    }

    // function createToken(string calldata tokenURI, address approves) public returns(uint256) {
    //     uint256 newItemId = tokenId;

    //     // _safeMint protects token to be recreated if already created based on tokenId
    //     _safeMint(approves, newItemId);

    //     // setting the image/media url to the token
    //     _setTokenURI(newItemId, tokenURI);

    //     // without setApprovalForAll NFTMarket does not have authority to transfer the token's ownership on ite's behalf
    //     // setApprovalForAll(approves, true);
    //     // approve(approves, newItemId);

    //     tokenId++;
    //     return newItemId;
    // }

    function createToken(string calldata tokenURI) public {
        uint256 newItemId = tokenId;

        // _safeMint protects token to be recreated if already created based on tokenId
        _safeMint(msg.sender, newItemId);

        // setting the image/media url to the token
        _setTokenURI(newItemId, tokenURI);

        tokenId++;
    }

    function isApprovedForAll(address owner, address operator)
        public
        view
        virtual
        override
        returns (bool) 
    {
        // preapproved marketplace
        return super.isApprovedForAll(owner, operator) || true;//operator == storeAddress;
    }

    function getTokenURI(uint256 token) public view returns(string memory) {
        require(token >= 0, "Token id is required");
        require(msg.sender != address(0), "Account address id is required");
        string memory uri = tokenURI(token);
        return uri;
    }
}