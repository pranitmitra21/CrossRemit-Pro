import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { API_URL } from '../apiConfig';

const KYCForm = ({ account, isDarkMode }) => {
    const [name, setName] = useState('');
    const [doc, setDoc] = useState('');
    const [status, setStatus] = useState('not_found'); // not_found, pending, verified, rejected
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (account) checkStatus();
    }, [account]);

    const checkStatus = async () => {
        try {
            const res = await fetch(`${API_URL}/api/kyc/status/${account}`);
            const data = await res.json();
            if (data.status) setStatus(data.status);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await fetch(`${API_URL}/api/kyc/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ address: account, name, document: doc })
            });
            setStatus('pending');
            alert("KYC Submitted for Review");
        } catch (e) {
            alert("Submission failed");
        } finally {
            setLoading(false);
        }
    };

    if (status === 'verified') {
        return (
            <div className={`${isDarkMode ? 'bg-green-500/10 border-green-500/20' : 'bg-green-50 border-green-200'} p-6 rounded-xl border flex items-center gap-4`}>
                <div className={`${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} p-3 rounded-full`}>
                    <CheckCircle className={isDarkMode ? "text-green-400" : "text-green-600"} size={32} />
                </div>
                <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-800'}`}>Verified</h3>
                    <p className={isDarkMode ? "text-green-300/80" : "text-green-700"}>You are approved to send remittances.</p>
                </div>
            </div>
        );
    }

    if (status === 'pending') {
        return (
            <div className={`${isDarkMode ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-yellow-50 border-yellow-200'} p-6 rounded-xl border flex items-center gap-4`}>
                <div className={`${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'} p-3 rounded-full`}>
                    <Clock className={isDarkMode ? "text-yellow-400" : "text-yellow-600"} size={32} />
                </div>
                <div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-yellow-800'}`}>Pending Review</h3>
                    <p className={isDarkMode ? "text-yellow-300/80" : "text-yellow-700"}>Your documents are being reviewed by an admin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-xl border transition-colors`}>
            <h3 className={`text-xl font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Upload className={isDarkMode ? "text-blue-500" : "text-blue-600"} size={24} />
                Identity Verification (KYC)
            </h3>
            <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>Required before sending funds.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-gray-900'}`}
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className={`block text-sm font-medium mb-1 ${isDarkMode ? 'text-slate-300' : 'text-gray-700'}`}>ID Document Number</label>
                    <input
                        type="text"
                        required
                        value={doc}
                        onChange={(e) => setDoc(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition ${isDarkMode ? 'bg-[#0B1120] border-slate-700 text-white placeholder-slate-600' : 'bg-white border-gray-200 text-gray-900'}`}
                        placeholder="A123-456-789"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-500 transition disabled:opacity-50 shadow-lg shadow-blue-900/20"
                >
                    {loading ? "Submitting..." : "Submit for Verification"}
                </button>
            </form>
        </div>
    );
};

export default KYCForm;
