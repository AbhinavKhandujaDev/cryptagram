// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./NFT.sol";

contract NFTMarket {
    struct MarketItem {
        uint itemId;
        string name;
        address nftContract;
        uint256 tokenId;
        address payable owner;
        address payable creator;
        uint256 price;
        uint256 royalityFee;
        bool isSelling;
    }

    event MarketItemCreated (
        uint indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        address creator,
        uint256 price,
        uint256 royalityFee
    );

    event random(address addr);

    uint256 private itemId;
    bool private locked = false;
    address payable private owner;
    uint256 listingPrice = 0.025 ether;
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(address => uint256) private addressToItemsCreated;
    uint256 private constant royality = 10;

    constructor() {
        itemId = 0;
        owner = payable(msg.sender);
    }

    modifier lockEntry() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    function getCurrentItemId() public view returns(uint256) {
        return itemId;
    }

    function getOwner() public view returns(address) {
        return owner;
    }

    // function createMarketItem(
    //     address nftContract, 
    //     uint256 price,
    //     string calldata tokenURI
    // ) public payable lockEntry returns(bytes memory) {
    //     require(price > 0, "Price must be at least 1 wei");
    //     require(price == listingPrice, "Price must be equal to listing price (0.025 eth)");

    //     // uint256 tokenId = NFT(nftContract).createToken(tokenURI);
    //     (bool status, bytes memory result) = nftContract.call{gas: 10000}(abi.encodePacked(bytes4(keccak256("createToken(string)")), tokenURI));

    //     // uint256 itemRoyality = (price * royality) / 100;
    //     // idToMarketItem[itemId] =  MarketItem(
    //     //     itemId,
    //     //     nftContract,
    //     //     tokenId,
    //     //     payable(msg.sender),
    //     //     payable(msg.sender),
    //     //     price,
    //     //     itemRoyality,
    //     //     false
    //     // );
        
    //     // emit MarketItemCreated(
    //     //     itemId,
    //     //     nftContract,
    //     //     tokenId,
    //     //     msg.sender,
    //     //     msg.sender,
    //     //     price,
    //     //     itemRoyality
    //     // );
    //     // itemId ++;
    //     return result;//idToMarketItem[itemId - 1];
    // }

    function createMarketItem(
        address nftContract, 
        uint256 tokenId,
        uint256 price,
        string memory name
    ) public payable lockEntry returns(MarketItem memory) {
        require(price > 0, "Price must be at least 1 wei");
        require(price >= listingPrice, "Price must be greater than or equal to listing price (0.025 eth)");
        uint256 itemRoyality = (price * royality) / 100;
        idToMarketItem[itemId] =  MarketItem(
            itemId,
            name,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            price,
            itemRoyality,
            false
        );
        
        emit MarketItemCreated(
            itemId,
            nftContract,
            tokenId,
            msg.sender,
            msg.sender,
            price,
            itemRoyality
        );
        addressToItemsCreated[msg.sender]++; 
        itemId++ ;
        return idToMarketItem[itemId - 1];
    }

    function sellMarketItem(
        address nftContract,
        uint256 tokenId
    ) public payable lockEntry {
        MarketItem memory item = idToMarketItem[tokenId];

        require(msg.value == item.price, "Please submit the asking price in order to complete the purchase");

        address creatorAddress = ERC721(nftContract).ownerOf(tokenId);
        bool success = creatorAddress == msg.sender;
        if (creatorAddress != msg.sender) {
            (success, ) = payable(creatorAddress).call{value: item.royalityFee}("");
        }
        require(success, "Can't proceed without paying royality to the creator");

        (bool success2, ) = payable(idToMarketItem[itemId].owner).call{value: msg.value - item.royalityFee}("");
        require(success2, "Can't proceed without paying the owner");
        ERC721(nftContract).transferFrom(item.owner, msg.sender, item.tokenId);
        idToMarketItem[tokenId].owner = payable(msg.sender);
    }

    function getMarketItems() public view returns(MarketItem[] memory) {
        MarketItem[] memory items = new MarketItem[](itemId);
        for (uint256 index = 0; index < itemId; index++) {
            items[index] = idToMarketItem[index];
        }
        return items;
    }

    function itemsCreatedByMe() public view returns(MarketItem[] memory) {
        uint256 count = addressToItemsCreated[msg.sender];
        MarketItem[] memory arr = new MarketItem[](count);
        uint256 indx = 0;
        for (uint256 index = 0; index < itemId; index++) {
            if (idToMarketItem[index].creator == msg.sender) {
                arr[indx] = idToMarketItem[indx];
                indx++;
            }
        }
        return arr;
    }

    // function getTokenURI(address nftContract, uint256 tokenId) public view returns(string memory) {
    //     require(nftContract != address(0), "Contract address id is required");
    //     require(tokenId >= 0, "Token id is required");
    //     require(msg.sender != address(0), "Account address id is required");
    //     // require(idToMarketItem[tokenId].owner == msg.sender, "Not authorised to view the token uri");
    //     string memory uri = ERC721(nftContract).tokenURI(tokenId);
    //     return uri;
    // }

}