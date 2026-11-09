import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, CheckCircle2, Lock, Clock, AlertTriangle } from "lucide-react";

import Home from "./Home";
import Search from "./Search";
import InnovativeHeader from "./InnovativeHeader";
import Admin from "./Admin";
import AboutUs from "./about";
import Contact from "./Contact";
import Workspace from "./Workspace";

import FAQ from "./FAQ";
import PrivacyPolicy from "./Privacy";
import TermsOfService from "./Terms";
import SecurityGuide from "./SecurityGuide";
import Blog from "./Blog";
import Technology from "./Technology";
import Footer from "./Footer";

function AppContent() {
  const location = useLocation();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [agreedChecked, setAgreedChecked] = useState(true);

  useEffect(() => {
    // Show the Terms & Acceptable Use dialogue once per browser session
    // (Skip on /terms and /privacy so users can read the policies freely)
    if (location.pathname === "/terms" || location.pathname === "/privacy") {
      return;
    }
    const sessionAccepted = sessionStorage.getItem("fylshare_session_consented");
    if (!sessionAccepted) {
      setShowConsentModal(true);
    }
  }, [location.pathname]);

  const handleAcceptTerms = () => {
    if (!agreedChecked) return;

    // Record legal acceptance, policy version, and timestamp (UAE TDRA & Global Compliance)
    const consentRecord = {
      accepted: true,
      policyVersion: "2026-11-TDRA-AUP",
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("fylshare_aup_consent", JSON.stringify(consentRecord));
    sessionStorage.setItem("fylshare_session_consented", "true");

    setShowConsentModal(false);
  };

  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
        {/* Lava Lamp Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      {/* Welcome & Terms/AUP Consent Dialogue (Pairs Legal Compliance with Monetag Click Trigger) */}
      <AnimatePresence>
        {showConsentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              className="w-full max-w-lg rounded-3xl bg-[#0e1017] border border-white/15 p-6 sm:p-8 shadow-[0_0_60px_rgba(217,70,239,0.2)] text-left"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-fuchsia-500/20 to-cyan-500/20 border border-fuchsia-500/30 flex items-center justify-center text-fuchsia-400 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">
                    Secure &amp; Compliant File Sharing
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-[Orbitron] text-white">
                    Welcome to Fylshare
                  </h2>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
                Before uploading or retrieving files, please confirm our responsible sharing rules:
              </p>

              <ul className="space-y-2.5 mb-6 text-xs text-gray-300 bg-white/[0.03] p-4 rounded-2xl border border-white/10">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                  <span>Only upload files you own or have the lawful right to share.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
                  <span>Do not upload illegal, copyrighted, adult, or harmful/malware content.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Lock size={15} className="text-cyan-400 shrink-0 mt-0.5" />
                  <span>Transfers are protected in transit (TLS 1.3) and screened against executable payloads.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Clock size={15} className="text-fuchsia-400 shrink-0 mt-0.5" />
                  <span>Anonymous transfers automatically expire and are permanently deleted.</span>
                </li>
              </ul>

              <label className="flex items-start gap-3 cursor-pointer mb-6 select-none">
                <input
                  type="checkbox"
                  checked={agreedChecked}
                  onChange={(e) => setAgreedChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-fuchsia-500 rounded cursor-pointer"
                />
                <span className="text-xs text-gray-300 leading-relaxed">
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    onClick={() => setShowConsentModal(false)}
                    className="text-fuchsia-400 underline hover:text-fuchsia-300"
                  >
                    Terms of Service &amp; Acceptable Use Policy
                  </Link>{" "}
                  and have read the{" "}
                  <Link
                    to="/privacy"
                    onClick={() => setShowConsentModal(false)}
                    className="text-cyan-400 underline hover:text-cyan-300"
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <button
                onClick={handleAcceptTerms}
                disabled={!agreedChecked}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition shadow-lg ${
                  agreedChecked
                    ? "bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white shadow-fuchsia-500/25 cursor-pointer"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                I Agree &amp; Continue to Fylshare →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <InnovativeHeader />
      <div className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/security" element={<SecurityGuide />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-transparent text-white font-[Poppins]">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
