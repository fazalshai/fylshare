import React from "react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[820px] mx-auto space-y-10">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Legal &amp; Acceptable Use
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            Terms of Service &amp; Acceptable Use Policy
          </h1>
          <p className="text-[14px] text-[#6E6E73] mt-2">
            Last updated: November 16, 2026
          </p>
        </header>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">1. Acceptance of Terms</h2>
          <p className="text-[#6E6E73]">
            By uploading, retrieving, or managing files on Fylshare (fylshare.com), you agree to these Terms of Service and our Acceptable Use Policy. If you do not agree, do not use the service.
          </p>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            2. Your Rights, Legal Responsibility &amp; Indemnification
          </h2>
          <p className="text-[#6E6E73]">
            <strong>Only upload content you own or have the legal right to share.</strong> You retain whatever ownership rights you hold in the files you upload, and you grant Fylshare a limited technical license solely to store, validate, transmit, and delete those files as part of operating the service.
          </p>
          <p className="text-[#6E6E73]">
            <strong>Sole Uploader Responsibility:</strong> Fylshare acts strictly as a technical passive conduit and hosting provider. By uploading files, you represent and warrant that your uploads comply with the UAE Federal Decree-Law on Combatting Rumors and Cybercrimes, international copyright/DMCA law, and the laws of your jurisdiction.{" "}
            <strong className="text-[#1D1D1F]">
              You bear full civil and criminal liability for any prohibited, infringing, or unlawful material you upload or distribute
            </strong>
            , and you agree to indemnify and hold harmless Fylshare and its operators from any third-party claims, legal costs, damages, or regulatory proceedings resulting from your uploads.
          </p>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            3. Acceptable Use Policy (Prohibited Content &amp; Conduct)
          </h2>
          <p className="text-[#6E6E73]">
            You must not use Fylshare to upload, store, share, or distribute:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-[#6E6E73] text-[14px]">
            <li>
              Unlawful material, including child sexual exploitation and abuse material (CSAM), terrorism-related content, fraud, or non-consensual intimate imagery.
            </li>
            <li>
              Material that infringes copyrights, trademarks, trade secrets, or other intellectual property rights without authorization.
            </li>
            <li>
              Malware, ransomware, spyware, trojans, exploit payloads, or raw executable installers (<code className="font-mono">.exe</code>, <code className="font-mono">.dll</code>, <code className="font-mono">.bat</code>, <code className="font-mono">.cmd</code>, <code className="font-mono">.scr</code>, <code className="font-mono">.vbs</code>, <code className="font-mono">.msi</code>, <code className="font-mono">.apk</code>, <code className="font-mono">.dmg</code>).
            </li>
            <li>
              Personal documents, financial records, or confidential data belonging to third parties without lawful authority.
            </li>
            <li>
              Automated brute-force enumeration of 6-digit retrieval codes, workspace PINs, or API endpoints.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            4. File Storage, Sender Revocation &amp; Compliance Audit Logs
          </h2>
          <p className="text-[#6E6E73]">
            Uploaded files remain accessible via their 6-digit code or share link until deleted by the sender (using their browser revocation token) or removed by an administrator. When you revoke or delete a transfer, stored file contents are deleted from cloud storage immediately and recipient downloads stop. However, to prevent misuse, Fylshare retains non-content operational and legal-compliance audit metadata (transfer ID, code history, filenames, byte size, timestamps, network IP, location, and terms acceptance) for abuse investigation, DMCA compliance, and cooperation with valid legal or law-enforcement requests.
          </p>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            5. Reporting Abuse or Copyright Infringement
          </h2>
          <p className="text-[#6E6E73]">
            To report suspected copyright infringement, malware, privacy violations, or unlawful content:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-[#6E6E73] text-[14px]">
            <li>
              Use the <strong>“Report Abuse or Prohibited Content”</strong> button directly on the{" "}
              <Link to="/search" className="text-[#0066CC] hover:underline">
                Receive page
              </Link>
              , or
            </li>
            <li>
              Email{" "}
              <a
                href="mailto:fylshare.official@gmail.com?subject=Abuse%20or%20Copyright%20Report"
                className="text-[#0066CC] hover:underline"
              >
                fylshare.official@gmail.com
              </a>{" "}
              with the 6-digit code (or share link) and a description of the violation.
            </li>
          </ul>
        </section>

        <section className="space-y-3 text-[15px] leading-relaxed">
          <h2 className="text-[20px] font-semibold">
            6. Disclaimer of Warranties &amp; Limitation of Liability
          </h2>
          <p className="text-[#6E6E73] text-[14px] bg-[#F5F5F7] p-5 rounded-2xl border border-[#D2D2D7]">
            Fylshare is provided on an “as is” and “as available” basis without warranties of any kind, whether express or implied. Do not rely on Fylshare as your sole copy of important data. To the maximum extent permitted by applicable law, Fylshare and its operators shall not be liable for indirect, incidental, consequential, or punitive damages arising out of your use of the service.
          </p>
        </section>
      </div>
    </div>
  );
}
