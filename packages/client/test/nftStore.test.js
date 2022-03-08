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

contract("Transfer", ([deployer, user, user2, user3]) => {
  let nft, nftStore, creator;
  let uri =
    "https://images.unsplash.com/photo-1599580506193-fef9dc35b205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80";

  before(async () => {
    creator = user2;
    nftStore = await NftStore.new(deployer);
    nft = await CRYPT.new(deployer);
  });

  async function buy(owner, buyer) {
    let itemId = 0;
    let item = await nftStore.getItemById(itemId);
    // await nft.setApprovalForAll(deployer, true, { from: owner });
    let isApproved = await nft.isApprovedForAll(owner, deployer);
    assert.equal(isApproved, true, "Operator in not approved");
    await nftStore.buyItem(itemId, buyer, {
      from: deployer,
      value: item.price,
    });
    let userOwnedItems = await nftStore.getItemsOwnedByUser(buyer);
    assert.equal(userOwnedItems.length, 1, "Invalid item count");
    item = await nftStore.getItemById(itemId);
    assert.equal(item.owner, buyer, "Invalid owner");
  }
  async function buy2(owner, buyer) {
    let itemId = 0;
    let item = await nftStore.getItemById(itemId);
    await nftStore.putItemForSale(itemId, { from: owner });
    await nftStore.buyItem(itemId, buyer, {
      from: deployer,
      value: item.price,
    });
    let userOwnedItems = await nftStore.getItemsOwnedByUser(buyer);
    assert.equal(userOwnedItems.length, 1, "Invalid item count");
  }

  describe("CRYPT Market Test", async () => {
    it("deployed successfully", async () => {
      const nftaddress = await nft.address;
      const nftMaddress = await nftStore.address;
      assert.notEqual(nftaddress, 0x0);
      assert.notEqual(nftaddress, "");
      assert.notEqual(nftaddress, null);
      assert.notEqual(nftaddress, undefined);

      assert.notEqual(nftMaddress, 0x0);
      assert.notEqual(nftMaddress, "");
      assert.notEqual(nftMaddress, null);
      assert.notEqual(nftMaddress, undefined);
    });

    it("create item", async () => {
      const nftaddress = nft.address;
      let amount = await web3.utils.toWei("0.025", "ether");

      await nft.createToken(uri, { from: creator });
      let tId = await nft.getLastTokenId();
      let owner = await nft.ownerOf(tId);
      assert.equal(owner, creator, "invalid token owner");
      await nftStore.createItem(nftaddress, uri, "Test", amount, tId, 25, {
        from: creator,
      });

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
      // let itemId = 0;
      // let item = await nftStore.getItemById(itemId);
      //   await nftStore.putItemForSale(itemId, { from: creator });
      //   await nftStore.buyItem(itemId, user, {
      //     from: deployer,
      //     value: item.price,
      //   });
      //   let userOwnedItems = await nftStore.getItemsOwnedByUser(user);
      //   assert.equal(userOwnedItems.length, 1, "Invalid item count");
      await buy(creator, user);
      await buy(user, user3);
      // await buy2(user, user3);
    });

    // it("buy items", async () => {
    //   await nftStore.sellMarketItem(0, {
    //     from: user,
    //     value: 25 * 10 ** 15,
    //   });
    //   let items = await nftStore.getMarketItems();
    //   items.forEach((item) => {
    //     assert.equal(
    //       item[4],
    //       user,
    //       "userItems bought are not similar to Items"
    //     );
    //     assert.equal(item[8], false, "item should not be in selling state");
    //   });

    //   // Other user cannot buy item unless the owner changes selling status
    //   await nftStore.sellMarketItem(0, {
    //     from: deployer,
    //     value: 25 * 10 ** 15,
    //   }).should.be.rejected;
    // });

    // it("change selling status", async () => {
    //   let owner = await nft.ownerOf(0);
    //   assert.equal(owner, user, "token owner is not user");
    //   console.log("owner ===> ", owner);
    //   await nftStore.changeSellingStatus(0, { from: user });
    //   let items = await nftStore.getMarketItems();
    //   console.log("items are ===> ", items);
    //   let cAddr = await nftStore.getContAddr();
    //   console.log("cAddr is ===> ", cAddr);
    //   console.log("nftStore is ===> ", nftStore.address);
    //   console.log("deployer is ===> ", deployer);
    //   await nftStore.sellMarketItem(0, {
    //     from: deployer,
    //     value: 25 * 10 ** 15,
    //   });
    // });
  });
});
