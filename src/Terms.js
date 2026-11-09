import React from "react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-gray-300 font-[Poppins]">
            <h1 className="text-4xl font-bold text-white mb-8 font-[Orbitron]">Terms of Service</h1>
            <p className="mb-8 text-gray-400">Last Updated: February 2, 2026</p>

            <div className="space-y-8 bg-black/40 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md">
                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">1. Agreement to Terms</h2>
                    <p className="leading-relaxed">
                        These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Fylshare ("we," "us" or "our"), concerning your access to and use of the fylshare.com website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">2. Intellectual Property Rights</h2>
                    <p className="leading-relaxed mb-4">
                        Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">3. Acceptable Use Policy (AUP) &amp; Prohibited Content</h2>
                    <p className="mb-4">You may only upload files that you own or have the lawful right to share. In compliance with international regulations (including UAE TDRA Internet Guidelines, EU DSA, and US DMCA), you strictly agree NOT to upload, store, or distribute:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Malware, ransomware, spyware, raw executable payloads (<code>.exe</code>, <code>.bat</code>, <code>.scr</code>, <code>.cmd</code>, <code>.vbs</code>, <code>.msi</code>), or harmful code.</li>
                        <li>Pirated software, movies, music, or any material that infringes third-party copyright or intellectual property rights.</li>
                        <li>Adult, pornographic, or sexually explicit content of any kind.</li>
                        <li>Private personal documents, photographs, or confidential data belonging to others without their explicit consent.</li>
                        <li>Content promoting fraud, phishing, terrorism, violence, or any activity prohibited by applicable local or international law.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">4. Automatic File Expiration &amp; Takedown Policy</h2>
                    <p className="leading-relaxed mb-3">
                        Anonymous transfers on Fylshare are ephemeral by design and are automatically purged from our servers and cloud storage after their retention window expires. We reserve the right to immediately remove or quarantine any transfer code reported for abuse or policy violations without prior notice.
                    </p>
                    <p className="leading-relaxed">
                        <strong>Report Abuse / Copyright Infringement:</strong> Anyone can report a 6-digit transfer code directly via the <strong>Report Abuse</strong> button on the file retrieval page or by emailing <a href="mailto:fylshare.official@gmail.com?subject=Abuse%20Report%20-%20Fylshare" className="text-fuchsia-400 hover:underline">fylshare.official@gmail.com</a> with the 6-digit code. Verified reports are processed and removed promptly.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">5. Disclaimer</h2>
                    <p className="leading-relaxed uppercase border-l-4 border-cyan-400 pl-4">
                        The site is provided on an "as-is" and "as-available" basis. You agree that your use of the site and our services will be at your sole risk. To the fullest extent permitted by law, we disclaim all warranties, express or implied, in connection with the site and your use thereof.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">6. Limitation of Liability</h2>
                    <p className="leading-relaxed">
                        In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the site, even if we have been advised of the possibility of such damages.
                    </p>
                </section>
            </div>
        </div>
    );
}
