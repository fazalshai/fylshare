import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-gray-300 font-[Poppins]">
            <h1 className="text-4xl font-bold text-white mb-8 font-[Orbitron]">Privacy Policy</h1>
            <p className="mb-8 text-gray-400">Last Updated: February 2, 2026</p>

            <div className="space-y-8 bg-black/40 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-md">
                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">1. Introduction</h2>
                    <p className="leading-relaxed">
                        Welcome to Fylshare ("we," "our," or "us"). We are committed to protecting your personal information and your right to privacy. If you have any questions or concerns about this privacy notice or our practices with regard to your personal information, please contact us at <a href="mailto:fylshare.official@gmail.com" className="text-cyan-400 hover:underline">fylshare.official@gmail.com</a>.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">2. Information We Collect</h2>
                    <p className="mb-4">We strictly adhere to a data minimization policy. We collect only what is necessary to provide our service:</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Uploaded Content:</strong> Any files you upload are stored on our secure servers (Google Firebase) for the sole purpose of transfer. These files are encrypted at rest and in transit.</li>
                        <li><strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the Website. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Website, and other technical information.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">3. How We Use Your Information</h2>
                    <p className="mb-4">We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent.</p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>To facilitate file transfers between users.</li>
                        <li>To maintain the safety and security of our Website (e.g. fraud monitoring and prevention).</li>
                        <li>To deliver targeted advertising (via Google AdSense) to support our free service.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">4. Cookie Policy & Advertising</h2>
                    <p className="mb-4">
                        We use cookies to enhance your browsing experience. Specifically, we use <strong>Google AdSense</strong> to display advertisements.
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to your website or other websites.</li>
                        <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">Google Ads Settings</a>.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">5. Data Retention</h2>
                    <p className="leading-relaxed">
                        We only keep your personal information and uploaded files for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. Files uploaded to "Workspaces" are retained until deleted by the user. Anonymous uploads may be subject to automated deletion policies (e.g., after 30 days) to preserve server space.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">6. Security of Your Information</h2>
                    <p className="leading-relaxed">
                        We use administrative, technical, and physical security measures to help protect your personal information. Files are encrypted using AES-256 standards. However, please also remember that we cannot guarantee that the internet itself is 100% secure. Although we will do our best to protect your personal information, transmission of personal information to and from our Website is at your own risk.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-4">7. Contact Us</h2>
                    <p className="leading-relaxed">
                        If you have general questions about the Site or this Privacy Policy, please contact us at: <a href="mailto:fylshare.official@gmail.com" className="text-cyan-400 hover:underline">fylshare.official@gmail.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
}
