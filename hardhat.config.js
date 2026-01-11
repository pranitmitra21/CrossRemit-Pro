require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL || "";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "";

const networks = {
  hardhat: {
    chainId: 31337,
  },
  localhost: {
    url: "http://127.0.0.1:8545",
    chainId: 31337,
  }
};

if (ALCHEMY_API_URL && PRIVATE_KEY) {
  networks.amoy = {
    url: ALCHEMY_API_URL,
    accounts: [PRIVATE_KEY],
    chainId: 80002
  };
  networks.sepolia = {
    url: ALCHEMY_API_URL,
    accounts: [PRIVATE_KEY],
    chainId: 11155111
  };
}

module.exports = {
  solidity: {
    compilers: [
      { version: "0.8.20" },
      { version: "0.8.28" }
    ],
  },
  networks: networks,
};