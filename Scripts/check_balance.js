const { ethers } = require("hardhat");

async function main() {
    // connect to the network specified in command line (Sepolia)
    const [signer] = await ethers.getSigners();
    const address = await signer.getAddress();

    console.log("Checking balance for address:", address);

    const balance = await ethers.provider.getBalance(address);
    console.log("Balance:", ethers.formatEther(balance), "ETH");
}

main().catch(console.error);
