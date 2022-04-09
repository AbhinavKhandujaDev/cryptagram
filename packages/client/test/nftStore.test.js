// '0',
// 'Test',
// '0x15742eb199670f962628542658bD5654b6a9EdD6',
// '1',
// '0x75bC0ABFCB8Dbc574d12623783f7c9DA7cfe3eD9',
// '0x75bC0ABFCB8Dbc574d12623783f7c9DA7cfe3eD9',
// '25000000000000000',
// '25',
// itemId: '0',
// name: 'Test',
// nftContract: '0x15742eb199670f962628542658bD5654b6a9EdD6',
// tokenId: '1',
// owner: '0x75bC0ABFCB8Dbc574d12623783f7c9DA7cfe3eD9',
// creator: '0x75bC0ABFCB8Dbc574d12623783f7c9DA7cfe3eD9',
// price: '25000000000000000',
// royaltyPercent: '25'

const NftStore = artifacts.require("./NFTStore.sol");
const CRYPT = artifacts.require("./CRYPT.sol");

require("chai").use(require("chai-as-promised")).should();

contract("NFT Store", ([deployer, user, user2, user3, user4, user5]) => {
  let nft, nftStore, creator;
  let uri =
    "https://images.unsplash.com/photo-1599580506193-fef9dc35b205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80";

  before(async () => {
    creator = user2;
    nftStore = await NftStore.new(deployer);
    nft = await CRYPT.new(deployer);
  });

  async function buy(buyer) {
    let itemId = 0;
    let item = await nftStore.getItemById(itemId);
    let nftOwner = await nft.ownerOf(item.tokenId);
    await nftStore.changeSellingStatus(item.itemId, true, { from: nftOwner });
    item = await nftStore.getItemById(itemId);
    assert.equal(nftOwner, item.owner, "Invalid owner");
    let amount = await web3.utils.toWei(item.price.toString(), "wei");
    assert.equal(item.isSelling, true, "Selling status should be 'true'");
    await nftStore.buyItem(item.itemId, {
      from: buyer,
      value: amount,
    });
    await nft.transferToken(item.itemId, buyer, { from: deployer });

    nftOwner = await nft.ownerOf(item.tokenId);
    await nftStore.changeSellingStatus(item.itemId, false, { from: nftOwner });
    let userOwnedItems = await nftStore.getItemsOwnedByUser(buyer);
    assert.equal(userOwnedItems.length, 1, "Invalid item count");
    item = await nftStore.getItemById(itemId);
    assert.equal(item.isSelling, false, "Selling status should be 'false'");
  }

  function checkDeployed(address) {
    assert.notEqual(address, 0x0);
    assert.notEqual(address, "");
    assert.notEqual(address, null);
    assert.notEqual(address, undefined);
  }

  describe("CRYPT Market Test", async () => {
    it("deployed successfully", async () => {
      const nftaddress = await nft.address;
      const nftMaddress = await nftStore.address;
      checkDeployed(nftaddress);
      checkDeployed(nftMaddress);
    });

    it("create item", async () => {
      const nftaddress = nft.address;
      let amount = await web3.utils.toWei("0.025", "ether");

      await nft.createToken(uri, { from: creator });
      let tId = await nft.getLastTokenId();
      let owner = await nft.ownerOf(tId);
      assert.equal(owner, creator, "invalid token owner");
      await nftStore.createItem(
        nftaddress,
        uri,
        "Test",
        amount,
        tId,
        25,
        true,
        {
          from: creator,
        }
      );

      let tokenUri = await nft.tokenURI(0);
      assert.equal(uri, tokenUri);

      let item = await nftStore.getItemById(0);
      console.log("item ==> ", item.name);
      assert.equal(item[4], creator);
      assert.equal(item[5], creator);
    });

    it("fetch items", async () => {
      // fetching all items
      let items = await nftStore.getItems();
      console.log("items are ===> ", items);
      assert.equal(items.length, 1, "Invalid item count");

      // fetch items created by user
      let userOwnedItems = await nftStore.getItemsOwnedByUser(creator);
      console.log("user owned items are ===> ", userOwnedItems);
      assert.equal(userOwnedItems.length, 1, "Invalid user owned item count");

      // fetch items created by user
      let userCreatedItems = await nftStore.getItemsCreatedByUser(creator);
      console.log("user created items are ===> ", userCreatedItems);
      assert.equal(
        userCreatedItems.length,
        1,
        "Invalid user created item count"
      );
    });

    it("buy items", async () => {
      await buy(user);
      let item = await nftStore.getItemById(0);
      console.log("new Item ==> ", item);
      await buy(user3);
      await buy(user4);
      await buy(user5);
    });
  });
});
