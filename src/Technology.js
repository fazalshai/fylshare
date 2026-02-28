import React from "react";
import { motion } from "framer-motion";
import { Server, Shield, Database, Activity, Lock, Cloud } from "lucide-react";

export default function Technology() {
    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400"
                    >
                        Fylshare Architecture
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                        A deep dive into the cryptographic protocols, infrastructure design, and data lifecycle management that powers our secure file transfer network. Designed for transparency and engineered for zero-trust.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold font-[Orbitron] text-white border-b border-white/10 pb-4">Cryptographic Implementation</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                The cornerstone of the Fylshare platform is our uncompromising approach to data encryption. We operate under a "Zero Knowledge" philosophy regarding payload contents. When a client initiates a file transfer, the payload is immediately secured using <strong>TLS 1.3 (Transport Layer Security)</strong>. This ensures perfect forward secrecy and protects against downgrade attacks during the transit phase over public networks.
                            </p>
                            <p>
                                Upon reaching our ingestion nodes, the file stream is passed directly to <strong>Google Cloud Storage</strong>, where it is secured at rest using <strong>AES-256 (Advanced Encryption Standard)</strong>. The keys used for this encryption are generated and managed by Google Cloud KMS (Key Management Service). Fylshare application servers do not possess the raw master keys, meaning even if an attacker gains root access to our application layer, they cannot mass-decrypt the storage buckets.
                            </p>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6">
                                <h4 className="font-bold text-fuchsia-400 mb-2 flex items-center gap-2"><Lock size={18} /> Endpoint Security Model</h4>
                                <p className="text-sm text-gray-400">
                                    Because we do not require user accounts for our core anonymous transfer service, we eliminate the primary vector for credential stuffing and phishing attacks. The 6-digit retrieval code acts as both the locator and the authorization token. Without the exact, highly entropic integer combination, the storage bucket will explicitly reject any API request, returning a generic 404 to obscure the existence of the secure payload.
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-8"
                    >
                        <h2 className="text-3xl font-bold font-[Orbitron] text-white border-b border-white/10 pb-4">Infrastructure Topology</h2>
                        <div className="space-y-4 text-gray-300 leading-relaxed">
                            <p>
                                High availability and massive throughput are required to support gigabyte-scale file transfers. Our backend services are written in highly optimized Node.js utilizing asynchronous I/O to handle thousands of concurrent multipart upload streams without thread blocking.
                            </p>
                            <p>
                                The frontend application is a globally distributed React Single Page Application (SPA). By leveraging edge networks (CDNs), the application is served from a physical server geographically close to the user, ensuring sub-100ms time-to-interactive (TTI) metrics regardless of whether the user is in London, Tokyo, or New York.
                            </p>
                            <div className="bg-white/5 p-6 rounded-xl border border-white/10 mt-6">
                                <h4 className="font-bold text-cyan-400 mb-2 flex items-center gap-2"><Server size={18} /> Stateful vs. Stateless Architecture</h4>
                                <p className="text-sm text-gray-400">
                                    While our file storage is inherently stateful, our API servers are completely stateless. Metadata (such as the association between a 6-digit code and a blob URI) is stored in a highly available MongoDB cluster. This separation of concerns allows us to automatically scale the API tier horizontally during traffic spikes without worrying about session affinity or sticky routing.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* The Lifecycle Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-gray-900 to-black p-8 md:p-12 rounded-3xl border border-white/10 mb-20"
                >
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold font-[Orbitron] text-white">The Ephemeral Data Lifecycle</h2>
                        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
                            We reject the industry norm of permanent data hoarding. Fylshare is a transit hub, not a warehouse. Here is the strict lifecycle of every byte uploaded to our network.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-fuchsia-500/20 text-fuchsia-400 rounded-full flex items-center justify-center mb-4 border border-fuchsia-500/50">
                                <Cloud size={28} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Ingestion</h4>
                            <p className="text-xs text-gray-400">File is fragmented, subjected to TLS 1.3 transit encryption, and streamed into active memory buffer.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-cyan-500/20 text-cyan-400 rounded-full flex items-center justify-center mb-4 border border-cyan-500/50">
                                <Activity size={28} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Processing</h4>
                            <p className="text-xs text-gray-400">Stream is flushed to Google Cloud bucket; KMS generates distinct AES-256 keys. Metadata mapped in MongoDB.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-pink-500/20 text-pink-400 rounded-full flex items-center justify-center mb-4 border border-pink-500/50">
                                <Database size={28} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Dormancy</h4>
                            <p className="text-xs text-gray-400">Code is provided to user. File sits in absolute encrypted dormancy awaiting the exact retrieval trigger.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto bg-red-500/20 text-red-400 rounded-full flex items-center justify-center mb-4 border border-red-500/50">
                                <Shield size={28} />
                            </div>
                            <h4 className="font-bold text-white mb-2">Annihilation</h4>
                            <p className="text-xs text-gray-400">Upon successful transit to recipient, pointer references are dropped, and cryptographic keys are scheduled for destruction.</p>
                        </div>
                    </div>
                </motion.div>

                {/* Conclusion / AdSense Text padding */}
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold font-[Orbitron] text-white mb-4">A Commitment to Mathematical Certainty</h2>
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Trust is not granted; it is verified. By publishing our architectural topology and relying strictly on audited, open-source cryptographic standards rather than proprietary "black box" security, we offer enterprise compliance officers and independent security researchers the necessary visibility. Fylshare remains committed to providing the fastest, most resilient, and mathematically secure data courier service on the internet.
                    </p>
                </div>

            </div>
        </div>
    );
}
