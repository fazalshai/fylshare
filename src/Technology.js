import React from "react";
import { Server, Database, Lock, Trash2 } from "lucide-react";

export default function Technology() {
  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[920px] mx-auto space-y-12">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Architecture &amp; File Lifecycle
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            How a Transfer Moves Through Fylshare
          </h1>
          <p className="text-[16px] text-[#6E6E73] mt-2 max-w-2xl leading-relaxed">
            Technical documentation of our upload pipeline, storage authorization, and automated expiration workflow.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[16px]">
              <Server size={18} className="text-[#0066CC]" />
              <h2>1. Ingestion &amp; Header Validation</h2>
            </div>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              The React web client uploads multipart streams over HTTPS to our Node.js/Express API. Before writing to storage, the server enforces file-count (max 10) and size (max 1 GB) limits, sanitizes filenames, verifies magic-byte headers for strict formats (PDF, PNG, JPEG, GIF, ZIP/OOXML), and blocks executable binaries (PE/MZ, ELF, Mach-O).
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[16px]">
              <Lock size={18} className="text-[#0066CC]" />
              <h2>2. Private Object Storage</h2>
            </div>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Validated files are written to Google Cloud Storage under internal random identifiers (<code className="font-mono">uploads/tr_.../f_...</code>) rather than user-supplied filenames. Objects remain private; we do not grant public bucket read access on uploaded files.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[16px]">
              <Database size={18} className="text-[#0066CC]" />
              <h2>3. Request-Time Authorization</h2>
            </div>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              When a recipient provides a 6-digit code or 192-bit share token, the API checks MongoDB Atlas to confirm that the transfer status is <code className="font-mono">available</code> and that the current UTC time is prior to <code className="font-mono">expiresAt</code>. Only then does the server mint a V4 signed read URL bounded to at most 10 minutes (or the remaining lifetime of the transfer).
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2">
            <div className="flex items-center gap-2 font-semibold text-[16px]">
              <Trash2 size={18} className="text-[#0066CC]" />
              <h2>4. Idempotent Expiration &amp; Redaction</h2>
            </div>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Download access ceases at the exact <code className="font-mono">expiresAt</code> timestamp even before background cleanup runs. Our hourly cleanup job deletes the primary objects from Google Cloud Storage, records <code className="font-mono">storageDeletedAt</code>, and scrubs the transfer label, filenames, and 6-digit code while preserving non-identifying operational counts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
