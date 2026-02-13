import { NavLink } from 'react-router-dom';
import { Layers, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-theme-bg/50 backdrop-blur-md border-b border-theme-border">
            <div className="max-w-7xl auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-2">
                        <Layers className="h-8 w-8 text-primary" />
                        <span className="text-xl font-bold tracking-tight">Q-Flow</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <NavLink to="/" className="text-theme-text-muted hover:text-theme-text px-3 py-2 rounded-md text-sm font-medium">Home</NavLink>
                            <NavLink to="/discovery" className="text-theme-text-muted hover:text-theme-text px-3 py-2 rounded-md text-sm font-medium">Discovery</NavLink>
                            <NavLink to="/dashboard" className="text-theme-text-muted hover:text-theme-text px-3 py-2 rounded-md text-sm font-medium">Dashboard</NavLink>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-xl bg-theme-border/50 text-theme-text-muted hover:text-primary transition-all"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <NavLink
                            to="/profile"
                            className="text-theme-text-muted hover:text-theme-text px-3 py-2 rounded-md text-sm font-medium"
                        >
                            Profile
                        </NavLink>
                        <NavLink
                            to="/admin/dashboard"
                            className="bg-slate-800 text-slate-300 hover:text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors border border-slate-700"
                        >
                            Admin
                        </NavLink>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
