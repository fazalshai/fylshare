import React from "react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[820px] mx-auto space-y-10">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Privacy Notice
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            How Fylshare Handles Your Data
          </h1>
          <p className="text-[14px] text-[#6E6E73] mt-2">
            Last updated: November 16, 2026 · Contact:{" "}
            <a
              href="mailto:fylshare.official@gmail.com"
              className="text-[#0066CC] hover:underline"
            >
              fylshare.official@gmail.com
            </a>
          </p>
        </header>

        <section className="space-y-3 text-[15px] leading-relaxed text-[#1D1D1F]">
          <h2 className="text-[20px] font-semibold">1. Overview &amp; Scope</h2>
          <p className="text-[#6E6E73]">
            Fylshare provides temporary file transfers using a 6-digit retrieval code or tokenized QR link, as well as PIN-protected Workspace Boxes. You do not need to create an account or provide an email address to send or receive files. This notice explains what information our systems process, who can access it, and how long it is retained.
          </p>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">2. Information We Process</h2>
          <div className="bg-[#F5F5F7] rounded-2xl p-6 border border-[#D2D2D7]/80 space-y-4 text-[14px]">
            <div>
              <h3 className="font-semibold text-[#1D1D1F]">
                A. Uploaded File Contents
              </h3>
              <p className="text-[#6E6E73] mt-0.5">
                Files you upload are transmitted over HTTPS (TLS 1.3) to our Node.js ingestion service and stored as private objects in Google Cloud Storage (via Firebase). Standard anonymous transfers expire 48 hours after upload, after which download access is disabled and the stored objects are deleted by our automated cleanup job.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1D1D1F]">
                B. Optional Transfer Label &amp; Filenames
              </h3>
              <p className="text-[#6E6E73] mt-0.5">
                If you enter an optional Transfer Label, it is stored alongside the original filenames so the recipient can recognize the package. Do not include sensitive personal information in transfer labels. When an anonymous transfer expires or is revoked, the transfer label, filenames, and retrieval code are scrubbed from the operational record.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1D1D1F]">
                C. Approximate Country &amp; Operational Metadata
              </h3>
              <p className="text-[#6E6E73] mt-0.5">
                We derive an approximate country code (for example, AE or IN) from standard network/CDN proxy headers when available, along with coarse device category (mobile, desktop, or tablet) and transfer byte counts. We do not request browser GPS geolocation permissions, and we do not store raw visitor IP addresses on transfer documents. Transient IP rate-limiting counters are held in server memory for up to 5 minutes to prevent code-guessing abuse.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-[#1D1D1F]">
                D. Local Browser Storage
              </h3>
              <p className="text-[#6E6E73] mt-0.5">
                To help you keep track of recent uploads without an account, your browser stores a list of up to 5 recent active transfers in <code className="font-mono">localStorage</code> on your device, including a revocation token that lets you delete your stored server files early.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            3. What the Operator Can See
          </h2>
          <p className="text-[#6E6E73]">
            Fylshare encrypts data in transit (TLS 1.3) and relies on Google Cloud Storage server-side encryption (AES-256) at rest. However, Fylshare is <strong>not</strong> a client-side zero-knowledge or end-to-end encrypted service because files pass through our server for format validation and storage management.
          </p>
          <p className="text-[#6E6E73]">
            By default, the Fylshare admin console displays operational metadata (timestamps, file counts, total bytes, lifecycle status, and approximate country) without exposing raw retrieval codes or direct download links. Authorized full administrators can generate a temporary inspection link only when investigating a documented abuse report or security incident, and every such action is recorded in a restricted Admin Audit Log.
          </p>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            4. Data Retention Schedule
          </h2>
          <div className="overflow-x-auto border border-[#D2D2D7] rounded-2xl">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-[#D2D2D7] text-[#1D1D1F] font-semibold">
                  <th className="py-3 px-4">Record Type</th>
                  <th className="py-3 px-4">Retention Window</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D2D2D7]/60 text-[#6E6E73]">
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Anonymous File Contents
                  </td>
                  <td className="py-3 px-4">48 hours</td>
                  <td className="py-3 px-4">
                    Access stops immediately at expiry; objects are deleted from storage by hourly cleanup.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Transfer Labels, Filenames &amp; 6-Digit Codes
                  </td>
                  <td className="py-3 px-4">48 hours</td>
                  <td className="py-3 px-4">
                    Redacted automatically when the transfer expires, is revoked, or is removed.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Workspace Box Files
                  </td>
                  <td className="py-3 px-4">Until deleted</td>
                  <td className="py-3 px-4">
                    Retained until deleted by a user with the Workspace PIN or removed for policy violations.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Minimized Operational History
                  </td>
                  <td className="py-3 px-4">90 days</td>
                  <td className="py-3 px-4">
                    Stores non-identifying byte counts, file counts, status, and approximate country.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Admin Audit &amp; Moderation Logs
                  </td>
                  <td className="py-3 px-4">180 days</td>
                  <td className="py-3 px-4">
                    Retained for security accountability and handling lawful or abuse inquiries.
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-medium text-[#1D1D1F]">
                    Aggregate Daily Counters
                  </td>
                  <td className="py-3 px-4">Indefinite</td>
                  <td className="py-3 px-4">
                    Daily numerical totals containing no personal data or identifiers.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            5. Service Providers (Subprocessors) &amp; Analytics
          </h2>
          <ul className="list-disc pl-5 space-y-2 text-[#6E6E73] text-[14px]">
            <li>
              <strong className="text-[#1D1D1F]">Google Cloud Storage / Firebase:</strong>{" "}
              Stores uploaded file objects in private cloud buckets.
            </li>
            <li>
              <strong className="text-[#1D1D1F]">MongoDB Atlas:</strong>{" "}
              Stores transfer metadata, workspace records, and operational logs.
            </li>
            <li>
              <strong className="text-[#1D1D1F]">Vercel &amp; Render:</strong>{" "}
              Host the web application frontend and Node.js API backend.
            </li>
            <li>
              <strong className="text-[#1D1D1F]">Google Analytics 4 (Optional):</strong>{" "}
              Loaded only if you click “Accept Analytics” in the consent bar. When enabled, URLs are sanitized to remove retrieval codes and query strings, and filenames/labels are never transmitted.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            6. Deletion Requests &amp; Contact
          </h2>
          <p className="text-[#6E6E73]">
            If you uploaded an anonymous transfer from your current browser, you can delete the stored files immediately using the <strong>“Delete server files”</strong> action under “Recent transfers on this device” on the{" "}
            <Link to="/" className="text-[#0066CC] hover:underline">
              homepage
            </Link>
            . For privacy inquiries, takedown requests, or assistance, email{" "}
            <a
              href="mailto:fylshare.official@gmail.com"
              className="text-[#0066CC] hover:underline"
            >
              fylshare.official@gmail.com
            </a>{" "}
            with the 6-digit code or transfer timestamp. Do not send government ID documents in ordinary support emails.
          </p>
        </section>
      </div>
    </div>
  );
}
