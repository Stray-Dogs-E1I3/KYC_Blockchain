require("@nomiclabs/hardhat-waffle");
require("@openzeppelin/hardhat-upgrades");
import "@nomiclabs/hardhat-etherscan";
require("dotenv").config();

const { LUNIVERSE_NODE_ID } = process.env;
const { LUNIVERSE_TEST_PRIVATE_KEY } = process.env;

const { TEST_PRIVATE_KEY } = process.env;
const { ETHERSCAN_API_KEY } = process.env;
const { PRIVATE_NETWORK_TEST_PRIVATE_KEY } = process.env;

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.0",
      },
      {
        version: "0.8.1",
        settings: {},
      },
      {
        version: "0.8.7",
        settings: {},
      },
      {
        version: "0.8.17",
        settings: {},
      },
    ],
  },
  networks: {
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [TEST_PRIVATE_KEY],
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [TEST_PRIVATE_KEY],
    },
    mumbai: {
      url: `https://polygon-mumbai.luniverse.io/${LUNIVERSE_NODE_ID}`,
      accounts: [LUNIVERSE_TEST_PRIVATE_KEY],
    },
    privates: {
      url: `http://192.168.153.143:8547`,
      accounts: [PRIVATE_NETWORK_TEST_PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
