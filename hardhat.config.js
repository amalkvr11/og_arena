require("@nomicfoundation/hardhat-toolbox");

/** @type import("hardhat/config").HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    testnet: {
      url: "https://evmrpc-testnet.0g.ai",
      chainId: 16602,
      // accounts: [process.env.PRIVATE_KEY] // Uncomment and set your private key
    }
  }
};