import React, { useState, useEffect } from 'react';
import { Contract, parseEther } from 'ethers';
import { Send, RefreshCcw } from 'lucide-react';
import config from '../config.json';
import { API_URL } from '../apiConfig';

const SendForm = ({ signer, account, isDarkMode }) => {
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [currency, setCurrency] = useState('NGN');
    const [rateData, setRateData] = useState({ rate: "0.00", source: "USD", target: "NGN" });
    const [riskData, setRiskData] = useState(null); // { score, status, reasons }

    const fetchRate = async () => {
        try {
            const res = await fetch(`${API_URL}/api/rates?target=${currency}`);
            const data = await res.json();
            setRateData(data);
        } catch (e) { console.error(e); }
    };

    const checkRisk = async () => {
        if (!amount || !recipient) return;
        try {
            const res = await fetch(`${API_URL}/api/ai/fraud-check`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount, recipient })
            });
            const data = await res.json();
            setRiskData(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        if (amount && recipient) {
            const timeout = setTimeout(checkRisk, 800); // Debounce
            return () => clearTimeout(timeout);
        } else {
            setRiskData(null);
        }
    }, [amount, recipient]);

    useEffect(() => {
        fetchRate();
        const interval = setInterval(fetchRate, 30000); // 30s poll
        return () => clearInterval(interval);
    }, [currency]); // Re-fetch when currency changes

    const handleSend = async (e) => {
        e.preventDefault();
        if (!signer || !config.remittanceAddress) return;
        setLoading(true);

        try {
            const remittanceContract = new Contract(config.remittanceAddress, config.remittanceABI, signer);

            const parsedAmount = parseEther(amount); // Use parseEther for SETH
            const rateInt = Math.floor(parseFloat(rateData.rate) * 100);

            // Send SETH
            console.log("Sending SETH...");
            const tx = await remittanceContract.sendRemittance(
                recipient,
                rateInt,
                rateData.source,
                rateData.target,
                { value: parsedAmount } // Send SETH Value
            );
            await tx.wait();

            // 3. Record to Backend History
            await fetch(`${API_URL}/api/transactions/record`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sender: account,
                    recipient,
                    amount: parsedAmount.toString(),
                    rate: rateData.rate,
                    currency: rateData.target
                })
            });

            alert("Remittance Sent Successfully!");
            setRecipient('');
            setAmount('');
            window.dispatchEvent(new Event('transactionUpdated'));

        } catch (error) {
            console.error("Send failed", error);
            alert("Send failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSend} className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-xl border transition-colors`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Send className={isDarkMode ? "text-blue-500" : "text-blue-600"} size={24} />
                    Send SETH
                </h3>
                <div className={`text-right text-xs flex flex-col items-end ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    <span className="flex items-center gap-1">
                        Rate: 1 SETH = {rateData.rate} {rateData.target}
                    </span>
                    <span className="text-blue-400/80">Live from API</span>
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Target Currency</label>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4 transition ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}
                    >
                        <option value="NGN">Nigerian Naira (NGN)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="JPY">Japanese Yen (JPY)</option>
                    </select>

                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Recipient Address</label>
                    <input
                        type="text"
                        required
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        placeholder="0x..."
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm transition ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Amount (ETH)</label>
                    <div className="relative">
                        <input
                            type="number"
                            required
                            step="0.0001"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'}`}
                        />
                        <div className={`absolute right-4 top-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-gray-400'}`}>
                            ≈ {amount ? (parseFloat(amount) * parseFloat(rateData.rate)).toLocaleString() : '0'} {rateData.target}
                        </div>
                    </div>
                </div>

                {/* AI Risk Indicator */}
                {riskData && (
                    <div className={`p-4 rounded-lg border text-sm ${riskData.status === 'Safe'
                        ? (isDarkMode ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-green-50 border-green-200 text-green-700')
                        : riskData.status === 'Medium Risk'
                            ? (isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400' : 'bg-yellow-50 border-yellow-200 text-yellow-700')
                            : (isDarkMode ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-red-50 border-red-200 text-red-700')
                        }`}>
                        <div className="flex justify-between items-center mb-1">
                            <span className="font-bold flex items-center gap-2">
                                {riskData.status === 'Safe' ? '🛡️ Safe Transaction' : '⚠️ AI Security Alert'}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-mono ${isDarkMode ? 'bg-[#0B1120]/50' : 'bg-white/50'}`}>
                                Score: {riskData.score}/100
                            </span>
                        </div>
                        {riskData.reasons.length > 0 && (
                            <ul className="list-disc list-inside mt-2 opacity-80">
                                {riskData.reasons.map((r, i) => <li key={i}>{r}</li>)}
                            </ul>
                        )}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || (riskData && riskData.status === 'High Risk')}
                    className={`w-full py-3 text-white font-medium rounded-lg transition disabled:opacity-50 shadow-lg ${riskData && riskData.status === 'High Risk' ? 'bg-red-500/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-900/20'
                        }`}
                >
                    {loading ? "Processing..." : riskData && riskData.status === 'High Risk' ? "Transaction Blocked by AI" : "Send Remittance"}
                </button>
            </div>
        </form>
    );
};

export default SendForm;

