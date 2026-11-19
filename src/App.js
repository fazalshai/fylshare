import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom";

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
import Rewards from "./Rewards";
import {
  getAnalyticsConsent,
  setAnalyticsConsent,
  trackPageView,
} from "./analytics";

const ROUTE_SEO = {
  "/": {
    title: "Fylshare — Files shared. Simply.",
    description:
      "Upload your files up to 1GB. Share a 6-digit code or QR code. No account required.",
  },
  "/search": {
    title: "Receive Files with a 6-Digit Code | Fylshare",
    description:
      "Enter a 6-digit Fylshare retrieval code to access and download shared files. No account required.",
  },
  "/workspace": {
    title: "Workspace Box — PIN-Protected Shared Folders | Fylshare",
    description:
      "Create or open a PIN-protected Workspace Box on Fylshare to manage shared project files across devices.",
  },
  "/blog": {
    title: "Guides & Technical Articles | Fylshare",
    description:
      "Practical guides on file transfer workflows, transport security, and data retention practices.",
  },
  "/about": {
    title: "About Fylshare — Service Overview & Operator Information",
    description:
      "Learn how Fylshare operates, how transfers are handled, and how to contact our support and safety team.",
  },
  "/contact": {
    title: "Support & Abuse Reporting | Fylshare",
    description:
      "Contact Fylshare support or submit an abuse, copyright, or privacy takedown request.",
  },
  "/faq": {
    title: "Frequently Asked Questions | Fylshare",
    description:
      "Clear answers about Fylshare file size limits, supported formats, Workspace Boxes, and privacy practices.",
  },
  "/security": {
    title: "Security & Data Handling | Fylshare",
    description:
      "Understand how Fylshare uses TLS 1.3 in transit, cloud storage encryption at rest, file validation, and access controls.",
  },
  "/technology": {
    title: "Architecture & File Lifecycle | Fylshare",
    description:
      "Technical documentation of Fylshare's upload validation, retrieval authorization, and automated deletion lifecycle.",
  },
  "/privacy": {
    title: "Privacy Notice — What We Collect & Retain | Fylshare",
    description:
      "Read Fylshare's Privacy Notice covering stored files, transfer labels, country estimation, subprocessors, and retention windows.",
  },
  "/terms": {
    title: "Terms of Service & Acceptable Use Policy | Fylshare",
    description:
      "Review Fylshare's Terms of Service, Acceptable Use Policy, prohibited content rules, and takedown procedures.",
  },
};

export function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const [consentChoice, setConsentChoice] = useState(() => getAnalyticsConsent());
  const [showConsentBanner, setShowConsentBanner] = useState(
    () => getAnalyticsConsent() === null
  );

  useEffect(() => {
    const cleanPath =
      location.pathname === "/" ? "/" : location.pathname.replace(/\/+$/, "");
    const canonicalUrl = `https://fylshare.com${cleanPath}`;

    let canonicalTag = document.querySelector("link[rel='canonical']");
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonicalUrl);

    const seo = ROUTE_SEO[cleanPath] || ROUTE_SEO["/"];
    document.title = isAdminRoute ? "Fylshare Admin Console" : seo.title;

    const descTag = document.querySelector("meta[name='description']");
    if (descTag && !isAdminRoute) {
      descTag.setAttribute("content", seo.description);
    }

    // Only track public page views when user has opted in; /admin is always excluded
    if (!isAdminRoute && consentChoice === "granted") {
      trackPageView(cleanPath, seo.title);
    }
  }, [location.pathname, isAdminRoute, consentChoice]);

  const handleConsentDecision = (decision) => {
    const saved = setAnalyticsConsent(decision);
    setConsentChoice(saved);
    setShowConsentBanner(false);
    if (saved === "granted" && !isAdminRoute) {
      trackPageView(location.pathname, document.title);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFFFF] text-[#1D1D1F]">
      {!isAdminRoute && <InnovativeHeader />}

      <main className="flex-1">
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
          <Route path="/rewards" element={<Rewards />} />
        </Routes>
      </main>

      {!isAdminRoute && (
        <Footer onOpenCookieSettings={() => setShowConsentBanner(true)} />
      )}

      {/* Non-blocking Optional Analytics Consent Bar (Equally accessible Accept & Decline) */}
      {!isAdminRoute && showConsentBanner && (
        <aside
          aria-label="Analytics preferences"
          className="fixed bottom-4 left-4 right-4 z-50 max-w-[760px] mx-auto bg-white border border-[#D2D2D7] rounded-2xl shadow-lg p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="text-[12px] text-[#6E6E73] leading-relaxed">
            <p className="font-semibold text-[#1D1D1F] text-[13px] mb-0.5">
              Optional Analytics Preference
            </p>
            <p>
              Core file transfers work without tracking cookies. With your permission, we use Google Analytics (GA4) with redacted URLs to measure aggregate page usage. We never send filenames, labels, or retrieval codes to analytics.{" "}
              <Link to="/privacy" className="text-[#0066CC] underline">
                Privacy Notice
              </Link>
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => handleConsentDecision("denied")}
              className="px-4 py-2 rounded-lg border border-[#D2D2D7] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[#1D1D1F] text-[12px] font-semibold transition-colors"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => handleConsentDecision("granted")}
              className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[12px] font-semibold transition-colors"
            >
              Accept Analytics
            </button>
          </div>
        </aside>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
