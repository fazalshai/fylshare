import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, Box, Info, Menu, X, Mail, BookOpen } from "lucide-react";

export default function InnovativeHeader() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [isMobileMenuOpen]);

    const navItems = [
        { name: "Upload",  path: "/",          icon: <Home     size={20} /> },
        { name: "Search",  path: "/search",    icon: <Search   size={20} /> },
        { name: "My Box",  path: "/workspace", icon: <Box      size={20} /> },
        { name: "Blog",    path: "/blog",      icon: <BookOpen size={20} /> },
        { name: "About",   path: "/about",     icon: <Info     size={20} /> },
        { name: "Contact", path: "/contact",   icon: <Mail     size={20} /> },
    ];

    return (
        <>
            {/* ── Desktop Floating Pill (lg and above: 1024px+) ── */}
            <motion.header
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
                className="fixed top-4 left-1/2 -translate-x-1/2 z-50 hidden lg:flex items-center gap-1 px-3 py-2 rounded-full border border-white/10 bg-black/30 backdrop-blur-md shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]"
            >
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-white/5 transition-colors group mr-1">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow-lg group-hover:shadow-fuchsia-500/50 transition-shadow duration-300">
                        <span className="text-white font-bold text-sm font-[Orbitron]">F</span>
                    </div>
                    <span className="text-white font-bold font-[Poppins] tracking-wide text-sm">Fylshare</span>
                </Link>

                {/* Nav Items */}
                <nav className="flex items-center gap-0.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.name} to={item.path} className="relative">
                                <motion.div
                                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                                        isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {React.cloneElement(item.icon, { size: 14 })}
                                    <span className="text-xs font-medium whitespace-nowrap">{item.name}</span>
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

            {/* ── Mobile / Tablet Top Bar (below lg: phones + tablets) ── */}
            <div className="lg:hidden fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-black/30 backdrop-blur-lg border-b border-white/10">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center shadow">
                        <span className="text-white font-bold text-sm font-[Orbitron]">F</span>
                    </div>
                    <span className="text-white font-bold font-[Poppins] text-base">Fylshare</span>
                </Link>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {/* ── Mobile / Tablet Full-Screen Menu Overlay ── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden fixed inset-0 z-40 bg-black/95 backdrop-blur-sm flex flex-col pt-20 pb-8 px-6 overflow-y-auto"
                    >
                        <nav className="flex flex-col gap-3 mt-4">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`flex items-center gap-4 px-5 py-4 rounded-2xl text-base font-semibold transition-all ${
                                            isActive
                                                ? "bg-fuchsia-600/20 text-fuchsia-400 border border-fuchsia-600/40"
                                                : "text-gray-300 border border-white/8 hover:bg-white/5 hover:text-white"
                                        }`}
                                    >
                                        {item.icon}
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
