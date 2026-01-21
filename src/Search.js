import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Toast from "./Toast";
import config from "./config";

export default function Search() {
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);

  const [showTopBanner, setShowTopBanner] = useState(true);
  const [showLeftBanner, setShowLeftBanner] = useState(true);
  const [showRightBanner, setShowRightBanner] = useState(true);
  const [showBottomBanner, setShowBottomBanner] = useState(true);

  const triggerToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSearch = async () => {
    if (code.trim().length !== 6 || isNaN(code)) {
      setResult(null);
      triggerToast("Enter a valid 6-digit code", "error");
      return;
    }

    try {
      const res = await fetch(`${config.API_BASE_URL}/api/uploads/${code}`);
      if (res.status === 404) {
        setResult(null);
        triggerToast("No file found for this code.", "warning");
        return;
      }

      const data = await res.json();
      setResult(data);
      triggerToast("File found successfully!", "success");
    } catch (error) {
      console.error(error);
      triggerToast("Error searching for file", "error");
    }
  };

  const handleView = (fileUrl) => {
    window.open(fileUrl, "_blank");
  };

  const handleDownload = (fileUrl, fileName) => {
    const a = document.createElement("a");
    a.href = fileUrl;
    a.download = fileName;
    a.click();
  };

  // Data matched to Home.js for consistency
  const bannerAds = [
    {
      href: "https://www.w3schools.com/html/default.asp",
      img: "https://tpc.googlesyndication.com/simgad/9379794023110126497",
      alt: "W3Schools Banner",
      logoOnly: true,
    },
  ];

  const sideBanners = {
    left: {
      href: "https://example.com/left",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Left Banner",
    },
    right: {
      href: "https://example.com/right",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Right Banner",
    },
    bottom: {
      href: "https://example.com/bottom",
      img: "https://tpc.googlesyndication.com/simgad/15999976041152607999",
      alt: "Bottom Banner",
    },
  };

  const CloseableBanner = ({ children, onClose }) => (
    <div className="relative rounded-sm overflow-hidden select-none bg-black/40 max-w-7xl mx-auto my-4 p-2 border border-white/10">
      <button
        onClick={onClose}
        aria-label="Close banner"
        title="Close"
        className="absolute top-1 right-2 text-white font-bold text-xl hover:text-gray-300 focus:outline-none select-none z-10"
      >
        ×
      </button>
      {children}
    </div>
  );

  return (
    <div className="min-h-screen bg-transparent text-white font-[Orbitron] px-4 pt-24 relative">
      {/* Toast */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Top Banner */}
      {showTopBanner && (
        <CloseableBanner onClose={() => setShowTopBanner(false)}>
          <div className="flex items-center justify-between text-white px-4 py-2 font-semibold text-center text-sm uppercase max-w-7xl mx-auto glass rounded-xl shadow-md">
            ADVERTISEMENT
          </div>
          <div
            className="flex flex-wrap justify-center overflow-hidden md:overflow-x-auto scrollbar-hide no-scrollbar max-w-7xl mx-auto px-2"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {bannerAds.map(({ href, img, alt, logoOnly }, idx) => (
              <a
                key={idx}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 flex flex-col items-center justify-center m-1 rounded-md shadow-lg glass"
                style={{
                  minWidth: logoOnly ? 140 : 180,
                  maxWidth: logoOnly ? 160 : 200,
                  flexGrow: 1,
                  flexBasis: logoOnly ? "140px" : "180px",
                }}
              >
                <img
                  src={img}
                  alt={alt}
                  className="object-contain rounded-t-md"
                  style={{ width: "100%", height: logoOnly ? 80 : 120 }}
                  loading="lazy"
                />
              </a>
            ))}
          </div>
        </CloseableBanner>
      )}

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-6 items-start mt-8">

        {/* Left Banner */}
        {showLeftBanner && (
          <CloseableBanner onClose={() => setShowLeftBanner(false)}>
            <a href={sideBanners.left.href} target="_blank" rel="noopener noreferrer">
              <img
                src={sideBanners.left.img}
                alt={sideBanners.left.alt}
                className="mx-auto rounded-md max-h-[250px]"
                style={{ width: "auto", backgroundColor: "transparent" }}
                loading="lazy"
              />
            </a>
          </CloseableBanner>
        )}

        {/* Center Content */}
        <div className="md:col-span-3 text-center">
          <h1 className="text-5xl font-bold text-white mb-4 font-[Orbitron] drop-shadow-lg">Search Your Files</h1>
          <p className="text-gray-300 mb-10 font-[Poppins]">Enter the 6-digit code provided at upload to access your file.</p>

          <div className="relative max-w-lg mx-auto mb-12 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400 group-hover:text-fuchsia-400 transition-colors"></i>
            </div>
            <input
              type="text"
              maxLength={6}
              placeholder="Enter 6-digit code"
              className="w-full pl-12 pr-4 py-4 rounded-full bg-white/10 border border-white/20 shadow-lg focus:outline-none focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent text-xl text-white transition placeholder-gray-500 backdrop-blur-md"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* Result Card */}
          {result ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel rounded-2xl shadow-2xl p-8 text-left max-w-lg mx-auto border border-white/10 mt-8"
            >
              <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white font-[Orbitron]">{result.name}</h2>
                  <p className="text-xs text-gray-400 mt-1">Received Files Package</p>
                </div>
                <div className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-xs font-bold border border-green-500/30">
                  READY
                </div>
              </div>

              <ul className="space-y-4">
                {result.files?.map((f, index) => (
                  <li key={index} className="flex flex-col gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-fuchsia-500/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="bg-fuchsia-500/20 text-fuchsia-300 p-3 rounded-lg">
                        <i className="fas fa-file text-xl"></i>
                      </div>
                      <div className="overflow-hidden">
                        <span className="text-gray-200 font-medium text-lg block truncate">{f.name}</span>
                      </div>
                    </div>

                    <div className="flex gap-3 justify-center mt-2">
                      <button
                        onClick={() => handleView(f.url)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-blue-500 hover:text-white text-gray-400 flex items-center justify-center transition border border-white/10"
                        title="View"
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                      <button
                        onClick={() => handleDownload(f.url, f.name)}
                        className="w-10 h-10 rounded-full bg-white/5 hover:bg-green-500 hover:text-white text-gray-400 flex items-center justify-center transition border border-white/10"
                        title="Download"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          ) : (
            code.length === 0 && (
              <div className="glass-panel max-w-md mx-auto mt-12 p-8 rounded-2xl border border-white/10 text-left shadow-2xl relative overflow-hidden">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">Example Result:</p>

                <div className="space-y-2 mb-6">
                  <div>
                    <span className="text-gray-400 text-sm">Name:</span>
                    <span className="text-white font-bold text-lg ml-2 font-[Orbitron]">Nobitha</span>
                  </div>
                  <div>
                    <span className="text-gray-400 text-sm">File:</span>
                    <span className="text-gray-300 ml-2">sample_document.pdf</span>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 hover:bg-blue-500/20 text-gray-500 hover:text-blue-400 flex items-center justify-center transition border border-white/10 cursor-not-allowed">
                    <i className="fas fa-eye text-lg"></i>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/5 hover:bg-green-500/20 text-gray-500 hover:text-green-400 flex items-center justify-center transition border border-white/10 cursor-not-allowed">
                    <i className="fas fa-download text-lg"></i>
                  </div>
                </div>
              </div>
            )
          )}
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

      {/* SEO Content: Retrieval Guide */}
      <div className="max-w-7xl mx-auto mt-24 mb-12 space-y-16">
        <div className="glass-panel p-8 rounded-2xl border border-white/10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 font-[Orbitron] text-white">How to Retrieve Files</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-fuchsia-500 flex items-center justify-center font-bold text-white shrink-0">1</div>
                <div>
                  <h3 className="text-lg font-bold text-fuchsia-300">Enter Code</h3>
                  <p className="text-gray-400 text-sm">Input the 6-digit code you received from the uploader into the search bar above.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white shrink-0">2</div>
                <div>
                  <h3 className="text-lg font-bold text-cyan-300">Verify File</h3>
                  <p className="text-gray-400 text-sm">Check the file name and details in the result card to ensure it's the correct file.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center font-bold text-white shrink-0">3</div>
                <div>
                  <h3 className="text-lg font-bold text-green-300">Download Instantly</h3>
                  <p className="text-gray-400 text-sm">Click the download button. No sign-up or login is needed to access public files.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 w-full md:w-auto">
            <div className="p-6 bg-white/5 rounded-xl border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-center">Why Retrieval is Safe</h3>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex items-center gap-2"><i className="fas fa-check text-green-400"></i> Code-based access control</li>
                <li className="flex items-center gap-2"><i className="fas fa-check text-green-400"></i> End-to-end transport encryption</li>
                <li className="flex items-center gap-2"><i className="fas fa-check text-green-400"></i> Automatic malware scanning</li>
                <li className="flex items-center gap-2"><i className="fas fa-check text-green-400"></i> No personal data collection</li>
              </ul>
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
