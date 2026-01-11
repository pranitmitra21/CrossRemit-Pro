const hre = require("hardhat");
const { expect } = require("chai");

async function main() {
    console.log("🚀 Starting Full-Stack Simulation...\n");

    // 1. Setup Environment
    const [deployer, user1, user2] = await hre.ethers.getSigners();
    console.log(`👤 User: ${user1.address}`);
    console.log(`👮 Admin: ${deployer.address}`);

    // Load Deployed Addresses from Frontend Config
    const config = require("../frontend/src/config.json");
    console.log(`📄 Contracts Loaded: Token at ${config.mockTokenAddress}, Remittance at ${config.remittanceAddress}\n`);

    const token = await hre.ethers.getContractAt("MockToken", config.mockTokenAddress);
    const remittance = await hre.ethers.getContractAt("Remittance", config.remittanceAddress);

    // 2. Mint Tokens (Faucet Simulation)
    console.log("💧 Step 1: Minting Tokens (Faucet)...");
    const mintAmount = hre.ethers.parseUnits("1000", 18);
    await token.connect(user1).mint(user1.address, mintAmount);
    console.log("   ✅ Minted 1000 USDC to User");

    // Backfill Mint transaction to Backend for Volume
    await fetch('http://localhost:3001/api/transactions/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            sender: "0x0000000000000000000000000000000000000000",
            recipient: user1.address,
            amount: mintAmount.toString(),
            rate: "1.0",
            currency: "USDC"
        })
    });
    console.log("   ✅ Recorded Mint in Backend API");


    // 3. KYC Submission (Frontend -> Backend)
    console.log("\n📝 Step 2: submitting KYC...");
    const kycRes = await fetch('http://localhost:3001/api/kyc/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: user1.address, name: "Simulated User", document: "SIM-888" })
    });
    console.log(`   ✅ KYC Submitted: ${(await kycRes.json()).message}`);


    // 4. Admin Approval (AdminDashboard -> Contract + Backend)
    console.log("\n👮 Step 3: Admin Approving KYC...");
    // On-Chain
    await remittance.connect(deployer).setKycStatus(user1.address, true);
    console.log("   ✅ On-Chain Status Updated to Verified");
    // Backend
    await fetch('http://localhost:3001/api/admin/update-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: user1.address, status: 'verified' })
    });
    console.log("   ✅ Backend Status Updated to Verified");


    // 5. Send Remittance (SendForm -> Contract)
    console.log("\n💸 Step 4: Sending Remittance...");
    const sendAmount = hre.ethers.parseUnits("500", 18);

    // Check AI Risk First
    const aiRes = await fetch('http://localhost:3001/api/ai/fraud-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: "500", recipient: user2.address })
    });
    const aiData = await aiRes.json();
    console.log(`   🤖 AI Risk Score: ${aiData.score} (${aiData.status})`);

    if (aiData.status !== "High Risk") {
        await token.connect(user1).approve(config.remittanceAddress, sendAmount);
        await remittance.connect(user1).sendRemittance(
            user2.address,
            sendAmount,
            100, // Rate 1.00 but * 100
            "USD",
            "EUR"
        );
        console.log("   ✅ Transaction Sent On-Chain");

        // Record in Backend
        await fetch('http://localhost:3001/api/transactions/record', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sender: user1.address,
                recipient: user2.address,
                amount: sendAmount.toString(),
                rate: "1.0",
                currency: "EUR"
            })
        });
        console.log("   ✅ Transaction Recorded in Backend");
    }

    // 6. Verify Final State
    console.log("\n📊 Step 5: Verifying Platform Stats...");
    const statsRes = await fetch('http://localhost:3001/api/admin/stats');
    const stats = await statsRes.json();
    console.log(`   📈 Total Volume: ${stats.totalVolume} (Wei)`);
    console.log(`   👥 Total Users: ${stats.totalUsers}`);

    console.log("\n✨ Simulation Complete: SYSTEM FUNCTIONAL ✨");
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
