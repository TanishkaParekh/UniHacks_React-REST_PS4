import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const RegisterPage = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();

    const handleRegister = (e) => {
        e.preventDefault();
        navigate('/dashboard');
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center px-4 bg-theme-bg transition-colors duration-500 relative overflow-hidden">
            {/* Theme-Aware Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-bg via-primary/5 to-secondary/5 transition-colors duration-700" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1000px] flex flex-col md:flex-row-reverse bg-theme-surface border border-theme-border rounded-[3rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] dark:shadow-none overflow-hidden relative z-10"
            >
                {/* Right Side (Form) */}
                <div className="w-full md:w-1/2 p-12 md:p-16 bg-theme-surface/60 backdrop-blur-xl">
                    <div className="mb-10">
                        <h2 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Create Account</h2>
                        <p className="text-theme-text-muted font-bold text-lg">Join Q-Flow and start saving time today</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-8">
                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Full Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    required
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="John Doe"
                                />
                                <User className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={22} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="yourname@gmail.com"
                                />
                                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={22} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Phone Number</label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    required
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="+1 (555) 000-0000"
                                />
                                <Phone className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={22} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Create Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={22} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-primary hover:bg-violet-700 text-white rounded-2xl font-black text-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-6"
                        >
                            Sign Up
                        </button>
                    </form>

                    <p className="text-center mt-10 text-theme-text-muted font-bold text-lg">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-black hover:underline underline-offset-8">Sign In</Link>
                    </p>
                </div>

                {/* Left Side (Visuals) */}
                <div className="hidden md:flex w-1/2 bg-[#0b011d] dark:bg-[#0b011d] relative items-center justify-center overflow-hidden">
                    {/* Pulsing Circle Outline */}
                    <motion.div
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[80%] h-[80%] border-2 border-dashed border-white/20 rounded-full"
                    />

                    {/* Floating Geometrics with Blur */}
                    <div className="relative group overflow-visible z-20">
                        <motion.div
                            animate={{
                                y: [40, -40, 40],
                                rotate: [0, -30, 0],
                                skew: [0, 5, 0]
                            }}
                            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
                            className="w-28 h-28 bg-gradient-to-br from-[#12e6da] to-[#7c3aed] rounded-[2.5rem] blur-[2px] shadow-[0_0_60px_rgba(18,230,218,0.4)] relative"
                        />
                    </div>

                    <motion.div
                        animate={{
                            y: [-30, 30, -30],
                            x: [20, -20, 20],
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute top-[20%] left-[25%] w-16 h-16 bg-gradient-to-br from-[#f43f5e] to-[#fb923c] rounded-[1.5rem] blur-[2px] shadow-[0_0_50px_rgba(244,63,94,0.4)] z-10"
                    />

                    {/* Ambient Glows */}
                    <div className="absolute top-[5%] right-[15%] w-72 h-72 bg-primary/10 rounded-full blur-[110px] pointer-events-none" />
                    <div className="absolute bottom-[25%] left-[10%] w-60 h-60 bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="absolute inset-0 bg-black/20 dark:bg-transparent pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};

export default RegisterPage;
