import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, UserX, Clock, Server, Cloud, Code } from "lucide-react";

export default function Blog() {
    const articles = [
        {
            id: "secure-sharing-guide",
            title: "How to Share Large Files Securely in 2026",
            date: "February 2, 2026",
            author: "Dr. Firoj Gazi",
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
            author: "Fazal Shaik",
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
            author: "Ch Madhu Bhushan",
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
        {
            id: "what-is-aes-256-encryption",
            title: "Demystifying AES-256: The Algorithm Protecting Your Files",
            date: "February 25, 2026",
            author: "Dr. Firoj Gazi",
            readTime: "9 min read",
            tags: ["Cryptography", "Tech"],
            icon: <Lock className="text-yellow-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        When evaluating secure file sharing platforms, you will invariably encounter the term "AES-256 encryption." It is touted as "military-grade" and "unbreakable." But what exactly is it, and why is it considered the global standard for protecting classified information, financial transactions, and your personal data?
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">The Anatomy of AES</h3>
                    <p className="mb-4">
                        The Advanced Encryption Standard (AES) is a symmetric-key algorithm developed by Belgian cryptographers Joan Daemen and Vincent Rijmen. "Symmetric" means the same key is used to both scramble (encrypt) and unscramble (decrypt) the data. The "256" refers to the length of this key in bits.
                    </p>
                    <p className="mb-4">
                        To visualize the scale, a 256-bit key means there are 2<sup>256</sup> possible combinations. That is a number roughly equal to the number of atoms in the observable universe. If every computer on Earth collaborated to launch a "brute-force" attack—trying every single combination—it would take billions of years to crack the code. This mathematical impossibility is what makes AES-256 the fortress of the digital world.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">How Fylshare Implements AES-256</h3>
                    <p className="mb-4">
                        Implementing a strong algorithm incorrectly can render it useless. At Fylshare, encryption is woven into the very fabric of our architecture. When you upload a file, it is secured using TLS 1.3 during transit (protecting it from interception by ISPs or hackers on public Wi-Fi). Once it reaches our Google Cloud infrastructure, it is encrypted at rest using AES-256. The decryption keys are managed by an entirely separate, strictly audited Key Management Service (KMS). This separation of duties means that even a total compromise of our storage buckets would only yield useless, randomized data to the attacker.
                    </p>
                </>
            ),
        },
        {
            id: "data-privacy-laws-gdpr-ccpa",
            title: "Navigating Data Privacy Laws: GDPR, CCPA, and Secure Sharing",
            date: "February 20, 2026",
            author: "Fazal Shaik",
            readTime: "11 min read",
            tags: ["Compliance", "Legal"],
            icon: <Shield className="text-blue-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        The regulatory landscape surrounding data privacy has transformed dramatically over the last decade. The implementation of the General Data Protection Regulation (GDPR) in Europe and the California Consumer Privacy Act (CCPA) in the United States signaled a fundamental shift: protecting user data is no longer just good practice; it is a strict legal mandate carrying massive financial penalties.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">The Principle of Data Minimization</h3>
                    <p className="mb-4">
                        A core tenet of modern privacy laws is "Data Minimization"—the practice of collecting only the exact personal data necessary to accomplish a specific purpose. Traditional cloud storage providers violate this principle incessantly by demanding names, phone numbers, recovery emails, and behavioral telemetry simply to share a PDF file. Fylshare was explicitly designed to comply with the strictest interpretations of GDPR by eliminating the account creation process for our core tool entirely. If we do not possess your identity, we cannot inadvertently leak it, sell it, or lose it in a breach.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">Compliance for Businesses</h3>
                    <p className="mb-4">
                        For businesses operating in the healthcare (HIPAA) or finance (GLBA) sectors, utilizing secure, verifiable transport mechanisms is mandatory. When employees share sensitive documents via unencrypted email attachments, the organization incurs massive liability. Fylshare’s "Workspace Box" feature provides a compliant, auditable, and encrypted sandbox. By utilizing Ephemeral storage protocols—where data is automatically purged upon retrieval—organizations can severely restrict their exposure window and ensure that stale client data does not become a toxic asset sitting on an unmonitored server.
                    </p>
                </>
            ),
        },
        {
            id: "threat-model-for-freelancers",
            title: "The Freelancer's Threat Model: Protecting Client Intellectual Property",
            date: "February 10, 2026",
            author: "Ch Madhu Bhushan",
            readTime: "7 min read",
            tags: ["Business", "Security"],
            icon: <UserX className="text-orange-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        As a freelancer or independent contractor, your reputation is your most valuable asset. Delivering high-quality work is only half the equation; demonstrating that you can safely handle a client's pre-release intellectual property, proprietary source code, or unannounced marketing materials is what secures long-term contracts. Unfortunately, the tools most freelancers rely on are severely lacking in operational security.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">The Danger of Persistent Links</h3>
                    <p className="mb-4">
                        Pasting a Google Drive or Dropbox link into a Slack channel or email thread creates a permanent point of vulnerability. Who has access to that Slack channel a year from now? Who is monitoring that email server? Persistent, unexpiring links to confidential assets routinely result in disastrous leaks. Fylshare solves this by replacing the "link" paradigm with the "Code" paradigm. An anonymous upload generates a highly entropic 6-digit code. Once the client uses the code to retrieve the file, the data can be rendered ephemeral, completely severing the vector of attack.
                    </p>
                    <p className="mb-4">
                        Adopting a "Zero Trust" posture—assuming every network is hostile and every link will eventually be compromised—forces you to utilize tools that operate differently. By shielding client transit with AES-256 and enforcing data expiration, freelancers not only protect the IP but signal an immense degree of professional maturity to their clients.
                    </p>
                </>
            ),
        },
        {
            id: "fatal-flaws-of-ftp",
            title: "The Fatal Flaws of FTP: Why Enterprises are Migrating to HTTPS TLS 1.3",
            date: "February 27, 2026",
            author: "Dr. Firoj Gazi",
            readTime: "10 min read",
            tags: ["Infrastructure", "Tech"],
            icon: <Server className="text-cyan-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        File Transfer Protocol (FTP) was built in the 1970s for ARPANET. It is fundamentally unencrypted, transmitting passwords and routing data in clear text. While FTPS and SFTP attempted to patch these vulnerabilities, the rise of stateless API architectures has proven that dedicated FTP servers are an absolute security liability in the modern enterprise.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">The Problem with Stateful Connections</h3>
                    <p className="mb-4">
                        FTP requires managing ports, maintaining stateful connections, and complex firewall negotiations. Every open FTP port is a beacon for automated port-scanners and brute-force botnets. By migrating to stateless, HTTPS-based uploads utilizing TLS 1.3 (as Fylshare does), organizations eliminate the need for persistent, vulnerable open connections.
                    </p>
                    <p className="mb-4">
                        TLS 1.3 significantly reduces the handshake overhead compared to earlier versions and enforces Perfect Forward Secrecy (PFS). This guarantees that even if a server's private key is compromised in the future, past recorded traffic cannot be decrypted. Relying on legacy FTP servers in a high-threat environment is equivalent to leaving your bank vault door wide open.
                    </p>
                </>
            ),
        },
        {
            id: "quantum-resistant-cryptography",
            title: "Quantum-Resistant Cryptography: Preparing for the Post-Quantum Web",
            date: "February 26, 2026",
            author: "Fazal Shaik",
            readTime: "14 min read",
            tags: ["Future", "Cryptography"],
            icon: <Code className="text-purple-400" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        The cryptographic foundations of the internet—RSA and Elliptic Curve Cryptography (ECC)—rely on math problems that are incredibly difficult for classical computers to solve, such as integer factorization. However, the advent of sufficiently powerful quantum computers running Shor's algorithm threatens to shatter these foundations overnight, a threat colloquially known as "Q-Day."
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">Store Now, Decrypt Later (SNDL)</h3>
                    <p className="mb-4">
                        State-sponsored threat actors are actively engaged in SNDL campaigns: vacuuming up massive amounts of encrypted traffic today with the explicit goal of decrypting it five or ten years from now when quantum computers reach maturity. This means data transmitted today is already at risk.
                    </p>
                    <p className="mb-4">
                        While AES-256 (used by Fylshare) is a symmetric key algorithm and is considered incredibly resilient and "quantum-resistant" against Grover's algorithm, the asymmetric key exchange used to set up the connection (TLS handshakes) must evolve. The industry is rapidly adopting NIST-approved Post-Quantum Cryptography (PQC) standards like Kyber. Transitioning legacy infrastructure is critical to protecting data with long-term sensitivity.
                    </p>
                </>
            ),
        },
        {
            id: "data-sovereignty-101",
            title: "Data Sovereignty 101: Where Do Your Cloud Files Actually Live?",
            date: "February 22, 2026",
            author: "Ch Madhu Bhushan",
            readTime: "8 min read",
            tags: ["Cloud", "Legal"],
            icon: <Cloud className="text-blue-500" size={24} />,
            content: (
                <>
                    <p className="mb-4">
                        When you drop a file into a "Cloud" provider, it doesn't float into the ether. It is stored on a physical spinning disk or SSD in a massive, power-hungry warehouse. The physical geographic location of that server determines which country's laws govern your data. This is the concept of Data Sovereignty.
                    </p>
                    <h3 className="text-xl font-bold text-white mt-6 mb-3">The Geopolitics of Server Racks</h3>
                    <p className="mb-4">
                        If an EU company uploads a confidential client dossier to a cloud service whose servers reside in the United States, that data is subject to the US CLOUD Act, potentially allowing law enforcement access without the local European company knowing. This directly contravenes the GDPR's strict requirements on cross-border data transfers.
                    </p>
                    <p className="mb-4">
                        Fylshare addresses sovereignty concerns by strictly orchestrating our Google Cloud Platform (GCP) storage bucket locations and utilizing ephemeral data processing. By ensuring data only exists temporarily in well-defined regions, and is aggressively destroyed, we give sovereign control back to the data creators, mitigating international compliance risks.
                    </p>
                </>
            ),
        }
    ];

    // Schema Generator for AdSense SEO compliance
    const generateSchema = (article) => {
        const schema = {
            "@context": "https://schema.org",
            "@type": "TechArticle",
            "headline": article.title,
            "author": {
                "@type": "Person",
                "name": article.author
            },
            "publisher": {
                "@type": "Organization",
                "name": "Fylshare Security Journal",
                "logo": {
                    "@type": "ImageObject",
                    "url": "https://fylshare.com/logo.png"
                }
            },
            "datePublished": new Date(article.date).toISOString(),
            "description": `An in-depth analysis on ${article.tags.join(" and ")}.`,
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": `https://fylshare.com/blog#${article.id}`
            }
        };
        return (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        );
    };

    return (
        <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl md:text-6xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400"
                    >
                        Security Journal
                    </motion.h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        In-depth research, security advisories, and industry insights.
                    </p>
                </div>

                <div className="space-y-12">
                    {articles.map((article, index) => (
                        <motion.article
                            id={article.id}
                            key={article.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-panel p-8 md:p-10 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md hover:border-white/20 transition-all relative overflow-hidden"
                        >
                            {/* Inject the Schema.org Script directly into the article block */}
                            {generateSchema(article)}

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-400">
                                <span className="flex items-center gap-2 bg-fuchsia-500/10 text-fuchsia-300 font-bold px-3 py-1 rounded-full border border-fuchsia-500/20">
                                    {article.author}
                                </span>
                                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full text-gray-300">
                                    <Clock size={14} /> {article.readTime}
                                </span>
                                <span className="flex items-center gap-2">
                                    {article.date}
                                </span>
                                {article.tags.map(tag => (
                                    <span key={tag} className="text-cyan-400 font-bold uppercase tracking-wider text-xs">#{tag}</span>
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
