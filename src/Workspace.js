import React, { useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import {
  Folder,
  Upload,
  Download,
  Eye,
  Trash2,
  LogOut,
  FileText,
  Lock,
  AlertCircle,
  X,
} from "lucide-react";
import Toast from "./Toast";
import config from "./config";

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 1024 * 1024 * 1024;
const BLOCKED_EXTENSIONS =
  /\.(exe|dll|bat|cmd|scr|vbs|vbe|jse|wsf|wsh|msi|msp|com|pif|cpl|hta|ps1|reg|apk|dmg|pkg|deb|rpm|iso|img)$/i;

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Workspace() {
  const xhrRef = useRef(null);
  const [boxName, setBoxName] = useState("");
  const [pin, setPin] = useState("");
  const [mode, setMode] = useState("login"); // "login" | "create"
  const [workspaceToken, setWorkspaceToken] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [files, setFiles] = useState([]);
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadState, setUploadState] = useState("idle"); // "idle" | "uploading" | "processing"
  const [uploadPct, setUploadPct] = useState(0);
  const [toast, setToast] = useState(null);

  const triggerToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4500);
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    if (!boxName.trim() || !pin.trim()) {
      setAuthError("Enter both a Workspace Box name and PIN.");
      return;
    }

    setAuthLoading(true);
    const endpoint = mode === "login" ? "/api/box/login" : "/api/box/create";

    try {
      const res = await fetch(`${config.API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boxName: boxName.trim(), pin: pin.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        const token = data.workspaceToken || "";
        setWorkspaceToken(token);
        setIsLoggedIn(true);
        setFiles(data.files || []);
        setPin(""); // Clear raw PIN from state once session token is issued
        if (mode === "login" && !data.files) {
          refreshFiles(boxName.trim(), token);
        }
      } else {
        setAuthError(data.error || data.message || "Authentication failed.");
      }
    } catch {
      setAuthError("Network error while connecting to Workspace service.");
    } finally {
      setAuthLoading(false);
    }
  };

  const refreshFiles = async (targetBox = boxName, token = workspaceToken) => {
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/workspaces/${encodeURIComponent(targetBox)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      } else if (res.status === 401) {
        setIsLoggedIn(false);
        setWorkspaceToken("");
        triggerToast("Workspace session expired. Please sign in again.", "warning");
      }
    } catch {
      // Ignore transient errors
    }
  };

  const onDrop = (acceptedFiles) => {
    const blocked = acceptedFiles.find((f) => BLOCKED_EXTENSIONS.test(f.name || ""));
    if (blocked) {
      triggerToast(`Executable format (${blocked.name}) is not permitted.`, "error");
      return;
    }
    const total = acceptedFiles.reduce((s, f) => s + (f.size || 0), 0);
    if (total > MAX_TOTAL_BYTES) {
      triggerToast("Total upload size exceeds 1 GB limit.", "error");
      return;
    }
    setUploadFiles(acceptedFiles.slice(0, MAX_FILES));
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const handleUpload = async () => {
    if (uploadFiles.length === 0) return;
    setUploadState("uploading");
    setUploadPct(0);

    const formData = new FormData();
    formData.append("boxName", boxName);
    uploadFiles.forEach((f) => formData.append("files", f));

    try {
      const resData = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open("POST", `${config.API_BASE_URL}/api/workspaces/upload`, true);
        xhr.setRequestHeader("Authorization", `Bearer ${workspaceToken}`);

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable && ev.total > 0) {
            const pct = Math.round((ev.loaded / ev.total) * 100);
            setUploadPct(pct);
            if (ev.loaded >= ev.total) {
              setUploadState("processing");
            }
          }
        };

        xhr.onload = () => {
          xhrRef.current = null;
          let parsed = {};
          try {
            parsed = JSON.parse(xhr.responseText || "{}");
          } catch {
            parsed = {};
          }
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve(parsed);
          } else {
            reject(new Error(parsed.error || "Workspace upload failed."));
          }
        };

        xhr.onerror = () => {
          xhrRef.current = null;
          reject(new Error("Network error during upload."));
        };

        xhr.send(formData);
      });

      setUploadFiles([]);
      setUploadState("idle");
      setUploadPct(0);
      if (resData.files) {
        setFiles(resData.files);
      } else {
        refreshFiles();
      }
      triggerToast("Files uploaded to Workspace Box.", "success");
    } catch (err) {
      setUploadState("idle");
      setUploadPct(0);
      triggerToast(err.message || "Upload failed.", "error");
    }
  };

  const handleFileDownload = async (fileObj, actionMode = "download") => {
    const fileKey = fileObj.code || fileObj.fileId;
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/workspaces/${encodeURIComponent(
          boxName
        )}/files/${encodeURIComponent(fileKey)}/download?json=true&mode=${actionMode}`,
        {
          headers: { Authorization: `Bearer ${workspaceToken}` },
        }
      );
      if (!res.ok) {
        triggerToast("Could not authorize workspace file access.", "error");
        return;
      }
      const data = await res.json();
      if (actionMode === "inline") {
        window.open(data.downloadUrl, "_blank", "noopener,noreferrer");
      } else {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = data.fileName || fileObj.name || "download";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch {
      triggerToast("Network error while requesting file.", "error");
    }
  };

  const handleDeleteFile = async (fileObj) => {
    const fileKey = fileObj.code || fileObj.fileId;
    if (
      !window.confirm(
        `Permanently delete "${fileObj.name}" from this Workspace Box and cloud storage?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/workspaces/${encodeURIComponent(
          boxName
        )}/files/${encodeURIComponent(fileKey)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${workspaceToken}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        triggerToast("File deleted from Workspace Box and storage.", "success");
      } else {
        triggerToast("Failed to delete file.", "error");
      }
    } catch {
      triggerToast("Error deleting file.", "error");
    }
  };

  if (isLoggedIn) {
    return (
      <div className="bg-[#FFFFFF] text-[#1D1D1F] min-h-[75vh]">
        {toast && (
          <div className="fixed top-20 right-4 z-50">
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          </div>
        )}

        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 pb-20">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D2D2D7]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[#0066CC]">
                <Folder size={20} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Workspace Box
                </p>
                <h1 className="text-[22px] font-semibold text-[#1D1D1F]">
                  {boxName}
                </h1>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsLoggedIn(false);
                setWorkspaceToken("");
                setFiles([]);
              }}
              className="px-4 py-2 rounded-xl border border-[#D2D2D7] bg-[#F5F5F7] hover:bg-[#E8E8ED] text-[13px] font-semibold text-[#1D1D1F] flex items-center gap-1.5 transition-colors"
            >
              <LogOut size={14} /> Lock &amp; Sign Out
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Upload Panel */}
            <div className="lg:col-span-4 apple-card rounded-2xl p-6 space-y-4">
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                Add Files to Box
              </h2>

              <div
                {...getRootProps()}
                className={`rounded-xl border border-dashed p-6 text-center transition-colors cursor-pointer ${
                  isDragActive
                    ? "border-[#0066CC] bg-[#0066CC]/[0.04]"
                    : "border-[#D2D2D7] bg-[#F5F5F7]/70 hover:bg-[#F5F5F7]"
                }`}
              >
                <input
                  {...getInputProps({
                    "aria-label": "Upload files to workspace",
                  })}
                />
                <Upload size={20} className="mx-auto mb-2 text-[#0066CC]" />
                <p className="text-[13px] font-medium text-[#1D1D1F]">
                  Drop files here or <span className="text-[#0066CC] underline">browse</span>
                </p>
                <p className="text-[11px] text-[#6E6E73] mt-1">
                  Up to 10 files · 1 GB max
                </p>
              </div>

              {uploadFiles.length > 0 && (
                <div className="space-y-2.5">
                  <ul className="space-y-1 text-[12px] max-h-36 overflow-y-auto">
                    {uploadFiles.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded bg-[#F5F5F7] border border-[#D2D2D7]/60"
                      >
                        <span className="truncate font-medium">{f.name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setUploadFiles((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          aria-label={`Remove ${f.name}`}
                          className="text-[#6E6E73] hover:text-red-600"
                        >
                          <X size={13} />
                        </button>
                      </li>
                    ))}
                  </ul>

                  {uploadState !== "idle" && (
                    <div className="space-y-1">
                      <div className="w-full h-2 bg-[#D2D2D7] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0066CC] transition-all"
                          style={{ width: `${uploadPct}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#6E6E73]">
                        {uploadState === "uploading"
                          ? `Uploading (${uploadPct}%)`
                          : "Storing in Workspace Box..."}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleUpload}
                    disabled={uploadState !== "idle"}
                    className="w-full py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white font-semibold text-[13px]"
                  >
                    {uploadState === "idle" ? "Upload to Box" : "Uploading..."}
                  </button>
                </div>
              )}
            </div>

            {/* Stored Files List */}
            <div className="lg:col-span-8 apple-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#D2D2D7]/70 pb-3">
                <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                  Stored Files ({files.length})
                </h2>
                <span className="text-[12px] text-[#6E6E73]">
                  Retained until deleted by a PIN holder
                </span>
              </div>

              {files.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-[#6E6E73]">
                  This Workspace Box is empty. Use the panel on the left to add files.
                </div>
              ) : (
                <ul className="space-y-2.5">
                  {files.map((f, idx) => (
                    <li
                      key={f.fileId || f.code || idx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/70"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-white border border-[#D2D2D7] flex items-center justify-center text-[#1D1D1F] shrink-0">
                          <FileText size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">
                            {f.name}
                          </p>
                          <p className="text-[11px] text-[#6E6E73]">
                            {formatBytes(f.size)}
                            {f.code ? ` · File Code: ${f.code}` : ""}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleFileDownload(f, "inline")}
                          className="px-3 py-1.5 rounded-lg bg-white border border-[#D2D2D7] hover:bg-[#E8E8ED]/50 text-[12px] font-semibold text-[#1D1D1F] flex items-center gap-1"
                        >
                          <Eye size={13} /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleFileDownload(f, "download")}
                          className="px-3 py-1.5 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-[12px] font-semibold text-white flex items-center gap-1"
                        >
                          <Download size={13} /> Download
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(f)}
                          aria-label={`Delete ${f.name}`}
                          className="p-1.5 rounded-lg bg-white border border-[#D2D2D7] hover:border-red-300 text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] min-h-[75vh]">
      {toast && (
        <div className="fixed top-20 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="max-w-[520px] mx-auto px-4 sm:px-6 pt-12 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-[32px] font-semibold tracking-tight text-[#1D1D1F] mb-2">
            Workspace Box
          </h1>
          <p className="text-[14px] text-[#6E6E73]">
            Persistent, PIN-protected shared folders for ongoing collaboration.
          </p>
        </div>

        <div className="apple-card rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/70">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setAuthError("");
              }}
              className={`py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                mode === "login"
                  ? "bg-white text-[#1D1D1F] shadow-xs"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              Open Existing Box
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("create");
                setAuthError("");
              }}
              className={`py-2 rounded-lg text-[13px] font-semibold transition-colors ${
                mode === "create"
                  ? "bg-white text-[#1D1D1F] shadow-xs"
                  : "text-[#6E6E73] hover:text-[#1D1D1F]"
              }`}
            >
              Create New Box
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label
                htmlFor="workspace-name-input"
                className="block text-[13px] font-medium text-[#1D1D1F] mb-1"
              >
                Box Name
              </label>
              <input
                id="workspace-name-input"
                type="text"
                required
                minLength={3}
                maxLength={40}
                placeholder="e.g., studio-deliverables"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[14px] text-[#1D1D1F] focus:bg-white focus:border-[#0066CC]"
              />
            </div>

            <div>
              <label
                htmlFor="workspace-pin-input"
                className="block text-[13px] font-medium text-[#1D1D1F] mb-1"
              >
                Security PIN
              </label>
              <input
                id="workspace-pin-input"
                type="password"
                required
                minLength={4}
                maxLength={32}
                placeholder="At least 4 characters"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[14px] text-[#1D1D1F] focus:bg-white focus:border-[#0066CC]"
              />
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[12px] flex items-start gap-2"
              >
                <AlertCircle size={15} className="shrink-0 mt-0.5 text-red-600" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white font-semibold text-[14px] transition-colors flex items-center justify-center gap-2"
            >
              <Lock size={15} />
              {authLoading
                ? "Verifying..."
                : mode === "login"
                ? "Unlock Workspace Box"
                : "Create Workspace Box"}
            </button>
          </form>

          <p className="text-[11px] text-[#6E6E73] leading-relaxed">
            Anyone with the Box Name and PIN can view, upload, and delete files inside that Box. Use a strong PIN and share it only with intended collaborators.
          </p>
        </div>
      </div>
    </div>
  );
}
