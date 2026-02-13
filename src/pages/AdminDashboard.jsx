import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, SkipForward, Pause, Power, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
    const [currentServing, setCurrentServing] = useState(42);
    const [queueSize, setQueueSize] = useState(15);
    const [isPaused, setIsPaused] = useState(false);

    const stats = [
        { label: "Active Queue", value: queueSize, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
        { label: "Avg Service", value: "4.5m", icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
        { label: "Stability", value: "98%", icon: TrendingUp, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
    ];

    const upcomingTokens = [43, 44, 45, 46, 47];

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 lg:px-8 bg-theme-bg text-theme-text transition-colors duration-500">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-black tracking-tight mb-2">Admin Dashboard</h1>
                        <p className="text-theme-text-muted text-lg font-bold flex items-center gap-2">
                            Global Trust Bank <span className="w-1.5 h-1.5 bg-theme-border rounded-full" /> Counter #01
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 bg-theme-surface border-2 border-theme-border rounded-2xl text-theme-text-muted font-black hover:text-primary hover:border-primary/30 transition-all shadow-sm">
                            <AlertCircle size={20} /> Emergency
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border-2 border-rose-500/20 rounded-2xl text-rose-600 font-black hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                            <Power size={20} /> Close Station
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="bg-theme-surface border-2 border-theme-border p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none transition-all group hover:border-primary/20"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} border-2 border-theme-border ${stat.color} shadow-inner group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={28} />
                                </div>
                            </div>
                            <p className="text-sm font-bold text-theme-text-muted uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                            <p className="text-4xl font-black">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Controls Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Active Token Call */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-12 flex flex-col items-center text-center relative overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none">
                            <div className="absolute top-8 right-8">
                                <span className="flex items-center gap-2 px-5 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-black border border-emerald-500/20">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" /> ONLINE
                                </span>
                            </div>

                            <p className="text-theme-text-muted font-black uppercase tracking-[0.2em] text-sm mb-6">Currently Serving</p>
                            <h2 className="text-[10rem] font-black text-theme-text mb-12 tracking-tighter leading-none">#{currentServing}</h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCurrentServing(prev => prev + 1)}
                                    className="py-8 bg-primary hover:bg-indigo-600 text-white rounded-[2.5rem] font-black text-2xl flex flex-col items-center gap-3 shadow-2xl shadow-primary/30 active:translate-y-1 transition-all"
                                >
                                    <Play size={32} fill="currentColor" /> CALL NEXT
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="py-8 bg-theme-bg hover:bg-theme-surface text-theme-text border-2 border-theme-border rounded-[2.5rem] font-black text-xl flex flex-col items-center gap-3 hover:border-primary/40 transition-all shadow-lg"
                                >
                                    <SkipForward size={32} /> SKIP USER
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsPaused(!isPaused)}
                                    className={`py-8 rounded-[2.5rem] font-black text-xl flex flex-col items-center gap-3 border-2 transition-all shadow-lg ${isPaused
                                        ? 'bg-amber-500 text-white border-amber-600 shadow-amber-500/30'
                                        : 'bg-theme-bg hover:bg-theme-surface text-theme-text border-theme-border hover:border-amber-500/40'
                                        }`}
                                >
                                    <Pause size={32} fill={isPaused ? "currentColor" : "none"} /> {isPaused ? 'RESUME' : 'PAUSE'}
                                </motion.button>
                            </div>
                        </div>

                        {/* Queue List */}
                        <div className="bg-theme-surface border-2 border-theme-border rounded-[3rem] p-8 shadow-xl">
                            <h3 className="text-2xl font-black mb-8 px-2">Upcoming Tokens</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingTokens.map((token, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ x: 10 }}
                                        className="flex items-center justify-between p-6 bg-theme-bg rounded-[2rem] border-2 border-theme-border hover:border-primary/20 transition-all shadow-sm"
                                    >
                                        <div className="flex items-center gap-5">
                                            <span className="w-14 h-14 rounded-2xl bg-theme-surface border-2 border-theme-border flex items-center justify-center font-black text-xl text-theme-text-muted group-hover:text-primary">#{token}</span>
                                            <div>
                                                <p className="text-lg font-black">{i === 0 ? "Senior Citizen #A8" : "Guest User"}</p>
                                                <p className="text-xs text-theme-text-muted font-bold uppercase tracking-widest">{i * 5 + 5} mins wait</p>
                                            </div>
                                        </div>
                                        <button className="text-sm font-black text-primary hover:underline underline-offset-4">DETAILS</button>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Side Info / Alerts */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="bg-theme-surface border-2 border-theme-border rounded-[3rem] p-8 shadow-xl">
                            <h3 className="text-2xl font-black mb-8 px-2">Priority Requests</h3>
                            <div className="space-y-6">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="p-8 bg-amber-500/10 border-2 border-amber-500/20 rounded-[2.5rem] shadow-sm"
                                >
                                    <p className="text-xl text-theme-text font-black mb-1">Swap #88 ↔ #92</p>
                                    <p className="text-sm text-theme-text-muted mb-6 font-bold uppercase tracking-tight">Reason: Senior Priority</p>
                                    <div className="flex gap-4">
                                        <button className="flex-1 py-4 bg-amber-500 text-white rounded-2xl text-sm font-black shadow-lg shadow-amber-500/30 hover:bg-amber-600 transition-all">APPROVE</button>
                                        <button className="flex-1 py-4 bg-theme-bg text-amber-700 dark:text-amber-400 border-2 border-amber-500/20 rounded-2xl text-sm font-black hover:bg-rose-500/10 hover:text-rose-600 transition-all">REJECT</button>
                                    </div>
                                </motion.div>
                            </div>
                        </div>

                        <div className="bg-theme-surface border-2 border-theme-border p-10 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-2xl font-black mb-2">Queue IQ</h3>
                                <p className="text-theme-text-muted text-sm mb-10 font-bold uppercase tracking-widest leading-relaxed">System predicts peak load from <span className="text-primary font-black">2:00 PM - 4:00 PM</span></p>
                                <div className="h-32 flex items-end gap-2 px-2 overflow-hidden">
                                    {[40, 70, 45, 90, 65, 80, 50, 40, 30].map((h, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ height: 0 }}
                                            animate={{ height: `${h}%` }}
                                            transition={{ delay: i * 0.1, duration: 1 }}
                                            className="flex-1 bg-gradient-to-t from-primary to-secondary rounded-t-lg opacity-60 group-hover:opacity-100 transition-all"
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
