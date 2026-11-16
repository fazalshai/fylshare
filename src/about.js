import React from "react";
import { Link } from "react-router-dom";

export default function AboutUs() {
  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[820px] mx-auto space-y-12">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            About Fylshare
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            Built for direct, temporary file handoffs.
          </h1>
          <p className="text-[16px] text-[#6E6E73] mt-2 leading-relaxed">
            Fylshare lets you move documents, archives, and media across devices using a short 6-digit code or QR scan—without creating user accounts or storing files indefinitely.
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "1 GB", label: "Max Transfer Size" },
            { value: "10", label: "Files Per Batch" },
            { value: "48h", label: "Standard Expiry" },
            { value: "No Account", label: "Required to Send" },
          ].map((stat, i) => (
            <div
              key={i}
              className="apple-surface rounded-2xl p-5 text-center"
            >
              <div className="text-[22px] font-semibold text-[#1D1D1F]">
                {stat.value}
              </div>
              <div className="text-[12px] text-[#6E6E73] mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        <section className="space-y-4 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">How Fylshare Works</h2>
          <p className="text-[#6E6E73]">
            Most everyday file transfers—moving a document to a shared computer, sending project drafts to a colleague, or transferring files between a desktop and a phone—do not require permanent cloud drive storage or account sign-ins.
          </p>
          <p className="text-[#6E6E73]">
            When you upload a file to Fylshare, our server validates the file format, stores it privately on Google Cloud Storage, and generates a 6-digit retrieval code alongside a high-entropy QR link. After 48 hours, download access stops and the stored file objects are automatically purged.
          </p>
        </section>

        <section className="apple-card rounded-2xl p-6 space-y-3 text-[14px]">
          <h2 className="text-[17px] font-semibold text-[#1D1D1F]">
            Operator &amp; Contact Information
          </h2>
          <p className="text-[#6E6E73] leading-relaxed">
            Fylshare is operated from India and serves users internationally using cloud infrastructure hosted on Vercel, Render, MongoDB Atlas, and Google Cloud Storage.
          </p>
          <p className="text-[#6E6E73]">
            General support, privacy requests, and abuse reports:{" "}
            <a
              href="mailto:fylshare.official@gmail.com"
              className="text-[#0066CC] hover:underline font-medium"
            >
              fylshare.official@gmail.com
            </a>
          </p>
        </section>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] text-white font-semibold text-[14px] transition-colors"
          >
            Start a Transfer
          </Link>
        </div>
      </div>
    </div>
  );
}
