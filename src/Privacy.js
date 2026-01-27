import React from "react";

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen pt-24 pb-20 px-4 max-w-4xl mx-auto text-gray-300 font-[Poppins]">
            <h1 className="text-4xl font-bold text-white mb-8 font-[Orbitron]">Privacy Policy</h1>

            <div className="space-y-6 bg-black/40 p-8 rounded-2xl border border-white/10 backdrop-blur-md">
                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-2">1. Introduction</h2>
                    <p>Welcome to Fylshare. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-2">2. Data We Collect</h2>
                    <p>We collect and format the following data:</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li><strong>Uploaded Files:</strong> Files are stored securely on our servers using Google Firebase Storage.</li>
                        <li><strong>Usage Data:</strong> We may process data about your use of our website and services ("usage data"). The usage data may include your IP address, geographical location, browser type and version, operating system, referral source, length of visit, page views and website navigation paths.</li>
                        <li><strong>Cookies:</strong> We use cookies to ensure you get the best experience on our website.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-2">3. Advertising (Google AdSense)</h2>
                    <p>We use Google AdSense to display ads. Google uses cookies to serve ads based on your prior visits to our website or other websites.</p>
                    <ul className="list-disc pl-5 mt-2 space-y-1">
                        <li>Google's use of advertising cookies enables it and its partners to serve ads to your users based on their visit to your sites and/or other sites on the Internet.</li>
                        <li>Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" className="text-cyan-400 hover:underline" target="_blank" rel="noreferrer">Google Ads Settings</a>.</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-2">4. Data Security</h2>
                    <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-fuchsia-400 mb-2">5. Contact Us</h2>
                    <p>If you have any questions about this privacy policy, please contact us at: <a href="mailto:support@fylshare.com" className="text-cyan-400 hover:underline">support@fylshare.com</a></p>
                </section>
            </div>
        </div>
    );
}
