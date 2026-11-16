import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock, BookOpen } from "lucide-react";

const ARTICLES = [
  {
    id: "how-to-use-fylshare-step-by-step",
    category: "Tutorial",
    title: "How to Send and Receive Files with a 6-Digit Code or QR",
    date: "March 18, 2026",
    readTime: "4 min read",
    summary:
      "A practical walkthrough of uploading files on Fylshare, sharing a 6-digit retrieval code or tokenized QR link, and revoking transfers early.",
    content: [
      "Fylshare is designed for quick, temporary file handoffs between devices without requiring account creation. You can upload up to 10 files (1 GB total) in a single transfer.",
      "When your upload finishes, Fylshare generates both a 6-digit numerical code (ideal for typing on a second computer) and a scannable QR code containing a high-entropy share token.",
      "Standard anonymous uploads expire automatically after 48 hours. If you finish transferring your files sooner, you can click 'Delete server files' under Recent transfers on your device to purge the stored files immediately.",
    ],
  },
  {
    id: "send-large-videos-without-quality-loss",
    category: "Workflow",
    title: "Transferring Uncompressed Video and Design Assets Across Devices",
    date: "March 10, 2026",
    readTime: "5 min read",
    summary:
      "Why messaging apps re-compress video footage and how direct file transfers preserve original bitrates and metadata.",
    content: [
      "Most instant messaging platforms automatically transcode and compress video files to save bandwidth, reducing resolution and color fidelity.",
      "Uploading the original MP4, MOV, or ZIP package directly preserves the exact byte stream. On Fylshare, recipients download the unmodified file stream over HTTPS.",
      "Always verify that your total package is within the 1 GB limit before starting your transfer.",
    ],
  },
  {
    id: "understanding-transport-and-storage-security",
    category: "Security",
    title: "Understanding TLS 1.3 Transit Security vs. Storage Encryption",
    date: "February 2, 2026",
    readTime: "6 min read",
    summary:
      "How transport encryption, server-side storage encryption, and local pre-encryption differ—and when to use each.",
    content: [
      "TLS 1.3 protects data as it travels between your browser and a web server, preventing network observers on public Wi-Fi or local networks from reading the transfer.",
      "Server-side encryption at rest (AES-256 on Google Cloud Storage) protects stored disks inside the data center. However, because the application server manages upload validation and signed download links, server-side encryption is distinct from client-side end-to-end encryption.",
      "When sharing highly sensitive or regulated records, we recommend encrypting the archive locally on your device prior to uploading.",
    ],
  },
];

export default function Blog() {
  const [selectedArticle, setSelectedArticle] = useState(null);

  if (selectedArticle) {
    return (
      <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
        <article className="max-w-[740px] mx-auto space-y-6">
          <button
            type="button"
            onClick={() => setSelectedArticle(null)}
            className="text-[13px] font-semibold text-[#0066CC] hover:underline flex items-center gap-1.5"
          >
            <ArrowLeft size={15} /> Back to all guides
          </button>

          <header className="border-b border-[#D2D2D7] pb-6 space-y-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0066CC]">
              {selectedArticle.category}
            </span>
            <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight text-[#1D1D1F]">
              {selectedArticle.title}
            </h1>
            <p className="text-[13px] text-[#6E6E73] flex items-center gap-2">
              <Clock size={13} /> {selectedArticle.date} ·{" "}
              {selectedArticle.readTime}
            </p>
          </header>

          <div className="space-y-4 text-[15px] text-[#1D1D1F] leading-relaxed">
            {selectedArticle.content.map((para, i) => (
              <p key={i} className="text-[#6E6E73]">
                {para}
              </p>
            ))}
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[920px] mx-auto space-y-10">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Guides &amp; Articles
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            Fylshare Guides
          </h1>
          <p className="text-[15px] text-[#6E6E73] mt-2">
            Practical documentation on file transfer workflows, security boundaries, and data retention.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((article) => (
            <div
              key={article.id}
              className="apple-card rounded-2xl p-6 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#0066CC]">
                  <span>{article.category}</span>
                  <span className="text-[#6E6E73] font-normal">
                    {article.readTime}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#1D1D1F] leading-snug">
                  {article.title}
                </h2>
                <p className="text-[13px] text-[#6E6E73] leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedArticle(article)}
                className="text-[13px] font-semibold text-[#0066CC] hover:underline flex items-center gap-1 self-start"
              >
                <BookOpen size={14} /> Read guide
              </button>
            </div>
          ))}
        </div>

        <div className="apple-surface rounded-2xl p-6 flex items-center justify-between">
          <span className="text-[13px] text-[#6E6E73]">
            Ready to transfer a file?
          </span>
          <Link
            to="/"
            className="px-4 py-2 rounded-lg bg-[#0066CC] text-white text-[12px] font-semibold"
          >
            Go to Transfer
          </Link>
        </div>
      </div>
    </div>
  );
}
