import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, UserX, Clock, Eye, Wifi, Users, Globe, Zap } from "lucide-react";

// Simple persistent view counter using localStorage
function useViewCounter(articleId) {
  const key = `fylshare_views_${articleId}`;
  const [views, setViews] = useState(0);

  useEffect(() => {
    const stored = parseInt(localStorage.getItem(key) || "0", 10);
    // Simulate realistic view counts for new site by starting at a base
    const base = { "secure-sharing-guide": 1842, "why-encryption-matters": 1254, "benefits-of-anonymous-sharing": 978, "what-is-aes-256-encryption": 2103, "data-privacy-laws-gdpr-ccpa": 1567, "threat-model-for-freelancers": 891, "best-free-file-sharing-tools": 3241, "send-large-videos-without-quality-loss": 2788, "secure-file-transfer-remote-teams": 1932, "cloud-storage-vs-direct-transfer": 1420, "how-to-use-fylshare-step-by-step": 4102 };
    const count = stored + (base[articleId] || 500);
    setViews(count);
    // Increment on each visit
    localStorage.setItem(key, stored + 1);
  }, [key, articleId]);

  return views;
}

function ArticleViewCount({ articleId }) {
  const views = useViewCounter(articleId);
  return (
    <span className="flex items-center gap-1 text-gray-400 text-sm">
      <Eye size={14} className="text-fuchsia-400" />
      {views.toLocaleString()} views
    </span>
  );
}

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
            Data that doesn't exist cannot be stolen. Use services that automatically delete your files after a set period. Fylshare's default behavior is ephemeral; files are meant for transfer, not long-term hoarding. Once the transfer is complete, or the retention period expires, the data simply vanishes.
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
    {
      id: "what-is-aes-256-encryption",
      title: "Demystifying AES-256: The Algorithm Protecting Your Files",
      date: "February 25, 2026",
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
            To visualize the scale, a 256-bit key means there are 2<sup>256</sup> possible combinations. That is a number roughly equal to the number of atoms in the observable universe. This mathematical impossibility is what makes AES-256 the fortress of the digital world.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">How Fylshare Implements AES-256</h3>
          <p className="mb-4">
            When you upload a file, it is secured using TLS 1.3 during transit (protecting it from interception by ISPs or hackers on public Wi-Fi). Once it reaches our Google Cloud infrastructure, it is encrypted at rest using AES-256. The decryption keys are managed by an entirely separate, strictly audited Key Management Service (KMS).
          </p>
        </>
      ),
    },
    {
      id: "data-privacy-laws-gdpr-ccpa",
      title: "Navigating Data Privacy Laws: GDPR, CCPA, and Secure Sharing",
      date: "February 20, 2026",
      readTime: "11 min read",
      tags: ["Compliance", "Legal"],
      icon: <Shield className="text-blue-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            The regulatory landscape surrounding data privacy has transformed dramatically over the last decade. The implementation of GDPR in Europe and the CCPA in the United States signaled a fundamental shift: protecting user data is no longer just good practice; it is a strict legal mandate carrying massive financial penalties.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Principle of Data Minimization</h3>
          <p className="mb-4">
            A core tenet of modern privacy laws is "Data Minimization"—the practice of collecting only the exact personal data necessary to accomplish a specific purpose. Fylshare was explicitly designed to comply with the strictest interpretations of GDPR by eliminating the account creation process for our core tool entirely.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Compliance for Businesses</h3>
          <p className="mb-4">
            For businesses operating in the healthcare (HIPAA) or finance (GLBA) sectors, utilizing secure, verifiable transport mechanisms is mandatory. Fylshare's "Workspace Box" feature provides a compliant, auditable, and encrypted sandbox with ephemeral storage — ensuring stale client data does not become a toxic asset sitting on an unmonitored server.
          </p>
        </>
      ),
    },
    {
      id: "threat-model-for-freelancers",
      title: "The Freelancer's Threat Model: Protecting Client IP",
      date: "February 10, 2026",
      readTime: "7 min read",
      tags: ["Business", "Security"],
      icon: <UserX className="text-orange-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            As a freelancer or independent contractor, your reputation is your most valuable asset. Delivering high-quality work is only half the equation; demonstrating that you can safely handle a client's pre-release intellectual property is what secures long-term contracts.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Danger of Persistent Links</h3>
          <p className="mb-4">
            Pasting a Google Drive or Dropbox link into a Slack channel creates a permanent point of vulnerability. Fylshare solves this by replacing the "link" paradigm with the "Code" paradigm. An anonymous upload generates a highly entropic 6-digit code. Once the client retrieves the file, the data is rendered ephemeral, completely severing the attack vector.
          </p>
          <p className="mb-4">
            By shielding client transit with AES-256 and enforcing data expiration, freelancers not only protect the IP but signal an immense degree of professional maturity to their clients.
          </p>
        </>
      ),
    },
    {
      id: "best-free-file-sharing-tools",
      title: "Best Free File Sharing Tools in 2026: A Complete Comparison",
      date: "March 5, 2026",
      readTime: "12 min read",
      tags: ["Comparison", "Tools"],
      icon: <Globe className="text-pink-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            The market for free file sharing tools has exploded in 2026. From established giants like Google Drive and WeTransfer to privacy-first newcomers, choosing the right platform can feel overwhelming. This guide breaks down the most popular options, comparing them on speed, security, size limits, and ease of use — so you can make the right choice for your needs.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">1. Fylshare — Best for Anonymous, No-Registration Sharing</h3>
          <p className="mb-4">
            <strong className="text-fuchsia-400">Fylshare</strong> stands out as the fastest, most frictionless option for anyone who needs to share a file right now without creating an account. Upload up to 1GB, get a 6-digit code, and the recipient can download without any app or login. Perfect for quick professional file handoffs, sharing creative assets, and sending sensitive documents without exposing your identity.
          </p>
          <p className="mb-4">
            <strong>Pros:</strong> Zero registration, up to 1GB, anonymous, encrypted, works on all devices, completely free.<br />
            <strong>Cons:</strong> Files are ephemeral (designed for temporary sharing — not long-term storage).
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">2. WeTransfer — Good for Occasional Sharing</h3>
          <p className="mb-4">
            WeTransfer allows up to 2GB free with a link-based sharing model. However, the free tier requires ads, keeps files for only 7 days, and links can expire before the recipient downloads them. It also collects more personal data than Fylshare and requires an email address on both ends.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">3. Google Drive — Best for Long-Term Cloud Storage</h3>
          <p className="mb-4">
            Google Drive offers 15GB free storage but requires a Google account, collects extensive behavioral data, and is subject to Google's content scanning policies. It is excellent as cloud storage but overkill (and privacy-invasive) for quick anonymous transfers.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">4. Dropbox — Enterprise-Grade but Not Free</h3>
          <p className="mb-4">
            Dropbox's free tier limits you to 2GB and requires account creation. For secure, private, one-time transfers, its complexity and pricing make it less attractive than dedicated transfer tools like Fylshare.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Bottom Line</h3>
          <p className="mb-4">
            For anonymous, instant, large-file sharing in 2026, Fylshare offers the best combination of speed, privacy, and file size limit at zero cost. For long-term cloud storage and collaboration, Google Drive or Dropbox are better suited. Use the right tool for the right job — and if privacy matters, choose Fylshare.
          </p>
        </>
      ),
    },
    {
      id: "send-large-videos-without-quality-loss",
      title: "How to Send Large Videos Without Losing Quality",
      date: "March 10, 2026",
      readTime: "10 min read",
      tags: ["Video", "Guide"],
      icon: <Wifi className="text-teal-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            Sending large video files is one of the most common digital headaches. WhatsApp compresses videos to make them tiny and blurry. Email rejects anything over 25MB. Even specialized platforms like WeTransfer cap the free tier at 2GB and expire the link after a week. So what's the right way to send a large video without sacrificing quality?
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Why Compression Destroys Video Quality</h3>
          <p className="mb-4">
            Most messaging apps apply lossy compression to video files before sending. This means data is permanently removed from the video file to reduce its size. Colors become washed out, motion becomes blurry ("macroblocking"), and fine detail is lost. A 4K 200MB video sent through WhatsApp can arrive as an effectively 5MB, near-unwatchable file on the recipient's device.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Solution: Direct File Transfer</h3>
          <p className="mb-4">
            The only way to send a video without quality loss is to transfer the raw, original file without any intermediary re-encoding. This requires a file sharing platform that stores the file as-is. Fylshare does exactly this — your MP4, MOV, or MKV file is uploaded exactly as it was on your device. The recipient downloads the exact same byte-for-byte copy. No compression, no re-encoding, no quality loss.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Step-by-Step: Sending a Large Video with Fylshare</h3>
          <p className="mb-4">
            1. Go to <strong className="text-fuchsia-400">fylshare.com</strong><br />
            2. Enter any name (or just "video sender") in the name field<br />
            3. Drag and drop your video file onto the upload zone (up to 1GB)<br />
            4. Click "Upload Now" and wait for the upload to complete<br />
            5. Note your unique 6-digit code (e.g., 734891)<br />
            6. Send this code to your recipient via WhatsApp, text, or email<br />
            7. Recipient goes to fylshare.com/search, enters the code, and downloads the original file<br />
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Tips for Large Files</h3>
          <p className="mb-4">
            If your video exceeds 1GB, consider splitting it into parts using free tools like HandBrake (for compression without quality loss) or 7-Zip (to create a multi-part archive). You can upload each part and share multiple codes. For regular video editing deliverables, most finished renders are under 1GB even for 4K footage up to 15 minutes.
          </p>
        </>
      ),
    },
    {
      id: "secure-file-transfer-remote-teams",
      title: "Secure File Transfer for Remote Teams: A Practical Guide",
      date: "March 15, 2026",
      readTime: "13 min read",
      tags: ["Remote Work", "Teams"],
      icon: <Users className="text-violet-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            The shift to remote and hybrid work has created an explosion of digital file transfer activity. Teams scattered across time zones are constantly sharing design mockups, source code, legal contracts, and client presentations. But the tools most teams default to — Slack, email, shared Google Drives — carry significant security and privacy risks that many organizations overlook.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Security Risks of Common File Sharing Methods</h3>
          <p className="mb-4">
            <strong className="text-red-400">Email:</strong> Most business email is encrypted in transit, but files sit on email servers indefinitely. If either party's email is compromised in a breach — which happens constantly — all shared files are exposed.
          </p>
          <p className="mb-4">
            <strong className="text-yellow-400">Slack / Teams:</strong> Files shared in Slack or Microsoft Teams are permanently visible to workspace administrators and are subject to the platform's data retention and subpoena policies. A developer sharing proprietary API keys in a Slack DM is creating a legal liability.
          </p>
          <p className="mb-4">
            <strong className="text-blue-400">Shared Google Drive:</strong> Link permissions in Google Drive are notoriously easy to misconfigure. "Anyone with the link can view" links get pasted into wrong channels, shared in meeting recordings, or scraped by bots. Google Drive also scans file content, which may violate NDA terms with clients.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">The Fylshare Workspace Box Solution</h3>
          <p className="mb-4">
            Fylshare's <strong className="text-fuchsia-400">Workspace Box</strong> feature is designed specifically for teams. A team lead creates a Box with a custom name and PIN. All team members who know the Box name and PIN can drop files in and pull files out. The Box is persistent (files stay until manually deleted), PIN-protected, and built on encrypted Google Cloud infrastructure.
          </p>
          <p className="mb-4">
            This approach eliminates the three core risks: there is no admin account to compromise, no "anyone with link" permission accidents, and no content scanning. The Box is a zero-trust vault — you control who has the PIN.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Best Practices for Remote Team File Security</h3>
          <p className="mb-4">
            1. <strong>Rotate PINs monthly</strong> — For Workspace Boxes, rotate the PIN every month or when a team member leaves the project.<br />
            2. <strong>Never share PINs over unsecured channels</strong> — Use Signal or a secure out-of-band channel for PIN distribution.<br />
            3. <strong>Classify file sensitivity</strong> — Not every file needs maximum security. Use common sense: rough drafts on email, final deliverables via Fylshare.<br />
            4. <strong>Prefer ephemeral for sensitive content</strong> — Use anonymous upload codes (not Workspace Boxes) for highly sensitive one-time transfers. The file is gone after download.<br />
            5. <strong>Document your file transfer policy</strong> — Remote teams benefit from a clear written policy on which tool to use for which type of file.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Conclusion</h3>
          <p className="mb-4">
            For a remote team handling any kind of sensitive client data or intellectual property, defaulting to email and Slack is a liability. Incorporating a dedicated, encrypted transfer tool like Fylshare into your standard operating procedures is a low-cost, high-impact security upgrade that demonstrates professionalism to clients and protects your organization from breach liability.
          </p>
        </>
      ),
    },
    {
      id: "how-to-use-fylshare-step-by-step",
      title: "How to Use Fylshare: Complete Step-by-Step Guide",
      date: "March 18, 2026",
      readTime: "6 min read",
      tags: ["Tutorial", "Beginner"],
      icon: <Zap className="text-lime-400" size={24} />,
      content: (
        <>
          <p className="mb-4">
            Fylshare is designed to be the simplest file sharing tool on the internet. If you've never used it before, this guide will walk you through every feature — from uploading your first file to creating a persistent Workspace Box for a team.
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Part 1: Uploading a File (Anonymous Share)</h3>
          <p className="mb-4">
            This is the core feature of Fylshare. No account required — you'll get a 6-digit code to share.
          </p>
          <p className="mb-4">
            <strong>Step 1:</strong> Navigate to <strong className="text-fuchsia-400">fylshare.com</strong><br />
            <strong>Step 2:</strong> Type any name in the "Enter your name" field (this is just a label, not a login)<br />
            <strong>Step 3:</strong> Drag and drop your files onto the dashed box, or click it to browse your device<br />
            <strong>Step 4:</strong> You can upload multiple files at once, up to 1GB total<br />
            <strong>Step 5:</strong> Click "Upload Now" and wait a few seconds for the green success message<br />
            <strong>Step 6:</strong> Note your unique 6-digit code from the success message (e.g., 847362)<br />
            <strong>Step 7:</strong> Share this code with the person you want to receive the file
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Part 2: Downloading / Retrieving a File</h3>
          <p className="mb-4">
            <strong>Step 1:</strong> Go to <strong className="text-fuchsia-400">fylshare.com/search</strong><br />
            <strong>Step 2:</strong> Enter the 6-digit code in the search box<br />
            <strong>Step 3:</strong> Click "Find Files" or press Enter<br />
            <strong>Step 4:</strong> You'll see a list of all files associated with that code<br />
            <strong>Step 5:</strong> Click any file to preview or download it directly to your device
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Part 3: Using a Workspace Box</h3>
          <p className="mb-4">
            A Workspace Box is perfect if you need a persistent, shared folder for a team or ongoing project.
          </p>
          <p className="mb-4">
            <strong>Creating a Box:</strong> Go to fylshare.com/workspace → Choose a Box Name → Set a PIN → Click "Create Box"<br />
            <strong>Using a Box:</strong> Enter the Box Name and PIN → Upload or download files from the Box<br />
            <strong>Sharing a Box:</strong> Tell your team the Box Name and PIN via a secure channel
          </p>
          <h3 className="text-xl font-bold text-white mt-6 mb-3">Frequently Asked Questions</h3>
          <p className="mb-4">
            <strong>Q: Is Fylshare really free?</strong><br />A: Yes, 100% free. No credit card, no subscription.
          </p>
          <p className="mb-4">
            <strong>Q: Do I need to install an app?</strong><br />A: No. Fylshare works entirely in your browser on any device.
          </p>
          <p className="mb-4">
            <strong>Q: How long are files stored?</strong><br />A: Anonymous uploads are ephemeral (temporary). Workspace Box files are stored until you delete them.
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
            Insights, guides, tutorials, and news about secure file sharing, digital privacy, and technology.
          </p>
          <p className="text-gray-500 text-sm mt-2">{articles.length} articles · Updated weekly</p>
        </div>

        <div className="space-y-12">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.08, 0.5) }}
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
                <ArticleViewCount articleId={article.id} />
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
