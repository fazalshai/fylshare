import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Shield, Clock, FileText, Zap } from "lucide-react";

export default function FAQ() {
    const faqs = [
        {
            question: "Is Fylshare completely free to use?",
            answer: "Yes, Fylshare is 100% free. You can upload files up to 1GB without paying a cent, and there are no hidden fees or subscription requirements.",
            icon: <Zap className="text-yellow-400" />
        },
        {
            question: "Are my files secure and private?",
            answer: "Absolutely. We use industry-standard encryption for all transfers. Your files are stored in Google Firebase Storage, which provides enterprise-grade security.",
            icon: <Shield className="text-green-400" />
        },
        {
            question: "How long do you keep my files?",
            answer: "Fylshare is designed for temporary 'quick sharing'. By default, files are treated as ephemeral. However, if you use a 'Workspace Box', files are stored persistently until you choose to delete them.",
            icon: <Clock className="text-blue-400" />
        },
        {
            question: "What is the maximum file size I can upload?",
            answer: "You can upload individual files or batches of files totaling up to 1GB per transfer. This is significantly higher than most email attachment limits (usually 25MB).",
            icon: <FileText className="text-purple-400" />
        },
        {
            question: "Do I need to create an account?",
            answer: "No! We believe in anonymous, frictionless sharing. You do not need to register, provide an email, or create a password to send or receive files.",
            icon: <Shield className="text-fuchsia-400" />
        },
        {
            question: "How do I access a file someone sent me?",
            answer: "It's simple. Ask the sender for the 6-digit code (e.g., 123456). Go to our 'Search' or 'Home' page, enter that code, and click download. It takes less than 5 seconds.",
            icon: <Zap className="text-cyan-400" />
        }
    ];

    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold mb-4 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-fuchsia-400 to-cyan-400"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <p className="text-gray-400 text-lg">Everything you need to know about secure, anonymous file sharing.</p>
                </div>

                {/* FAQ Grid */}
                <div className="grid gap-6">
                    {faqs.map((faq, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all bg-black/40 backdrop-blur-md"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 p-2 bg-white/5 rounded-full">
                                    {faq.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 font-[Orbitron] text-gray-100">{faq.question}</h3>
                                    <p className="text-gray-400 leading-relaxed">{faq.answer}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* SEO Text Block (Hidden from main visual flow but readable by bots/users) */}
                <div className="mt-20 p-8 rounded-3xl bg-white/5 border border-white/10">
                    <h2 className="text-2xl font-bold mb-4 font-[Orbitron] text-cyan-300">Why Choose Fylshare?</h2>
                    <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                        <p>
                            In today's digital age, sharing large files securely and quickly is a necessity. Fylshare provides a robust platform for anonymous file sharing without the hassle of registration. Whether you are sending large video files, high-resolution images, or encrypted documents, our platform ensures your data transfers are fast and reliable.
                        </p>
                        <p>
                            Unlike traditional cloud storage services that require cumbersome logins and subscriptions, Fylshare focuses on speed. Our 6-digit code system revolutionizes how you retrieve data—eliminating long, complicated URLs in favor of simple, memorable codes.
                        </p>
                        <p>
                            Safety is our priority. With enterprise-grade encryption and automated file purging policies for non-persistent storage, we ensure your data remains private. Experience the future of file sharing with Fylshare today.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    );
}
