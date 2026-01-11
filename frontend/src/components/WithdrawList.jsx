import React, { useState, useEffect } from 'react';
import { Contract, formatUnits } from 'ethers';
import { ArrowDownToLine, RefreshCw } from 'lucide-react';
import config from '../config.json';

const WithdrawList = ({ signer, account, isDarkMode }) => {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTransfers = async () => {
        if (!signer || !config.remittanceAddress) return;
        setLoading(true);
        try {
            const contract = new Contract(config.remittanceAddress, config.remittanceABI, signer);
            const count = await contract.transferCount(); // public variable getter
            console.log("📊 Total transfers on contract:", Number(count));
            console.log("🔍 Looking for transfers to:", account);

            const loaded = [];

            // Reverse loop to show newest first
            // Limit to last 10 for performance in demo
            const total = Number(count);
            const start = Math.max(0, total - 10);

            for (let i = total - 1; i >= start; i--) {
                const t = await contract.getTransfer(i);
                console.log(`Transfer #${i}:`, {
                    sender: t.sender,
                    recipient: t.recipient,
                    amount: formatUnits(t.amount, 18),
                    withdrawn: t.withdrawn
                });

                // data: sender, recipient, amount, fxRate, sourceCurrency, targetCurrency, withdrawn
                if (t.recipient.toLowerCase() === account.toLowerCase() && !t.withdrawn) {
                    console.log(`✅ Found transfer for you! ID: ${i}`);
                    loaded.push({
                        id: i,
                        sender: t.sender,
                        recipient: t.recipient,
                        amount: t.amount,
                        fxRate: t.fxRate,
                        sourceCurrency: t.sourceCurrency,
                        targetCurrency: t.targetCurrency,
                        withdrawn: t.withdrawn
                    });
                }
            }
            console.log("💰 Your incoming transfers:", loaded.length);
            setTransfers(loaded);
        } catch (error) {
            console.error("❌ Fetch failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (id) => {
        if (!signer) return;

        // Find the transfer to show amount
        const transfer = transfers.find(t => t.id === id);
        if (!transfer) return;

        const amountInEth = formatUnits(transfer.amount, 18);

        // Confirmation dialog
        const confirmed = confirm(
            `Withdraw ${amountInEth} SETH?\n\n` +
            `From: ${transfer.sender.slice(0, 10)}...\n\n` +
            `Note: MetaMask will show "0 SETH" because you're calling a contract function, ` +
            `but you WILL receive ${amountInEth} SETH in your wallet!`
        );

        if (!confirmed) return;

        try {
            const contract = new Contract(config.remittanceAddress, config.remittanceABI, signer);
            const tx = await contract.withdraw(id);

            console.log(`⏳ Withdrawing ${amountInEth} SETH... TX:`, tx.hash);
            await tx.wait();

            console.log(`✅ Successfully withdrawn ${amountInEth} SETH!`);
            alert(`✅ Successfully withdrawn ${amountInEth} SETH!\n\nCheck your wallet balance - it has increased by ${amountInEth} SETH.`);
            window.dispatchEvent(new Event('transactionUpdated'));
            fetchTransfers();
        } catch (error) {
            console.error("Withdraw failed", error);
            alert("Withdraw failed: " + error.message);
        }
    };

    useEffect(() => {
        if (signer) fetchTransfers();
    }, [signer, account]);

    return (
        <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-xl border h-[412px] flex flex-col transition-colors`}>
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <ArrowDownToLine className={isDarkMode ? "text-green-500" : "text-green-600"} size={24} />
                    Incoming Transfers
                </h3>
                <button onClick={fetchTransfers} className={`p-2 rounded-full transition ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-gray-100'}`}>
                    <RefreshCw size={18} className={`${loading ? "animate-spin" : ""} ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`} />
                </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {transfers.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">No transfers found.</p>
                ) : (
                    transfers.map((t) => (
                        <div key={t.id} className={`p-4 border rounded-lg flex justify-between items-center transition ${isDarkMode ? 'border-slate-700/50 bg-[#0B1120]/50 hover:border-slate-600' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}>
                            <div>
                                <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{formatUnits(t.amount, 18)} {t.targetCurrency}</p>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>From: {t.sender.slice(0, 6)}...{t.sender.slice(-4)}</p>
                            </div>
                            {t.withdrawn ? (
                                <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-gray-200 text-gray-600'}`}>Received</span>
                            ) : (
                                <button
                                    onClick={() => handleWithdraw(t.id)}
                                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-500 transition shadow-lg shadow-green-900/20"
                                >
                                    Withdraw
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default WithdrawList;
