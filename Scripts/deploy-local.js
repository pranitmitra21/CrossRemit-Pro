const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Starting deployment...");

  // 1. Deploy Mock Token
  const MockToken = await hre.ethers.getContractFactory("MockToken");
  const mockToken = await MockToken.deploy("USD Coin", "USDC");
  await mockToken.waitForDeployment();
  const mockTokenAddress = await mockToken.getAddress();
  console.log(`MockToken deployed to: ${mockTokenAddress}`);

  // 2. Deploy Remittance Contract
  const Remittance = await hre.ethers.getContractFactory("Remittance");
  const remittance = await Remittance.deploy(mockTokenAddress);
  await remittance.waitForDeployment();
  const remittanceAddress = await remittance.getAddress();
  console.log(`Remittance deployed to: ${remittanceAddress}`);

  // 3. Save Config for Frontend
  const frontendDir = path.join(__dirname, "..", "frontend", "src");
  if (!fs.existsSync(frontendDir)) {
    console.log("Frontend directory not found. Creating...");
    fs.mkdirSync(frontendDir, { recursive: true });
  }

  const configPath = path.join(frontendDir, "config.json");
  const config = {
    mockTokenAddress,
    remittanceAddress,
    mockTokenABI: JSON.parse(JSON.stringify(MockToken.interface.formatJson())),
    remittanceABI: JSON.parse(JSON.stringify(Remittance.interface.formatJson()))
  };

  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  console.log(`Config saved to: ${configPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
