import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, QrCode, Share2, Zap, Lock, ArrowRight, UploadCloud, Search, Trash2, FolderPlus } from "lucide-react";
import Toast from "./Toast";
import config from "./config";

export default function Home() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Instant Quick-Retrieve Code Bar on Homepage
  const [quickCode, setQuickCode] = useState("");

  // Post-upload Persistent Transfer Ticket (stops duplicate panic uploads & drives viral sharing!)
  const [activeTransfer, setActiveTransfer] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [copiedField, setCopiedField] = useState(null);

  // 100% Free 1GB Limit to build habit and rapid user adoption
  const MAX_TOTAL_SIZE = 1024 * 1024 * 1024; // 1GB Free

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("fylshare_recent_transfers") || "[]");
      setRecentTransfers(saved.slice(0, 5));
    } catch {
      setRecentTransfers([]);
    }
  }, []);

  const triggerToast = (message, type = "info", duration = 6000) => {
    setToast({ message, type, duration });
    setTimeout(() => setToast(null), duration);
  };

  const BLOCKED_EXTENSIONS = /\.(exe|bat|cmd|scr|vbs|pif|com|msi)$/i;

  const onDrop = (acceptedFiles) => {
    const dangerousFile = acceptedFiles.find((f) => BLOCKED_EXTENSIONS.test(f.name || ""));
    if (dangerousFile) {
      triggerToast(`❌ Security Policy: Raw executable files (${dangerousFile.name}) are not permitted.`, "error");
      return;
    }
    const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      triggerToast("❌ Total upload limit is 1GB per session", "error");
      return;
    }
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: 10,
    accept: { "*/*": [] },
  });

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleQuickRetrieve = (e) => {
    e.preventDefault();
    const cleaned = quickCode.trim();
    if (cleaned.length !== 6 || isNaN(cleaned)) {
      triggerToast("Enter a valid 6-digit retrieval code", "error");
      return;
    }
    navigate(`/search?code=${cleaned}`);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      triggerToast("❌ Please drop or select at least one file", "error");
      return;
    }
    const senderName = name.trim() || "Anonymous";
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      triggerToast("❌ Total size exceeds 1GB", "error");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    setLoading(true);
    setProgress(1);

    let finalizeInterval = null;

    try {
      const formData = new FormData();
      formData.append("name", senderName);
      formData.append("code", code);
      formData.append("size", totalSize);
      files.forEach((file) => formData.append("files", file));

      const responseData = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `${config.API_BASE_URL}/api/uploads`, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            // Map network byte transfer to 1% - 88%, then tick 89% - 99% while cloud storage finalizes
            const networkPct = Math.max(1, Math.min(88, Math.round((event.loaded / event.total) * 88)));
            setProgress(networkPct);

            if (event.loaded >= event.total && !finalizeInterval) {
              finalizeInterval = setInterval(() => {
                setProgress((prev) => (prev < 99 ? prev + 1 : 99));
              }, 250);
            }
          }
        };

        xhr.onload = () => {
          if (finalizeInterval) clearInterval(finalizeInterval);
          try {
            const parsed = JSON.parse(xhr.responseText || "{}");
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(parsed);
            } else {
              reject(parsed);
            }
          } catch (err) {
            reject(err);
          }
        };

        xhr.onerror = () => {
          if (finalizeInterval) clearInterval(finalizeInterval);
          reject(new Error("Network error"));
        };

        xhr.send(formData);
      });

      if (responseData) {
        setProgress(100);
        // Pause briefly at 100% so the user clearly sees "100% Uploaded Successfully!"
        await new Promise((r) => setTimeout(r, 650));

        const shareUrl = `${window.location.origin}/search?code=${code}`;
        const ticket = {
          code,
          name: senderName,
          fileNames: files.map((f) => f.name),
          totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
          shareUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };
        setActiveTransfer(ticket);
        const updatedRecent = [ticket, ...recentTransfers.filter((t) => t.code !== code)].slice(0, 5);
        setRecentTransfers(updatedRecent);
        localStorage.setItem("fylshare_recent_transfers", JSON.stringify(updatedRecent));

        setFiles([]);
        setName("");
      }
    } catch (error) {
      if (finalizeInterval) clearInterval(finalizeInterval);
      console.error("❌ Upload error:", error);
      triggerToast("❌ Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] px-4 pt-24 relative">
      {/* Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center w-full max-w-sm px-6 py-8 rounded-3xl bg-[#11131a] border border-white/15 shadow-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div className="relative w-24 h-24 mx-auto mb-5 flex items-center justify-center">
                <div
                  className={`absolute inset-0 rounded-full border-4 ${
                    progress === 100
                      ? "border-emerald-500"
                      : "border-t-fuchsia-500 border-r-cyan-500 border-b-white/10 border-l-white/10 animate-spin"
                  }`}
                ></div>
                <span className="text-xl font-extrabold font-[Orbitron] text-white">
                  {progress}%
                </span>
              </div>

              {/* Smooth Progress Bar */}
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full transition-all duration-200 rounded-full ${
                    progress === 100
                      ? "bg-emerald-400"
                      : "bg-gradient-to-r from-fuchsia-500 to-cyan-400"
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-base font-bold text-white">
                {progress < 100
                  ? `${progress}% Done — Uploading...`
                  : "✅ 100% Uploaded Successfully!"}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {progress < 88
                  ? "Sending encrypted bytes..."
                  : progress < 100
                  ? "Finalizing your 6-digit code..."
                  : "Generating transfer ticket..."}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <div className="fixed top-24 right-6 z-40">
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              durationMs={toast.duration || 6000}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* HERO SECTION: Dual Action (Instant Code Retrieval + 100% Free Upload) */}
      <div className="max-w-5xl mx-auto mt-2">
        {/* Quick Retrieve Bar — Top Priority for Lab / Phone Users with a 6-digit code */}
        <form
          onSubmit={handleQuickRetrieve}
          className="mb-8 glass-panel p-3 sm:p-4 rounded-2xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-black/40 to-fuchsia-950/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shrink-0">
              <Search size={18} />
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-white">Have a 6-Digit Code?</p>
              <p className="text-xs text-gray-400">Enter your code to unlock and download files instantly</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              maxLength={6}
              value={quickCode}
              onChange={(e) => setQuickCode(e.target.value.replace(/\D/g, ""))}
              placeholder="Enter 6-digit code"
              className="w-full sm:w-52 px-4 py-2.5 rounded-xl bg-black/50 border border-white/15 text-white font-mono tracking-widest text-center text-sm focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm shrink-0 transition flex items-center gap-1.5"
            >
              Get File <ArrowRight size={15} />
            </button>
          </div>
        </form>

        {/* Main Center Area: Either Persistent Transfer Success Ticket OR Upload Card */}
        {activeTransfer ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel p-8 rounded-3xl border-2 border-emerald-500/40 bg-[#0d1117]/90 shadow-[0_0_50px_rgba(16,185,129,0.15)] max-w-3xl mx-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 text-left space-y-5 w-full">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  ✅ Transfer Live &amp; Ready to Download
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Your 6-Digit Retrieval Code</p>
                  <div className="flex items-center gap-3">
                    <span className="text-5xl sm:text-6xl font-extrabold font-[Orbitron] tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-cyan-300 to-fuchsia-400">
                      {activeTransfer.code}
                    </span>
                    <button
                      onClick={() => copyToClipboard(activeTransfer.code, "code")}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 transition"
                    >
                      {copiedField === "code" ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
                      {copiedField === "code" ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                </div>

                {/* Direct Link Copy */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2">
                  <div className="truncate text-xs text-gray-300 font-mono">{activeTransfer.shareUrl}</div>
                  <button
                    onClick={() => copyToClipboard(activeTransfer.shareUrl, "link")}
                    className="px-3 py-1.5 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-500 text-white text-xs font-bold shrink-0 flex items-center gap-1"
                  >
                    {copiedField === "link" ? <Check size={13} /> : <Copy size={13} />}
                    {copiedField === "link" ? "Link Copied" : "Copy Direct Link"}
                  </button>
                </div>

                {/* File summary */}
                <div className="text-xs text-gray-400">
                  📦 <strong>{activeTransfer.fileNames.join(", ")}</strong> ({activeTransfer.totalSizeMB} MB)
                </div>

                {/* Viral Share Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(
                      `Here is your file on Fylshare! Enter 6-digit code *${activeTransfer.code}* or click to download directly: ${activeTransfer.shareUrl}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/40 text-[#25D366] text-xs font-bold flex items-center gap-2 transition"
                  >
                    <Share2 size={14} /> Share on WhatsApp
                  </a>
                  <button
                    onClick={() => setActiveTransfer(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-gray-200 text-xs font-semibold transition"
                  >
                    + Upload More Files
                  </button>
                </div>
              </div>

              {/* Instant QR Code for Lab PC -> Phone Scan */}
              <div className="bg-white p-4 rounded-2xl text-center shrink-0 shadow-xl">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(
                    activeTransfer.shareUrl
                  )}`}
                  alt={`QR Code for ${activeTransfer.code}`}
                  className="w-36 h-36 mx-auto"
                />
                <p className="text-[11px] font-bold text-black mt-2 flex items-center justify-center gap-1">
                  <QrCode size={13} /> Scan with Phone to Download
                </p>
              </div>
            </div>

            {/* Free Habit Loop: Pitch Free Workspace Box for recurring usage */}
            <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-cyan-300">
                <FolderPlus size={15} />
                <span>Need a permanent shared space? Create a PIN-protected Workspace Box for free.</span>
              </div>
              <Link
                to="/workspace"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold shrink-0 transition"
              >
                Open Workspace Box →
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="glass-panel p-6 sm:p-10 rounded-3xl shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/10 max-w-3xl mx-auto space-y-6"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold">
                <Zap size={13} /> Instant • Encrypted • Up to 1GB Free
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white font-[Orbitron]">
                Upload Your File
              </h1>
              <p className="text-gray-400 text-sm">
                Share anything across devices in seconds with a 6-digit code or QR scan. No account needed.
              </p>
            </div>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white text-center backdrop-blur-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-label="Enter your name"
            />

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition cursor-pointer ${
                isDragActive
                  ? "border-fuchsia-500 bg-fuchsia-500/10"
                  : "border-white/20 bg-white/[0.03] hover:bg-white/[0.07] hover:border-fuchsia-400/50"
              }`}
            >
              <label htmlFor="file-upload" className="sr-only">
                Upload files
              </label>
              <input {...getInputProps({ id: "file-upload", "aria-label": "File Upload Dropzone" })} />
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-fuchsia-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-fuchsia-300">
                  <UploadCloud size={32} />
                </div>
                <p className="text-base font-semibold text-white">
                  Drag &amp; drop files here, or <span className="text-fuchsia-400 underline">click to browse</span>
                </p>
                <p className="text-xs text-gray-400">
                  Any file type — Max total 1GB
                </p>

                {files.length > 0 && (
                  <div className="w-full max-w-md mt-4 p-4 rounded-xl bg-black/50 border border-emerald-500/30 text-left space-y-2">
                    <div className="flex justify-between items-center text-xs text-emerald-400 font-bold">
                      <span>{files.length} file(s) selected</span>
                      <span>
                        Total: {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                      </span>
                    </div>
                    <ul className="text-xs text-gray-200 space-y-1 max-h-28 overflow-y-auto">
                      {files.map((file, index) => (
                        <li key={index} className="truncate">
                          ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-cyan-600 hover:from-fuchsia-500 hover:to-cyan-500 text-white rounded-xl transition font-bold text-base shadow-lg shadow-fuchsia-500/20"
            >
              Upload Now
            </button>

            <p className="text-[11px] text-gray-500 text-center leading-relaxed">
              By uploading, you confirm you have the right to share these files and agree to our{" "}
              <Link to="/terms" className="text-gray-400 underline hover:text-white">
                Terms &amp; Acceptable Use Policy
              </Link>{" "}
              and{" "}
              <Link to="/privacy" className="text-gray-400 underline hover:text-white">
                Privacy Policy
              </Link>
              . Files auto-expire to protect your privacy.
            </p>
          </motion.div>
        )}

        {/* Recent Uploads Saved on This Device (Prevents Lost Codes!) */}
        {recentTransfers.length > 0 && (
          <div className="max-w-3xl mx-auto mt-6 glass-panel p-5 rounded-2xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                📌 Your Recent Transfers on This Device (Click to view QR &amp; Code anytime)
              </span>
              <button
                onClick={() => {
                  localStorage.removeItem("fylshare_recent_transfers");
                  setRecentTransfers([]);
                }}
                className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1"
              >
                <Trash2 size={12} /> Clear
              </button>
            </div>
            <div className="space-y-2">
              {recentTransfers.map((item) => (
                <div
                  key={item.code}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-lg bg-fuchsia-500/20 border border-fuchsia-500/40 text-fuchsia-300 font-mono font-bold text-sm">
                      {item.code}
                    </span>
                    <div>
                      <span className="text-white font-medium">{item.fileNames.join(", ")}</span>
                      <span className="text-gray-500 ml-2">({item.totalSizeMB} MB • {item.timestamp})</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTransfer(item)}
                      className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold"
                    >
                      Show QR &amp; Code
                    </button>
                    <Link
                      to={`/search?code=${item.code}`}
                      className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-semibold"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* SEO Content Section: Features & FAQ */}
      <div className="max-w-7xl mx-auto mt-20 mb-12 space-y-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400 font-[Orbitron]">
            Why Use Fylshare?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-4 text-fuchsia-300">
                <Zap size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">
                Upload files instantly without any registration. Just drag, drop, and share across any device.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 text-cyan-300">
                <QrCode size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">6-Digit Code &amp; Instant QR</h3>
              <p className="text-gray-400 text-sm">
                Retrieve your files anywhere using a simple 6-digit code or instant phone QR scan. No app required.
              </p>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-300">
                <Lock size={22} />
              </div>
              <h3 className="text-xl font-bold mb-2">AES-256 Encrypted</h3>
              <p className="text-gray-400 text-sm">
                Protected in transit via TLS 1.3 and encrypted at rest via AES-256 for complete privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Universal Compatibility */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10">
          <div className="text-left mb-6">
            <h2 className="text-2xl font-bold text-white font-[Orbitron] mb-2">Universal File Compatibility</h2>
            <p className="text-gray-300 text-sm">
              Works on iPhone, Android, Windows, Mac, and Linux browsers with zero app installation.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["PDF", "DOCX", "PPTX", "JPG", "PNG", "MP4", "ZIP", "HTML/CSS/JS", "PY", "IPYNB", "CAD/DWG", "PSD", "CSV"].map((fmt) => (
              <span key={fmt} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300 border border-white/10">
                {fmt}
              </span>
            ))}
            <span className="px-3 py-1 bg-white/5 rounded-full text-xs italic text-gray-500 border border-white/5">
              + standard document &amp; media formats up to 1GB
            </span>
          </div>
        </div>
      </div>

      {/* Latest from Blog Section */}
      <div className="max-w-7xl mx-auto mb-20 px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold font-[Orbitron] text-white">Latest from our Blog</h2>
            <p className="text-gray-400 mt-2">Guides on fast file transfers, campus workflows, and security.</p>
          </div>
          <Link to="/blog" className="hidden md:block text-fuchsia-400 hover:text-fuchsia-300 font-bold transition">
            View All Articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/blog" className="glass-panel p-6 rounded-xl border border-white/10 hover:bg-white/5 transition group">
            <span className="text-xs font-bold text-fuchsia-400 mb-2 block">SECURITY</span>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-fuchsia-300 transition">How to Share Large Files Securely</h3>
            <p className="text-gray-400 text-sm line-clamp-3">
              Learn why TLS 1.3 and AES-256 encryption are critical for protecting your digital assets and avoiding common security pitfalls.
            </p>
          </Link>
          <Link to="/blog" className="glass-panel p-6 rounded-xl border border-white/10 hover:bg-white/5 transition group">
            <span className="text-xs font-bold text-cyan-400 mb-2 block">PRIVACY</span>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition">Why End-to-End Encryption Matters</h3>
            <p className="text-gray-400 text-sm line-clamp-3">
              Understand the technology behind AES-256 encryption and why anonymous file transfer is safer than account-based services.
            </p>
          </Link>
          <Link to="/blog" className="glass-panel p-6 rounded-xl border border-white/10 hover:bg-white/5 transition group">
            <span className="text-xs font-bold text-green-400 mb-2 block">GUIDE</span>
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-green-300 transition">The Benefits of Anonymous Sharing</h3>
            <p className="text-gray-400 text-sm line-clamp-3">
              Discover how reducing your metadata footprint protects your digital identity and improves workflow efficiency.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
