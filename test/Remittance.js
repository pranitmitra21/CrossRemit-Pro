const { expect } = require("chai");
const hre = require("hardhat");

describe("Remittance Contract", function () {
  let remittance, stablecoin, deployer, sender, recipient;

  beforeEach(async () => {
    [deployer, sender, recipient] = await hre.ethers.getSigners();

    // Deploy a mock ERC20 stablecoin
    const MockToken = await hre.ethers.getContractFactory("MockToken");
    stablecoin = await MockToken.deploy("Mock USD", "mUSD");
    console.log("stablecoin object:", stablecoin);
    console.log("MockToken deployed at:", stablecoin.target);

    // Mint tokens to sender (EOA address, so .address stays)
    await stablecoin.mint(sender.address, hre.ethers.parseUnits("1000", 18));

    // Deploy Remittance contract, use stablecoin.target, not .address
    const Remittance = await hre.ethers.getContractFactory("Remittance");
    remittance = await Remittance.deploy(stablecoin.target);
    console.log("Remittance deployed at:", remittance.target);
  });

  it("should simulate transfer and withdrawal with dynamic wallet", async () => {
    const amount = hre.ethers.parseUnits("10", 18);
    const fxRate = 11345;

    // sender approves contract to pull funds (use remittance.target here)
    await stablecoin.connect(sender).approve(remittance.target, amount);

    // send remittance (recipient.address is correct, signer EOA)
    const tx = await remittance.connect(sender).sendRemittance(
      recipient.address,
      amount,
      fxRate,
      "USD",
      "NGN"
    );
    
    const receipt = await tx.wait();

    // Fetch logs directly using the deployed contract's address and event topic
    const logs = await remittance.runner.provider.getLogs({
        address: remittance.target,
        fromBlock: receipt.blockNumber,
        toBlock: receipt.blockNumber,
    });

    const parsedLogs = logs
    .map(log => {
        try {
        return remittance.interface.parseLog(log);
        } catch {
        return null;
        }
    })
    .filter(log => log && log.name === "TransferInitiated");

    if (parsedLogs.length === 0) {
        throw new Error("No TransferInitiated event found in logs");
    }

const transferId = parsedLogs[0].args.transferId.toString();


    console.log("Transfer initiated with ID:", transferId);

    // Check contract balance (use remittance.target)
    const contractBalance = await stablecoin.balanceOf(remittance.target);
    expect(contractBalance.toString()).to.equal(amount.toString());

    // recipient withdraws
    const withdrawTx = await remittance.connect(recipient).withdraw(transferId);
    await withdrawTx.wait();

    // Check recipient balance (recipient.address is correct)
    const recipientBalance = await stablecoin.balanceOf(recipient.address);
    expect(recipientBalance.toString()).to.equal(amount.toString());

    console.log("Withdrawal successful for:", recipient.address);
  });
});