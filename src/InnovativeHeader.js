import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Box, Info, Menu, X } from "lucide-react";

export default function InnovativeHeader() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Upload", path: "/", icon: <Home size={20} /> },
        { name: "Search", path: "/search", icon: <Search size={20} /> },
        { name: "My Box", path: "/workspace", icon: <Box size={20} /> },
        { name: "About", path: "/about", icon: <Info size={20} /> },
    ];

    return (
        <>
            {/* Desktop Floating Pill Header */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 hidden md:flex items-center gap-2 p-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            >
                {/* Logo Area */}
                <Link to="/" className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-white/5 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-fuchsia-500/50 transition-shadow duration-300">
                        <span className="text-white font-bold text-lg font-[Orbitron]">F</span>
                    </div>
                    <span className="text-white font-bold font-[Poppins] tracking-wide">Fylshare</span>
                </Link>

                <div className="w-[1px] h-6 bg-white/20 mx-2"></div>

                {/* Navigation Items */}
                <nav className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.name} to={item.path} className="relative">
                                <motion.div
                                    className={`relative flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {item.icon}
                                    <span className="text-sm font-medium">{item.name}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>
            </motion.header>

            {/* Mobile Header (Simplified) */}
            <div className="md:hidden fixed top-0 left-0 w-full z-50 p-4 flex justify-between items-center bg-black/20 backdrop-blur-lg">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm font-[Orbitron]">F</span>
                    </div>
                    <span className="text-white font-bold font-[Poppins]">Fylshare</span>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2" aria-label="Toggle mobile menu">
                    {isMobileMenuOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-40 bg-black/95 pt-20 px-6 md:hidden"
                    >
                        <div className="flex flex-col gap-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`flex items-center gap-4 p-4 rounded-xl text-lg font-medium ${location.pathname === item.path ? 'bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-600/50' : 'text-gray-400 border border-white/5'}`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
