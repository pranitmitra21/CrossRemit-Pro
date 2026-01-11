import React, { useState, useEffect } from 'react';
import { Contract, formatEther, ethers } from 'ethers';
import { UserCheck, XCircle, Shield, Users, Wallet, RefreshCcw } from 'lucide-react';
import config from '../config.json';
import { API_URL } from '../apiConfig';

const AdminDashboard = ({ signer, isAdmin = false, isDarkMode }) => {
    const [pending, setPending] = useState([]);
    const [stats, setStats] = useState({ totalVolume: 0, totalUsers: 0, verifiedUsers: 0 });
    const [userBalance, setUserBalance] = useState("0.0");
    const [ethPrice, setEthPrice] = useState(2500);

    const [loadingBalance, setLoadingBalance] = useState(false);

    const fetchBalance = async () => {
        setLoadingBalance(true);
        try {
            if (!window.ethereum) {
                console.log("No MetaMask");
                return;
            }

            // Get current accounts
            const accounts = await window.ethereum.request({ method: 'eth_accounts' });
            if (!accounts || accounts.length === 0) {
                console.log("No accounts connected");
                return;
            }

            const address = accounts[0];

            // Direct balance fetch from MetaMask
            const balanceHex = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            });

            const balanceInEth = formatEther(balanceHex);
            console.log(`✅ Balance for ${address}: ${balanceInEth} SETH`);
            setUserBalance(balanceInEth);

        } catch (error) {
            console.error("Balance fetch failed:", error);
        } finally {
            // Add slight delay so user sees the spinner
            setTimeout(() => setLoadingBalance(false), 800);
        }
    };

    const fetchData = async () => {
        // Backend data
        try {
            const [pendingRes, statsRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/pending`),
                fetch(`${API_URL}/api/admin/stats`)
            ]);
            setPending(await pendingRes.json());
            setStats(await statsRes.json());
        } catch (e) {
            console.error("Backend Error:", e);
        }

        // Blockchain balance
        await fetchBalance();
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        const handleUpdate = () => fetchData();
        window.addEventListener('transactionUpdated', handleUpdate);

        return () => {
            clearInterval(interval);
            window.removeEventListener('transactionUpdated', handleUpdate);
        };
    }, []);

    const [approving, setApproving] = useState(null); // Track which user is being processed
    const [blockchainStatus, setBlockchainStatus] = useState(null); // Track blockchain confirmation

    const handleDecision = async (userAddress, approved) => {
        console.log("🎯 handleDecision called!");
        console.log("User address:", userAddress);
        console.log("Approved:", approved);

        if (!signer) {
            alert("Connect Wallet as Admin");
            console.error("❌ No signer!");
            return;
        }

        setApproving(userAddress);

        try {
            // 🚀 STEP 1: UPDATE BACKEND FIRST (Instant!)
            console.log("⚡ Updating backend database first...");
            const response = await fetch(`${API_URL}/api/admin/update-status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: userAddress, status: approved ? 'verified' : 'rejected' })
            });

            if (!response.ok) {
                throw new Error("Backend update failed");
            }

            console.log("✅ Backend updated instantly!");

            // 🎉 STEP 2: Show success immediately and refresh
            alert(`User ${approved ? 'Approved' : 'Rejected'}! ✅\n\nBlockchain confirmation in progress...`);
            fetchData(); // User sees "Verified" status now!
            setApproving(null);

            // 📡 STEP 3: Blockchain confirmation in background
            setBlockchainStatus("⏳ Confirming on blockchain...");
            console.log("📡 Starting blockchain confirmation in background...");

            try {
                // Ensure on Sepolia
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });
            } catch (switchError) {
                console.error("⚠️ Network switch error:", switchError);
            }

            // Call smart contract
            console.log("📝 Creating contract instance...");
            const contract = new Contract(config.remittanceAddress, config.remittanceABI, signer);

            console.log("🚀 Sending blockchain transaction...");
            const tx = await contract.setKycStatus(userAddress, approved);
            console.log("⏳ Transaction sent! TX Hash:", tx.hash);

            setBlockchainStatus(`⏳ TX: ${tx.hash.slice(0, 10)}...`);

            await tx.wait();
            console.log("✅ Blockchain confirmed!");
            setBlockchainStatus("✅ Blockchain confirmed!");

            setTimeout(() => setBlockchainStatus(null), 3000); // Clear after 3s

        } catch (error) {
            console.error("❌ Error:", error);

            // If backend succeeded but blockchain failed, warn the user
            if (blockchainStatus) {
                alert("⚠️ User is approved in database, but blockchain sync failed.\nThey may need manual blockchain update later.");
                setBlockchainStatus("⚠️ Blockchain sync failed");
                setTimeout(() => setBlockchainStatus(null), 5000);
            } else {
                alert("Action Failed: " + (error.reason || error.message));
            }
        } finally {
            setApproving(null);
        }
    };

    return (
        <div className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-xl flex items-center justify-between transition-colors`}>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-slate-400 text-sm font-medium">Your Balance</p>
                            <RefreshCcw
                                size={14}
                                className={`text-slate-500 transition ${loadingBalance ? 'animate-spin text-blue-500 cursor-not-allowed' : 'cursor-pointer hover:text-blue-400'}`}
                                onClick={loadingBalance ? undefined : fetchBalance}
                                title="Refresh Balance"
                            />
                        </div>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{parseFloat(userBalance).toFixed(4)} SETH</p>
                        <p className={`text-xs font-medium mt-1 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            ≈ ${(parseFloat(userBalance) * ethPrice).toLocaleString()} USD
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'}`}>
                        <Wallet className={isDarkMode ? "text-blue-500" : "text-blue-600"} size={24} />
                    </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-xl flex items-center justify-between transition-colors`}>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Total Users</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stats.totalUsers}</p>
                    </div>
                    <div className="bg-purple-500/10 p-3 rounded-full">
                        <Users className={isDarkMode ? "text-purple-500" : "text-purple-600"} size={24} />
                    </div>
                </div>

                <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl border shadow-xl flex items-center justify-between transition-colors`}>
                    <div>
                        <p className="text-slate-400 text-sm font-medium">Verified Ratio</p>
                        <p className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {stats.totalUsers ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}%
                        </p>
                    </div>
                    <div className={`p-3 rounded-full ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                        <span className={`text-2xl ${isDarkMode ? 'text-green-500' : 'text-green-600'}`}>✓</span>
                    </div>
                </div>
            </div>

            {/* Blockchain Status Indicator */}
            {blockchainStatus && (
                <div className={`p-4 rounded-lg flex items-center gap-3 border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/20' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="text-2xl">
                        {blockchainStatus.includes('✅') ? '✅' : blockchainStatus.includes('⚠️') ? '⚠️' : '⏳'}
                    </div>
                    <p className="text-blue-400 font-medium">{blockchainStatus}</p>
                </div>
            )}

            {/* Pending Verifications - Admin Only */}
            {isAdmin && (
                <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-xl border transition-colors`}>
                    <h3 className={`text-xl font-semibold mb-6 flex items-center gap-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        <span className="text-2xl">🛡️</span>
                        Pending Verifications
                    </h3>

                    {pending.length === 0 ? (
                        <p className="text-slate-500 italic">No pending KYC requests.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className={`border-b text-sm ${isDarkMode ? 'border-slate-700 text-slate-400' : 'border-gray-100 text-gray-500'}`}>
                                        <th className="pb-3 font-medium">Name</th>
                                        <th className="pb-3 font-medium">Document ID</th>
                                        <th className="pb-3 font-medium text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-gray-100'}`}>
                                    {pending.map((u) => (
                                        <tr key={u.address} className={`group transition ${isDarkMode ? 'hover:bg-slate-700/30' : 'hover:bg-gray-50'}`}>
                                            <td className={`py-4 font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>{u.name}</td>
                                            <td className={`py-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{u.document}</td>
                                            <td className="py-4 text-right flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleDecision(u.address, true)}
                                                    disabled={approving === u.address}
                                                    className="p-2 text-green-400 hover:bg-green-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    {approving === u.address ? "⏳" : <UserCheck size={20} />}
                                                </button>
                                                <button
                                                    onClick={() => handleDecision(u.address, false)}
                                                    disabled={approving === u.address}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                                                >
                                                    {approving === u.address ? "⏳" : <XCircle size={20} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
