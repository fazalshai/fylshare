import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, Eye, Download, Sparkles, FolderPlus, Share2, FileText, Code } from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Toast from "./Toast";
import config from "./config";

export default function Search() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const triggerToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // Load Monetag zones (Zone 9526371 Epic MultiTag + Zone 9526375 Push Service Worker)
  // ONLY on the Retrieval/Download screen so Uploaders on "/" are never interrupted!
  useEffect(() => {
    // 1. Register Monetag Push Service Worker (/sw.js -> zone 9526375)
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    // 2. Inject Monetag Epic Tag (zone 9526371) on retrieval page
    const scriptId = "monetag-retrieval-zone";
    if (!document.getElementById(scriptId)) {
      const script = document.createElement("script");
      script.id = scriptId;
      script.async = true;
      script.setAttribute("data-cfasync", "false");
      script.src = "https://p.monetag.com/tag.min.js?z=9526371";
      document.body.appendChild(script);
    }
  }, []);

  const fetchByCode = useCallback(
    async (targetCode) => {
      const cleaned = (targetCode || "").trim();
      if (cleaned.length !== 6 || isNaN(cleaned)) {
        setResult(null);
        triggerToast("Enter a valid 6-digit code", "error");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`${config.API_BASE_URL}/api/uploads/${cleaned}`);
        if (res.status === 404) {
          setResult(null);
          triggerToast("No file found for this code.", "warning");
          return;
        }

        const data = await res.json();
        setResult(data);
        triggerToast("File package unlocked!", "success");
      } catch (error) {
        console.error(error);
        triggerToast("Error searching for file", "error");
      } finally {
        setLoading(false);
      }
    },
    [triggerToast]
  );

  // Auto-lookup when ?code=XXXXXX is present in URL (from QR scan or WhatsApp link)
  useEffect(() => {
    const urlCode = searchParams.get("code") || searchParams.get("q");
    if (urlCode && /^\d{6}$/.test(urlCode.trim())) {
      setCode(urlCode.trim());
      fetchByCode(urlCode.trim());
    }
  }, [searchParams, fetchByCode]);

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  };

  const handleDownload = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.click();
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] px-4 pt-28 pb-20 relative">
      {/* Toast */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>

      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
          ⚡ Instant 6-Digit File Retrieval — 100% Free
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3 font-[Orbitron] drop-shadow-lg">
          Retrieve Your Files
        </h1>
        <p className="text-gray-400 mb-8 text-sm sm:text-base">
          Enter your 6-digit transfer code below to preview or download your files immediately.
        </p>

        {/* Search Input + Button */}
        <div className="max-w-lg mx-auto mb-10 flex items-center gap-2 bg-white/5 p-2 rounded-2xl border border-white/15 focus-within:border-fuchsia-400 transition shadow-lg">
          <div className="pl-3 text-gray-400">
            <SearchIcon size={20} />
          </div>
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit code (e.g. 687179)"
            className="w-full py-3 px-2 bg-transparent focus:outline-none text-xl font-mono tracking-widest text-white placeholder-gray-500"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            onKeyDown={(e) => e.key === "Enter" && fetchByCode(code)}
            aria-label="Enter 6-digit code"
          />
          <button
            onClick={() => fetchByCode(code)}
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-bold text-sm shrink-0 transition"
          >
            {loading ? "Finding..." : "Get Files"}
          </button>
        </div>

        {/* Result Card */}
        {result ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 text-left"
          >
            <div className="glass-panel rounded-3xl shadow-2xl p-6 sm:p-8 border border-emerald-500/30 bg-[#0d1117]/90">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
                <div>
                  <span className="text-xs text-gray-400 uppercase tracking-wider">Uploaded By</span>
                  <h2 className="text-2xl font-bold text-white font-[Orbitron]">{result.name || "Anonymous"}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
                    ✓ {result.files?.length || 0} FILE(S) READY
                  </span>
                </div>
              </div>

              <ul className="space-y-3">
                {result.files?.map((f, index) => {
                  const isCode = /\.(js|py|html|css|cpp|c|java|json)$/i.test(f.name || "");
                  return (
                    <li
                      key={index}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-fuchsia-500/40 transition-all"
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="bg-fuchsia-500/20 text-fuchsia-300 p-3 rounded-xl shrink-0">
                          {isCode ? <Code size={20} /> : <FileText size={20} />}
                        </div>
                        <div className="overflow-hidden">
                          <span className="text-white font-semibold text-base block truncate">{f.name}</span>
                          {f.size && (
                            <span className="text-xs text-gray-400">
                              {(f.size / 1024 / 1024).toFixed(2)} MB
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 shrink-0">
                        <button
                          onClick={() => handleView(f.url)}
                          className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition"
                          title="Preview in browser"
                        >
                          <Eye size={15} /> View
                        </button>
                        <button
                          onClick={() => handleDownload(f.url, f.name)}
                          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-emerald-500/20"
                          title="Download file"
                        >
                          <Download size={15} /> Download
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* Viral Re-Share Bar */}
              <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400">
                <span>Share this file package with classmates or teammates:</span>
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(
                    `Download "${result.files?.map((f) => f.name).join(", ")}" on Fylshare using code ${code}: ${window.location.origin}/search?code=${code}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-bold flex items-center gap-1.5"
                >
                  <Share2 size={14} /> Share on WhatsApp
                </a>
              </div>
            </div>

            {/* Free Habit Builder: Convert One-Time Downloader into a Daily User */}
            <div className="p-6 rounded-2xl border border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-950/40 via-[#120b1e] to-cyan-950/40 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-fuchsia-400">
                  <Sparkles size={13} /> 100% FREE WORKSPACE BOX
                </div>
                <h3 className="text-lg font-bold text-white">Want Your Own Permanent PIN-Locked Folder?</h3>
                <p className="text-xs text-gray-300 max-w-xl">
                  Keep all your lab manuals, code files, CVs, and project PDFs in one personal Box and open it from any computer in 2 seconds.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to="/"
                  className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
                >
                  Upload a File
                </Link>
                <Link
                  to="/workspace"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white font-bold text-xs transition shadow-lg"
                >
                  Create Free Box →
                </Link>
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="glass-panel max-w-xl mx-auto p-6 rounded-2xl border border-white/10 text-left">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-bold">
              Need to Send a File Instead?
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-300">
                Upload any PDF, lab manual, code zip, or video up to 1GB for free and get a 6-digit code &amp; QR in 5 seconds.
              </p>
              <Link
                to="/"
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 transition"
              >
                Upload Free →
              </Link>
            </div>
          </div>
        )}

        {/* How to Retrieve Info */}
        <div className="mt-16 glass-panel p-8 rounded-2xl border border-white/10 text-left grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-fuchsia-500/20 text-fuchsia-300 flex items-center justify-center font-bold shrink-0">
              1
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Enter 6-Digit Code</h3>
              <p className="text-gray-400 text-xs mt-1">
                Type the 6-digit code or scan the QR code from the uploader's screen.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold shrink-0">
              2
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Preview or Download</h3>
              <p className="text-gray-400 text-xs mt-1">
                Open PDFs and images directly in your browser or download the original raw file.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold shrink-0">
              <FolderPlus size={16} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Save to Workspace Box</h3>
              <p className="text-gray-400 text-xs mt-1">
                Use <Link to="/workspace" className="text-cyan-400 underline">My Box</Link> for free, permanent, PIN-locked folders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
