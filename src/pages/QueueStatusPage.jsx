import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Users, ArrowRightLeft, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import TokenSwapModal from '../components/TokenSwapModal';

const QueueStatusPage = () => {
    const [position, setPosition] = useState(7);
    const [serving, setServing] = useState(42);
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const myToken = 49;

    // Simulate queue movement
    useEffect(() => {
        const timer = setInterval(() => {
            setServing(prev => prev + 1);
            setPosition(prev => Math.max(0, prev - 1));
        }, 15000); // Move every 15 seconds for demo
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 max-w-2xl mx-auto bg-theme-bg transition-colors duration-500">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-2xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden"
            >
                {/* Header */}
                <div className="flex justify-between items-start mb-12">
                    <div>
                        <h1 className="text-3xl font-black mb-2 tracking-tight">Your Token</h1>
                        <p className="text-theme-text-muted text-lg font-bold">Global Trust Bank - Downtown</p>
                    </div>
                    <div className="bg-primary/10 text-primary px-6 py-4 rounded-[2rem] font-black text-5xl border-2 border-primary/20 shadow-inner">
                        #{myToken}
                    </div>
                </div>

                {/* Status Grid */}
                <div className="grid grid-cols-2 gap-6 mb-12">
                    <div className="bg-theme-bg p-8 rounded-[2.5rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Users size={16} /> People Ahead
                        </p>
                        <p className="text-5xl font-black">{position}</p>
                    </div>
                    <div className="bg-theme-bg p-8 rounded-[2.5rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Clock size={16} /> Wait Time
                        </p>
                        <p className="text-5xl font-black text-primary">{position * 5}m</p>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="mb-12 space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-theme-text-muted text-lg font-bold">Currently Serving</span>
                        <span className="text-4xl font-black text-primary">#{serving}</span>
                    </div>
                    <div className="h-6 bg-theme-bg rounded-full border-2 border-theme-border overflow-hidden p-1 shadow-inner">
                        <motion.div
                            initial={{ width: '10%' }}
                            animate={{ width: `${((serving - 40) / (myToken - 40)) * 100}%` }}
                            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-black text-theme-text-muted uppercase tracking-widest px-1">
                        <span>Started at #40</span>
                        <span className="text-primary">Target: #{myToken}</span>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-6">
                    <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsSwapModalOpen(true)}
                        className="w-full py-6 bg-theme-bg hover:bg-theme-surface text-theme-text rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 border-2 border-theme-border hover:border-primary/50 transition-all shadow-lg shadow-slate-100 dark:shadow-none"
                    >
                        <ArrowRightLeft size={24} className="text-primary" /> Request Token Swap
                    </motion.button>

                    <button className="w-full py-3 text-theme-text-muted text-base font-black hover:text-rose-500 transition-colors uppercase tracking-widest">
                        Leave Queue
                    </button>
                </div>

                <TokenSwapModal
                    isOpen={isSwapModalOpen}
                    onClose={() => setIsSwapModalOpen(false)}
                    myToken={myToken}
                />

                {/* Info Alert */}
                <div className="mt-10 flex gap-4 p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[2rem] shadow-sm">
                    <AlertCircle className="text-amber-500 shrink-0" size={28} />
                    <p className="text-sm font-bold text-amber-700 dark:text-amber-200/80 leading-relaxed">
                        Pro-tip: Please arrive at the counter when you have <span className="text-amber-600 dark:text-amber-400 font-black px-1">2 people</span> ahead of you for a smooth experience.
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default QueueStatusPage;
