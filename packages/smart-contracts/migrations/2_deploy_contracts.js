const Transfer = artifacts.require("Transfer");
const nft = artifacts.require("NFT");
const nftMarket = artifacts.require("NFTMarket");
const crypt = artifacts.require("CRYPTNFT");
const nftStore = artifacts.require("NFTStore");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Transfer);
  await deployer.deploy(nftMarket);
  await deployer.deploy(nftStore, accounts[0]);
  await deployer.deploy(crypt, accounts[0]);

  // if (network === "ethTestnet") {
  //   let cryptToken = await crypt.deployed();
  //   cryptToken.mint(accounts[0], 1000);
  // }
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
