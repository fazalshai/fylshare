import React from "react";
import { motion } from "framer-motion";

export default function SecurityGuide() {
    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-cyan-400"
                    >
                        Security Center
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Understanding how Fylshare protects your data, anonymity, and digital privacy. A comprehensive guide for users and developers.
                    </p>
                </div>

                <div className="space-y-12">

                    {/* Article 1 */}
                    <article className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-fuchsia-500/20 text-fuchsia-300 px-4 py-1 rounded-full text-sm font-bold border border-fuchsia-500/30">Privacy First</span>
                            <span className="text-gray-500 text-sm">5 min read</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 font-[Orbitron] text-white">Why Anonymous File Sharing Matters</h2>
                        <div className="text-gray-300 space-y-4 leading-relaxed">
                            <p>
                                In an era where digital footprints are continuously tracked, the concept of anonymity has become a luxury. Most file-sharing services require email registrations, account creations, and phone number verifications. This creates a permanent link between your identity and the data you transmit.
                            </p>
                            <p>
                                <strong>Fylshare takes a different approach.</strong> We believe that the simple act of moving data from Person A to Person B should not require a detailed dossier of who you are. By removing the authentication layer, we eliminate the primary vector for data breaches: user databases.
                            </p>
                            <p>
                                When you do not have an account, you cannot be hacked. There are no passwords to steal, no emails to phish, and no profiles to compromise. Your "identity" on our platform exists only for the duration of your session. Once you leave, the trace vanishes. This is the core philosophy of <em>Ephemeral Data Transport</em>.
                            </p>
                        </div>
                    </article>

                    {/* Article 2 */}
                    <article className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-cyan-500/20 text-cyan-300 px-4 py-1 rounded-full text-sm font-bold border border-cyan-500/30">Encryption</span>
                            <span className="text-gray-500 text-sm">7 min read</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 font-[Orbitron] text-white">The Technical Architecture of Trust</h2>
                        <div className="text-gray-300 space-y-4 leading-relaxed">
                            <p>
                                Trust is not about believing promises; it is about verifying technology. Fylshare runs on a robust infrastructure powered by Google Cloud Platform (GCP) and Firebase Storage. This provides enterprise-grade security standards that are typically reserved for Fortune 500 companies.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">1. Encryption in Transit</h3>
                            <p>
                                From the moment you drag a file into our browser window, it is encapsulated in a TLS 1.3 (Transport Layer Security) tunnel. This ensures that no intermediary—be it your ISP, a public Wi-Fi hacker, or a government firewall—can inspect the contents of your transfer.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">2. Encryption at Rest</h3>
                            <p>
                                Once your file reaches our servers, it is written to disk using AES-256 encryption. This is the industry standard for data protection. Even if someone were to physically steal the hard drives from the data center, the data would remain a meaningless scramble of random bits without the cryptographic keys.
                            </p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">3. The 6-Digit Protocol</h3>
                            <p>
                                Our unique 6-digit retrieval code serves as a temporary "key" to your data. Unlike long, complex URLs that get indexed by search engines or saved in browser histories, these codes are short-lived. They are designed to be shared via secure, out-of-band channels (like a verbal conversation or an encrypted chat), further reducing the attack surface.
                            </p>
                        </div>
                    </article>

                    {/* Article 3 */}
                    <article className="glass-panel p-8 md:p-12 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="bg-green-500/20 text-green-300 px-4 py-1 rounded-full text-sm font-bold border border-green-500/30">Compliance</span>
                            <span className="text-gray-500 text-sm">4 min read</span>
                        </div>
                        <h2 className="text-3xl font-bold mb-6 font-[Orbitron] text-white">Commitment to Data Sovereignty</h2>
                        <div className="text-gray-300 space-y-4 leading-relaxed">
                            <p>
                                We strictly adhere to the principle of Data Minimization. We do not collect names, addresses, or payment information because we simply do not need it. We process your files solely for the purpose of transmission.
                            </p>
                            <p>
                                <strong>No Third-Party Tracking:</strong> We do not sell user data to advertising brokers. The advertisements you see on our platform are clear, distinct, and do not rely on invasive behavioral profiling. We serve ads to support our infrastructure costs, but we never compromise your privacy to do so.
                            </p>
                            <p>
                                By choosing Fylshare, you are supporting an independent web where privacy is a default setting, not an expensive add-on. We are committed to maintaining this standard of integrity as we grow.
                            </p>
                        </div>
                    </article>

                </div>

                <div className="mt-20 p-8 border-t border-white/10 text-center">
                    <p className="text-gray-500">
                        Have more questions about our security practices? Contact our security team at <a href="mailto:fylshare.official@gmail.com" className="text-fuchsia-400 hover:underline">fylshare.official@gmail.com</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
