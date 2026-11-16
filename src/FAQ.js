import React from "react";
import { Link } from "react-router-dom";

export default function FAQ() {
  const faqs = [
    {
      question: "Is Fylshare free to use?",
      answer:
        "Yes. Standard transfers up to 10 files and 1 GB total are free to use without registration or subscriptions.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "No account is required for standard transfers. You upload your files, receive a 6-digit retrieval code and QR link, and share that code or link with your recipient.",
    },
    {
      question: "How long are uploaded files kept?",
      answer:
        "Standard anonymous uploads expire 48 hours after upload. Download access stops immediately at the expiration time, and the stored file objects are deleted by our automated cleanup job. You can also revoke and delete your uploaded files early from the homepage on the same browser. Files uploaded to a PIN-protected Workspace Box remain until deleted by a PIN holder.",
    },
    {
      question: "Which file types are supported?",
      answer:
        "We support common documents (PDF, Word, Excel, PowerPoint, text, CSV, Markdown), images (JPEG, PNG, GIF, WebP, SVG), audio and video (MP4, MOV, WebM, MP3, WAV), archives (ZIP, TAR, GZ, 7Z), design/CAD files, and source code. Raw executable and installer formats (.exe, .dll, .bat, .cmd, .scr, .vbs, .msi, .apk, .dmg) are blocked.",
    },
    {
      question: "What is the difference between removing a transfer from my browser and deleting server files?",
      answer:
        "“Remove from browser” only clears the shortcut saved in your browser's local storage; the files remain downloadable on Fylshare until their 48-hour expiry. “Delete server files” (or “Revoke transfer”) permanently deletes the stored files from cloud storage and disables the 6-digit code immediately.",
    },
    {
      question: "Is Fylshare end-to-end encrypted or zero-knowledge?",
      answer:
        "No. Fylshare encrypts transfers in transit using TLS 1.3 and stores files in private Google Cloud Storage buckets encrypted at rest with AES-256, but files pass through our backend server for format validation and storage management. For highly confidential data, we recommend encrypting your file locally before uploading.",
    },
  ];

  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[820px] mx-auto space-y-10">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Help Center
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            Frequently Asked Questions
          </h1>
          <p className="text-[15px] text-[#6E6E73] mt-2">
            Clear answers about limits, file types, expiration, and privacy.
          </p>
        </header>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="apple-card rounded-2xl p-6 space-y-2"
            >
              <h2 className="text-[16px] font-semibold text-[#1D1D1F]">
                {faq.question}
              </h2>
              <p className="text-[14px] text-[#6E6E73] leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="apple-surface rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[13px] text-[#6E6E73]">
          <div>
            <p className="font-semibold text-[#1D1D1F]">Still have a question?</p>
            <p className="mt-0.5">
              Reach out to our support and safety team for assistance.
            </p>
          </div>
          <Link
            to="/contact"
            className="px-4 py-2 rounded-lg bg-[#0066CC] hover:bg-[#0055B3] text-white font-semibold text-[12px] shrink-0"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
