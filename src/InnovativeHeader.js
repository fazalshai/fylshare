import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function InnovativeHeader() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Transfer", path: "/" },
    { name: "Receive", path: "/search" },
    { name: "Workspace", path: "/workspace" },
    { name: "Security", path: "/security" },
    { name: "FAQ", path: "/faq" },
    { name: "Support", path: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#D2D2D7]/70">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 text-[#1D1D1F] hover:opacity-80 transition-opacity rounded-md"
          aria-label="Fylshare Home"
        >
          <span className="w-7 h-7 rounded-lg bg-[#1D1D1F] text-white flex items-center justify-center text-xs font-semibold tracking-tight">
            F
          </span>
          <span className="text-[17px] font-semibold tracking-tight text-[#1D1D1F]">
            Fylshare
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav aria-label="Main navigation" className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#F5F5F7] text-[#1D1D1F] font-semibold"
                    : "text-[#6E6E73] hover:text-[#1D1D1F]"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Quick Receive Action on Desktop */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/search"
            className="text-[13px] font-medium text-[#0066CC] hover:text-[#0055B3] transition-colors px-3 py-1.5 rounded-full bg-[#0066CC]/[0.08]"
          >
            Enter 6-Digit Code
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-[#1D1D1F] hover:bg-[#F5F5F7] transition-colors"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-[#D2D2D7] bg-white px-4 pt-2 pb-6">
          <nav aria-label="Mobile navigation" className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2.5 rounded-xl text-[15px] font-medium ${
                    isActive
                      ? "bg-[#F5F5F7] text-[#1D1D1F] font-semibold"
                      : "text-[#6E6E73] hover:text-[#1D1D1F]"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
