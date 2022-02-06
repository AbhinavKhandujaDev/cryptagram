const NFTMarket = artifacts.require("./NFTMarket.sol");
const NFT = artifacts.require("./NFT.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Transfer", ([deployer, user]) => {
  let nft, nftMarket;
  let uri =
    "https://images.unsplash.com/photo-1599580506193-fef9dc35b205?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=871&q=80";
  const BN = web3.utils.BN;
  before(async () => {
    nftMarket = await NFTMarket.deployed();
    nft = await NFT.deployed();
  });

  describe("NFT Market Test", async () => {
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
      const nftaddress = await nft.address;
      let amount = await web3.utils.toWei("0.025", "ether");
      amount = amount.toString();

      await nft.createToken(uri);
      let currentId = await nft.getCurrentId();
      assert.equal(currentId, "1");

      let itemCreated = await nftMarket.createMarketItem(
        nftaddress,
        0,
        amount,
        { from: deployer }
      );
      //   await nftMarket.createMarketItem(nftaddress, 1, amount, {
      //     from: deployer,
      //   });
      //   await nftMarket.getMarketItems();
      let items = await nftMarket.getMarketItems();
      console.log("items are ===> ", items);
    });
  });
});
