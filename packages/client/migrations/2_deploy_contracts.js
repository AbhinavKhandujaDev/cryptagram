const Transfer = artifacts.require("Transfer");
const nft = artifacts.require("NFT");
const nftMarket = artifacts.require("NFTMarket");
const crypt = artifacts.require("CRYPT");
const nftStore = artifacts.require("NFTStore");

const dummyAddr = "0x3b1194691A7a118D44d3f851440d8071AE5FcC34";

module.exports = async function (deployer) {
  await deployer.deploy(Transfer);
  await deployer.deploy(nftMarket);
  await deployer.deploy(nftStore, dummyAddr);
  await deployer.deploy(crypt, dummyAddr);

  let market = await nftMarket.deployed();
  await deployer.deploy(nft, market.address);

  // let token = await nft.deployed(market.address);
  // await token.createToken(
  //   "https://ipfs.io/ipfs/bafybeih6is3bindxpe4qc4umzoixs37vadwfskcspyzcxlh277crmnmxmy?filename=add-selected.png"
  // );
  // await market.createMarketItem(
  //   token.address,
  //   0,
  //   `${0.025 * 10 ** 18}`,
  //   "Random",
  //   true
  // );
};
