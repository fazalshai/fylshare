import React from "react";
import { Link } from "react-router-dom";

export default function Footer({ onOpenCookieSettings }) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-[#D2D2D7]/80 bg-[#F5F5F7] text-[#6E6E73]">
      <div className="max-w-[1160px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-[#D2D2D7]/60">
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#1D1D1F] text-white flex items-center justify-center text-[11px] font-semibold">
                F
              </span>
              <span className="text-[15px] font-semibold text-[#1D1D1F]">Fylshare</span>
            </div>
            <p className="text-[13px] text-[#6E6E73] max-w-md leading-relaxed">
              Temporary file transfers using a 6-digit retrieval code or QR link, plus PIN-protected Workspace folders. No account required for standard transfers.
            </p>
            <p className="text-[12px] text-[#6E6E73]">
              Support &amp; abuse reports:{" "}
              <a
                href="mailto:fylshare.official@gmail.com"
                className="text-[#0066CC] hover:underline"
              >
                fylshare.official@gmail.com
              </a>
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-[12px] font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Product
            </h3>
            <ul className="space-y-1.5 text-[13px]">
              <li>
                <Link to="/" className="hover:text-[#1D1D1F] transition-colors">
                  Send Files
                </Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#1D1D1F] transition-colors">
                  Receive with Code
                </Link>
              </li>
              <li>
                <Link to="/workspace" className="hover:text-[#1D1D1F] transition-colors">
                  Workspace Box
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="hover:text-[#1D1D1F] transition-colors">
                  Optional Rewards
                </Link>
              </li>
              <li>
                <Link to="/technology" className="hover:text-[#1D1D1F] transition-colors">
                  Architecture &amp; Lifecycle
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#1D1D1F] transition-colors">
                  Guides
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-2">
            <h3 className="text-[12px] font-semibold text-[#1D1D1F] uppercase tracking-wider">
              Trust &amp; Legal
            </h3>
            <ul className="space-y-1.5 text-[13px]">
              <li>
                <Link to="/security" className="hover:text-[#1D1D1F] transition-colors">
                  Security &amp; Data Handling
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#1D1D1F] transition-colors">
                  Privacy Notice
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#1D1D1F] transition-colors">
                  Terms &amp; Acceptable Use
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#1D1D1F] transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1D1D1F] transition-colors">
                  Report Abuse / Contact
                </Link>
              </li>
              {onOpenCookieSettings && (
                <li>
                  <button
                    type="button"
                    onClick={onOpenCookieSettings}
                    className="text-left hover:text-[#1D1D1F] transition-colors underline"
                  >
                    Analytics Preferences
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[12px] text-[#6E6E73]">
          <p>&copy; {year} Fylshare. All rights reserved.</p>
          <p>
            Only upload content you own or have the legal right to share.
          </p>
        </div>
      </div>
    </footer>
  );
}
