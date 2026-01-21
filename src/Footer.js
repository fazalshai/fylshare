import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-20 border-t border-white/10 bg-black/40 backdrop-blur-sm py-8 font-[Poppins]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm font-[Orbitron]">F</span>
                    </div>
                    <span className="text-gray-300 font-bold tracking-wide">Fylshare &copy; {year}</span>
                </div>

                <nav className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/about" className="hover:text-white transition">About Us</Link>
                    <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
}
