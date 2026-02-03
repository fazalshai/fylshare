import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, UserX, Clock } from "lucide-react";

export default function Blog() {
    const articles = [
        {
            id: "secure-sharing-guide",
            title: "How to Share Large Files Securely in 2026",
            date: "February 2, 2026",
            readTime: "8 min read",
            tags: ["Security", "Guide"],
            icon: <Shield className="text-fuchsia-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        In an age where data breaches are common news, sharing large files securely is more critical than ever. Whether you are sending sensitive business documents, creative portfolios, or personal videos, the method you choose matters. Traditional email attachments are limited by size (usually 25MB) and lack encryption. Cloud storage accounts often require registration, leaving a permanent digital footprint.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Use End-to-End Encryption</h3>
                    <p className="mb-4">
                        The gold standard for file sharing is End-to-End Encryption (E2EE). This means your file is encrypted on your device before it ever travels over the internet, and it can only be decrypted by the recipient. Fylshare employs TLS 1.3 for encryption in transit and AES-256 for data at rest, ensuring that clear-text data is never exposed to intermediaries.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">2. Avoid Account-Based Services</h3>
                    <p className="mb-4">
                        Many popular services force you to create an account. This links your identity to the files you transfer. For true privacy, look for platforms that allow "anonymous" or "guest" uploads. By removing the user profile from the equation, you minimize the risk of social engineering attacks or database leaks exposing your activity.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Use Expiring Links (Ephemeral Storage)</h3>
                    <p className="mb-4">
                        Data that doesn't exist cannot be stolen. Use services that automatically delete your files after a set period. Fylshare's default behavior is ephemeral; files are meant for transfer, not long-term hoarding. Once the transfer is complete, or the retention period expires, the data should simply vanish.
                    </p>
                </>
            ),
        },
        {
            id: "why-encryption-matters",
            title: "Why End-to-End Encryption Matters for Everyone",
            date: "January 28, 2026",
            readTime: "6 min read",
            tags: ["Privacy", "Tech"],
            icon: <Lock className="text-cyan-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        Encryption is often viewed as a tool for spies or super-secret organizations. In reality, it is a fundamental human right in the digital age. It protects your medical records, your financial transactions, and your private conversations from prying eyes.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">What is AES-256?</h3>
                    <p className="mb-4">
                        AES (Advanced Encryption Standard) with a 256-bit key is one of the most secure encryption methods available. It is used by governments and financial institutions worldwide. The number of possible keys is astronomical—2^256. To put that in perspective, cracking it with a brute-force attack would take modern supercomputers longer than the age of the universe.
                    </p>
                    <p className="mb-4">
                        At Fylshare, we use Google Cloud, which manages these encryption keys with strict access controls. This means that we, the developers, do not casually browse your files. The system is designed to treat data as "blobs" of unreadable ciphertext until the correct retrieval code authorizes access.
                    </p>
                </>
            ),
        },
        {
            id: "benefits-of-anonymous-sharing",
            title: "The Benefits of Anonymous File Transfer",
            date: "January 15, 2026",
            readTime: "5 min read",
            tags: ["Anonymity", "Freedom"],
            icon: <UserX className="text-green-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        Anonymity is not about hiding wrongdoing; it's about protecting autonomy. When you share a file anonymously, you are protecting yourself from tracking, profiling, and targeted advertising.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">No Metadata Trails</h3>
                    <p className="mb-4">
                        Metadata—data about data—can be just as revealing as the content itself. Timestamps, IP addresses, location tags, and user IDs paint a picture of your life. By using a platform like Fylshare that minimizes data collection, you reduce your metadata footprint.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">Speed and Efficiency</h3>
                    <p className="mb-4">
                        Beyond privacy, anonymity offers speed. Skipping the "Sign Up / Log In / Verify Email" loop saves valuable minutes. In a fast-paced professional environment, being able to drag, drop, and get a code in 3 seconds is a significant productivity booster.
                    </p>
                </>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400"
                    >
                        Fylshare Blog
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Insights, guides, and news about secure file sharing, digital privacy, and technology.
                    </p>
                </div>

                <div className="space-y-12">
                    {articles.map((article, index) => (
                        <motion.article
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/20 transition-all"
                        >
                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-gray-300">
                                    <Clock size={14} /> {article.readTime}
                                </span>
                                <span className="flex items-center gap-2">
                                    {article.date}
                                </span>
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-fuchsia-400">#{tag}</span>
                                ))}
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="p-3 bg-white/5 rounded-full mt-1 hidden sm:block">
                                    {article.icon}
                                </div>
                                <h2 className="text-3xl font-bold font-[Orbitron] text-white leading-tight">
                                    {article.title}
                                </h2>
                            </div>

                            <div className="text-gray-300 leading-relaxed text-lg pl-0 sm:pl-[68px]">
                                {article.content}
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </div>
    );
}
