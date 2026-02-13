import React from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Clock,
    Calendar,
    Bell,
    Search,
    ChevronRight,
    TrendingUp,
    Zap,
    History,
    MapPin,
    ArrowRightLeft
} from 'lucide-react';

const UserDashboard = () => {
    // Mock data for the dashboard
    const userData = {
        name: "Rownok",
        activeToken: {
            number: 49,
            place: "Global Trust Bank",
            peopleAhead: 7,
            waitTime: "35 mins",
            progress: 85
        },
        stats: [
            { label: "Total Visits", value: "24", icon: History, color: "text-blue-500", bg: "bg-blue-500/10" },
        ],
        swaps: {
            used: 2,
            total: 5
        },
        history: [
            { id: 1, place: "City General Hospital", date: "20 Aug 2024", token: "#105", status: "Completed" },
            { id: 2, place: "Student Admin - Block A", date: "15 Aug 2024", token: "#27", status: "Completed" },
            { id: 3, place: "Starbucks - Tech Park", date: "12 Aug 2024", token: "#88", status: "Canceled" },
        ]
    };

    return (
        <div className="pt-24 pb-12 min-h-screen px-4 lg:px-8 bg-theme-bg text-theme-text transition-colors duration-500">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black flex items-center gap-3">
                            Hello, {userData.name}! <span className="text-3xl animate-bounce">👋</span>
                        </h1>
                        <p className="text-theme-text-muted mt-2 text-lg font-medium">Your schedule is looking clear today.</p>
                    </motion.div>

                    <div className="flex items-center gap-3">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Search queues..."
                                className="bg-theme-surface border-2 border-theme-border rounded-[1.5rem] py-3 pl-12 pr-6 text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 w-64 md:w-80 transition-all font-medium shadow-sm"
                            />
                        </div>
                        <button className="p-4 bg-theme-surface border-2 border-theme-border rounded-[1.5rem] text-theme-text-muted hover:text-primary hover:border-primary/50 transition-all relative shadow-sm group">
                            <Bell size={22} className="group-hover:rotate-12 transition-transform" />
                            <span className="absolute top-3 right-3 w-3 h-3 bg-rose-500 rounded-full border-2 border-theme-surface shadow-sm" />
                        </button>
                    </div>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                    {/* Active Token Card - Main Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        whileHover={{ scale: 1.01 }}
                        className="md:col-span-8 bg-theme-surface border-2 border-primary/20 rounded-[3rem] p-10 relative overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <span className="px-5 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                                        Live Status
                                    </span>
                                    <h2 className="text-5xl md:text-6xl font-black text-theme-text mt-6 tracking-tight">{userData.activeToken.place}</h2>
                                    <p className="text-theme-text-muted mt-3 flex items-center gap-2 text-lg font-bold">
                                        <MapPin size={20} className="text-primary" /> Downtown Business District
                                    </p>
                                </div>
                                <div className="hidden sm:block">
                                    <div className="text-8xl font-black text-primary/5 group-hover:text-primary/10 transition-colors">#{userData.activeToken.number}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <div className="bg-theme-bg border border-theme-border rounded-[2rem] p-6 shadow-inner group hover:border-primary/30 transition-all">
                                    <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2 opacity-80">Position</p>
                                    <p className="text-4xl font-black text-theme-text">{userData.activeToken.peopleAhead}</p>
                                </div>
                                <div className="bg-theme-bg border border-theme-border rounded-[2rem] p-6 shadow-inner group hover:border-primary/30 transition-all">
                                    <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2 opacity-80">Wait Time</p>
                                    <p className="text-4xl font-black text-theme-text">{userData.activeToken.waitTime}</p>
                                </div>
                                <div className="sm:col-span-2 bg-theme-bg border border-theme-border rounded-[2rem] p-6 shadow-inner group hover:border-primary/30 transition-all">
                                    <div className="flex justify-between items-end mb-3">
                                        <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest opacity-80">Queue Progress</p>
                                        <span className="text-xl font-black text-theme-text">{userData.activeToken.progress}%</span>
                                    </div>
                                    <div className="h-4 bg-theme-surface rounded-full overflow-hidden p-1 border border-theme-border shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${userData.activeToken.progress}%` }}
                                            className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(124,58,237,0.3)]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
                        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none" />
                    </motion.div>

                    {/* Daily Swaps - Sidebar Widget */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        whileHover={{ y: -5 }}
                        className="md:col-span-4 bg-theme-surface border-2 border-theme-border rounded-[3rem] p-10 flex flex-col justify-between shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-all cursor-default relative overflow-hidden"
                    >
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-8 shadow-inner border border-primary/20">
                                <ArrowRightLeft size={32} />
                            </div>
                            <h3 className="text-3xl font-black mb-4 tracking-tight">Daily Swaps</h3>
                            <p className="text-theme-text-muted text-lg font-medium leading-relaxed mb-8">
                                You have <span className="text-primary font-black">{userData.swaps.total - userData.swaps.used} swaps</span> remaining for today.
                            </p>

                            {/* Visual Progress for Swaps */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-black text-theme-text-muted uppercase tracking-widest">Usage Limit</span>
                                    <span className="text-xl font-black">{userData.swaps.used} / {userData.swaps.total}</span>
                                </div>
                                <div className="h-4 bg-theme-bg rounded-full overflow-hidden p-1 border border-theme-border shadow-inner flex gap-1">
                                    {[...Array(userData.swaps.total)].map((_, i) => (
                                        <div
                                            key={i}
                                            className={`flex-1 rounded-full transition-all duration-500 ${i < userData.swaps.used
                                                ? 'bg-primary shadow-[0_0_10px_rgba(59,130,246,0.5)]'
                                                : 'bg-theme-border'
                                                }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button className="w-full mt-10 py-5 bg-primary text-white hover:bg-indigo-600 rounded-[2rem] font-black text-base flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/25">
                            Request New Swap
                        </button>
                    </motion.div>

                    {/* Stats Grid Icons */}
                    {userData.stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="md:col-span-4 lg:col-span-4 bg-theme-surface border-2 border-theme-border rounded-[2.5rem] p-8 text-center shadow-lg shadow-slate-100 dark:shadow-none transition-all group hover:border-primary/20"
                        >
                            <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner group-hover:rotate-6 transition-transform`}>
                                <stat.icon size={26} />
                            </div>
                            <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2">{stat.label}</p>
                            <p className="text-3xl font-black">{stat.value}</p>
                        </motion.div>
                    ))}

                    {/* Discovery Widget */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        whileHover={{ scale: 1.01 }}
                        className="md:col-span-8 lg:col-span-6 bg-theme-surface rounded-[3rem] p-10 relative overflow-hidden group shadow-xl shadow-slate-200/50 dark:shadow-none border-2 border-theme-border hover:border-primary/20 transition-all"
                    >
                        <div className="relative z-10 flex flex-col justify-between h-full">
                            <div>
                                <h3 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Explore Nearby</h3>
                                <p className="text-theme-text-muted text-lg mb-10 max-w-[280px] font-bold leading-snug">
                                    Instant service available at <span className="text-primary">4 locations</span> near you.
                                </p>
                            </div>
                            <button className="w-fit px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg shadow-xl shadow-primary/20 hover:px-14 transition-all">
                                Open Map
                            </button>
                        </div>
                        <MapPin className="absolute -right-6 top-1/2 -translate-y-1/2 w-64 h-64 text-primary/5 group-hover:translate-x-4 transition-transform duration-700" />
                    </motion.div>

                    {/* History Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="md:col-span-12 lg:col-span-12 bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-xl shadow-slate-200/50 dark:shadow-none"
                    >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                            <h3 className="text-3xl font-black flex items-center gap-3">
                                <History size={30} className="text-primary" /> Activity History
                            </h3>
                            <button className="text-base font-black text-primary hover:underline underline-offset-8">Download Report</button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {userData.history.map((item) => (
                                <motion.div
                                    key={item.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-theme-bg border-2 border-theme-border rounded-[2.5rem] p-8 flex flex-col justify-between hover:border-primary/40 transition-all cursor-pointer group shadow-sm hover:shadow-xl hover:shadow-primary/5"
                                >
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-16 h-16 bg-theme-surface border-2 border-theme-border rounded-3xl flex items-center justify-center font-black text-2xl text-theme-text-muted group-hover:text-primary transition-all shadow-inner group-hover:scale-110">
                                            {item.token}
                                        </div>
                                        <div className={`text-xs font-black px-5 py-2 rounded-full ${item.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                            }`}>
                                            {item.status.toUpperCase()}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black mb-1 group-hover:text-primary transition-colors">{item.place}</p>
                                        <p className="text-sm text-theme-text-muted font-bold flex items-center gap-2">
                                            <Calendar size={14} /> {item.date}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                </div>
            </div>

            {/* Bottom Floating Navigation (Mobile Style inspiration) */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 md:hidden bg-white/10 backdrop-blur-xl border border-white/20 p-2 rounded-full flex items-center gap-1 shadow-2xl z-50">
                <button className="p-4 bg-white text-slate-900 rounded-full shadow-lg"><Zap size={20} /></button>
                <button className="p-4 text-white hover:bg-white/10 rounded-full"><Users size={20} /></button>
                <button className="p-4 text-white hover:bg-white/10 rounded-full"><Calendar size={20} /></button>
                <button className="p-4 text-white hover:bg-white/10 rounded-full"><History size={20} /></button>
            </div>
        </div>
    );
};

export default UserDashboard;
