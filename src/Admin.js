import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Download,
  Trash2,
  Shield,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  LogOut,
  FileText,
  Folder,
  Flag,
  Activity,
  X,
  Info,
} from "lucide-react";
import config from "./config";
import AdminCampaigns from "./AdminCampaigns";

const TIMEZONE_OPTIONS = [
  { value: "Asia/Dubai", label: "Asia/Dubai (GST · UTC+04:00)" },
  { value: "UTC", label: "UTC (Coordinated Universal Time)" },
  { value: "Asia/Kolkata", label: "Asia/Kolkata (IST · UTC+05:30)" },
  { value: "Europe/London", label: "Europe/London (GMT/BST)" },
  { value: "America/New_York", label: "America/New_York (ET)" },
  { value: "Australia/Sydney", label: "Australia/Sydney (AET)" },
];

const COUNTRY_FLAGS = {
  AE: "🇦🇪",
  IN: "🇮🇳",
  US: "🇺🇸",
  GB: "🇬🇧",
  AU: "🇦🇺",
  CA: "🇨🇦",
  DE: "🇩🇪",
  FR: "🇫🇷",
  SG: "🇸🇬",
  SA: "🇸🇦",
  QA: "🇶🇦",
  KW: "🇰🇼",
  OM: "🇴🇲",
  BH: "🇧🇭",
  LK: "🇱🇰",
  VN: "🇻🇳",
  PK: "🇵🇰",
  BD: "🇧🇩",
};

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  if (n < 1024 * 1024 * 1024) return `${(n / (1024 * 1024)).toFixed(2)} MB`;
  return `${(n / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

function formatInTimezone(isoString, timeZone = "Asia/Dubai") {
  if (!isoString) return "—";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      timeZone,
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(new Date(isoString));
  } catch {
    return new Date(isoString).toISOString();
  }
}

function StatusBadge({ status }) {
  const map = {
    available: "bg-emerald-50 text-emerald-800 border-emerald-200",
    expired: "bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]",
    deletion_pending: "bg-amber-50 text-amber-800 border-amber-200",
    deleted: "bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]",
    revoked: "bg-[#F5F5F7] text-[#6E6E73] border-[#D2D2D7]",
    quarantined: "bg-red-50 text-red-800 border-red-200",
    rejected: "bg-red-50 text-red-800 border-red-200",
  };
  const labels = {
    available: "Available",
    expired: "Expired (Files Purged)",
    deletion_pending: "Deletion Pending Retry",
    deleted: "Deleted",
    revoked: "Revoked by Sender",
    quarantined: "Quarantined",
    rejected: "Rejected",
  };
  const cls = map[status] || map.expired;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cls}`}>
      {labels[status] || status}
    </span>
  );
}

