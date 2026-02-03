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
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">3. Prohibited Activities</h2>
                    <p className="mb-4">You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us. Specifically, you agree not to:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Upload or transmit viruses, Trojan horses, or other harmful material.</li>
                        <li>Upload any content that violates intellectual property rights or copyright laws.</li>
                        <li>Use the Site to distribute illegal content, including child sexual abuse material (CSAM) or content promoting terrorism.</li>
                        <li>Attempt to bypass any measures of the Site designed to prevent or restrict access to the Site, or any portion of the Site.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-4">4. Digital Millennium Copyright Act (DMCA) Notice</h2>
                    <p className="leading-relaxed">
                        We respect the intellectual property rights of others. If you believe that any material available on or through the Site infringes upon any copyright you own or control, please immediately notify our Designated Copyright Agent at <a href="mailto:fylshare.official@gmail.com" className="text-fuchsia-400 hover:underline">fylshare.official@gmail.com</a>. We will respond efficiently to all takedown requests.
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
