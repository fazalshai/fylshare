import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, Search, Box, Info } from "lucide-react";

export default function StandardHeader() {
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navItems = [
        { name: "Upload", path: "/", icon: <Home size={18} /> },
        { name: "Search", path: "/search", icon: <Search size={18} /> },
        { name: "My Box", path: "/workspace", icon: <Box size={18} /> },
        { name: "About", path: "/about", icon: <Info size={18} /> },
    ];

    return (
        <>
            <header className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-sm h-16 flex items-center px-4 md:px-8">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-lg rounded-tr-xl rounded-bl-xl">
                            F
                        </div>
                        <span className="text-gray-700 font-bold text-xl tracking-tight">Fylshare</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`text-sm font-medium transition-colors ${isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-900"}`}
                                >
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden">
                    <div className="flex flex-col gap-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center gap-3 py-3 text-lg font-medium border-b border-gray-100 ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-600'}`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}