export default function Admin() {
  // Session State (Server-side authenticated; no credentials in frontend code)
  const [token, setToken] = useState(
    () => sessionStorage.getItem("fylshare_admin_token") || ""
  );
  const [adminUser, setAdminUser] = useState(null);
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Navigation Tabs: "transfers" | "workspaces" | "reports" | "audit" | "policy" | "campaigns"
  const [activeTab, setActiveTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get("tab") || "transfers";
    } catch {
      return "transfers";
    }
  });

  // Query & Filter State (Default: All retained history, Asia/Dubai timezone)
  const [period, setPeriod] = useState("all_retained");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [timezone, setTimezone] = useState("Asia/Dubai");
  const [viewFilter, setViewFilter] = useState("all"); // "all" | "active" | "historical"
  const [statusFilter, setStatusFilter] = useState("all");
  const [countryFilter, setCountryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(25);

  // Data State
  const [reportData, setReportData] = useState(null);
  const [workspaces, setWorkspaces] = useState([]);
  const [abuseReports, setAbuseReports] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [fetchState, setFetchState] = useState("idle"); // "idle" | "loading" | "ready" | "error"
  const [fetchError, setFetchError] = useState("");
  const [lastUpdatedUtc, setLastUpdatedUtc] = useState(null);
  const [isStale, setIsStale] = useState(false);

  // Selected Transfer Details & Modals
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState(null);
  const [actionBanner, setActionBanner] = useState(null);

  const pollTimerRef = useRef(null);

  // Verify existing session token on mount
  useEffect(() => {
    if (!token) {
      setAdminUser(null);
      return;
    }
    fetch(`${config.API_BASE_URL}/api/admin/session`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Expired");
        return res.json();
      })
      .then((data) => {
        setAdminUser(data.user);
      })
      .catch(() => {
        sessionStorage.removeItem("fylshare_admin_token");
        setToken("");
        setAdminUser(null);
      });
  }, [token]);

  const loadTransfersAndStats = useCallback(
    async (silent = false) => {
      if (!token) return;
      if (!silent) setFetchState("loading");
      setFetchError("");

      try {
        const params = new URLSearchParams({
          period,
          timezone,
          view: viewFilter,
          status: statusFilter,
          country: countryFilter,
          transferType: typeFilter,
          page: String(page),
          pageSize: String(pageSize),
        });
        if (period === "custom") {
          if (customStart) params.set("startDate", customStart);
          if (customEnd) params.set("endDate", customEnd);
        }

        const res = await fetch(
          `${config.API_BASE_URL}/api/admin/transfers?${params.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 401) {
          sessionStorage.removeItem("fylshare_admin_token");
          setToken("");
          setAdminUser(null);
          return;
        }

        if (!res.ok) {
          throw new Error("Server returned an error while loading transfers.");
        }

        const data = await res.json();
        setReportData(data);
        setLastUpdatedUtc(new Date().toISOString());
        setIsStale(false);
        setFetchState("ready");
      } catch (err) {
        if (!silent) {
          setFetchState("error");
          setFetchError(err.message || "Unable to load admin reporting data.");
        } else {
          setIsStale(true);
        }
      }
    },
    [
      token,
      period,
      timezone,
      viewFilter,
      statusFilter,
      countryFilter,
      typeFilter,
      page,
      pageSize,
      customStart,
      customEnd,
    ]
  );

  const loadSecondaryTabData = useCallback(async () => {
    if (!token) return;
    try {
      if (activeTab === "workspaces") {
        const res = await fetch(`${config.API_BASE_URL}/api/admin/workspaces`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setWorkspaces(await res.json());
      } else if (activeTab === "reports") {
        const res = await fetch(`${config.API_BASE_URL}/api/admin/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setAbuseReports(await res.json());
      } else if (activeTab === "audit" && adminUser?.role === "admin") {
        const res = await fetch(`${config.API_BASE_URL}/api/admin/audit`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setAuditLogs(await res.json());
      }
    } catch {
      // Handled inline
    }
  }, [token, activeTab, adminUser?.role]);

  useEffect(() => {
    if (token && adminUser) {
      loadTransfersAndStats(false);
      loadSecondaryTabData();
    }
  }, [token, adminUser, loadTransfersAndStats, loadSecondaryTabData]);

  // Near-real-time polling fallback that automatically pauses when tab is hidden
  useEffect(() => {
    if (!token || !adminUser) return undefined;

    const startPolling = () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      pollTimerRef.current = setInterval(() => {
        if (!document.hidden) {
          loadTransfersAndStats(true);
        }
      }, 30000);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadTransfersAndStats(true);
      }
    };

    startPolling();
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [token, adminUser, loadTransfersAndStats]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.trim(),
          password: passwordInput,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.token) {
        sessionStorage.setItem("fylshare_admin_token", data.token);
        setToken(data.token);
        setAdminUser(data.user);
        setPasswordInput("");
      } else {
        setLoginError(data.error || "Invalid credentials.");
      }
    } catch {
      setLoginError("Unable to reach authentication server.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch(`${config.API_BASE_URL}/api/admin/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Ignore network error on logout
    }
    sessionStorage.removeItem("fylshare_admin_token");
    setToken("");
    setAdminUser(null);
    setReportData(null);
  };

  const handleConfirmDeleteTransfer = async () => {
    if (!confirmDeleteTarget) return;
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/uploads/${encodeURIComponent(
          confirmDeleteTarget.transferId || confirmDeleteTarget.id
        )}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ reason: "Admin console deletion" }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionBanner({ type: "success", text: data.message || "Transfer deleted." });
        setConfirmDeleteTarget(null);
        setSelectedTransfer(null);
        loadTransfersAndStats(false);
      } else {
        setActionBanner({
          type: "error",
          text: data.error || data.message || "Failed to delete transfer.",
        });
      }
    } catch {
      setActionBanner({ type: "error", text: "Network error during deletion." });
    }
  };

  const handleDirectFileOpen = async (transferObj, fileIdx = 0) => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/transfers/${encodeURIComponent(
          transferObj.transferId || transferObj.id
        )}/file-access`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            fileIndex: fileIdx,
            reason: "Admin direct view",
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.downloadUrl) {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        setActionBanner({
          type: "error",
          text: data.error || "Could not open file.",
        });
      }
    } catch {
      setActionBanner({ type: "error", text: "Network error while opening file." });
    }
  };

  const handleExportCsv = async () => {
    try {
      const params = new URLSearchParams({ period, timezone });
      if (period === "custom") {
        if (customStart) params.set("startDate", customStart);
        if (customEnd) params.set("endDate", customEnd);
      }
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/export?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!res.ok) {
        setActionBanner({
          type: "error",
          text: "Export requires full administrator privileges.",
        });
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fylshare-transfers-${period}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setActionBanner({ type: "error", text: "Failed to export CSV." });
    }
  };

  const handleManualCleanupRun = async () => {
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/admin/cleanup/run`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setActionBanner({
          type: "success",
          text: `Cleanup cycle completed: ${data.expiredProcessed || 0} expired transfers purged, ${data.failures || 0} errors.`,
        });
        loadTransfersAndStats(false);
      }
    } catch {
      setActionBanner({ type: "error", text: "Cleanup request failed." });
    }
  };

  const handleModerateReport = async (reportId, action) => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/reports/${encodeURIComponent(reportId)}/moderate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            action,
            resolutionNote: `Moderated via Admin Console (${action})`,
          }),
        }
      );
      if (res.ok) {
        loadSecondaryTabData();
        loadTransfersAndStats(true);
      }
    } catch {
      // Ignore
    }
  };

  const handleDeleteWorkspace = async (boxName) => {
    if (
      !window.confirm(
        `Delete Workspace Box "${boxName}" and all stored files permanently?`
      )
    ) {
      return;
    }
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/admin/workspaces/${encodeURIComponent(boxName)}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.ok) {
        setWorkspaces((prev) => prev.filter((w) => w.boxName !== boxName));
        setActionBanner({ type: "success", text: `Workspace "${boxName}" deleted.` });
      }
    } catch {
      setActionBanner({ type: "error", text: "Failed to delete workspace." });
    }
  };

  // Unauthenticated Login View
  if (!token || !adminUser) {
    return (
      <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F] flex flex-col justify-center items-center px-4">
        <div className="w-full max-w-[400px] bg-white border border-[#D2D2D7] rounded-2xl p-8 shadow-sm space-y-6">
          <div className="text-center space-y-1.5">
            <div className="w-10 h-10 rounded-xl bg-[#1D1D1F] text-white flex items-center justify-center mx-auto font-semibold text-sm">
              F
            </div>
            <h1 className="text-[22px] font-semibold text-[#1D1D1F]">
              Fylshare Admin Console
            </h1>
            <p className="text-[13px] text-[#6E6E73]">
              Restricted operational and moderation access
            </p>
          </div>

          {loginError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12px] flex items-center gap-2"
            >
              <AlertTriangle size={15} className="shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="admin-username"
                className="block text-[13px] font-medium text-[#1D1D1F] mb-1"
              >
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[14px] text-[#1D1D1F] focus:bg-white focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label
                htmlFor="admin-password"
                className="block text-[13px] font-medium text-[#1D1D1F] mb-1"
              >
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[14px] text-[#1D1D1F] focus:bg-white focus:border-[#0066CC]"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white font-semibold text-[14px] transition-colors"
            >
              {loginLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="pt-3 border-t border-[#D2D2D7]/70 text-center">
            <Link to="/" className="text-[12px] text-[#0066CC] hover:underline">
              &larr; Return to public site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totals = reportData?.totals || {
    totalTransfers: 0,
    totalFiles: 0,
    totalBytes: 0,
    activeTransfers: 0,
    activeFiles: 0,
    historicalTransfers: 0,
    cleanupPendingCount: 0,
    totalWorkspaces: 0,
    openReportsCount: 0,
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-[#1D1D1F]">
      {/* Dedicated Private Admin Top Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-[#D2D2D7] px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#1D1D1F] text-white flex items-center justify-center text-xs font-semibold">
              F
            </span>
            <span className="text-[15px] font-semibold text-[#1D1D1F]">
              Fylshare Admin
            </span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F5F5F7] border border-[#D2D2D7] text-[11px] font-medium text-[#6E6E73]">
            {adminUser.username} ({adminUser.role})
          </span>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdatedUtc && (
            <span className="hidden md:inline text-[12px] text-[#6E6E73]">
              Last updated: {formatInTimezone(lastUpdatedUtc, timezone)} ({timezone})
            </span>
          )}
          <button
            type="button"
            onClick={() => {
              loadTransfersAndStats(false);
              loadSecondaryTabData();
            }}
            className="px-3 py-1.5 rounded-lg border border-[#D2D2D7] bg-white hover:bg-[#F5F5F7] text-[12px] font-semibold text-[#1D1D1F] flex items-center gap-1.5"
          >
            <RefreshCw size={13} className={fetchState === "loading" ? "animate-spin" : ""} />
            Refresh
          </button>
          <Link
            to="/"
            className="text-[12px] font-medium text-[#6E6E73] hover:text-[#1D1D1F] px-2"
          >
            Public Site
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-[#1D1D1F] hover:bg-black text-white text-[12px] font-semibold flex items-center gap-1"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </header>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8 space-y-6">
        {/* Action Feedback Banner */}
        {actionBanner && (
          <div
            role="status"
            className={`p-3.5 rounded-xl border text-[13px] flex items-center justify-between ${
              actionBanner.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-white border-[#D2D2D7] text-[#1D1D1F]"
            }`}
          >
            <span>{actionBanner.text}</span>
            <button
              type="button"
              onClick={() => setActionBanner(null)}
              className="text-[#6E6E73] hover:text-[#1D1D1F]"
            >
              <X size={15} />
            </button>
          </div>
        )}

        {/* Stale Data Warning */}
        {isStale && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] flex items-center justify-between">
            <span>
              Background refresh failed; showing data from {formatInTimezone(lastUpdatedUtc, timezone)}.
            </span>
            <button
              type="button"
              onClick={() => loadTransfersAndStats(false)}
              className="font-semibold underline"
            >
              Retry now
            </button>
          </div>
        )}

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D2D2D7] pb-3">
          <nav aria-label="Admin sections" className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "transfers", label: "Transfers & History", icon: <FileText size={14} /> },
              {
                id: "workspaces",
                label: `Workspaces (${totals.totalWorkspaces})`,
                icon: <Folder size={14} />,
              },
              {
                id: "reports",
                label: `Moderation Queue (${totals.openReportsCount})`,
                icon: <Flag size={14} />,
              },
              ...(adminUser.role === "admin"
                ? [{ id: "audit", label: "Audit Log", icon: <Shield size={14} /> }]
                : []),
              { id: "policy", label: "Retention & Lifecycle", icon: <Clock size={14} /> },
              { id: "campaigns", label: "Campaigns & Rewards", icon: <Flag size={14} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-[13px] font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === tab.id
                    ? "bg-[#1D1D1F] text-white"
                    : "bg-white text-[#6E6E73] hover:text-[#1D1D1F] border border-[#D2D2D7]/70"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Timezone Selector */}
          <div className="flex items-center gap-2 text-[12px]">
            <label htmlFor="admin-tz-select" className="text-[#6E6E73] font-medium">
              Reporting Timezone:
            </label>
            <select
              id="admin-tz-select"
              value={timezone}
              onChange={(e) => {
                setTimezone(e.target.value);
                setPage(1);
              }}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#D2D2D7] text-[#1D1D1F] font-medium"
            >
              {TIMEZONE_OPTIONS.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* === CAMPAIGNS & REWARDS === */}
        {activeTab === "campaigns" && (
          <AdminCampaigns token={token} isAdmin={adminUser.role === "admin"} />
        )}

        {/* === TAB 1: TRANSFERS & HISTORICAL REPORTING === */}
        {activeTab === "transfers" && (
          <div className="space-y-6">
            {/* Date Window & Filter Bar */}
            <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Date Period Selector */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { id: "today", label: "Today" },
                    { id: "7d", label: "Last 7 days" },
                    { id: "30d", label: "Last 30 days" },
                    { id: "custom", label: "Custom range" },
                    { id: "all_retained", label: "All retained history" },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setPeriod(p.id);
                        setPage(1);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors ${
                        period === p.id
                          ? "bg-[#0066CC] text-white"
                          : "bg-[#F5F5F7] text-[#1D1D1F] hover:bg-[#E8E8ED]"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* View Mode Toggle: All vs Active Files vs Historical Activity */}
                <div className="flex items-center gap-1 bg-[#F5F5F7] p-1 rounded-xl border border-[#D2D2D7]/70">
                  {[
                    { id: "all", label: "All Records" },
                    { id: "active", label: "Active Files Only" },
                    { id: "historical", label: "Historical / Expired" },
                  ].map((v) => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setViewFilter(v.id);
                        setPage(1);
                      }}
                      className={`px-3 py-1 rounded-lg text-[12px] font-semibold transition-colors ${
                        viewFilter === v.id
                          ? "bg-white text-[#1D1D1F] shadow-xs"
                          : "text-[#6E6E73] hover:text-[#1D1D1F]"
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {period === "custom" && (
                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#D2D2D7]/60 text-[12px]">
                  <label className="flex items-center gap-1.5">
                    <span className="text-[#6E6E73]">Start ({timezone}):</span>
                    <input
                      type="date"
                      value={customStart}
                      onChange={(e) => {
                        setCustomStart(e.target.value);
                        setPage(1);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#D2D2D7] bg-white"
                    />
                  </label>
                  <label className="flex items-center gap-1.5">
                    <span className="text-[#6E6E73]">End ({timezone}):</span>
                    <input
                      type="date"
                      value={customEnd}
                      onChange={(e) => {
                        setCustomEnd(e.target.value);
                        setPage(1);
                      }}
                      className="px-2.5 py-1 rounded-lg border border-[#D2D2D7] bg-white"
                    />
                  </label>
                </div>
              )}

              {/* Secondary Filters & Export */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D2D2D7]/60 text-[12px]">
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5">
                    <span className="text-[#6E6E73]">Status:</span>
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7]"
                    >
                      <option value="all">All statuses</option>
                      <option value="available">Available</option>
                      <option value="expired">Expired</option>
                      <option value="deletion_pending">Deletion Pending</option>
                      <option value="deleted">Deleted</option>
                      <option value="revoked">Revoked</option>
                      <option value="quarantined">Quarantined</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-1.5">
                    <span className="text-[#6E6E73]">Country:</span>
                    <select
                      value={countryFilter}
                      onChange={(e) => {
                        setCountryFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7]"
                    >
                      <option value="all">All countries (incl. Unknown)</option>
                      <option value="UNKNOWN">Unknown country only</option>
                      <option value="AE">United Arab Emirates (AE)</option>
                      <option value="IN">India (IN)</option>
                      <option value="LK">Sri Lanka (LK)</option>
                      <option value="VN">Viet Nam (VN)</option>
                      <option value="AU">Australia (AU)</option>
                      <option value="US">United States (US)</option>
                      <option value="GB">United Kingdom (GB)</option>
                    </select>
                  </label>

                  <label className="flex items-center gap-1.5">
                    <span className="text-[#6E6E73]">Type:</span>
                    <select
                      value={typeFilter}
                      onChange={(e) => {
                        setTypeFilter(e.target.value);
                        setPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7]"
                    >
                      <option value="all">All types</option>
                      <option value="anonymous">Anonymous transfers</option>
                      <option value="workspace">Workspace transfers</option>
                    </select>
                  </label>
                </div>

                {adminUser.role === "admin" && (
                  <button
                    type="button"
                    onClick={handleExportCsv}
                    className="px-3.5 py-1.5 rounded-lg bg-white border border-[#D2D2D7] hover:bg-[#F5F5F7] text-[#1D1D1F] font-semibold flex items-center gap-1.5"
                  >
                    <Download size={13} /> Export Filtered CSV (Minimized)
                  </button>
                )}
              </div>
            </div>

            {/* Honest Historical Coverage Disclosure */}
            {reportData?.trackingMetadata && (
              <div className="p-3.5 rounded-xl bg-white border border-[#D2D2D7] text-[12px] text-[#6E6E73] flex items-start gap-2.5">
                <Info size={15} className="text-[#0066CC] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1D1D1F]">Retained History Coverage:</strong>{" "}
                  Earliest retained transfer record in database:{" "}
                  <span className="font-mono text-[#1D1D1F]">
                    {reportData.trackingMetadata.earliestRetainedRecordAt
                      ? formatInTimezone(
                          reportData.trackingMetadata.earliestRetainedRecordAt,
                          timezone
                        )
                      : "None"}
                  </span>
                  . {reportData.trackingMetadata.note}
                </div>
              </div>
            )}

            {/* KPI Summary Cards (Separating Transfers vs Individual Files) */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Filtered Transfers
                </p>
                <p
                  data-testid="kpi-total-transfers"
                  className="text-[28px] font-semibold text-[#1D1D1F] mt-1"
                >
                  {totals.totalTransfers}
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  {totals.activeTransfers} active · {totals.historicalTransfers} historical
                </p>
              </div>

              <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Individual Files
                </p>
                <p
                  data-testid="kpi-total-files"
                  className="text-[28px] font-semibold text-[#0066CC] mt-1"
                >
                  {totals.totalFiles}
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  {totals.activeFiles} currently available in storage
                </p>
              </div>

              <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Filtered Volume
                </p>
                <p className="text-[28px] font-semibold text-[#1D1D1F] mt-1">
                  {formatBytes(totals.totalBytes)}
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  Across complete filtered dataset
                </p>
              </div>

              <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Storage Cleanup
                </p>
                <p
                  className={`text-[28px] font-semibold mt-1 ${
                    totals.cleanupPendingCount > 0 ? "text-amber-600" : "text-emerald-700"
                  }`}
                >
                  {totals.cleanupPendingCount > 0
                    ? `${totals.cleanupPendingCount} Pending`
                    : "Healthy"}
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  {totals.cleanupPendingCount > 0
                    ? "Queued for retry"
                    : "No failed storage deletions"}
                </p>
              </div>

              <div className="bg-white border border-[#D2D2D7] rounded-2xl p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Open Abuse Reports
                </p>
                <p
                  className={`text-[28px] font-semibold mt-1 ${
                    totals.openReportsCount > 0 ? "text-red-600" : "text-[#1D1D1F]"
                  }`}
                >
                  {totals.openReportsCount}
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-0.5">
                  In moderation queue
                </p>
              </div>
            </div>

            {/* Main Grid: Transfers Table + Details / Country Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Transfers Table (8 cols) */}
              <div className="lg:col-span-8 bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-[#D2D2D7] flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-[#1D1D1F]">
                    Transfers ({totals.totalTransfers})
                  </h2>
                  <span className="text-[12px] text-[#6E6E73]">
                    Page {reportData?.pagination?.page || 1} of{" "}
                    {reportData?.pagination?.totalPages || 1}
                  </span>
                </div>

                {fetchState === "loading" && !reportData ? (
                  <div className="p-12 text-center text-[13px] text-[#6E6E73]">
                    Loading transfer records...
                  </div>
                ) : fetchState === "error" ? (
                  <div className="p-12 text-center space-y-3">
                    <p className="text-[14px] text-red-700 font-medium">{fetchError}</p>
                    <button
                      type="button"
                      onClick={() => loadTransfersAndStats(false)}
                      className="px-4 py-2 rounded-lg bg-[#0066CC] text-white text-[12px] font-semibold"
                    >
                      Retry Query
                    </button>
                  </div>
                ) : !reportData?.items?.length ? (
                  <div className="p-12 text-center text-[13px] text-[#6E6E73]">
                    No transfers match the selected date window and filters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[13px]">
                      <thead>
                        <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          <th className="py-3 px-4">Created ({timezone})</th>
                          <th className="py-3 px-4">Code</th>
                          <th className="py-3 px-4">Label</th>
                          <th className="py-3 px-4">Files &amp; Size</th>
                          <th className="py-3 px-4">Location (City, State, Country)</th>
                          <th className="py-3 px-4">Status</th>
                          <th className="py-3 px-4 text-right">Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D2D2D7]/60">
                        {reportData.items.map((item) => {
                          const flag = item.countryCode
                            ? COUNTRY_FLAGS[item.countryCode] || "🌐"
                            : "—";
                          const isSelected = selectedTransfer?.id === item.id;
                          return (
                            <tr
                              key={item.id}
                              onClick={() => setSelectedTransfer(item)}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? "bg-[#0066CC]/[0.06]" : "hover:bg-[#F5F5F7]/70"
                              }`}
                            >
                              <td className="py-3 px-4 whitespace-nowrap font-mono text-[12px] text-[#1D1D1F]">
                                {formatInTimezone(item.createdAt, timezone)}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap font-mono text-[12px] font-semibold text-[#0066CC]">
                                {item.code || "—"}
                              </td>
                              <td className="py-3 px-4 max-w-[180px] truncate text-[#1D1D1F] font-medium">
                                {item.label}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-[#1D1D1F]">
                                <span className="font-semibold">{item.fileCount}</span>{" "}
                                {item.fileCount === 1 ? "file" : "files"}{" "}
                                <span className="text-[#6E6E73] text-[12px]">
                                  ({formatBytes(item.totalBytes)})
                                </span>
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                {item.countryCode ? (
                                  <span className="inline-flex items-center gap-1.5 text-[12px] text-[#1D1D1F]">
                                    <span>{flag}</span>
                                    <span>
                                      {item.locationDisplay || item.countryName} ({item.countryCode})
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-[12px] text-[#6E6E73]">
                                    {item.locationDisplay || "Unknown"}
                                  </span>
                                )}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <StatusBadge status={item.status} />
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap text-right">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTransfer(item);
                                  }}
                                  className="text-[12px] font-semibold text-[#0066CC] hover:underline"
                                >
                                  Inspect
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Server-Side Pagination Bar */}
                {reportData?.pagination && reportData.pagination.totalPages > 1 && (
                  <div className="px-5 py-3 border-t border-[#D2D2D7] flex items-center justify-between text-[12px]">
                    <span className="text-[#6E6E73]">
                      Showing page {reportData.pagination.page} of{" "}
                      {reportData.pagination.totalPages} ({reportData.pagination.totalItems} total transfers)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={!reportData.pagination.hasPrevPage}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        className="px-3 py-1 rounded-lg border border-[#D2D2D7] bg-white disabled:opacity-40 flex items-center gap-1"
                      >
                        <ChevronLeft size={14} /> Previous
                      </button>
                      <button
                        type="button"
                        disabled={!reportData.pagination.hasNextPage}
                        onClick={() => setPage((p) => p + 1)}
                        className="px-3 py-1 rounded-lg border border-[#D2D2D7] bg-white disabled:opacity-40 flex items-center gap-1"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Selected Transfer Details OR Country & Daily Breakdown (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                {selectedTransfer ? (
                  <div className="bg-white border border-[#D2D2D7] rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between border-b border-[#D2D2D7]/70 pb-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                          Transfer Metadata
                        </p>
                        <h3 className="text-[16px] font-semibold text-[#1D1D1F] mt-0.5">
                          {selectedTransfer.label}
                        </h3>
                        <p className="text-[11px] font-mono text-[#6E6E73]">
                          ID: {selectedTransfer.transferId}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedTransfer(null)}
                        className="text-[#6E6E73] hover:text-[#1D1D1F] p-1"
                        aria-label="Close transfer details"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <dl className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-[12px]">
                      <div>
                        <dt className="text-[#6E6E73]">Status</dt>
                        <dd className="mt-0.5">
                          <StatusBadge status={selectedTransfer.status} />
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Files &amp; Size</dt>
                        <dd className="font-semibold text-[#1D1D1F] mt-0.5">
                          {selectedTransfer.fileCount} file(s) ({formatBytes(selectedTransfer.totalBytes)})
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Created ({timezone})</dt>
                        <dd className="font-mono text-[#1D1D1F] mt-0.5">
                          {formatInTimezone(selectedTransfer.createdAt, timezone)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Expires ({timezone})</dt>
                        <dd className="font-mono text-[#1D1D1F] mt-0.5">
                          {formatInTimezone(selectedTransfer.expiresAt, timezone)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Location (City, State, Country)</dt>
                        <dd className="text-[#1D1D1F] font-medium mt-0.5">
                          {selectedTransfer.countryCode
                            ? `${
                                selectedTransfer.locationDisplay ||
                                selectedTransfer.countryName
                              } (${selectedTransfer.countryCode})`
                            : selectedTransfer.locationDisplay || "Unknown"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Location Source</dt>
                        <dd className="font-mono text-[11px] text-[#6E6E73] mt-0.5">
                          {selectedTransfer.locationSource}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Device Category</dt>
                        <dd className="text-[#1D1D1F] capitalize mt-0.5">
                          {selectedTransfer.deviceCategory || "unknown"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-[#6E6E73]">Retrievals / Downloads</dt>
                        <dd className="text-[#1D1D1F] mt-0.5">
                          {selectedTransfer.retrievalCount} lookups ·{" "}
                          {selectedTransfer.downloadServedCount} served
                        </dd>
                      </div>
                    </dl>

                    {selectedTransfer.lastCleanupError && (
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>Storage Cleanup Error (Attempt {selectedTransfer.cleanupAttempts}):</strong>{" "}
                        {selectedTransfer.lastCleanupError}
                      </div>
                    )}

                    {/* Files in Transfer */}
                    <div className="space-y-2 pt-2 border-t border-[#D2D2D7]/70">
                      <p className="text-[12px] font-semibold text-[#1D1D1F]">
                        Files ({selectedTransfer.files?.length || 0})
                        {selectedTransfer.bundleDownloadRequests > 0 && (
                          <span className="ml-2 font-normal text-[11px] text-[#6E6E73]">
                            · Bundle downloads: {selectedTransfer.bundleDownloadRequests} (counted
                            per transfer, not added to file totals)
                          </span>
                        )}
                      </p>
                      <ul className="space-y-1.5 max-h-96 overflow-y-auto">
                        {selectedTransfer.files?.map((f) => (
                          <li
                            key={f.index}
                            className="p-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/70 flex items-center justify-between gap-2 text-[12px]"
                          >
                            <div className="min-w-0">
                              <p className="font-medium text-[#1D1D1F] truncate">
                                {f.name}
                              </p>
                              <p className="text-[11px] text-[#6E6E73]">
                                {formatBytes(f.size)} ·{" "}
                                {f.storageDeleted ? "Purged from storage" : "Stored privately"}
                              </p>
                              <dl
                                className="mt-1.5 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[10.5px] text-[#6E6E73]"
                                title="Clicks = button presses in the browser. Download requested = server issued a signed link (completion on the device is unknown for signed storage URLs). Distinct sessions are short-lived browser sessions, not verified people."
                              >
                                <dt>Button clicks</dt><dd className="text-[#1D1D1F]">{f.buttonClicks || 0}</dd>
                                <dt>Download requested / link issued</dt><dd className="text-[#1D1D1F]">{f.downloadRequests || 0}</dd>
                                <dt>Delivery completion</dt><dd className="text-[#1D1D1F]">{f.deliveryCompletionStatus === "observed_proxy_stream" ? `${f.observedDeliveries || 0} observed` : "Unknown (signed URL)"}</dd>
                                <dt>Repeat downloads</dt><dd className="text-[#1D1D1F]">{f.repeatDownloads || 0}</dd>
                                <dt>Distinct sessions (estimate)</dt><dd className="text-[#1D1D1F]">{f.estimatedDistinctSessions || 0}</dd>
                                <dt>Reward-qualifying</dt><dd className="text-[#1D1D1F]">{f.qualifyingDownloads || 0}</dd>
                                <dt>HEAD / previews · bots · range chunks</dt><dd className="text-[#1D1D1F]">{f.headOrPreviewRequests || 0} · {f.scannerOrBotRequests || 0} · {f.rangeRequests || 0}</dd>
                                <dt>Last activity</dt><dd className="text-[#1D1D1F]">{f.lastActivityAt ? formatInTimezone(f.lastActivityAt, timezone) : "—"}</dd>
                              </dl>
                            </div>
                            {!f.storageDeleted &&
                              selectedTransfer.status === "available" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleDirectFileOpen(selectedTransfer, f.index)
                                  }
                                  className="px-2.5 py-1 rounded-lg bg-[#0066CC] text-white text-[11px] font-semibold hover:bg-[#0055B3] shrink-0 flex items-center gap-1"
                                >
                                  <Eye size={12} /> View File
                                </button>
                              )}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {adminUser.role === "admin" &&
                      selectedTransfer.status !== "deleted" && (
                        <div className="pt-3 border-t border-[#D2D2D7]/70">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteTarget(selectedTransfer)}
                            className="w-full py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold flex items-center justify-center gap-1.5"
                          >
                            <Trash2 size={14} /> Delete Stored Files &amp; Revoke Transfer
                          </button>
                        </div>
                      )}
                  </div>
                ) : null}

                {/* Country Breakdown Card */}
                <div className="bg-white border border-[#D2D2D7] rounded-2xl p-5 space-y-3">
                  <div>
                    <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                      Country Breakdown (Filtered Window)
                    </h3>
                    <p className="text-[11px] text-[#6E6E73] mt-0.5 leading-relaxed">
                      Derived from CDN/proxy network headers when available. VPNs, proxies, and missing headers can affect estimates. Timezones and device labels are never counted as countries; unknown values are preserved.
                    </p>
                  </div>

                  {!reportData?.countryBreakdown?.length ? (
                    <p className="text-[12px] text-[#6E6E73]">No country data in window.</p>
                  ) : (
                    <ul className="space-y-2 text-[12px]">
                      {reportData.countryBreakdown.map((c, idx) => {
                        const flag = c.countryCode
                          ? COUNTRY_FLAGS[c.countryCode] || "🌐"
                          : "—";
                        return (
                          <li
                            key={c.countryCode || `unk_${idx}`}
                            className="flex items-center justify-between py-1.5 border-b border-[#D2D2D7]/50 last:border-0"
                          >
                            <span className="font-medium text-[#1D1D1F]">
                              {flag}{" "}
                              {c.countryCode
                                ? `${c.countryName} (${c.countryCode})`
                                : "Unknown"}
                            </span>
                            <span className="text-[#6E6E73]">
                              <strong className="text-[#1D1D1F]">{c.transfers}</strong>{" "}
                              transfers · <strong className="text-[#1D1D1F]">{c.files}</strong>{" "}
                              files
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                {/* Daily Activity Breakdown */}
                <div className="bg-white border border-[#D2D2D7] rounded-2xl p-5 space-y-3">
                  <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                    Daily Activity ({timezone})
                  </h3>
                  {!reportData?.dailySeries?.length ? (
                    <p className="text-[12px] text-[#6E6E73]">No activity in window.</p>
                  ) : (
                    <ul className="space-y-2 text-[12px]">
                      {reportData.dailySeries.slice(0, 10).map((d) => (
                        <li
                          key={d.date}
                          className="flex items-center justify-between py-1 border-b border-[#D2D2D7]/50 last:border-0"
                        >
                          <span className="font-mono text-[#1D1D1F]">{d.date}</span>
                          <span className="text-[#6E6E73]">
                            <strong className="text-[#1D1D1F]">{d.transfers}</strong>{" "}
                            transfers ·{" "}
                            <strong className="text-[#0066CC]">{d.files}</strong> files (
                            {formatBytes(d.bytes)})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* === TAB 2: WORKSPACES (WITH PIN VISIBLE TO ADMIN) === */}
        {activeTab === "workspaces" && (
          <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D2D2D7] flex items-center justify-between">
              <div>
                <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Workspace Boxes ({workspaces.length})
                </h2>
                <p className="text-[12px] text-[#6E6E73]">
                  Manage all active Workspace Boxes and their PINs.
                </p>
              </div>
            </div>

            {workspaces.length === 0 ? (
              <div className="p-12 text-center text-[13px] text-[#6E6E73]">
                No workspaces found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                      <th className="py-3 px-5">Box Name</th>
                      <th className="py-3 px-5">PIN</th>
                      <th className="py-3 px-5">Files</th>
                      <th className="py-3 px-5">Volume</th>
                      <th className="py-3 px-5">Created ({timezone})</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D2D2D7]/60">
                    {workspaces.map((w) => (
                      <tr key={w.id || w.boxName} className="hover:bg-[#F5F5F7]/60">
                        <td className="py-3 px-5 font-semibold text-[#1D1D1F]">
                          {w.boxName}
                        </td>
                        <td className="py-3 px-5 font-mono font-semibold text-[#0066CC]">
                          {w.pin || "—"}
                        </td>
                        <td className="py-3 px-5">{w.fileCount} files</td>
                        <td className="py-3 px-5">{formatBytes(w.totalBytes)}</td>
                        <td className="py-3 px-5 font-mono text-[12px]">
                          {formatInTimezone(w.createdAt, timezone)}
                        </td>
                        <td className="py-3 px-5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteWorkspace(w.boxName)}
                            className="text-red-600 hover:underline text-[12px] font-semibold"
                          >
                            Delete Box
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* === TAB 3: MODERATION QUEUE (ABUSE REPORTS) === */}
        {activeTab === "reports" && (
          <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D2D2D7]">
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                Abuse &amp; Takedown Moderation Queue
              </h2>
              <p className="text-[12px] text-[#6E6E73]">
                Do not casually download or open suspected unlawful content. Quarantine or remove violating transfers directly using metadata and report evidence.
              </p>
            </div>

            {abuseReports.length === 0 ? (
              <div className="p-12 text-center text-[13px] text-[#6E6E73]">
                No abuse reports in queue.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                      <th className="py-3 px-4">Report ID</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Reason</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Submitted</th>
                      {adminUser.role === "admin" && (
                        <th className="py-3 px-4 text-right">Moderation</th>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D2D2D7]/60">
                    {abuseReports.map((rep) => (
                      <tr key={rep.reportId}>
                        <td className="py-3 px-4 font-mono text-[12px]">{rep.reportId}</td>
                        <td className="py-3 px-4 capitalize font-medium">{rep.category}</td>
                        <td className="py-3 px-4 max-w-md">{rep.reason}</td>
                        <td className="py-3 px-4 capitalize font-semibold">{rep.status}</td>
                        <td className="py-3 px-4 font-mono text-[12px]">
                          {formatInTimezone(rep.createdAt, timezone)}
                        </td>
                        {adminUser.role === "admin" && (
                          <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleModerateReport(rep.reportId, "quarantine")}
                              className="px-2.5 py-1 rounded bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-semibold"
                            >
                              Quarantine
                            </button>
                            <button
                              type="button"
                              onClick={() => handleModerateReport(rep.reportId, "remove")}
                              className="px-2.5 py-1 rounded bg-red-600 text-white text-[11px] font-semibold"
                            >
                              Remove Files
                            </button>
                            <button
                              type="button"
                              onClick={() => handleModerateReport(rep.reportId, "dismiss")}
                              className="px-2.5 py-1 rounded bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F] text-[11px] font-semibold"
                            >
                              Dismiss
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* === TAB 4: ADMIN AUDIT LOG === */}
        {activeTab === "audit" && adminUser.role === "admin" && (
          <div className="bg-white border border-[#D2D2D7] rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-[#D2D2D7]">
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                Privileged Action Audit Log
              </h2>
              <p className="text-[12px] text-[#6E6E73]">
                Records logins, file content inspections, deletions, moderation actions, and CSV exports.
              </p>
            </div>

            {auditLogs.length === 0 ? (
              <div className="p-12 text-center text-[13px] text-[#6E6E73]">
                No audit events recorded yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                      <th className="py-3 px-4">Timestamp ({timezone})</th>
                      <th className="py-3 px-4">Actor</th>
                      <th className="py-3 px-4">Action</th>
                      <th className="py-3 px-4">Target</th>
                      <th className="py-3 px-4">Reason / Detail</th>
                      <th className="py-3 px-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D2D2D7]/60">
                    {auditLogs.map((log, i) => (
                      <tr key={log._id || i}>
                        <td className="py-2.5 px-4 font-mono text-[12px]">
                          {formatInTimezone(log.timestamp, timezone)}
                        </td>
                        <td className="py-2.5 px-4 font-medium">
                          {log.actor} ({log.role})
                        </td>
                        <td className="py-2.5 px-4 font-mono text-[12px]">{log.action}</td>
                        <td className="py-2.5 px-4 font-mono text-[12px]">
                          {log.targetType}
                          {log.targetId ? `:${log.targetId}` : ""}
                        </td>
                        <td className="py-2.5 px-4 text-[#6E6E73]">{log.reason || "—"}</td>
                        <td className="py-2.5 px-4 font-semibold">{log.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* === TAB 5: RETENTION & LIFECYCLE POLICY === */}
        {activeTab === "policy" && (
          <div className="bg-white border border-[#D2D2D7] rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#D2D2D7] pb-4">
              <div>
                <h2 className="text-[18px] font-semibold text-[#1D1D1F]">
                  Data Retention &amp; File Lifecycle Policy
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Separated retention schedules for stored file blobs, identifying metadata, operational history, and aggregate statistics.
                </p>
              </div>
              {adminUser.role === "admin" && (
                <button
                  type="button"
                  onClick={handleManualCleanupRun}
                  className="px-4 py-2 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] text-white text-[12px] font-semibold flex items-center gap-1.5"
                >
                  <Activity size={14} /> Run Storage Cleanup Cycle Now
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                    <th className="py-3 px-4">Data Category</th>
                    <th className="py-3 px-4">Retention Duration</th>
                    <th className="py-3 px-4">Lifecycle Behavior</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D2D2D7]/60">
                  <tr>
                    <td className="py-3 px-4 font-semibold">
                      1. Uploaded File Contents &amp; Retrieval Codes
                    </td>
                    <td className="py-3 px-4 font-mono">Until deleted</td>
                    <td className="py-3 px-4 text-[#6E6E73]">
                      Files and 6-digit retrieval codes remain active and downloadable until deleted by the sender or removed by an administrator.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">
                      2. Transfer Metadata (Labels, Filenames, Codes)
                    </td>
                    <td className="py-3 px-4 font-mono">Until deleted</td>
                    <td className="py-3 px-4 text-[#6E6E73]">
                      Retained alongside the transfer so recipients and the admin console can view filenames, labels, and retrieval codes.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">
                      3. Minimized Operational History Records
                    </td>
                    <td className="py-3 px-4 font-mono">90 days</td>
                    <td className="py-3 px-4 text-[#6E6E73]">
                      Retains non-identifying timestamps, file counts, byte totals, status, cleanup state, and approximate country for admin reporting without keeping file blobs.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">
                      4. Admin Audit Logs &amp; Abuse Moderation Records
                    </td>
                    <td className="py-3 px-4 font-mono">180 days</td>
                    <td className="py-3 px-4 text-[#6E6E73]">
                      Restricted records of privileged admin actions and abuse reports for security accountability and lawful compliance.
                    </td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-semibold">
                      5. Aggregate Daily Usage Statistics (<code className="font-mono">DailyStats</code>)
                    </td>
                    <td className="py-3 px-4 font-mono">Retained (Non-personal counters)</td>
                    <td className="py-3 px-4 text-[#6E6E73]">
                      Daily UTC totals of transfers created, files uploaded, bytes transferred, and expirations. Contains zero PII, filenames, or codes.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal: Confirm Destructive Deletion */}
      {confirmDeleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#D2D2D7] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
              Confirm File Deletion
            </h3>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              This will immediately delete the stored file object(s) for transfer{" "}
              <code className="font-mono text-[#1D1D1F]">
                {confirmDeleteTarget.transferId}
              </code>{" "}
              from cloud storage, revoke download access, and redact identifying labels.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDeleteTarget(null)}
                className="px-4 py-2 rounded-lg border border-[#D2D2D7] text-[12px] font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteTransfer}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[12px] font-semibold"
              >
                Delete Stored Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
