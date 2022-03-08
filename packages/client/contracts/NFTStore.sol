// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./CRYPT.sol";

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
        uint256 tId,
        uint256 royaltyPercent
    ) public payable lockEntry {
        require(price > 0, "Price must be at least 1 wei");
        // uint256 tId = CRYPT(nftContract).createToken(uri, msg.sender);
        // (bool success,) = nftContract.delegatecall(
        //     abi.encodeWithSignature("createToken(string,address)", uri, msg.sender)
        // );
        // require(success, "Unable to createToken");
        // uint256 tId = CRYPT(nftContract).getLastTokenId();
        address payable addr = payable(msg.sender);
        idToItem[itemId] = Item(
            itemId, 
            name, 
            nftContract, 
            tId, 
            addr, 
            addr, 
            price, 
            uri,
            royaltyPercent
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
        for (uint256 index = 0; index < itemId; index++) {
            if (idToItem[index].creator == caller) {   
                items[index] = idToItem[index];
            }
        }
        return items;
    }

    function putItemForSale(uint256 id) public {
        Item memory item = idToItem[id];
        require(item.owner == msg.sender, "Only owner can put the item for sale");
        // CRYPT(item.nftContract).setApprovalForAll(address(this), true);
        (bool success,) = item.nftContract.delegatecall(
            abi.encodeWithSignature("setApprovalForAll(address,bool)", marketOwner ,true)
        );
        require(success, "Unable to put item for sale");
    }

    function buyItem(uint256 id, address buyer) public payable {
        Item memory item = idToItem[id];
        require(item.owner != buyer, "You already own this item");
        require(msg.value == item.price, "Invalid price value");
        if(buyer != item.creator) {
            uint256 royalty = msg.value * (item.royaltyPercent/100);
            (bool royaltyGiven,) = item.creator.call{value: royalty}("");
            require(royaltyGiven, "Unable to proceed without paying royalty to the creator");
        }
        address currentOwner = IERC721(item.nftContract).ownerOf(item.tokenId);
        IERC721(item.nftContract).transferFrom(currentOwner, buyer, item.tokenId);

        // (bool transferred,) = item.nftContract.delegatecall(
        //     abi.encodeWithSignature("transferFrom(address,address,bool)", item.owner, buyer, item.tokenId)
        // );
        // require(transferred, "Unable to transfer token");
        idToItem[id].owner = payable(buyer);
        addressToItemsCount[item.owner]--;
        addressToItemsCount[buyer]++;
    }
}