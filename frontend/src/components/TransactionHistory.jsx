import React, { useState, useEffect } from 'react';
import { History, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { formatUnits } from 'ethers';
import { API_URL } from '../apiConfig';

const TransactionHistory = ({ account, isDarkMode }) => {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (account) fetchHistory();

        // Listen for real-time updates
        const handleUpdate = () => {
            if (account) fetchHistory();
        };
        window.addEventListener('transactionUpdated', handleUpdate);

        return () => window.removeEventListener('transactionUpdated', handleUpdate);
    }, [account]);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/api/transactions/${account}`);
            const data = await res.json();
            setHistory(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    if (!account) return null;

    return (
        <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-xl border h-[444px] flex flex-col transition-colors`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 flex-shrink-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <History className={isDarkMode ? "text-purple-500" : "text-purple-600"} size={24} />
                Recent Activity
            </h3>

            <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {loading ? (
                    <p className="text-sm text-slate-500">Loading...</p>
                ) : history.length === 0 ? (
                    <p className={`text-sm italic ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>No activity yet.</p>
                ) : (
                    history.map((tx) => {
                        const isSend = tx.sender.toLowerCase() === account.toLowerCase();
                        return (
                            <div key={tx.id} className={`flex justify-between items-center p-3 rounded-lg border border-transparent transition ${isDarkMode ? 'hover:bg-slate-800/50 hover:border-slate-700' : 'hover:bg-gray-50 hover:border-gray-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${isSend
                                        ? (isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-600')
                                        : (isDarkMode ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-600')
                                        }`}>
                                        {isSend ? <ArrowUpRight size={18} /> : <ArrowDownLeft size={18} />}
                                    </div>
                                    <div>
                                        <p className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                            {isSend ? "Sent Remittance" : "Received Funds"}
                                        </p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                                            {new Date(tx.timestamp).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className={`font-bold ${isSend
                                        ? (isDarkMode ? 'text-gray-200' : 'text-gray-900')
                                        : (isDarkMode ? 'text-green-400' : 'text-green-600')
                                        }`}>
                                        {isSend ? '-' : '+'}{Number(formatUnits(tx.amount || "0", 18)).toFixed(4)} SETH
                                    </p>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                                        ≈ {(Number(formatUnits(tx.amount || "0", 18)) * Number(tx.rate || 0)).toLocaleString(undefined, { maximumFractionDigits: 2 })} {tx.currency}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div >
    );
};

export default TransactionHistory;
