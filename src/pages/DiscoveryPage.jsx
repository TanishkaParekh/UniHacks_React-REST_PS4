import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Map as MapIcon, Filter, Info, Users, Clock, Navigation, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const DiscoveryPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlace, setSelectedPlace] = useState(null);

    const places = [
        {
            id: 1,
            name: "Global Trust Bank - Downtown",
            type: "Bank",
            crowd: "Low",
            crowdValue: 3,
            currentServing: 42,
            lastToken: 45,
            eta: "5 mins",
            lat: "20%",
            lng: "30%",
            color: "bg-emerald-500"
        },
        {
            id: 2,
            name: "City General Hospital",
            type: "Hospital",
            crowd: "High",
            crowdValue: 18,
            currentServing: 105,
            lastToken: 123,
            eta: "45 mins",
            lat: "45%",
            lng: "60%",
            color: "bg-rose-500"
        },
        {
            id: 3,
            name: "Student Admin - Block A",
            type: "College",
            crowd: "Medium",
            crowdValue: 12,
            currentServing: 15,
            lastToken: 27,
            eta: "20 mins",
            lat: "70%",
            lng: "40%",
            color: "bg-amber-500"
        },
        {
            id: 4,
            name: "Starbucks - Tech Park",
            type: "Cafe",
            crowd: "Low",
            crowdValue: 2,
            currentServing: 88,
            lastToken: 90,
            eta: "2 mins",
            lat: "15%",
            lng: "75%",
            color: "bg-emerald-500"
        }
    ];

    const filteredPlaces = places.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="pt-16 h-screen flex flex-col md:flex-row overflow-hidden bg-theme-bg transition-colors duration-500">
            {/* Sidebar - Search and List */}
            <div className="w-full md:w-[450px] bg-theme-surface border-r-2 border-theme-border flex flex-col z-20 shadow-2xl relative">
                <div className="p-8 border-b-2 border-theme-border bg-theme-surface/80 backdrop-blur-md">
                    <h1 className="text-3xl font-black mb-6 flex items-center gap-3 tracking-tight">
                        <MapIcon className="text-primary" size={32} /> Discover Places
                    </h1>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-theme-text-muted group-focus-within:text-primary transition-colors" size={22} />
                        <input
                            type="text"
                            placeholder="Find banks, clinics, labs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-theme-bg border-2 border-theme-border rounded-[1.5rem] py-4 pl-12 pr-6 text-base text-theme-text font-bold focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                    {filteredPlaces.length > 0 ? filteredPlaces.map(place => (
                        <motion.button
                            key={place.id}
                            whileHover={{ scale: 1.02, x: 5 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedPlace(place)}
                            className={`w-full text-left p-6 rounded-[2rem] border-2 transition-all shadow-lg active:shadow-sm ${selectedPlace?.id === place.id
                                ? 'bg-primary/5 border-primary ring-2 ring-primary/20'
                                : 'bg-theme-bg border-theme-border hover:border-primary/30'
                                }`}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs font-black uppercase tracking-widest text-theme-text-muted bg-theme-surface px-3 py-1 rounded-full border border-theme-border">
                                    {place.type}
                                </span>
                                <span className={`flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full ${place.color} bg-opacity-10 ${place.color.replace('bg-', 'text-')} border border-current`}>
                                    <Users size={14} /> {place.crowd.toUpperCase()}
                                </span>
                            </div>
                            <h3 className="text-xl font-black mb-3 tracking-tight">{place.name}</h3>
                            <div className="flex items-center gap-6 text-sm text-theme-text-muted font-bold">
                                <span className="flex items-center gap-2 bg-theme-surface px-3 py-1 rounded-xl border border-theme-border"><Clock size={16} /> {place.eta}</span>
                                <span className="flex items-center gap-2"><Info size={16} /> Serving #{place.currentServing}</span>
                            </div>
                        </motion.button>
                    )) : (
                        <div className="text-center py-20">
                            <p className="text-theme-text-muted font-black text-xl">No places found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Content - Map Area */}
            <div className="flex-1 relative bg-theme-bg overflow-hidden cursor-crosshair">
                {/* Mock Map Background Grid */}
                <div className="absolute inset-0 opacity-40 dark:opacity-20 transition-opacity"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-border) 2px, transparent 0)`,
                        backgroundSize: '80px 80px'
                    }}
                />

                {/* Decorative Map Elements */}
                <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                {/* Pins */}
                {filteredPlaces.map(place => (
                    <motion.button
                        key={place.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.4, zIndex: 10 }}
                        onClick={() => setSelectedPlace(place)}
                        style={{ top: place.lat, left: place.lng }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 group"
                    >
                        <div className={`relative p-3 rounded-full ${place.color} ring-[6px] ring-theme-bg shadow-2xl transition-all group-hover:ring-primary/30 group-hover:shadow-primary/30`}>
                            <MapIcon size={20} className="text-white" />
                            <div className="absolute -inset-2 bg-current opacity-20 rounded-full animate-ping pointer-events-none" />
                        </div>
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full mb-4 left-1/2 -translate-x-1/2 bg-theme-surface border-2 border-theme-border px-5 py-2 rounded-2xl text-sm font-black text-theme-text opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 whitespace-nowrap pointer-events-none shadow-2xl">
                            {place.name}
                        </div>
                    </motion.button>
                ))}

                {/* Detailed Modal/Overlay */}
                <AnimatePresence>
                    {selectedPlace && (
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 100 }}
                            className="absolute bottom-10 right-10 w-full max-w-[450px] bg-theme-surface border-2 border-theme-border rounded-[3.5rem] p-10 shadow-2xl z-30"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h2 className="text-3xl font-black mb-2 tracking-tight">{selectedPlace.name}</h2>
                                    <p className="text-theme-text-muted text-lg font-medium flex items-center gap-2">
                                        <Navigation size={20} className="text-primary" /> Technopark District
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedPlace(null)}
                                    className="p-3 bg-theme-bg border-2 border-theme-border rounded-full text-theme-text-muted hover:text-rose-500 hover:border-rose-500/30 transition-all hover:rotate-90"
                                >
                                    <Search size={24} className="rotate-45" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="bg-theme-bg p-6 rounded-[2rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                                    <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2">Live Progress</p>
                                    <p className="text-4xl font-black">#{selectedPlace.currentServing}</p>
                                </div>
                                <div className="bg-theme-bg p-6 rounded-[2rem] border-2 border-theme-border shadow-inner group hover:border-primary/20 transition-all">
                                    <p className="text-xs font-black text-theme-text-muted uppercase tracking-widest mb-2">EST. WAIT</p>
                                    <p className="text-4xl font-black text-primary">{selectedPlace.eta}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between text-lg">
                                    <span className="text-theme-text-muted font-black">People currently in line</span>
                                    <span className="font-black text-2xl">{selectedPlace.crowdValue}</span>
                                </div>
                                <div className="w-full bg-theme-bg h-5 rounded-full overflow-hidden p-1 border-2 border-theme-border shadow-inner">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(selectedPlace.crowdValue / 20) * 100}%` }}
                                        className={`h-full rounded-full ${selectedPlace.color.replace('bg-', 'bg-')} shadow-[0_0_15px_rgba(0,0,0,0.1)]`}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full mt-10 py-6 bg-primary hover:bg-indigo-600 text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-primary/30 group"
                            >
                                <CheckCircle2 size={28} /> Join Virtual Queue
                            </motion.button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DiscoveryPage;
