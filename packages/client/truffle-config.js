require("babel-register");
require("babel-polyfill");
const HDWalletProvider = require("@truffle/hdwallet-provider");

const mnemonic =
  "Goals Risks Approach Tradeoffs Environments Dependencies Data, Stakeholders Coverage models Resources Information needs Prioritisation Tooling, Schedule";

module.exports = {
  networks: {
    ethTestnet: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/090db3e9e87c41069d9e524a34e4e112"
        );
      },
      network_id: 4,
      skipDryRun: true,
    },
    bscTestnet: {
      provider: () =>
        new HDWalletProvider(
          mnemonic,
          `https://data-seed-prebsc-1-s1.binance.org:8545`
        ),
      network_id: 97,
      skipDryRun: true,
    },
    // development: {
    //   host: "127.0.0.1",
    //   port: 7545,
    //   network_id: "*", // Match any network id
    // },
  },
  contracts_directory: "./contracts",
  contracts_build_directory: "./abis",
  compilers: {
    solc: {
      version: "^0.8.0",
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
