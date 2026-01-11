const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Deploy Remittance contract
  const Remittance = await ethers.getContractFactory("Remittance");
  const remittance = await Remittance.deploy();
  await remittance.waitForDeployment();
  const remittanceAddress = await remittance.getAddress();
  console.log("✅ Remittance contract deployed at:", remittanceAddress);

  // Update Config
  const configPath = path.join(__dirname, "../frontend/src/config.json");
  let config = {};
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  }

  config.remittanceAddress = remittanceAddress;

  // Read Artifact for ABI
  const artifactPath = path.join(__dirname, "../artifacts/contracts/Remittance.sol/Remittance.json");
  if (fs.existsSync(artifactPath)) {
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
    config.remittanceABI = artifact.abi;
  }

  // Remove mockTokenAddress if it exists, as it's deprecated
  delete config.mockTokenAddress;
  delete config.mockTokenABI;

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log("✅ Config updated in frontend/src/config.json");
}

main().catch((error) => {
  console.error("❌ Deployment error:", error);
  process.exit(1);
});