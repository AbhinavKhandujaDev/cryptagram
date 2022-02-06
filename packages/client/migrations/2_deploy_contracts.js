const Transfer = artifacts.require("Transfer");
const nft = artifacts.require("NFT");
const nftMarket = artifacts.require("NFTMarket");

module.exports = async function (deployer) {
  await deployer.deploy(Transfer);
  await deployer.deploy(nft);
  await deployer.deploy(nftMarket);
};
