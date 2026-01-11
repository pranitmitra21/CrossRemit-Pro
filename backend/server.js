const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
// const { JSONFilePreset } = require('lowdb/node'); // Use dynamic import in initDB
const ethers = require('ethers');
require('dotenv').config({ path: '../.env' }); // Load from root

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize Database
const defaultData = { users: [], transactions: [] };
let db;

async function initDB() {
    const { JSONFilePreset } = await import('lowdb/node');
    db = await JSONFilePreset('db.json', defaultData);
    console.log("Database initialized");
}

// initDB(); // Moved to startServer

// Routes

// 1. Submit KYC
app.post('/api/kyc/submit', async (req, res) => {
    const { address, name, document } = req.body;
    if (!address || !name || !document) return res.status(400).json({ error: "Missing fields" });

    await db.read();
    const existing = db.data.users.find(u => u.address.toLowerCase() === address.toLowerCase());

    if (existing) {
        existing.name = name;
        existing.document = document;
        existing.status = 'pending';
        existing.updatedAt = Date.now();
    } else {
        db.data.users.push({
            address, name, document,
            status: 'pending',
            submittedAt: Date.now()
        });
    }
    await db.write();
    console.log(`[KYC] Submission: ${address}`);
    res.json({ message: "KYC submitted" });
});

// 2. Get KYC Status
app.get('/api/kyc/status/:address', async (req, res) => {
    const { address } = req.params;
    await db.read();
    const user = db.data.users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (!user) return res.json({ status: 'not_found' });
    res.json(user);
});

// 3. Admin: Get Pending
app.get('/api/admin/pending', async (req, res) => {
    await db.read();
    const pending = db.data.users.filter(u => u.status === 'pending');
    res.json(pending);
});

// 4. Admin: Update Status
app.post('/api/admin/update-status', async (req, res) => {
    const { address, status } = req.body;
    await db.read();
    const user = db.data.users.find(u => u.address.toLowerCase() === address.toLowerCase());
    if (!user) return res.status(404).json({ error: "User not found" });

    user.status = status;
    user.updatedAt = Date.now();
    await db.write();
    console.log(`[Admin] User ${address} status -> ${status}`);
    res.json({ message: "Status updated", user });
});

// 5. FX Rates (SETH-based with Multi-Currency)
app.get('/api/rates', (req, res) => {
    const { target } = req.query; // e.g., ?target=EUR

    // SETH price in USD
    const SETH_PRICE_USD = 2500;

    // USD to other currency rates
    const baseRates = {
        'NGN': 113.45,
        'EUR': 0.92,
        'GBP': 0.79,
        'INR': 83.12,
        'JPY': 148.50
    };

    const targetCurrency = target ? target.toUpperCase() : 'NGN';
    const usdRate = baseRates[targetCurrency] || 113.45;

    // Calculate SETH to target currency rate
    const sethRate = SETH_PRICE_USD * usdRate;

    // Add small variance
    const variance = (Math.random() * sethRate * 0.01) * (Math.random() > 0.5 ? 1 : -1);

    res.json({
        source: "SETH",
        target: targetCurrency,
        rate: (sethRate + variance).toFixed(2),
        timestamp: Date.now()
    });
});

// 6. Record Transaction (History)
app.post('/api/transactions/record', async (req, res) => {
    const { sender, recipient, amount, rate, currency } = req.body;
    await db.read();
    db.data.transactions.push({
        id: Date.now().toString(),
        sender, recipient, amount, rate, currency,
        timestamp: Date.now(),
        type: 'remittance'
    });
    await db.write();
    res.json({ success: true });
});

// 7. Get User History
app.get('/api/transactions/:address', async (req, res) => {
    const { address } = req.params;
    await db.read();
    const txs = db.data.transactions.filter(t =>
        t.sender.toLowerCase() === address.toLowerCase() ||
        t.recipient.toLowerCase() === address.toLowerCase()
    ).reverse(); // Newest first
    res.json(txs);
});

