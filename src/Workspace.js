import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import Toast from "./Toast";
import { Box } from "lucide-react";
import config from "./config";

export default function Workspace() {
    const [boxName, setBoxName] = useState("");
    const [pin, setPin] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [files, setFiles] = useState([]); // Files currently in the box

    // Upload State
    const [uploadFiles, setUploadFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [toast, setToast] = useState(null);

    const triggerToast = (message, type = "info") => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 5000);
    };

    const handleAuth = async () => {
        if (!boxName || !pin) return triggerToast("Please enter Box Name and PIN", "error");

        const endpoint = isLogin ? "/api/box/login" : "/api/box/create";

        try {
            const res = await fetch(`${config.API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ boxName, pin }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsLoggedIn(true);
                // For login, specific logic can be here, but using generic toast
                triggerToast(isLogin ? "Logged in successfully" : "Box created successfully", "success");
                if (data.files) setFiles(data.files);
                if (isLogin) refreshFiles();
            } else {
                triggerToast(data.message || "Authentication failed", "error");
            }
        } catch (err) {
            console.error(err);
            triggerToast("Network error", "error");
        }
    };

    const refreshFiles = async () => {
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/workspaces/${boxName}?pin=${pin}`);
            if (res.ok) {
                const data = await res.json();
                setFiles(data.files || []);
            } else {
                setFiles([]);
            }
        } catch (err) { console.error(err); }
    };

    // ... (dropzone)
    const onDrop = (acceptedFiles) => {
        setUploadFiles(acceptedFiles);
    };
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, multiple: true });

    const handleUpload = async () => {
        if (uploadFiles.length === 0) return;
        setLoading(true);
        setProgress(50); // Fake progress for fetch

        try {
            const formData = new FormData();
            formData.append("boxName", boxName);
            formData.append("pin", pin);
            uploadFiles.forEach((file) => formData.append("files", file));

            const res = await fetch(`${config.API_BASE_URL}/api/workspaces/upload`, {
                method: "POST",
                body: formData, // Browser sets Content-Type: multipart/form-data
            });

            if (res.ok) {
                setProgress(100);
                triggerToast("Files uploaded successfully", "success");
                setUploadFiles([]);
                refreshFiles();
            } else {
                triggerToast("Failed to save file metadata", "error");
            }

        } catch (err) {
            console.error(err);
            triggerToast("Upload failed", "error");
        } finally {
            setLoading(false);
            setProgress(0);
        }
    };

    const handleDeleteFile = async (code) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;
        try {
            const res = await fetch(`${config.API_BASE_URL}/api/workspaces/${boxName}/files/${code}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ pin })
            });

            if (res.ok) {
                triggerToast("File deleted", "success");
                refreshFiles();
            } else {
                triggerToast("Failed to delete", "error");
            }
        } catch (err) {
            console.error(err);
            triggerToast("Error deleting file", "error");
        }
    };

    if (isLoggedIn) {
        return (
            <div className="min-h-screen bg-transparent text-white font-[Poppins] p-8 pt-24">
                <div className="flex justify-between items-center mb-8 border-b border-white/20 pb-4">
                    <h1 className="text-3xl font-bold font-[Orbitron] tracking-widest text-white">
                        BOX: <span className="text-fuchsia-400">{boxName}</span>
                    </h1>
                    <button onClick={() => setIsLoggedIn(false)} className="text-sm text-gray-400 hover:text-white transition">[ LOGOUT ]</button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Uploader Section */}
                    <div className="glass-panel p-6 rounded-2xl h-fit shadow-lg">
                        <h2 className="text-xl mb-4 font-[Orbitron] text-gray-200 border-b border-white/10 pb-2">Upload Files</h2>

                        <div
                            {...getRootProps()}
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer relative overflow-hidden ${isDragActive ? "border-fuchsia-400 bg-fuchsia-500/10" : "border-white/20 bg-white/5 hover:bg-white/10"
                                }`}
                        >
                            <input {...getInputProps()} />
                            <div className="flex flex-col items-center">
                                <span className="text-3xl text-gray-300 mb-2">☁️</span>
                                <p className="text-gray-300 font-medium text-xs tracking-wider">DROP FILES HERE</p>
                            </div>
                        </div>

                        {uploadFiles.length > 0 && (
                            <div className="mt-4">
                                <p className="text-green-400 text-xs font-mono mb-2">{uploadFiles.length} files selected</p>
                                <button
                                    onClick={handleUpload}
                                    disabled={loading}
                                    className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white p-2 rounded-lg font-bold transition shadow-lg"
                                >
                                    {loading ? `Uploading... ${progress}%` : "Start Upload"}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* File List Section */}
                    <div className="lg:col-span-2 glass-panel p-6 rounded-2xl shadow-lg">
                        <h2 className="text-xl mb-4 font-[Orbitron] text-gray-200 border-b border-white/10 pb-2">
                            Stored Files ({files.length})
                        </h2>
                        {files.length === 0 ? (
                            <p className="text-gray-500 text-sm">No files in this box yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {files.map((f, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white/5 p-4 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                                        <div>
                                            <p className="font-bold text-gray-100">{f.name}</p>
                                            <p className="text-[10px] text-gray-400 font-mono">
                                                ID: {f.code || "N/A"} | SIZE: {(f.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <a href={f.url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/5 hover:bg-blue-500 hover:text-white rounded-lg transition text-gray-400">
                                                <i className="fas fa-eye"></i>
                                            </a>
                                            <a href={f.url} download className="p-2 bg-white/5 hover:bg-green-500 hover:text-white rounded-lg transition text-gray-400">
                                                <i className="fas fa-download"></i>
                                            </a>
                                            <button
                                                onClick={() => handleDeleteFile(f.code)}
                                                className="p-2 bg-white/5 hover:bg-red-500 hover:text-white rounded-lg transition text-gray-400"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence>
                    {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
                </AnimatePresence>
            </div>
        );
    }

    // LOGIN / CREATE SCREEN
    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] flex flex-col items-center pt-32 p-4">
            <AnimatePresence>
                {toast && <div className="absolute top-24 right-4"><Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} /></div>}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md glass-panel p-10 rounded-2xl shadow-2xl relative"
            >
                <div className="flex justify-center mb-8 gap-4 border-b border-white/10 pb-4">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`text-lg font-bold transition-all ${isLogin ? "text-fuchsia-400 border-b-2 border-fuchsia-400" : "text-gray-500 hover:text-white"}`}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`text-lg font-bold transition-all ${!isLogin ? "text-fuchsia-400 border-b-2 border-fuchsia-400" : "text-gray-500 hover:text-white"}`}
                    >
                        Create Box
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center mb-8 font-[Orbitron]">
                    {isLogin ? "Access Your Box" : "Create New Box"}
                </h2>

                <div className="space-y-6">
                    <div>
                        <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider">Box Name</label>
                        <input
                            type="text"
                            value={boxName}
                            onChange={(e) => setBoxName(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white placeholder-gray-600 transition"
                            placeholder="e.g. MySharedBox"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-xs mb-1 uppercase tracking-wider">Security PIN</label>
                        <input
                            type="password"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 text-white placeholder-gray-600 transition"
                            placeholder="****"
                        />
                    </div>

                    <button
                        onClick={handleAuth}
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white p-4 rounded-xl font-bold text-lg shadow-lg mt-4 transition transform active:scale-95"
                    >
                        {isLogin ? "Enter Box" : "Create Box"}
                    </button>
                </div>
            </motion.div>

            {/* Content Section: Why Create a Box? */}
            <div className="mt-20 max-w-4xl mx-auto glass-panel p-8 rounded-2xl border border-white/10 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1">
                    <h2 className="text-3xl font-bold mb-4 font-[Orbitron] text-white">Why Create a Box?</h2>
                    <p className="text-gray-300 mb-6 leading-relaxed">
                        A "Box" is your secure, personal workspace in the cloud. Unlike one-time uploads, a Box allows you to:
                    </p>
                    <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                            <div className="bg-fuchsia-500/20 p-2 rounded-full text-fuchsia-300"><Box size={18} /></div>
                            <span className="text-gray-300 text-sm">Organize multiple files in one place</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="bg-cyan-500/20 p-2 rounded-full text-cyan-300"><i className="fas fa-lock"></i></div>
                            <span className="text-gray-300 text-sm">Secure access with a custom PIN</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <div className="bg-purple-500/20 p-2 rounded-full text-purple-300"><i className="fas fa-clock"></i></div>
                            <span className="text-gray-300 text-sm">Persistent storage for ongoing projects</span>
                        </li>
                    </ul>
                </div>

                <div className="flex-1 bg-white/5 p-6 rounded-xl border border-white/10">
                    <h3 className="text-xl font-bold text-white mb-2">How it works</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-400">
                        <li>Select <strong>"Create Box"</strong> above.</li>
                        <li>Choose a unique <strong>Box Name</strong> (e.g., 'ProjectX').</li>
                        <li>Set a <strong>4-digit PIN</strong> for security.</li>
                        <li>Share the Box Name & PIN with collaborators to let them access the files too.</li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
