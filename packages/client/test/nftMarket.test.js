// '0',
// 'TestName',
// '0x767dab7E2B922969FB6e195f90989e3b6e94DBF2',
// '0',
// '0x09596Ea20BcA7eaaDeD3b5a0767bA65c52613C75',
// '0x09596Ea20BcA7eaaDeD3b5a0767bA65c52613C75',
// '25000000000000000',
// '2500000000000000',
// true,
// itemId: '0',
// name: 'TestName',
// nftContract: '0x767dab7E2B922969FB6e195f90989e3b6e94DBF2',
// tokenId: '0',
// owner: '0x09596Ea20BcA7eaaDeD3b5a0767bA65c52613C75',
// creator: '0x09596Ea20BcA7eaaDeD3b5a0767bA65c52613C75',
// price: '25000000000000000',
// royalityFee: '2500000000000000',
// isSelling: true
const NFTMarket = artifacts.require("./NFTMarket.sol");
const NFT = artifacts.require("./NFT.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Transfer", ([deployer, user]) => {
  let nft, nftMarket;
  let uri =
    "https://images.unsplash.com/photo-1599580506193-fef9dc35b205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80";

  before(async () => {
    nftMarket = await NFTMarket.deployed();
    nft = await NFT.deployed();
  });

  describe("NFT Market Test", async () => {
    let currentTokenId;
    it("deployed successfully", async () => {
      const nftaddress = await nft.address;
      const nftMaddress = await nftMarket.address;
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

      let nftTxn = await nft.createToken(uri);
      let currentTokenId = nftTxn.logs[0].args.tokenId.toString();
      assert.equal(currentTokenId, "0");

      await nftMarket.createMarketItem(
        nftaddress,
        Number(currentTokenId),
        amount,
        "TestName",
        true,
        { from: deployer }
      );
    });

    it("fetch items", async () => {
      // fetching all items
      let items = await nftMarket.getMarketItems();
      assert.isAtLeast(items.length, 1, "items should be 1 or more than 1");
      let itemUri = await nft.getTokenURI(items[0][3]);
      assert.equal(uri, itemUri, "item uri should be equal to `itemUri`");

      // fetching items created by user
      let userItems = await nftMarket.itemsCreatedByMe({ from: deployer });
      userItems.forEach((item) => {
        assert.equal(item[5], deployer, "userItems are not similar to Items");
      });

      let userItems2 = await nftMarket.itemsCreatedByMe({ from: user });
      assert.equal(userItems2.length, 0, "userItems2 should be 0");
    });

    it("buy items", async () => {
      await nftMarket.sellMarketItem(0, {
        from: user,
        value: 25 * 10 ** 15,
      });
      let items = await nftMarket.getMarketItems();
      items.forEach((item) => {
        assert.equal(
          item[4],
          user,
          "userItems bought are not similar to Items"
        );
        assert.equal(item[8], false, "item should not be in selling state");
      });

      // Other user cannot buy item unless the owner changes selling status
      await nftMarket.sellMarketItem(0, {
        from: deployer,
        value: 25 * 10 ** 15,
      }).should.be.rejected;
    });

    it("change selling status", async () => {
      let owner = await nft.ownerOf(0);
      assert.equal(owner, user, "token owner is not user");
      console.log("owner ===> ", owner);
      await nftMarket.changeSellingStatus(0, { from: user });
      let items = await nftMarket.getMarketItems();
      console.log("items are ===> ", items);
      let cAddr = await nftMarket.getContAddr();
      console.log("cAddr is ===> ", cAddr);
      console.log("nftMarket is ===> ", nftMarket.address);
      console.log("deployer is ===> ", deployer);
      await nftMarket.sellMarketItem(0, {
        from: deployer,
        value: 25 * 10 ** 15,
      });
    });
  });
});
