import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, ChevronRight } from 'lucide-react';
import { API_URL } from '../apiConfig';

const KYCHistory = ({ isDarkMode }) => {
    const [verifiedUsers, setVerifiedUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchVerifiedUsers = async () => {
        try {
            const res = await fetch(`${API_URL}/api/kyc/verified`);
            const data = await res.json();
            setVerifiedUsers(data);
            setLoading(false);
        } catch (e) {
            console.error('Failed to fetch verified users:', e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVerifiedUsers();
        // Auto-refresh every 10 seconds
        const interval = setInterval(fetchVerifiedUsers, 10000);
        return () => clearInterval(interval);
    }, []);

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`${isDarkMode ? 'bg-[#151E32] border-slate-800' : 'bg-white border-gray-100'} p-6 rounded-xl shadow-sm border transition-colors`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-xl font-semibold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    <Users className={isDarkMode ? "text-green-400" : "text-green-600"} size={24} />
                    KYC History
                </h3>
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                    <ShieldCheck size={16} className={isDarkMode ? "text-green-400" : "text-green-600"} />
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                        {verifiedUsers.length} Verified
                    </span>
                </div>
            </div>

            {loading ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-sm">Loading verified users...</p>
                </div>
            ) : verifiedUsers.length === 0 ? (
                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                    <ShieldCheck size={48} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No verified users yet</p>
                    <p className="text-xs mt-1">Complete KYC verification to appear here</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                    {verifiedUsers.map((user, index) => (
                        <div
                            key={user.address}
                            className={`flex items-center justify-between p-3 rounded-lg border transition group ${isDarkMode ? 'bg-[#0B1120]/50 border-slate-700/50 hover:bg-slate-800' : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100 hover:shadow-md'}`}
                        >
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <ShieldCheck size={16} className={`${isDarkMode ? 'text-green-400' : 'text-green-600'} flex-shrink-0`} />
                                    <p className={`font-semibold text-sm truncate ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {user.name}
                                    </p>
                                </div>
                                <p className={`font-mono text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-gray-600'}`}>
                                    {user.address.slice(0, 10)}...{user.address.slice(-8)}
                                </p>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-600' : 'text-gray-500'}`}>
                                    Verified: {formatDate(user.verifiedAt)}
                                </p>
                            </div>
                            <ChevronRight
                                size={18}
                                className={`${isDarkMode ? 'text-slate-600' : 'text-gray-400'} flex-shrink-0 group-hover:translate-x-1 transition`}
                            />
                        </div>
                    ))}
                </div>
            )}

            {verifiedUsers.length > 0 && (
                <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-gray-100'}`}>
                    <p className={`text-xs text-center ${isDarkMode ? 'text-slate-500' : 'text-gray-500'}`}>
                        Auto-updates every 10 seconds • Showing most recent verifications first
                    </p>
                </div>
            )}
        </div>
    );
};

export default KYCHistory;
