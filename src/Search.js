import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Download,
  Eye,
  FileText,
  Flag,
  Clock,
  AlertCircle,
  RefreshCw,
  ShieldAlert,
  CheckCircle2,
  X,
} from "lucide-react";
import Toast from "./Toast";
import config from "./config";
import { trackEvent } from "./analytics";

function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(2)} MB`;
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState("");
  const [activeIdentifier, setActiveIdentifier] = useState("");
  const [result, setResult] = useState(null);
  const [statusState, setStatusState] = useState("idle"); // "idle" | "loading" | "success" | "not_found" | "rate_limited" | "error"
  const [errorMessage, setErrorMessage] = useState("");
  const [toast, setToast] = useState(null);

  // Abuse Reporting Modal State
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportCategory, setReportCategory] = useState("copyright");
  const [reportReason, setReportReason] = useState("");
  const [reportContact, setReportContact] = useState("");
  const [reportConfirmation, setReportConfirmation] = useState(null);
  const [submittingReport, setSubmittingReport] = useState(false);

  const triggerToast = useCallback((message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const lookupTransfer = useCallback(async (identifierInput, isToken = false) => {
    const cleaned = String(identifierInput || "").trim();
    if (!isToken && (!/^\d{6}$/.test(cleaned))) {
      setStatusState("error");
      setErrorMessage("Please enter a valid 6-digit numerical retrieval code.");
      setResult(null);
      return;
    }

    setStatusState("loading");
    setErrorMessage("");
    setReportConfirmation(null);

    try {
      const endpoint = isToken
        ? `${config.API_BASE_URL}/api/uploads/${encodeURIComponent(
            cleaned
          )}?token=${encodeURIComponent(cleaned)}`
        : `${config.API_BASE_URL}/api/uploads/${encodeURIComponent(cleaned)}`;

      const res = await fetch(endpoint);

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setResult(null);
        setStatusState("rate_limited");
        setErrorMessage(
          data.message ||
            "Too many lookup attempts from your network. Please wait a minute and try again."
        );
        return;
      }

      if (res.status === 404 || res.status === 410) {
        setResult(null);
        setStatusState("not_found");
        setErrorMessage(
          "No active transfer was found for this code. It may have expired after its 48-hour window, been revoked by the sender, or been mistyped."
        );
        return;
      }

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setResult(data);
      setActiveIdentifier(cleaned);
      setStatusState("success");

      trackEvent("retrieval_succeeded", {
        file_count: data.fileCount || data.files?.length || 1,
        transfer_type: "anonymous",
        status: "available",
      });
    } catch {
      setResult(null);
      setStatusState("error");
      setErrorMessage(
        "Unable to reach the Fylshare retrieval service. Check your connection and try again."
      );
    }
  }, []);

  // Support ?token=... or ?code=... and scrub credentials from URL bar immediately to prevent referrer/history leakage
  useEffect(() => {
    const urlToken = searchParams.get("token");
    const urlCode = searchParams.get("code") || searchParams.get("q");

    if (urlToken && urlToken.trim().length >= 16) {
      const cleanToken = urlToken.trim();
      if (window.history?.replaceState) {
        window.history.replaceState({}, "", "/search");
      }
      lookupTransfer(cleanToken, true);
    } else if (urlCode && /^\d{6}$/.test(urlCode.trim())) {
      const cleanCode = urlCode.trim();
      setCode(cleanCode);
      if (window.history?.replaceState) {
        window.history.replaceState({}, "", "/search");
      }
      lookupTransfer(cleanCode, false);
    }
  }, [searchParams, lookupTransfer]);

  const handleFileAction = async (fileObj, mode = "download") => {
    try {
      trackEvent("download_requested", {
        transfer_type: "anonymous",
        status: mode,
      });

      const downloadPath =
        fileObj.downloadEndpoint ||
        `/api/uploads/${encodeURIComponent(activeIdentifier || code)}/files/${
          fileObj.index || 0
        }/download`;

      const res = await fetch(
        `${config.API_BASE_URL}${downloadPath}?json=true&mode=${mode}`
      );

      if (res.status === 410 || res.status === 404) {
        setResult(null);
        setStatusState("not_found");
        setErrorMessage("This transfer has expired and its files are no longer available.");
        return;
      }

      if (!res.ok) {
        triggerToast("Could not authorize file download. Please retry.", "error");
        return;
      }

      const data = await res.json();
      if (!data.downloadUrl) {
        triggerToast("Download URL unavailable.", "error");
        return;
      }

      if (mode === "inline" && !data.forceAttachment) {
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
      triggerToast("Network error while requesting file download.", "error");
    }
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    if (!reportReason.trim() || reportReason.trim().length < 5) return;

    setSubmittingReport(true);
    try {
      const res = await fetch(`${config.API_BASE_URL}/api/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: /^\d{6}$/.test(activeIdentifier) ? activeIdentifier : code,
          token: activeIdentifier.length >= 16 ? activeIdentifier : undefined,
          category: reportCategory,
          reason: reportReason.trim(),
          reporterContact: reportContact.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setReportConfirmation(data.reportId || "SUBMITTED");
        setReportReason("");
      } else {
        triggerToast(data.error || "Could not submit report.", "error");
      }
    } catch {
      triggerToast("Network error while submitting report.", "error");
    } finally {
      setSubmittingReport(false);
    }
  };

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

      <div className="max-w-[760px] mx-auto px-4 sm:px-6 pt-12 pb-20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F] mb-2">
            Receive Files
          </h1>
          <p className="text-[15px] text-[#6E6E73]">
            Enter the 6-digit retrieval code shared by the sender.
          </p>
        </div>

        {/* Code Input Card */}
        <div className="apple-card rounded-2xl p-6 sm:p-8 mb-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupTransfer(code, false);
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            <div className="flex-1">
              <label htmlFor="retrieval-code-input" className="sr-only">
                6-digit retrieval code
              </label>
              <input
                id="retrieval-code-input"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                aria-label="Enter 6-digit code"
                className="w-full px-4 py-3.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[20px] font-mono tracking-[0.22em] text-center sm:text-left text-[#1D1D1F] placeholder-[#6E6E73]/60 focus:bg-white focus:border-[#0066CC]"
              />
            </div>
            <button
              type="submit"
              disabled={statusState === "loading"}
              className="py-3.5 px-7 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] disabled:opacity-50 text-white font-semibold text-[15px] transition-colors shrink-0"
            >
              {statusState === "loading" ? "Checking..." : "Continue"}
            </button>
          </form>

          {/* Status States: Not Found / Expired / Rate Limited / Error */}
          {(statusState === "not_found" ||
            statusState === "rate_limited" ||
            statusState === "error") && (
            <div
              role="alert"
              className="mt-5 p-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] flex items-start gap-3 text-[13px]"
            >
              <AlertCircle
                size={18}
                className={
                  statusState === "not_found"
                    ? "text-[#6E6E73] shrink-0 mt-0.5"
                    : "text-red-600 shrink-0 mt-0.5"
                }
              />
              <div className="flex-1 space-y-2">
                <p className="font-medium text-[#1D1D1F]">{errorMessage}</p>
                {statusState === "error" && (
                  <button
                    type="button"
                    onClick={() => lookupTransfer(activeIdentifier || code, activeIdentifier.length >= 16)}
                    className="inline-flex items-center gap-1.5 text-[#0066CC] font-semibold hover:underline"
                  >
                    <RefreshCw size={13} /> Retry lookup
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Authorized Transfer Result Card */}
        {statusState === "success" && result && (
          <div className="apple-card rounded-2xl p-6 sm:p-8 space-y-6" aria-live="polite">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#D2D2D7]/70 pb-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6E6E73]">
                  Transfer Package
                </p>
                <h2 className="text-[20px] font-semibold text-[#1D1D1F] mt-0.5">
                  {result.name || "Untitled transfer"}
                </h2>
                {result.expiresAt && (
                  <p className="text-[12px] text-[#6E6E73] flex items-center gap-1.5 mt-1">
                    <Clock size={13} /> Expires{" "}
                    {new Date(result.expiresAt).toLocaleString()}
                  </p>
                )}
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] font-semibold">
                {result.files?.length || 0} file(s) available
              </span>
            </div>

            {result.scanStatus === "uninspectable_encrypted_archive" && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[12px] flex items-start gap-2.5">
                <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-700" />
                <span>
                  This transfer contains a password-protected archive whose internal contents cannot be inspected automatically. Only open archives from senders you trust.
                </span>
              </div>
            )}

            <ul className="space-y-3">
              {result.files?.map((f, index) => (
                <li
                  key={f.fileId || index}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7]/70"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-[#D2D2D7] flex items-center justify-center text-[#1D1D1F] shrink-0">
                      <FileText size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#1D1D1F] truncate">
                        {f.name}
                      </p>
                      <p className="text-[12px] text-[#6E6E73]">
                        {formatBytes(f.size)}
                        {f.forceAttachment ? " · Attachment download only" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {!f.forceAttachment && (
                      <button
                        type="button"
                        onClick={() => handleFileAction(f, "inline")}
                        className="px-3.5 py-2 rounded-lg bg-white border border-[#D2D2D7] hover:bg-[#E8E8ED]/60 text-[#1D1D1F] text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye size={14} /> Preview
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleFileAction(f, "download")}
                      className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white text-[12px] font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Download size={14} /> Download
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-[#D2D2D7]/70 flex flex-wrap items-center justify-between gap-3 text-[12px] text-[#6E6E73]">
              <span>
                Only open files from people you trust.
              </span>
              <button
                type="button"
                onClick={() => setShowReportModal(true)}
                className="text-red-600 hover:underline font-medium flex items-center gap-1.5"
              >
                <Flag size={13} /> Report Abuse or Prohibited Content
              </button>
            </div>
          </div>
        )}

        {/* Secondary Guidance when Idle */}
        {statusState === "idle" && (
          <div className="apple-surface rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#6E6E73]">
            <div>
              <p className="font-semibold text-[#1D1D1F]">Need to send files instead?</p>
              <p className="mt-0.5">
                Upload up to 1 GB and generate a 6-digit retrieval code in seconds.
              </p>
            </div>
            <Link
              to="/"
              className="px-4 py-2 rounded-lg bg-white border border-[#D2D2D7] text-[#1D1D1F] font-semibold text-[12px] hover:bg-[#E8E8ED]/40 shrink-0"
            >
              Go to Send Files
            </Link>
          </div>
        )}
      </div>

      {/* Abuse Report Modal */}
      {showReportModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-abuse-title"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="bg-white border border-[#D2D2D7] rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#D2D2D7]/70 pb-3">
              <h3
                id="report-abuse-title"
                className="text-[17px] font-semibold text-[#1D1D1F]"
              >
                Report Abuse or Prohibited Content
              </h3>
              <button
                type="button"
                onClick={() => setShowReportModal(false)}
                className="text-[#6E6E73] hover:text-[#1D1D1F] p-1"
                aria-label="Close report dialog"
              >
                <X size={18} />
              </button>
            </div>

            {reportConfirmation ? (
              <div className="space-y-3 py-2 text-[13px]">
                <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 size={18} /> Report submitted
                </div>
                <p className="text-[#6E6E73] leading-relaxed">
                  Reference ID: <code className="font-mono text-[#1D1D1F]">{reportConfirmation}</code>. Reported transfers are queued for moderation and may be automatically quarantined pending review.
                </p>
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="w-full py-2.5 rounded-xl bg-[#1D1D1F] text-white font-semibold text-[13px]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReport} className="space-y-4 text-[13px]">
                <div>
                  <label
                    htmlFor="report-category"
                    className="block font-medium text-[#1D1D1F] mb-1"
                  >
                    Issue category
                  </label>
                  <select
                    id="report-category"
                    value={reportCategory}
                    onChange={(e) => setReportCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  >
                    <option value="copyright">Copyright or IP infringement</option>
                    <option value="malware">Malware or harmful file</option>
                    <option value="privacy">Privacy violation / personal data</option>
                    <option value="unlawful">Unlawful or prohibited content</option>
                    <option value="other">Other policy violation</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="report-reason"
                    className="block font-medium text-[#1D1D1F] mb-1"
                  >
                    Description <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="report-reason"
                    required
                    minLength={5}
                    rows={3}
                    placeholder="Describe why this transfer violates Fylshare's Acceptable Use Policy..."
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="report-contact"
                    className="block font-medium text-[#1D1D1F] mb-1"
                  >
                    Contact email{" "}
                    <span className="text-[#6E6E73] font-normal">
                      (optional, for takedown follow-up)
                    </span>
                  </label>
                  <input
                    id="report-contact"
                    type="email"
                    placeholder="you@example.com"
                    value={reportContact}
                    onChange={(e) => setReportContact(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2 rounded-lg border border-[#D2D2D7] text-[#1D1D1F] font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReport}
                    className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold"
                  >
                    {submittingReport ? "Submitting..." : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
