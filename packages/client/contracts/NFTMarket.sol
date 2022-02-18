// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTMarket {
    struct MarketItem {
        uint256 itemId;
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
        uint256 indexed itemId,
        address indexed nftContract,
        uint256 indexed tokenId,
        address owner,
        address creator,
        uint256 price,
        uint256 royalityFee
    );

    event random(address addr);
    event random2(string msg, address addr);

    uint256 private itemId;
    bool private locked = false;
    address payable private owner;
    uint256 listingPrice = 0.025 ether;
    mapping(uint256 => MarketItem) private idToMarketItem;
    mapping(address => uint256) private addressToItemsCreated;
    mapping(address => uint256) private addressToItemsCollected;
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

    function createMarketItem(
        address nftContract, 
        uint256 tokenId,
        uint256 price,
        string memory name,
        bool enlist
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
            enlist
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
        addressToItemsCollected[msg.sender]++;
        itemId++ ;
        return idToMarketItem[itemId - 1];
    }
    
    function sellMarketItem(uint256 mItemId) public payable {
        MarketItem memory item = idToMarketItem[mItemId];
        require(item.isSelling, "Item not for sale");
        require(msg.value == item.price, "Invalid price value");
        require(item.owner != msg.sender, "You already own this item");

        address currentOwner = IERC721(item.nftContract).ownerOf(item.tokenId);
        
        bool success = true;
        if (currentOwner != msg.sender) {
            (success, ) = item.creator.call{value: item.royalityFee}("");
        }
        require(success, "Can't proceed without paying royality to the creator");

        (bool success2, ) = payable(currentOwner).call{value: msg.value - item.royalityFee}("");
        require(success2, "Can't proceed without paying the owner");
        IERC721(item.nftContract).transferFrom(currentOwner, msg.sender, item.tokenId);
        addressToItemsCollected[currentOwner]--;
        idToMarketItem[mItemId].owner = payable(msg.sender);
        idToMarketItem[mItemId].isSelling = false;
    }

    function changeSellingStatus(uint256 mItemId) payable public {
        MarketItem memory item = idToMarketItem[mItemId];
        require(item.owner == msg.sender, "Only item owner can change the status");
        idToMarketItem[mItemId].isSelling = !idToMarketItem[mItemId].isSelling;

        if (idToMarketItem[mItemId].isSelling) {
            // IERC721(item.nftContract).approve(address(this), item.tokenId);
            IERC721(item.nftContract).setApprovalForAll(address(this), true);
        }else {
            IERC721(item.nftContract).setApprovalForAll(item.owner, true);
        }
    }

    function getContAddr() public view returns(address) {
        return address(this);    
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
                arr[indx] = idToMarketItem[index];
                indx++;
            }
        }
        return arr;
    }
    
    function itemsCollected() public view returns(MarketItem[] memory) {
        uint256 count = addressToItemsCollected[msg.sender];
        MarketItem[] memory arr = new MarketItem[](count);
        uint256 indx = 0;
        for (uint256 index = 0; index < itemId; index++) {
            if (idToMarketItem[index].owner == msg.sender) {
                arr[indx] = idToMarketItem[index];
                indx++;
            }
        }
        return arr;
    }

}