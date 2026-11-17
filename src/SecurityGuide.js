import React from "react";
import { Link } from "react-router-dom";
import { Shield, Lock, Clock, FileCheck, AlertTriangle } from "lucide-react";

export default function SecurityGuide() {
  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[920px] mx-auto space-y-12">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Security &amp; Data Handling
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            How Fylshare Protects Transfers
          </h1>
          <p className="text-[16px] text-[#6E6E73] mt-2 max-w-2xl leading-relaxed">
            An accurate overview of our transport security, storage architecture, file validation rules, and access controls—including their practical boundaries.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="apple-card rounded-2xl p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[#0066CC]">
              <Lock size={18} />
            </div>
            <h2 className="text-[17px] font-semibold">
              Encryption in Transit &amp; at Rest
            </h2>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Transfers between your browser and Fylshare use HTTPS (TLS 1.3). Uploaded files are stored in private Google Cloud Storage buckets encrypted at rest using AES-256. Because files are processed by our server prior to storage, Fylshare is not a client-side zero-knowledge or end-to-end encrypted system.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[#0066CC]">
              <FileCheck size={18} />
            </div>
            <h2 className="text-[17px] font-semibold">
              File Signature &amp; Archive Validation
            </h2>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Uploads are checked against an explicit supported-type policy. We inspect file extensions alongside binary magic-byte headers (blocking disguised Windows PE, ELF, and Mach-O executables) and check unencrypted ZIP headers for path traversal and extreme compression ratios.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[#0066CC]">
              <Shield size={18} />
            </div>
            <h2 className="text-[17px] font-semibold">
              Retrieval Codes vs. Tokenized Links
            </h2>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Six-digit codes provide fast manual convenience across devices, backed by per-network rate limiting. Because a 6-digit number has limited entropy, share links and QR codes use a 192-bit cryptographically random token. Do not rely on a 6-digit code alone for highly confidential secrets.
            </p>
          </div>

          <div className="apple-card rounded-2xl p-6 space-y-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#F5F5F7] border border-[#D2D2D7] flex items-center justify-center text-[#0066CC]">
              <Clock size={18} />
            </div>
            <h2 className="text-[17px] font-semibold">
              Time-Bounded Signed Downloads
            </h2>
            <p className="text-[13px] text-[#6E6E73] leading-relaxed">
              Uploaded files are not stored at public URLs. When a recipient requests a download, our server verifies that the transfer has not expired or been revoked, then issues a short-lived signed URL bounded by the remaining transfer lifetime. Active web/script files are served strictly as downloadable attachments.
            </p>
          </div>
        </div>

        <section className="bg-[#F5F5F7] rounded-2xl p-6 sm:p-8 border border-[#D2D2D7] space-y-4">
          <div className="flex items-center gap-2 text-[#1D1D1F] font-semibold text-[16px]">
            <AlertTriangle size={18} className="text-amber-600 shrink-0" />
            <span>Important Security Boundaries</span>
          </div>
          <ul className="list-disc pl-5 space-y-2 text-[13px] text-[#6E6E73] leading-relaxed">
            <li>
              <strong>File inspection is not a guarantee:</strong> Header validation and executable blocking reduce common risks, but cannot guarantee that every document or password-protected archive is free of malicious content. Only open files from senders you trust.
            </li>
            <li>
              <strong>Highly sensitive material:</strong> If you must transmit regulated or highly confidential records, encrypt the file locally (for example, using age, GPG, or a strong encrypted container) before uploading.
            </li>
            <li>
              <strong>Reporting vulnerabilities or abuse:</strong> Contact{" "}
              <a
                href="mailto:fylshare.official@gmail.com"
                className="text-[#0066CC] hover:underline"
              >
                fylshare.official@gmail.com
              </a>{" "}
              or use the{" "}
              <Link to="/search" className="text-[#0066CC] hover:underline">
                Report Abuse
              </Link>{" "}
              tool on the Receive page.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
