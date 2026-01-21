import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Admin() {
  const [uploads, setUploads] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState(""); // "main" or "team"
  const [viewMode, setViewMode] = useState("uploads"); // "uploads" or "workspaces"

  const API_BASE = "https://filehub-gyll.onrender.com";

  const fetchUploads = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/uploads`);
      const data = await res.json();
      setUploads(data);
    } catch (err) {
      console.error("Failed to fetch uploads", err);
    }
  }, [API_BASE]);

  const fetchWorkspaces = React.useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/workspaces`);
      const data = await res.json();
      setWorkspaces(data);
    } catch (err) {
      console.error("Failed to fetch workspaces", err);
    }
  }, [API_BASE]);

  useEffect(() => {
    if (authenticated) {
      if (viewMode === "uploads") fetchUploads();
      else fetchWorkspaces();
    }
  }, [authenticated, viewMode, fetchUploads, fetchWorkspaces]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "fazal" && password === "9948") {
      setAuthenticated(true);
      setRole("main");
      setError("");
    } else if (username === "team" && password === "team") {
      setAuthenticated(true);
      setRole("team");
      setError("");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const deleteFile = async (code) => {
    // if (!window.confirm("Are you sure you want to delete this file?")) return; 
    // User requested "just delete no need to ask"

    try {
      await fetch(`${API_BASE}/api/uploads/${code}`, { method: "DELETE" });
      setUploads(uploads.filter((u) => u.code !== code));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBox = async (boxName) => {
    // if (!window.confirm(`Delete Box "${boxName}" and all its files?`)) return;
    // User requested "just delete no need to ask"

    try {
      // Note: Logic allows deletion without checking PIN if accessed via Admin (assuming Admin is secured or local)
      await fetch(`${API_BASE}/api/admin/workspaces/${boxName}`, { method: "DELETE" });
      setWorkspaces(workspaces.filter(w => w.boxName !== boxName));
    } catch (err) {
      console.error(err);
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-[Orbitron]">
        <form onSubmit={handleLogin} className="bg-[#111111] p-8 rounded-xl shadow-lg w-full max-w-md space-y-6">
          <h2 className="text-2xl font-bold text-center text-fuchsia-400">🔐 Admin Login</h2>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label className="block mb-1 text-sm text-gray-400">Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-fuchsia-500" required />
          </div>
          <div>
            <label className="block mb-1 text-sm text-gray-400">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 rounded-md bg-gray-900 border border-gray-700 text-white focus:outline-none focus:border-fuchsia-500" required />
          </div>
          <button type="submit" className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-md text-white font-semibold">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-[Orbitron] px-8 py-10">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl font-bold text-center mb-8"
      >
        Admin Dashboard 📊
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setViewMode("uploads")}
          className={`px-4 py-2 rounded ${viewMode === "uploads" ? "bg-fuchsia-600 text-white" : "bg-gray-800 text-gray-400"}`}
        >
          Anonymous Uploads
        </button>
        <button
          onClick={() => setViewMode("workspaces")}
          className={`px-4 py-2 rounded ${viewMode === "workspaces" ? "bg-fuchsia-600 text-white" : "bg-gray-800 text-gray-400"}`}
        >
          Workspace Boxes
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border border-gray-700 bg-[#111111] rounded-xl overflow-hidden">
          <thead className="text-gray-400 uppercase bg-[#1f1f1f] border-b border-gray-700">
            <tr>
              {viewMode === "uploads" ? (
                <>
                  {role === "main" && <th className="px-4 py-3">Code</th>}
                  <th className="px-4 py-3">File Name(s)</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3">Date</th>
                </>
              ) : (
                <>
                  <th className="px-4 py-3">Box Name</th>
                  <th className="px-4 py-3 text-red-400">PIN</th>
                  <th className="px-4 py-3">Files</th>
                  <th className="px-4 py-3">Created</th>
                </>
              )}
              {role === "main" && <th className="px-4 py-3 text-center">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(viewMode === "uploads" ? uploads : workspaces).length === 0 ? (
              <tr><td colSpan={6} className="text-center px-4 py-6 text-gray-500">No data found.</td></tr>
            ) : (
              (viewMode === "uploads" ? uploads : workspaces).map((item, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-[#181818] transition">
                  {viewMode === "uploads" ? (
                    <>
                      {role === "main" && <td className="px-4 py-3 text-xs text-gray-400">{item.code}</td>}
                      <td className="px-4 py-3 font-medium text-white">{item.files.map(f => f.name).join(", ")}</td>
                      <td className="px-4 py-3">{item.name}</td>
                      <td className="px-4 py-3">{new Date(item.date).toLocaleDateString()}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-3 font-bold text-fuchsia-400">{item.boxName}</td>
                      <td className="px-4 py-3 font-mono text-red-400">{item.pin}</td>
                      <td className="px-4 py-3">{item.files.length} items</td>
                      <td className="px-4 py-3">{new Date(item.createdAt).toLocaleDateString()}</td>
                    </>
                  )}

                  {role === "main" && (
                    <td className="px-4 py-3 text-center">
                      {viewMode === "uploads" ? (
                        <button onClick={() => deleteFile(item.code)} className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700">Delete</button>
                      ) : (
                        <button onClick={() => deleteBox(item.boxName)} className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700">Delete Box</button>
                      )}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
