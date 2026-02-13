import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Users, ArrowRightLeft, AlertCircle, CheckCircle2, XCircle, Zap } from 'lucide-react';
import TokenSwapModal from '../components/TokenSwapModal';
import { useQueue } from '../context/QueueContext';

const QueueStatusPage = () => {
    const { queueData, performSwap, snoozeQueue, markCompleted, canSwap } = useQueue();
    const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
    const [showAlert, setShowAlert] = useState(false);
    const [notifications, setNotifications] = useState([]);

    const { number: myToken, peopleAhead: position } = queueData.activeToken;
    const serving = Math.max(40, myToken - position); // Derive serving from token and position

    const upcomingTokens = [
        { id: serving + 1, type: 'Senior', wait: '2m' },
        { id: serving + 2, type: 'Guest', wait: '5m' },
        { id: serving + 3, type: 'Business', wait: '8m' },
    ];

    // Simulate queue movement and FCFS alert
    useEffect(() => {
        const timer = setInterval(() => {
            setServing(prev => prev + 1);
            setPosition(prev => Math.max(0, prev - 1));
        }, 15000);

        const alertTimer = setTimeout(() => {
            setShowAlert(true);
            setNotifications(prev => [...prev, "Spot #41 just opened! Swap now to jump ahead?"]);
        }, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(alertTimer);
        };
    }, []);

    const handleSnooze = () => {
        snoozeQueue();
        setNotifications(prev => ["You've been moved to the back (Snoozed).", ...prev]);
    };

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 max-w-2xl mx-auto bg-theme-bg transition-colors duration-500 space-y-8">
            {/* Real-time Notifications */}
            <AnimatePresence>
                {notifications.map((note, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        className="bg-primary text-white p-6 rounded-[2rem] shadow-2xl flex items-center justify-between border-2 border-white/20 backdrop-blur-xl"
                    >
                        <div className="flex items-center gap-4 text-sm font-black uppercase tracking-widest">
                            <Clock className="animate-pulse" /> {note}
                        </div>
                        <CheckCircle2 className="cursor-pointer" onClick={() => setNotifications(prev => prev.filter((_, idx) => idx !== i))} />
                    </motion.div>
                ))}
            </AnimatePresence>

            {/* FCFS Empty Slot Alert */}
            <AnimatePresence>
                {showAlert && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[2.5rem] p-8 relative overflow-hidden group shadow-lg"
                    >
                        <div className="relative z-10 flex gap-6 items-center">
                            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <Zap size={32} />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-black text-emerald-600 dark:text-emerald-400">Empty Slot Available!</h3>
                                <p className="text-sm font-bold text-theme-text-muted mt-1 leading-relaxed">Token #41 just canceled. Click to jump ahead! First-come, first-served.</p>
                            </div>
                            <button
                                onClick={() => {
                                    performSwap(41, 1);
                                    setShowAlert(false);
                                }}
                                className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black text-sm shadow-xl hover:bg-emerald-600 transition-all font-primary"
                            >
                                CLAIM SPOT
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                    <div className="bg-primary/10 text-primary px-6 py-4 rounded-[2rem] font-black text-5xl border-2 border-primary/20 shadow-xl">
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
                            animate={{ width: `${Math.min(100, ((serving - 40) / (myToken - 40)) * 100)}%` }}
                            className="h-full bg-gradient-to-r from-primary via-indigo-500 to-indigo-600 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        />
                    </div>
                    <div className="flex justify-between text-xs font-black text-theme-text-muted uppercase tracking-widest px-1">
                        <span>Started at #40</span>
                        <span className="text-primary">Target: #{myToken}</span>
                    </div>
                </div>

                {/* Upcoming Tokens Visualization (Shifting) */}
                <div className="mb-12">
                    <h3 className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] mb-6 px-2">Next in Line</h3>
                    <div className="space-y-4">
                        {upcomingTokens.map((token, i) => (
                            <motion.div
                                key={token.id}
                                layout
                                className="flex items-center justify-between p-6 bg-theme-bg rounded-2xl border-2 border-theme-border hover:border-primary/20 shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-theme-surface border-2 border-theme-border flex items-center justify-center font-black text-lg text-theme-text-muted">
                                        #{token.id}
                                    </div>
                                    <p className="font-black">{token.type} User</p>
                                </div>
                                <span className="text-xs font-black text-primary uppercase tracking-widest">{token.wait} wait</span>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <motion.button
                        whileHover={canSwap ? { scale: 1.02, y: -2 } : {}}
                        whileTap={canSwap ? { scale: 0.98 } : {}}
                        onClick={() => canSwap && setIsSwapModalOpen(true)}
                        className={`w-full py-6 rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 border-2 transition-all shadow-lg ${canSwap
                            ? 'bg-theme-bg hover:bg-theme-surface text-theme-text border-theme-border hover:border-primary/50'
                            : 'bg-theme-bg text-theme-text-muted border-theme-border opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <ArrowRightLeft size={24} className={canSwap ? "text-primary" : "text-theme-text-muted"} />
                        {canSwap ? 'Request Token Swap' : 'Daily Limit Reached'}
                    </motion.button>

                    {!canSwap && (
                        <p className="text-center text-rose-500 text-xs font-black uppercase tracking-widest mt-2">
                            You've used all 8 swaps for today
                        </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleSnooze}
                            className="py-5 bg-theme-bg text-theme-text-muted border-2 border-theme-border rounded-[2rem] font-black hover:border-amber-500/40 hover:text-amber-500 transition-all flex items-center justify-center gap-2"
                        >
                            <Clock size={20} /> Snooze Apt
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                                markCompleted();
                                setNotifications(prev => ["Queue left. See you soon!", ...prev]);
                            }}
                            className="py-5 bg-theme-bg text-theme-text-muted border-2 border-theme-border rounded-[2rem] font-black hover:border-rose-500/40 hover:text-rose-600 transition-all flex items-center justify-center gap-2"
                        >
                            <XCircle size={20} /> Leave Queue
                        </motion.button>
                    </div>
                </div>

                <TokenSwapModal
                    isOpen={isSwapModalOpen}
                    onClose={() => setIsSwapModalOpen(false)}
                    myToken={myToken}
                />

                {/* Info Alert */}
                <div className="mt-10 flex gap-4 p-6 bg-amber-500/10 border-2 border-amber-500/20 rounded-[2rem] shadow-sm text-theme-text">
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
