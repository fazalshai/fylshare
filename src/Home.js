import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  Copy,
  Check,
  QrCode,
  ArrowRight,
  X,
  FileText,
  RefreshCw,
  Trash2,
  ShieldAlert,
  Clock,
  Info,
} from "lucide-react";
import Toast from "./Toast";
import config from "./config";
import { trackEvent, getSizeBucket } from "./analytics";

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 1024 * 1024 * 1024; // 1 GB
const BLOCKED_EXTENSIONS =
  /\.(exe|dll|bat|cmd|scr|vbs|vbe|jse|wsf|wsh|msi|msp|com|pif|cpl|hta|ps1|reg|apk|dmg|pkg|deb|rpm|iso|img)$/i;

const RECENT_STORAGE_KEY = "fylshare_device_transfers_v2";

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

function formatExpiryDate(isoString) {
  if (!isoString) return "48 hours from upload";
  try {
    return new Date(isoString).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return isoString;
  }
}

export default function Home() {
  const navigate = useNavigate();
  const xhrRef = useRef(null);

  const [label, setLabel] = useState("");
  const [files, setFiles] = useState([]);
  const [quickCode, setQuickCode] = useState("");
  const [toast, setToast] = useState(null);

  // Upload lifecycle state: "idle" | "uploading" | "processing" | "error" | "cancelled" | "success"
  const [uploadState, setUploadState] = useState("idle");
  const [bytesUploadedPct, setBytesUploadedPct] = useState(0);
  const [uploadErrorMsg, setUploadErrorMsg] = useState("");

  // Confirmed transfer result from server
  const [activeTransfer, setActiveTransfer] = useState(null);
  const [recentTransfers, setRecentTransfers] = useState([]);
  const [copiedKey, setCopiedKey] = useState(null);
  const [revokingCode, setRevokingCode] = useState(null);

  // Load and prune expired local transfers on mount
  useEffect(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(RECENT_STORAGE_KEY) || "[]");
      const now = Date.now();
      const valid = Array.isArray(raw)
        ? raw.filter((item) => {
            if (!item || item.revoked) return false;
            if (item.expiresAt && new Date(item.expiresAt).getTime() <= now) {
              return false;
            }
            return true;
          })
        : [];
      setRecentTransfers(valid.slice(0, 5));
      localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(valid.slice(0, 5)));
    } catch {
      setRecentTransfers([]);
    }
  }, []);

  const triggerToast = (message, type = "info", duration = 5000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  const onDrop = (acceptedFiles) => {
    setUploadErrorMsg("");
    const combined = [...files, ...acceptedFiles];

    if (combined.length > MAX_FILES) {
      setUploadErrorMsg(`You can upload up to ${MAX_FILES} files per transfer.`);
      return;
    }

    const blocked = combined.find((f) => BLOCKED_EXTENSIONS.test(f.name || ""));
    if (blocked) {
      setUploadErrorMsg(
        `"${blocked.name}" is an executable or installer format that is not permitted by our supported file policy.`
      );
      return;
    }

    const totalSize = combined.reduce((sum, f) => sum + (f.size || 0), 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      setUploadErrorMsg("Total transfer size exceeds the 1 GB maximum limit.");
      return;
    }

    setFiles(combined);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
    maxFiles: MAX_FILES,
  });

  const removeSelectedFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setUploadErrorMsg("");
  };

  const handleQuickReceive = (e) => {
    e.preventDefault();
    const cleaned = quickCode.replace(/\D/g, "").trim();
    if (cleaned.length !== 6) {
      triggerToast("Enter a valid 6-digit retrieval code.", "error");
      return;
    }
    navigate(`/search?code=${cleaned}`);
  };

  const copyText = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setUploadState("cancelled");
    setBytesUploadedPct(0);
    setUploadErrorMsg("Upload cancelled.");
  };

  const handleUploadSubmit = async () => {
    if (files.length === 0) {
      setUploadErrorMsg("Select at least one file to upload.");
      return;
    }

    const totalSize = files.reduce((sum, f) => sum + (f.size || 0), 0);
    if (totalSize > MAX_TOTAL_BYTES) {
      setUploadErrorMsg("Total size exceeds the 1 GB limit.");
      return;
    }

    setUploadErrorMsg("");
    setUploadState("uploading");
    setBytesUploadedPct(0);

    trackEvent("upload_started", {
      file_count: files.length,
      size_bucket: getSizeBucket(totalSize),
      transfer_type: "anonymous",
    });

    const formData = new FormData();
    formData.append("name", label.trim().slice(0, 80));
    formData.append("size", String(totalSize));
    files.forEach((file) => formData.append("files", file));

    try {
      const responseData = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhrRef.current = xhr;
        xhr.open("POST", `${config.API_BASE_URL}/api/uploads`, true);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && event.total > 0) {
            const actualPct = Math.round((event.loaded / event.total) * 100);
            setBytesUploadedPct(actualPct);
            if (event.loaded >= event.total) {
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
            reject(new Error(parsed.error || "Upload could not be completed."));
          }
        };

        xhr.onerror = () => {
          xhrRef.current = null;
          reject(new Error("Network connection failed during upload."));
        };

        xhr.onabort = () => {
          xhrRef.current = null;
          reject(new Error("ABORTED"));
        };

        xhr.send(formData);
      });

      const shareUrl = responseData.shareToken
        ? `${window.location.origin}/search?token=${encodeURIComponent(
            responseData.shareToken
          )}`
        : `${window.location.origin}/search?code=${encodeURIComponent(responseData.code)}`;

      const ticket = {
        transferId: responseData.transferId,
        code: responseData.code,
        shareUrl,
        revokeToken: responseData.revokeToken || null,
        label: label.trim() || "Untitled transfer",
        fileCount: responseData.fileCount || files.length,
        totalBytes: responseData.totalBytes || totalSize,
        createdAt: responseData.createdAt || new Date().toISOString(),
        expiresAt:
          responseData.expiresAt ||
          new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
        scanStatus: responseData.scanStatus || "passed",
      };

      setActiveTransfer(ticket);
      setUploadState("success");
      setFiles([]);
      setLabel("");

      // Save minimized record to local device list
      const updatedRecent = [
        ticket,
        ...recentTransfers.filter((t) => t.code !== ticket.code),
      ].slice(0, 5);
      setRecentTransfers(updatedRecent);
      try {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updatedRecent));
      } catch {
        // Ignore quota errors
      }

      trackEvent("upload_completed", {
        file_count: ticket.fileCount,
        size_bucket: getSizeBucket(ticket.totalBytes),
        transfer_type: "anonymous",
        status: "available",
      });
    } catch (err) {
      if (err.message === "ABORTED") return;
      setUploadState("error");
      setUploadErrorMsg(err.message || "Upload failed. Please retry.");
      trackEvent("upload_failed", {
        file_count: files.length,
        size_bucket: getSizeBucket(totalSize),
        transfer_type: "anonymous",
        error_category: "upload_error",
      });
    }
  };

  // Clear from local browser storage ONLY (does NOT delete files on server)
  const handleClearLocalDeviceHistory = (codeToClear = null) => {
    const next = codeToClear
      ? recentTransfers.filter((item) => item.code !== codeToClear)
      : [];
    setRecentTransfers(next);
    try {
      if (next.length === 0) {
        localStorage.removeItem(RECENT_STORAGE_KEY);
      } else {
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
      }
    } catch {
      // Ignore
    }
    triggerToast(
      "Removed from this browser's local list. Server files remain active until they expire or are revoked.",
      "info"
    );
  };

  // Revoke transfer & delete actual stored files on the server
  const handleRevokeServerTransfer = async (transferItem) => {
    if (!transferItem?.code || !transferItem?.revokeToken) {
      triggerToast("Revocation token is unavailable for this transfer.", "error");
      return;
    }
    if (
      !window.confirm(
        `Delete stored files for code ${transferItem.code} from Fylshare servers immediately? Recipients will no longer be able to download them.`
      )
    ) {
      return;
    }

    setRevokingCode(transferItem.code);
    try {
      const res = await fetch(
        `${config.API_BASE_URL}/api/uploads/${encodeURIComponent(
          transferItem.code
        )}/revoke`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Revoke-Token": transferItem.revokeToken,
          },
          body: JSON.stringify({ revokeToken: transferItem.revokeToken }),
        }
      );

      if (res.ok) {
        const next = recentTransfers.filter((t) => t.code !== transferItem.code);
        setRecentTransfers(next);
        localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(next));
        if (activeTransfer?.code === transferItem.code) {
          setActiveTransfer(null);
          setUploadState("idle");
        }
        trackEvent("deletion_completed", {
          transfer_type: "anonymous",
          status: "revoked",
        });
        triggerToast(
          "Transfer revoked and stored files deleted from Fylshare servers.",
          "success"
        );
      } else {
        const errData = await res.json().catch(() => ({}));
        triggerToast(
          errData.error || "Could not revoke transfer on server.",
          "error"
        );
      }
    } catch {
      triggerToast("Network error while revoking transfer.", "error");
    } finally {
      setRevokingCode(null);
    }
  };

  const totalSelectedBytes = files.reduce((sum, f) => sum + (f.size || 0), 0);

  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F]">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-4 z-50">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      {/* Main Hero & Transfer Workspace */}
      <section className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-16">
        {/* Restrained Hero Header */}
        <div className="max-w-2xl mx-auto text-center mb-10">
          <h1 className="text-[34px] sm:text-[48px] font-semibold tracking-tight text-[#1D1D1F] leading-[1.1] mb-3">
            Files shared. Simply.
          </h1>
          <p className="text-[16px] sm:text-[18px] text-[#6E6E73] font-normal leading-relaxed">
            Upload your files. Share a code or QR. No account required.
          </p>
        </div>

        {/* Two-Column Core Interaction: Send (Left/Main) + Receive (Right/Side) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* SEND PANEL (7 columns on desktop) */}
          <div className="lg:col-span-7 apple-card rounded-2xl p-6 sm:p-8">
            {activeTransfer ? (
              <div className="space-y-6" aria-live="polite">
                <div className="flex items-center justify-between border-b border-[#D2D2D7]/70 pb-4">
                  <div>
                    <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full mb-1">
                      Transfer Available
                    </span>
                    <h2 className="text-[20px] font-semibold text-[#1D1D1F]">
                      Ready to share
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTransfer(null);
                      setUploadState("idle");
                    }}
                    className="text-[13px] font-medium text-[#0066CC] hover:text-[#0055B3]"
                  >
                    Send another file
                  </button>
                </div>

                {/* Code + QR Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center bg-[#F5F5F7] rounded-2xl p-5 border border-[#D2D2D7]/60">
                  <div className="sm:col-span-7 space-y-4">
                    <div>
                      <p className="text-[12px] font-medium text-[#6E6E73] uppercase tracking-wider">
                        6-Digit Retrieval Code
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          data-testid="generated-code"
                          className="text-[36px] sm:text-[42px] font-semibold tracking-[0.14em] font-mono text-[#1D1D1F]"
                        >
                          {activeTransfer.code}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyText(activeTransfer.code, "code")}
                          className="px-3.5 py-2 rounded-lg bg-white border border-[#D2D2D7] hover:bg-[#E8E8ED]/50 text-[12px] font-semibold text-[#1D1D1F] flex items-center gap-1.5 transition-colors"
                        >
                          {copiedKey === "code" ? (
                            <>
                              <Check size={14} className="text-emerald-600" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy Code
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[11px] text-[#6E6E73] mt-1">
                        Short 6-digit codes are for quick convenience. For stronger protection, share the tokenized link or QR below.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[12px] font-medium text-[#6E6E73]">
                        Direct Retrieval Link
                      </p>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          readOnly
                          value={activeTransfer.shareUrl}
                          aria-label="Direct retrieval link"
                          className="w-full px-3 py-2 rounded-lg bg-white border border-[#D2D2D7] text-[12px] text-[#1D1D1F] font-mono truncate"
                        />
                        <button
                          type="button"
                          onClick={() => copyText(activeTransfer.shareUrl, "link")}
                          className="px-3.5 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[12px] font-semibold shrink-0 flex items-center gap-1.5 transition-colors"
                        >
                          {copiedKey === "link" ? (
                            <>
                              <Check size={14} /> Copied
                            </>
                          ) : (
                            <>
                              <Copy size={14} /> Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="sm:col-span-5 flex flex-col items-center justify-center bg-white p-4 rounded-xl border border-[#D2D2D7]/70">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=148x148&margin=6&data=${encodeURIComponent(
                        activeTransfer.shareUrl
                      )}`}
                      alt={`QR code for retrieval code ${activeTransfer.code}`}
                      className="w-32 h-32"
                    />
                    <span className="text-[11px] font-medium text-[#6E6E73] mt-2 flex items-center gap-1">
                      <QrCode size={12} /> Scan with camera to receive
                    </span>
                  </div>
                </div>

                {/* Exact Server Expiry & Revoke Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[12px] text-[#6E6E73]">
                  <div className="flex items-center gap-2">
                    <Clock size={14} className="text-[#6E6E73] shrink-0" />
                    <span>
                      {activeTransfer.fileCount} file(s) ({formatBytes(activeTransfer.totalBytes)}) · Expires{" "}
                      <strong className="text-[#1D1D1F]">
                        {formatExpiryDate(activeTransfer.expiresAt)}
                      </strong>
                    </span>
                  </div>

                  {activeTransfer.revokeToken && (
                    <button
                      type="button"
                      onClick={() => handleRevokeServerTransfer(activeTransfer)}
                      disabled={revokingCode === activeTransfer.code}
                      className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1 self-start sm:self-auto"
                    >
                      <Trash2 size={13} />
                      {revokingCode === activeTransfer.code
                        ? "Deleting stored files..."
                        : "Revoke transfer & delete stored files"}
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                <div className="flex items-baseline justify-between">
                  <h2 className="text-[19px] font-semibold text-[#1D1D1F]">
                    Send Files
                  </h2>
                  <span className="text-[12px] text-[#6E6E73]">
                    Up to 10 files · 1 GB max
                  </span>
                </div>

                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`rounded-2xl border border-dashed p-7 sm:p-9 text-center transition-colors cursor-pointer ${
                    isDragActive
                      ? "border-[#0066CC] bg-[#0066CC]/[0.04]"
                      : "border-[#D2D2D7] bg-[#F5F5F7]/70 hover:bg-[#F5F5F7] hover:border-[#6E6E73]"
                  }`}
                >
                  <label htmlFor="file-upload-input" className="sr-only">
                    Select files to upload
                  </label>
                  <input
                    {...getInputProps({
                      id: "file-upload-input",
                      "aria-label": "Select files to upload",
                    })}
                  />
                  <div className="w-11 h-11 rounded-full bg-white border border-[#D2D2D7] flex items-center justify-center mx-auto mb-3 text-[#0066CC] shadow-sm">
                    <Upload size={20} />
                  </div>
                  <p className="text-[15px] font-medium text-[#1D1D1F]">
                    Drag and drop files here, or{" "}
                    <span className="text-[#0066CC] underline">browse</span>
                  </p>
                  <p className="text-[12px] text-[#6E6E73] mt-1.5 max-w-md mx-auto leading-relaxed">
                    Supported: PDF, Office docs, images, audio/video, ZIP/7Z/TAR archives, CAD/design, and source code. Raw executables (.exe, .bat, .msi, .apk, .dmg) are blocked.
                  </p>
                </div>

                {/* Selected Files List */}
                {files.length > 0 && (
                  <div className="rounded-xl border border-[#D2D2D7] bg-[#F5F5F7]/50 p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-[12px] font-medium text-[#6E6E73] pb-1 border-b border-[#D2D2D7]/60">
                      <span>
                        {files.length} of {MAX_FILES} files selected
                      </span>
                      <span>
                        {formatBytes(totalSelectedBytes)} / 1 GB
                      </span>
                    </div>
                    <ul className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                      {files.map((file, idx) => (
                        <li
                          key={`${file.name}-${idx}`}
                          className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-[#D2D2D7]/60 text-[13px]"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText size={15} className="text-[#6E6E73] shrink-0" />
                            <span className="truncate text-[#1D1D1F] font-medium">
                              {file.name}
                            </span>
                            <span className="text-[11px] text-[#6E6E73] shrink-0">
                              ({formatBytes(file.size)})
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(idx)}
                            disabled={
                              uploadState === "uploading" ||
                              uploadState === "processing"
                            }
                            className="text-[#6E6E73] hover:text-red-600 p-1 rounded"
                            aria-label={`Remove ${file.name}`}
                          >
                            <X size={14} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optional Transfer Label */}
                <div>
                  <label
                    htmlFor="transfer-label-input"
                    className="block text-[13px] font-medium text-[#1D1D1F] mb-1"
                  >
                    Transfer label{" "}
                    <span className="text-[#6E6E73] font-normal">(optional)</span>
                  </label>
                  <input
                    id="transfer-label-input"
                    type="text"
                    maxLength={80}
                    placeholder="e.g., Q4 Slides, Architecture Drafts"
                    value={label}
                    onChange={(e) => setLabel(e.target.value)}
                    disabled={
                      uploadState === "uploading" || uploadState === "processing"
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D2D2D7] text-[14px] text-[#1D1D1F] placeholder-[#6E6E73]/70 focus:border-[#0066CC]"
                  />
                  <p className="text-[11px] text-[#6E6E73] mt-1">
                    Visible to anyone with your retrieval code. Avoid sensitive personal information in the label.
                  </p>
                </div>

                {/* Validation / Error Banner */}
                {uploadErrorMsg && (
                  <div
                    role="alert"
                    className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-[13px]"
                  >
                    <ShieldAlert size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <div className="flex-1">{uploadErrorMsg}</div>
                  </div>
                )}

                {/* Real Upload Progress State */}
                {(uploadState === "uploading" || uploadState === "processing") && (
                  <div
                    role="status"
                    aria-live="polite"
                    className="p-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-[13px] font-medium text-[#1D1D1F]">
                      <span>
                        {uploadState === "uploading"
                          ? `Uploading bytes (${bytesUploadedPct}%)`
                          : "Bytes sent — verifying & storing on server..."}
                      </span>
                      <button
                        type="button"
                        onClick={handleCancelUpload}
                        className="text-[12px] font-medium text-red-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </div>
                    <div className="w-full h-2 bg-[#D2D2D7] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0066CC] transition-all duration-150 rounded-full"
                        style={{ width: `${bytesUploadedPct}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Primary Action Button */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleUploadSubmit}
                    disabled={
                      uploadState === "uploading" || uploadState === "processing"
                    }
                    className="w-full py-3 px-5 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white font-semibold text-[15px] transition-colors flex items-center justify-center gap-2"
                  >
                    {uploadState === "error" || uploadState === "cancelled" ? (
                      <>
                        <RefreshCw size={16} /> Retry Upload
                      </>
                    ) : (
                      "Upload & Generate Code"
                    )}
                  </button>
                </div>

                {/* Proportionate Contextual Notice */}
                <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                  Only upload content you own or have the legal right to share. Standard transfers expire automatically after 48 hours. By uploading, you agree to our{" "}
                  <Link to="/terms" className="text-[#0066CC] hover:underline">
                    Terms &amp; Acceptable Use Policy
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-[#0066CC] hover:underline">
                    Privacy Notice
                  </Link>
                  .
                </p>
              </div>
            )}
          </div>

          {/* RECEIVE & RECENT PANEL (5 columns on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Receive by Code Card */}
            <div className="apple-card rounded-2xl p-6 sm:p-7 space-y-4">
              <div>
                <h2 className="text-[19px] font-semibold text-[#1D1D1F]">
                  Receive Files
                </h2>
                <p className="text-[13px] text-[#6E6E73] mt-0.5">
                  Have a 6-digit retrieval code? Enter it to view and download.
                </p>
              </div>

              <form onSubmit={handleQuickReceive} className="space-y-3">
                <div>
                  <label htmlFor="quick-code-input" className="sr-only">
                    6-digit retrieval code
                  </label>
                  <input
                    id="quick-code-input"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    placeholder="6-digit code"
                    value={quickCode}
                    onChange={(e) =>
                      setQuickCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full px-4 py-3 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[18px] font-mono tracking-[0.2em] text-center text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:bg-white focus:border-[#0066CC]"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-[#1D1D1F] hover:bg-black text-white font-semibold text-[14px] transition-colors flex items-center justify-center gap-1.5"
                >
                  Access Files <ArrowRight size={15} />
                </button>
              </form>
            </div>

            {/* Compact Privacy & Operator Visibility Summary */}
            <div className="apple-surface rounded-2xl p-5 space-y-2.5 text-[12px] text-[#6E6E73]">
              <div className="flex items-center gap-2 text-[#1D1D1F] font-semibold text-[13px]">
                <Info size={15} className="text-[#0066CC] shrink-0" />
                <span>How your transfer is handled</span>
              </div>
              <ul className="space-y-1.5 leading-relaxed list-disc pl-4">
                <li>
                  <strong>Storage &amp; Expiry:</strong> Files are stored privately on Google Cloud Storage and automatically deleted 48 hours after upload.
                </li>
                <li>
                  <strong>Metadata:</strong> We store file sizes, timestamps, optional transfer labels, and approximate country (derived from network headers without GPS).
                </li>
                <li>
                  <strong>Operator Access:</strong> Fylshare encrypts data in transit (TLS 1.3) and at rest, but is not a zero-knowledge service. Authorized administrators may review reported transfers for abuse moderation.
                </li>
              </ul>
            </div>

            {/* Recent Transfers on This Device */}
            {recentTransfers.length > 0 && (
              <div className="apple-card rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[14px] font-semibold text-[#1D1D1F]">
                    Recent transfers on this device
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleClearLocalDeviceHistory(null)}
                    className="text-[12px] text-[#6E6E73] hover:text-[#1D1D1F]"
                  >
                    Clear local list
                  </button>
                </div>

                <p className="text-[11px] text-[#6E6E73] leading-relaxed">
                  Saved in this browser’s local storage only. Clearing this list from your browser does not delete files stored on Fylshare servers.
                </p>

                <ul className="space-y-2">
                  {recentTransfers.map((item) => (
                    <li
                      key={item.code}
                      className="p-3 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/70 text-[12px] space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="px-2 py-0.5 rounded bg-white border border-[#D2D2D7] font-mono font-semibold text-[#1D1D1F]">
                            {item.code}
                          </span>
                          <span className="truncate font-medium text-[#1D1D1F]">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#6E6E73] shrink-0">
                          {item.fileCount} file(s)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#D2D2D7]/50 text-[11px]">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveTransfer(item)}
                            className="text-[#0066CC] font-medium hover:underline"
                          >
                            View QR &amp; Code
                          </button>
                          <button
                            type="button"
                            onClick={() => handleClearLocalDeviceHistory(item.code)}
                            className="text-[#6E6E73] hover:text-[#1D1D1F]"
                          >
                            Remove from browser
                          </button>
                        </div>

                        {item.revokeToken && (
                          <button
                            type="button"
                            onClick={() => handleRevokeServerTransfer(item)}
                            disabled={revokingCode === item.code}
                            className="text-red-600 hover:underline font-medium"
                          >
                            {revokingCode === item.code
                              ? "Deleting..."
                              : "Delete server files"}
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Secondary Workflow & Support Section */}
      <section className="border-t border-[#D2D2D7]/70 bg-[#F5F5F7] py-16">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-xl">
            <h2 className="text-[24px] sm:text-[28px] font-semibold text-[#1D1D1F] tracking-tight">
              Designed for clarity and predictable retention.
            </h2>
            <p className="text-[15px] text-[#6E6E73] mt-2 leading-relaxed">
              Move documents, archives, and media across devices without creating accounts or leaving files online indefinitely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 border border-[#D2D2D7]/70 space-y-2">
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                1. Validated Upload
              </h3>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                Files up to 1 GB are checked against our supported-type policy and binary header rules before being written to private cloud storage.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D2D2D7]/70 space-y-2">
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                2. Code or Tokenized QR
              </h3>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                Share a 6-digit code for quick manual entry on another computer, or scan the QR code containing a high-entropy retrieval token.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#D2D2D7]/70 space-y-2">
              <h3 className="text-[16px] font-semibold text-[#1D1D1F]">
                3. Automatic 48-Hour Expiry
              </h3>
              <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                Download links stop working as soon as a transfer expires. Stored file objects are automatically purged, or you can revoke them immediately.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
