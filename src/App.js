import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./Home";
import Search from "./Search";
// import Header from "./Header"; // Replaced
import InnovativeHeader from "./InnovativeHeader";
import Admin from "./Admin";
import AboutUs from "./about";
import Workspace from "./Workspace";

import PrivacyPolicy from "./Privacy";
import TermsOfService from "./Terms";
import Footer from "./Footer";


function AppContent() {
  const location = useLocation();

  useEffect(() => {
    // Analytics removed
  }, [location]);

  return (
    <>
      <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#050505]">
        {/* Lava Lamp Blobs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
      </div>

      <InnovativeHeader />
      <div className="min-h-[calc(100vh-200px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
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
