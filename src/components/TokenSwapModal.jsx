import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRightLeft, User, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';

const TokenSwapModal = ({ isOpen, onClose, myToken }) => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [reason, setReason] = useState('');
    const [isSent, setIsSent] = useState(false);

    const availableUsers = [
        { id: 1, token: 45, position: 2, waitTime: "10 mins", name: "User A" },
        { id: 2, token: 46, position: 3, waitTime: "15 mins", name: "User B" },
        { id: 3, token: 47, position: 4, waitTime: "20 mins", name: "User C" },
    ];

    const reasons = [
        "Emergency / Medical",
        "Elderly / Senior Citizen",
        "Willing to wait longer",
        "Travel / Transport Issue"
    ];

    const handleSendRequest = () => {
        setIsSent(true);
        setTimeout(() => {
            onClose();
            setIsSent(false);
            setSelectedUser(null);
            setReason('');
        }, 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-theme-bg/90 backdrop-blur-md"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 40 }}
                        className="relative w-full max-w-xl bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-12 shadow-[0_32px_128px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
                    >
                        {isSent ? (
                            <div className="py-20 text-center">
                                <motion.div
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    className="w-28 h-28 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner"
                                >
                                    <CheckCircle2 size={64} />
                                </motion.div>
                                <h3 className="text-4xl font-black mb-4 tracking-tight">Request Sent!</h3>
                                <p className="text-theme-text-muted text-xl font-bold">Waiting for #{selectedUser?.token}'s response...</p>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-10">
                                    <div className="flex items-center gap-5">
                                        <div className="p-4 bg-primary/10 text-primary rounded-[1.5rem] border-2 border-primary/20 shadow-inner">
                                            <ArrowRightLeft size={32} />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-black tracking-tight mb-1">Token Swap</h2>
                                            <p className="text-theme-text-muted text-sm tracking-[0.2em] uppercase font-black">Your Token: <span className="text-primary">#{myToken}</span></p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-theme-text-muted hover:text-rose-500 transition-all p-3 hover:bg-rose-500/5 rounded-full border-2 border-transparent hover:border-rose-500/10"
                                    >
                                        <X size={32} />
                                    </button>
                                </div>

                                <div className="space-y-8">
                                    {/* User Selection */}
                                    <div>
                                        <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] mb-4 block px-2">Swap with Someone Ahead</label>
                                        <div className="space-y-4">
                                            {availableUsers.map((user) => (
                                                <motion.button
                                                    key={user.id}
                                                    whileHover={{ x: 10 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => setSelectedUser(user)}
                                                    className={`w-full flex items-center justify-between p-6 rounded-[2rem] border-2 transition-all shadow-lg ${selectedUser?.id === user.id
                                                        ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                                                        : 'bg-theme-bg border-theme-border hover:border-primary/20'
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 rounded-2xl bg-theme-surface border-2 border-theme-border flex items-center justify-center font-black text-2xl text-primary shadow-inner">
                                                            #{user.token}
                                                        </div>
                                                        <div className="text-left">
                                                            <p className="text-xl font-black">User {user.token}</p>
                                                            <p className="text-sm font-bold flex items-center gap-2 text-theme-text-muted"><Clock size={16} className="text-primary" /> {user.waitTime} wait </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-black text-primary uppercase tracking-tight">Ahead by {user.position} spots</p>
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Reason Selection */}
                                    <div>
                                        <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] mb-4 block px-2">Why do you need to swap?</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {reasons.map((r, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => setReason(r)}
                                                    className={`px-6 py-4 rounded-2xl border-2 text-sm font-black text-left transition-all ${reason === r
                                                        ? 'bg-primary/5 border-primary text-theme-text'
                                                        : 'bg-theme-bg border-theme-border text-theme-text-muted hover:border-primary/30 hover:text-theme-text'
                                                        }`}
                                                >
                                                    {r}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-amber-500/10 border-2 border-amber-500/20 p-6 rounded-[2rem] flex gap-5 shadow-sm">
                                        <AlertCircle className="text-amber-500 shrink-0" size={28} />
                                        <p className="text-xs text-amber-900 dark:text-amber-200/70 leading-relaxed font-bold">
                                            Note: Swaps are mutual. Your request will be sent to User {selectedUser?.token || 'X'} and must be accepted for the change to take effect.
                                        </p>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.05, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        disabled={!selectedUser || !reason}
                                        onClick={handleSendRequest}
                                        className={`w-full py-6 rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all shadow-2xl ${selectedUser && reason
                                            ? 'bg-primary hover:bg-indigo-600 text-white shadow-primary/30'
                                            : 'bg-theme-bg text-theme-text-muted cursor-not-allowed border-2 border-theme-border opacity-50'
                                            }`}
                                    >
                                        PROPOSE SWAP
                                    </motion.button>
                                </div>
                            </>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default TokenSwapModal;
