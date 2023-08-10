require("@nomicfoundation/hardhat-toolbox");

const { API_URL, POLYGON_URL, PRIVATE_KEY, ETHERSCAN_API, POLYGONSCAN_API } =
  process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: API_URL,
      accounts: [PRIVATE_KEY],
    },
    mumbai: {
      url: POLYGON_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    // apiKey: ETHERSCAN_API,
    apiKey: POLYGONSCAN_API,
  },
};
