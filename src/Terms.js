import React from "react";

export default function TermsOfService() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-gray-300 font-[Poppins]">
            <h1 className="text-4xl font-bold text-white mb-8 font-[Orbitron]">Terms of Service</h1>

            <div className="space-y-6 bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">1. Acceptance of Terms</h2>
                    <p>By accessing and using Fylshare, you accept and agree to be bound by the terms and provision of this agreement.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">2. Use of Service</h2>
                    <p>Fylshare provides a temporary file sharing service. You agree not to misuse the service.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>You must not upload any illegal, harmful, or copyrighted content.</li>
                        <li>We reserve the right to delete any file without notice.</li>
                        <li>Files are automatically deleted after 24 hours.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">3. Disclaimer</h2>
                    <p>The materials on Fylshare's website are provided on an 'as is' basis. Fylshare makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">4. Limitations</h2>
                    <p>In no event shall Fylshare or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Fylshare's website.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-cyan-400 mb-2">5. Changes to Terms</h2>
                    <p>We reserve the right to update these terms at any time. We recommend you review this page periodically for any changes.</p>
                </section>
            </div>
        </div>
    );
}
