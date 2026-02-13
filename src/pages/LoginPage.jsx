import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock, User, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const LoginPage = () => {
    const [role, setRole] = useState('user');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { theme } = useTheme();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        if (role === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen py-24 flex items-center justify-center px-4 bg-theme-bg transition-colors duration-500 relative overflow-hidden">
            {/* Theme-Aware Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-theme-bg via-primary/5 to-secondary/5 transition-colors duration-700" />

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[1000px] flex flex-col md:flex-row bg-theme-surface border border-theme-border rounded-[3rem] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.2)] dark:shadow-none overflow-hidden relative z-10"
            >
                {/* Left Side - Login Form */}
                <div className="w-full md:w-1/2 p-12 md:p-16 bg-theme-surface/60 backdrop-blur-xl">
                    <div className="mb-12">
                        <h2 className="text-4xl font-black text-theme-text mb-3 tracking-tight">Welcome Back</h2>
                        <p className="text-theme-text-muted font-bold text-lg">Enter your details to access your account</p>
                    </div>

                    <div className="flex bg-theme-bg p-1.5 rounded-full mb-12 w-fit shadow-inner border border-theme-border">
                        <button
                            onClick={() => setRole('user')}
                            className={`px-10 py-3 rounded-full font-black text-sm transition-all duration-300 ${role === 'user' ? 'bg-primary text-white shadow-xl' : 'text-theme-text-muted hover:text-theme-text'}`}
                        >
                            User
                        </button>
                        <button
                            onClick={() => setRole('admin')}
                            className={`px-10 py-3 rounded-full font-black text-sm transition-all duration-300 ${role === 'admin' ? 'bg-primary text-white shadow-xl' : 'text-theme-text-muted hover:text-theme-text'}`}
                        >
                            Admin
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-10">
                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Email Address</label>
                            <div className="relative">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="yourname@gmail.com"
                                />
                                <Mail className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={24} />
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-black text-theme-text-muted uppercase tracking-[0.2em] ml-1 opacity-70">Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b-2 border-theme-border py-4 pr-10 text-theme-text focus:outline-none focus:border-primary transition-all text-xl font-bold placeholder:text-theme-text-muted/20"
                                    placeholder="••••••••"
                                />
                                <Lock className="absolute right-0 top-1/2 -translate-y-1/2 text-theme-text-muted opacity-40 group-focus-within:opacity-100 transition-opacity" size={24} />
                            </div>
                        </div>

                        <div className="flex justify-between items-center px-1">
                            <label className="flex items-center gap-3 cursor-pointer text-base font-bold text-theme-text-muted hover:text-theme-text transition-colors group">
                                <div className="relative flex items-center justify-center">
                                    <input type="checkbox" className="peer appearance-none w-5 h-5 rounded border-2 border-theme-border checked:bg-primary checked:border-primary transition-all cursor-pointer" />
                                    <div className="absolute hidden peer-checked:block text-white pointer-events-none text-xs">✓</div>
                                </div>
                                Remember me
                            </label>
                            <a href="#" className="font-black text-primary hover:underline underline-offset-8 transition-all">Forgot Password?</a>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-6 bg-primary hover:bg-violet-700 text-white rounded-2xl font-black text-2xl transition-all shadow-xl active:scale-95 flex items-center justify-center gap-3 mt-4"
                        >
                            Sign In
                        </button>
                    </form>

                    <p className="text-center mt-12 text-theme-text-muted font-bold text-lg">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-black hover:underline underline-offset-8">Create Account</Link>
                    </p>
                </div>

                {/* Right Side - Visuals */}
                <div className="hidden md:flex w-1/2 bg-[#0b011d] dark:bg-[#0b011d] relative items-center justify-center overflow-hidden">
                    {/* Pulsing Circle Outline */}
                    <motion.div
                        animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-[85%] h-[85%] border-2 border-white/20 rounded-full pointer-events-none"
                    />

                    {/* Floating Geometrics with Blur */}
                    <div className="relative group cursor-pointer z-20">
                        <motion.div
                            animate={{
                                y: [0, -40, 0],
                                rotate: [0, 45, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            className="w-32 h-32 bg-gradient-to-br from-[#732997] to-[#ec599b] rounded-3xl blur-[2px] shadow-[0_0_60px_rgba(236,89,155,0.5)] relative"
                        />
                    </div>

                    <motion.div
                        animate={{
                            y: [0, 50, 0],
                            x: [0, -30, 0],
                            rotate: [0, -10, 0]
                        }}
                        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        className="absolute bottom-[25%] right-[20%] w-20 h-20 bg-gradient-to-br from-[#1a4eff] to-[#12e6da] rounded-full blur-[2px] shadow-[0_0_50px_rgba(18,230,218,0.5)] z-10"
                    />

                    {/* Ambient Glows */}
                    <div className="absolute top-[15%] left-[10%] w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute bottom-[10%] right-[10%] w-80 h-80 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

                    <div className="absolute inset-0 bg-black/20 dark:bg-transparent pointer-events-none" />
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
