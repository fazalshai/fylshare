import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import config from "./config";

export default function Home() {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Ads state removed

  // 1GB Limit
  const MAX_TOTAL_SIZE = 1024 * 1024 * 1024;

  const onDrop = (acceptedFiles) => {
    const totalSize = acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      triggerToast("❌ Total upload limit is 1GB", "error");
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

  const triggerToast = (message, type = "info", duration = 15000) => {
    setToast({ message, type, duration });
    setTimeout(() => setToast(null), duration);
  };

  const handleSubmit = async () => {
    if (name.trim() === "" || files.length === 0) {
      triggerToast("❌ Please enter your name and upload at least one file", "error");
      return;
    }
    const totalSize = files.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      triggerToast("❌ Total size exceeds 1GB", "error");
      return;
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    setLoading(true);
    setProgress(50); // Fake progress since fetch doesn't support progress events easily

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("code", code);
      formData.append("size", totalSize);
      files.forEach((file) => formData.append("files", file));

      const res = await fetch(`${config.API_BASE_URL}/api/uploads`, {
        method: "POST",
        body: formData, // No Content-Type header; browser sets it with boundary
      });

      const result = await res.json();

      if (res.ok) {
        setProgress(100);
        triggerToast(`✅ Upload successful! Your code: ${code}`, "success", 15000);
        setFiles([]);
        setName("");
      } else {
        console.error(result);
        triggerToast("❌ Upload failed", "error");
      }
    } catch (error) {
      console.error("❌ Upload error:", error);
      triggerToast("❌ Upload error", "error");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  // Ads removed per user request

  return (
    <div className="min-h-screen bg-transparent text-white font-[Orbitron] px-4 pt-24 relative">
      {/* Loader Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center max-w-xs px-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-fuchsia-500 border-opacity-60 mx-auto"></div>
              <p className="mt-4 text-lg font-semibold text-white">
                {progress < 100 ? `🚀 Uploading... ${progress}% completed` : "✅ Upload complete!"}
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
              durationMs={toast.duration || 15000}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Top Banner Removed */}

      {/* Main upload grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        {/* Left Banner */}
        {/* Advertisements Removed */}

        {/* Upload center */}
        <div className="md:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-8 rounded-2xl shadow-[0_0_15px_rgba(255,255,255,0.05)] space-y-6"
          >
            <h2 className="text-3xl font-bold text-center text-white font-[Poppins]">Upload Your File</h2>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white text-center backdrop-blur-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${isDragActive ? "border-fuchsia-500 bg-white/10" : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center justify-center space-y-2">
                <span className="text-5xl">📁</span>
                <p className="text-sm text-gray-300">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-xs text-gray-500">
                  Any file type — Max total 1GB
                </p>

                {files.length > 0 && (
                  <ul className="mt-2 text-sm text-green-400 space-y-1 font-medium">
                    {files.map((file, index) => (
                      <li key={index}>
                        ✅ {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                      </li>
                    ))}
                    <li className="text-xs text-gray-400 mt-2">
                      Total: {(files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(1)} MB
                    </li>
                  </ul>
                )}
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full p-3 bg-black text-white rounded-xl hover:bg-gray-800 transition font-bold border border-white"
            >
              Upload Now
            </button>
          </motion.div>
        </div>

        {/* Right Banner */}
        {showRightBanner && (
          <CloseableBanner onClose={() => setShowRightBanner(false)}>
            <a href={sideBanners.right.href} target="_blank" rel="noopener noreferrer">
              <img
                src={sideBanners.right.img}
                alt={sideBanners.right.alt}
                className="mx-auto rounded-md max-h-[250px]"
                style={{ width: "auto", backgroundColor: "transparent" }}
                loading="lazy"
              />
            </a>
          </CloseableBanner>
        )}
      </div>

      {/* SEO Content Section: Features & FAQ */}
      < div className="max-w-7xl mx-auto mt-20 mb-12 space-y-16" >

        {/* Features Grid */}
        < div className="text-center" >
          <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Why Use FylShare?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-4 text-fuchsia-300">
                <i className="fas fa-bolt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
              <p className="text-gray-400 text-sm">Upload files instantly without any registration. Just drag, drop, and share.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-cyan-500/20 rounded-full flex items-center justify-center mb-4 text-cyan-300">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure & Temporary</h3>
              <p className="text-gray-400 text-sm">Your files are encrypted and automatically deleted after 24 hours to ensure total privacy.</p>
            </div>
            <div className="glass-panel p-6 rounded-xl hover:bg-white/5 transition border border-white/5">
              <div className="w-12 h-12 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center mb-4 text-purple-300">
                <i className="fas fa-globe text-xl"></i>
              </div>
              <h3 className="text-xl font-bold mb-2">Accessible Anywhere</h3>
              <p className="text-gray-400 text-sm">Retrieve your files from any device using a simple 6-digit code. No app required.</p>
            </div>
          </div>
        </div>

        {/* How It Works (SEO Text) */}
        <div className="glass-panel p-8 rounded-2xl border border-white/10 md:flex items-center gap-8">
          <div className="flex-1 space-y-4 text-left">
            <h2 className="text-2xl font-bold text-white">How File Sharing Works</h2>
            <p className="text-gray-300 leading-relaxed">
              Fylshare simplifies the way you move data. Instead of email attachments or complex cloud links, we use a unique <span className="text-cyan-400 font-bold">6-digit code</span> system.
              When you upload a file, our secure server generates this code. You can share it verbally, via text, or write it down.
              The recipient simply enters this code on our Search page to download the file instantly.
            </p>
            <p className="text-sm text-gray-500 italic">
              *Files are hosted for a limited time to guarantee freshness and privacy.
            </p>
          </div>

          <div className="hidden md:block w-px h-32 bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>

          <div className="flex-1 space-y-4 text-left">
            <h2 className="text-2xl font-bold text-white">Universal File Support</h2>
            <p className="text-gray-300">
              We accept <span className="text-fuchsia-400 font-bold">ALL file types</span>. Whether it's a document, code, video, or archive, Fylshare handles it.
              Some popular formats we handle daily:
            </p>
            <div className="flex flex-wrap gap-2">
              {['PDF', 'DOCX', 'JPG', 'PNG', 'MP4', 'ZIP', 'MP3', 'EXE', 'APK', 'DMG'].map(fmt => (
                <span key={fmt} className="px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-gray-300 border border-white/10">
                  {fmt}
                </span>
              ))}
              <span className="px-3 py-1 bg-white/5 rounded-full text-xs italic text-gray-500 border border-white/5">
                + Everything else
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Banner */}
      {showBottomBanner && (
        <CloseableBanner onClose={() => setShowBottomBanner(false)}>
          <a href={sideBanners.bottom.href} target="_blank" rel="noopener noreferrer">
            <img
              id="lowerfeatureshowcase300"
              src={sideBanners.bottom.img}
              alt={sideBanners.bottom.alt}
              className="w-full rounded-xl max-h-[150px] object-contain"
              loading="lazy"
              style={{ backgroundColor: "transparent" }}
            />
          </a>
        </CloseableBanner>
      )}
    </div>
  );
}
