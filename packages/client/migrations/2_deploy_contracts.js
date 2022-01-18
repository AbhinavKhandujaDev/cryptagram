const Transfer = artifacts.require("Transfer");
const Post = artifacts.require("Post");

module.exports = function (deployer) {
  deployer.deploy(Transfer);
  deployer.deploy(Post);
};
