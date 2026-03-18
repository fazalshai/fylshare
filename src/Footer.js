import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="mt-20 border-t border-white/10 bg-black/40 backdrop-blur-sm py-10 font-[Poppins]">
            <div className="max-w-7xl mx-auto px-4">
                {/* Top: Logo + Email */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 to-cyan-500 flex items-center justify-center">
                            <span className="text-white font-bold text-sm font-[Orbitron]">F</span>
                        </div>
                        <div>
                            <span className="text-gray-300 font-bold tracking-wide block">Fylshare &copy; {year}</span>
                            <a href="mailto:fylshare.official@gmail.com" className="text-fuchsia-400 text-xs hover:text-fuchsia-300 transition">fylshare.official@gmail.com</a>
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm max-w-xs text-center md:text-right">
                        Free, anonymous, and secure file sharing. No registration needed.
                    </p>
                </div>

                {/* Nav Links */}
                <nav className="flex flex-wrap justify-center gap-5 text-sm text-gray-400 border-t border-white/5 pt-6">
                    <Link to="/" className="hover:text-white transition">Home</Link>
                    <Link to="/blog" className="hover:text-white transition">Blog</Link>
                    <Link to="/about" className="hover:text-white transition">About Us</Link>
                    <Link to="/contact" className="hover:text-fuchsia-400 transition font-semibold">Contact Us</Link>
                    <Link to="/security" className="hover:text-white transition">Security Center</Link>
                    <Link to="/technology" className="hover:text-white transition">Technology</Link>
                    <Link to="/faq" className="hover:text-white transition">FAQ</Link>
                    <Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-white transition">Terms of Service</Link>
                </nav>
            </div>
        </footer>
    );
}
