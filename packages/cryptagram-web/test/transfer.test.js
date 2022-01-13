const Transfer = artifacts.require("./Transfer.sol");
const Post = artifacts.require("./Post.sol");

require("chai").use(require("chai-as-promised")).should();

contract("Transfer", ([deployer, user]) => {
  let transfer;
  let deployerBal;
  let userBal;

  const tokensEth = (num) => web3.utils.fromWei(num, "ether");

  before(async () => {
    transfer = await Transfer.deployed();
    deployerBal = await tokensEth(await web3.eth.getBalance(deployer));
    userBal = await tokensEth(await web3.eth.getBalance(user));

    assert(userBal >= 100, "user balance is not 100ETH");
  });

  describe("transfer contract deployment", async () => {
    it("deployed successfully", async () => {
      const address = await transfer.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await transfer.name();
      assert.equal(name, "Transfer");
    });
  });

  describe("transfer currency", async () => {
    it("not approve & transfer to user", async () => {
      let amount = (3e18).toString();

      await transfer.transfer(user, { value: amount }).should.be.rejected;

      let userEthBalance = await tokensEth(await web3.eth.getBalance(user));
      assert(userEthBalance == userBal, "user balance is not as expected");
    });

    it("approve & transfer to user", async () => {
      let amount = (3e18).toString();
      console.log("amount ", amount);
      await transfer.approve(user, amount);
      await transfer.transfer(user, { value: amount });

      //   console.log("userEthBalance ", userBal);
      let userEthBalance = await tokensEth(await web3.eth.getBalance(user));
      let deployerEthBalance = await tokensEth(
        await web3.eth.getBalance(deployer)
      );
      assert(
        deployerBal - deployerEthBalance >= tokensEth(amount),
        "deployer balance is not as expected"
      );
      assert(
        userEthBalance - userBal == tokensEth(amount),
        "user balance is not as expected"
      );
    });
  });
});

contract("Post", ([deployer, user]) => {
  let postCont;
  before(async () => {
    postCont = await Post.deployed();
  });

  describe("post contract deployment", async () => {
    it("deployed successfully", async () => {
      const address = await postCont.address;
      assert.notEqual(address, 0x0);
      assert.notEqual(address, "");
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });

    it("has a name", async () => {
      const name = await postCont.name();
      assert.equal(name, "Post");
    });
  });

  describe("post actions", async () => {
    it("upload without user address", async () => {
      await postCont.savePost({
        postUrl: "randomString",
        postType: "image",
      }).should.be.rejected;
    });

    it("upload with all validations", async () => {
      let res = await postCont.savePost([user, 0, "randomString", "image"], {
        from: user,
      });

      await postCont.savePost([user, 0, "randomString2", "text"], {
        from: user,
      });
      let count = (await postCont.getCount()).toString();
      console.log("Count => ", count);
      assert(res >= count, "post not uploaded");
    });
  });
});
