// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./CRYPTNFT.sol";

contract NFTStore {

    struct Item {
        uint256 itemId;
        string name;
        address nftContract;
        uint256 tokenId;
        address payable owner;
        address payable creator;
        uint256 price;
        string uri;
        uint256 royaltyPercent;
        bool isSelling;
    }

    uint256 private itemId;
    bool private locked = false;
    mapping(uint256 => Item) private idToItem;
    mapping(address => uint256) private addressToItemsCount;
    address private marketOwner;

    event random(string msg, address addr);

    constructor(address cowner) {
        itemId = 0;
        marketOwner = cowner;
    }

    modifier onlyOwner() {
        require(marketOwner == msg.sender);
        _;
    }

    modifier lockEntry() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    function createItem(
        address nftContract, 
        string memory uri, 
        string memory name,
        uint256 price,
        // uint256 tId,
        uint256 royaltyPercent,
        bool isSelling
    ) public payable lockEntry {
        require(price > 0, "Price must be at least 1 wei");
        address payable creator = payable(msg.sender);
        uint256 tId = CRYPTNFT(nftContract).createToken(uri, creator);
        idToItem[itemId] = Item(
            itemId, 
            name, 
            nftContract, 
            tId, 
            creator, 
            creator, 
            price, 
            uri,
            royaltyPercent,
            isSelling
        );
        addressToItemsCount[msg.sender]++;
        itemId++;
    }

    function getItemById(uint256 id) public view returns(Item memory){
        return idToItem[id];
    }

    function getItems() public view returns(Item[] memory){
        Item[] memory items = new Item[](itemId);
        for (uint256 index = 0; index < itemId; index++) {
            items[index] = idToItem[index];
        }
        return items;
    }
    
    function getItemsOwnedByUser(address caller) public view returns(Item[] memory){
        uint256 count = addressToItemsCount[caller];
        Item[] memory items = new Item[](count);
        for (uint256 index = 0; index < itemId; index++) {
            if (idToItem[index].owner == caller) {   
                items[index] = idToItem[index];
            }
        }
        return items;
    }
    
    function getItemsCreatedByUser(address caller) public view returns(Item[] memory){
        uint256 count = addressToItemsCount[caller];
        Item[] memory items = new Item[](count);
        for (uint256 index = 0; index <= itemId; index++) {
            if (idToItem[index].creator == caller) {   
                items[index] = idToItem[index];
            }
        }
        return items;
    }

    function putItemForSale(uint256 id) public {
        Item memory item = idToItem[id];
        require(item.owner == msg.sender, "Only owner can put the item for sale");
        // CRYPTNFT(item.nftContract).setApprovalForAll(address(this), true);
        (bool success,) = item.nftContract.delegatecall(
            abi.encodeWithSignature("setApprovalForAll(address,bool)", marketOwner ,true)
        );
        require(success, "Unable to put item for sale");
    }

    function buyItem(uint256 id) public payable {
        Item memory item = idToItem[id];
        require(item.isSelling, "Item is not being sold");
        require(item.owner != msg.sender, "You already own this item");
        require(msg.value == item.price, "Invalid price value");
        if(msg.sender != item.creator) {
            (bool royaltyGiven,) = item.creator.call{value: (msg.value/100) * item.royaltyPercent}("");
            require(royaltyGiven, "Unable to proceed without paying royalty to the creator");
        }
        // address currentOwner = IERC721(item.nftContract).ownerOf(item.tokenId);
        // require(currentOwner == item.owner, "Item owner not valid");
        // IERC721(item.nftContract).transferFrom(item.owner, buyer, item.tokenId);

        // (bool transferred,) = item.nftContract.delegatecall(
        //     abi.encodeWithSignature("transferFrom(address,address,bool)", item.owner, buyer, item.tokenId)
        // );
        // require(transferred, "Unable to transfer token");
        idToItem[id].isSelling = false;
        idToItem[id].owner = payable(msg.sender);
        addressToItemsCount[item.owner]--;
        addressToItemsCount[msg.sender]++;
    }

    function changeSellingStatus(uint256 id, bool status) public payable {
        Item memory item = idToItem[id];
        address tokenOwner = IERC721(item.nftContract).ownerOf(idToItem[id].tokenId);
        require(msg.sender == tokenOwner, "Only owner can change the selling status");
        idToItem[id].isSelling = status;
        require(idToItem[id].isSelling == status, "Unable to change the status");
    }
}