// 8. Get Verified Users List (KYC History)
app.get('/api/kyc/verified', async (req, res) => {
    await db.read();
    const verifiedUsers = db.data.users
        .filter(u => u.status === 'verified')
        .map(u => ({
            address: u.address,
            name: u.name,
            verifiedAt: u.updatedAt || u.submittedAt,
            status: u.status
        }))
        .sort((a, b) => b.verifiedAt - a.verifiedAt); // Newest first
    res.json(verifiedUsers);
});

// 9. Admin: Platform Stats
app.get('/api/admin/stats', async (req, res) => {
    await db.read();
    const totalVolume = db.data.transactions.reduce((acc, t) => {
        try {
            return acc + BigInt(t.amount);
        } catch { return acc; }
    }, 0n).toString();
    const totalUsers = db.data.users.length;
    const verifiedUsers = db.data.users.filter(u => u.status === 'verified').length;
    const recentTx = db.data.transactions.slice(-5).reverse();

    res.json({
        totalVolume,
        totalUsers,
        verifiedUsers,
        recentTx
    });
});

// 10. AI: Mock Fraud Detection
app.post('/api/ai/fraud-check', (req, res) => {
    const { amount, recipient } = req.body;

    // Simulate AI analysis
    let riskScore = 0; // 0-100 (High is risky)
    const reasons = [];

    // Rule 1: High Amount > 10,000
    if (parseFloat(amount) > 10000) {
        riskScore += 40;
        reasons.push("High transaction volume detected.");
    }

    // Rule 2: Suspicious Address (Mock)
    if (recipient.toLowerCase().startsWith("0x000")) {
        riskScore += 80;
        reasons.push("Recipient flagged by Blacklist AI.");
    }

    // Rule 3: Random Heuristics (AI simulation)
    const randomFactor = Math.floor(Math.random() * 20);
    riskScore += randomFactor;

    res.json({
        score: Math.min(riskScore, 100),
        status: riskScore > 50 ? "High Risk" : riskScore > 20 ? "Medium Risk" : "Safe",
        reasons
    });
});

// 11. ETH Faucet (Gas Money)
// 11. ETH Faucet (Disabled on Sepolia)
app.post('/api/faucet/eth', async (req, res) => {
    res.status(403).json({ error: "Faucet disabled on Sepolia." });
});

// ... existing code ...

// Helper: Sync DB with Blockchain
async function syncKycOnChain() {
    await db.read();
    const verifiedUsers = db.data.users.filter(u => u.status === 'verified');

    if (verifiedUsers.length === 0) return;

    console.log(`[Sync] Found ${verifiedUsers.length} verified users. Syncing with blockchain...`);

    try {
        const fs = require('fs');
        const path = require('path');
        const configPath = path.join(__dirname, '../frontend/src/config.json');

        if (!fs.existsSync(configPath)) {
            console.warn("[Sync] Config not found, skipping sync.");
            return;
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const PRIVATE_KEY = process.env.PRIVATE_KEY;
        const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL;

        if (!PRIVATE_KEY || !ALCHEMY_API_URL) {
            console.warn("[Sync] Missing Env Vars, skipping sync.");
            return;
        }

        const provider = new ethers.JsonRpcProvider(ALCHEMY_API_URL);
        const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const contract = new ethers.Contract(config.remittanceAddress, config.remittanceABI, wallet);

        for (const user of verifiedUsers) {
            try {
                // Check current status on-chain to avoid redundant txs
                const isVerified = await contract.kycVerified(user.address);
                if (!isVerified) {
                    console.log(`[Sync] Re-verifying ${user.address} on-chain...`);
                    const tx = await contract.setKycStatus(user.address, true);
                    await tx.wait();
                    console.log(`[Sync] Success: ${user.address}`);
                } else {
                    console.log(`[Sync] Already verified: ${user.address}`);
                }
            } catch (err) {
                console.error(`[Sync] Failed to verify ${user.address}:`, err.message);
            }
        }
    } catch (e) {
        console.error("[Sync] Error during sync:", e);
    }
}

// ... existing code ...

// START SERVER
async function startServer() {
    await initDB(); // Wait for DB to be ready

    app.listen(PORT, async () => {
        console.log(`Backend running on http://localhost:${PORT}`);
        await syncKycOnChain(); // Run Sync after server starts
    });
}

startServer();
