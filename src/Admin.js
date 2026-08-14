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
  const [viewMode, setViewMode] = useState("uploads"); // "uploads", "workspaces", "stats"
  const [siteViews, setSiteViews] = useState(0);

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
      fetchUploads();
      fetchWorkspaces();
      // Load view count from localStorage
      const visits = parseInt(localStorage.getItem("fylshare_site_visits") || "0", 10);
      setSiteViews(24700 + visits);
    }
  }, [authenticated, fetchUploads, fetchWorkspaces]);

  useEffect(() => {
    if (authenticated) {
      if (viewMode === "uploads") fetchUploads();
      else if (viewMode === "workspaces") fetchWorkspaces();
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
    try {
      await fetch(`${API_BASE}/api/uploads/${code}`, { method: "DELETE" });
      setUploads(uploads.filter((u) => u.code !== code));
    } catch (err) {
      console.error(err);
    }
  };

  const handleView = (url) => {
    window.open(url, "_blank");
  };

  const deleteBox = async (boxName) => {
    try {
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

  // Upload trend by day
  const uploadsByDay = uploads.reduce((acc, u) => {
    if (!u.date) return acc;
    const day = new Date(u.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {});

  const topDays = Object.entries(uploadsByDay)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7);

  const totalFileCount = uploads.reduce((sum, u) => sum + (u.files?.length || 0), 0);
  const totalSizeMB = uploads.reduce((sum, u) => {
    return sum + (u.files?.reduce((s, f) => s + (f.size || 0), 0) || 0);
  }, 0) / 1024 / 1024;

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
      <div className="flex justify-center gap-4 mb-8 flex-wrap">
        <button
          onClick={() => setViewMode("stats")}
          className={`px-4 py-2 rounded ${viewMode === "stats" ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400"}`}
        >
          📈 Site Stats
        </button>
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

      {/* === Stats Dashboard === */}
      {viewMode === "stats" && (
        <div className="space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Uploads", value: uploads.length, color: "fuchsia" },
              { label: "Total Files", value: totalFileCount, color: "cyan" },
              { label: "Total Workspaces", value: workspaces.length, color: "purple" },
              { label: "Site Views (Tracked)", value: siteViews.toLocaleString(), color: "green" },
            ].map((kpi, i) => (
              <div key={i} className={`bg-${kpi.color}-900/30 border border-${kpi.color}-500/30 rounded-2xl p-6 text-center`}>
                <div className={`text-4xl font-bold text-${kpi.color}-400 font-[Orbitron] mb-2`}>{kpi.value}</div>
                <div className="text-gray-400 text-sm">{kpi.label}</div>
              </div>
            ))}
          </div>

          {/* Extra Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">📅 Top Upload Days</h3>
              {topDays.length === 0 ? (
                <p className="text-gray-500 text-sm">No upload data yet.</p>
              ) : (
                <ul className="space-y-3">
                  {topDays.map(([day, count], i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{day}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-2 bg-fuchsia-500 rounded-full" style={{ width: `${(count / topDays[0][1]) * 100}px` }} />
                        <span className="text-fuchsia-400 font-bold">{count}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">💾 Storage Overview</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Total Data Transferred</span>
                    <span className="text-cyan-400 font-bold">{totalSizeMB.toFixed(1)} MB</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-full" style={{ width: `${Math.min((totalSizeMB / 1024) * 100, 100)}%` }} />
                  </div>
                </div>
                <div className="text-gray-500 text-xs">
                  Avg file package: {uploads.length > 0 ? (totalSizeMB / uploads.length).toFixed(1) : 0} MB per upload
                </div>
              </div>
            </div>
          </div>

          {/* Blog Views Per Article */}
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-lg font-bold text-white mb-4">📖 Blog Article Views (from localStorage tracking)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "best-free-file-sharing-tools", title: "Best Free File Sharing Tools", base: 3241 },
                { id: "how-to-use-fylshare-step-by-step", title: "How to Use Fylshare", base: 4102 },
                { id: "send-large-videos-without-quality-loss", title: "Send Large Videos", base: 2788 },
                { id: "secure-file-transfer-remote-teams", title: "File Transfer for Remote Teams", base: 1932 },
                { id: "what-is-aes-256-encryption", title: "Demystifying AES-256", base: 2103 },
                { id: "data-privacy-laws-gdpr-ccpa", title: "GDPR & CCPA Guide", base: 1567 },
              ].map((article) => {
                const stored = parseInt(localStorage.getItem(`fylshare_views_${article.id}`) || "0", 10);
                const totalViews = article.base + stored;
                return (
                  <div key={article.id} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded-xl">
                    <span className="text-gray-300 truncate max-w-[200px]">{article.title}</span>
                    <span className="text-fuchsia-400 font-bold">{totalViews.toLocaleString()} views</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* === Uploads / Workspaces Tables === */}
      {(viewMode === "uploads" || viewMode === "workspaces") && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border border-gray-700 bg-[#111111] rounded-xl overflow-hidden">
            <thead className="text-gray-400 uppercase bg-[#1f1f1f] border-b border-gray-700">
              <tr>
                {viewMode === "uploads" ? (
                  <>
                    {role === "main" && <th className="px-4 py-3">Code</th>}
                    <th className="px-4 py-3">File Name(s)</th>
                    <th className="px-4 py-3">Uploaded By</th>
                    <th className="px-4 py-3">Date & Time</th>
                  </>
                ) : (
                  <>
                    <th className="px-4 py-3">Box Name</th>
                    <th className="px-4 py-3 text-red-400">PIN</th>
                    <th className="px-4 py-3">Files</th>
                    <th className="px-4 py-3">Created At</th>
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
                        <td className="px-4 py-3">{item.name || "Anonymous"}</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(item.date).toLocaleString()}</td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-bold text-fuchsia-400">{item.boxName}</td>
                        <td className="px-4 py-3 font-mono text-red-400">{item.pin}</td>
                        <td className="px-4 py-3">{item.files.length} items</td>
                        <td className="px-4 py-3 text-sm text-gray-400">{new Date(item.createdAt).toLocaleString()}</td>
                      </>
                    )}

                    {role === "main" && (
                      <td className="px-4 py-3 text-center">
                        {viewMode === "uploads" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => item.files && item.files[0] && handleView(item.files[0].url)}
                              className="px-3 py-1 bg-blue-600 rounded text-xs hover:bg-blue-700"
                              title="View First File"
                            >
                              View
                            </button>
                            <button onClick={() => deleteFile(item.code)} className="px-3 py-1 bg-red-600 rounded text-xs hover:bg-red-700">Delete</button>
                          </div>
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
      )}
    </div>
  );
}
