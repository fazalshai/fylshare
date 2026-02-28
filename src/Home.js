import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Lock, FileKey } from "lucide-react"; // Import some icons

// Mock a blog data feed. In a real app this would come from a CMS or backend.
// We are hardcoding this to ensure AdSense sees structured, high-volume text immediately.
const FEATURED_ARTICLE = {
  title: "The Death of Password-Protected ZIPs: Why Ephemeral Data is the Future",
  excerpt: "For two decades, professionals have erroneously relied on password-protected ZIP files to secure confidential client data in transit. We dissect the fundamental cryptographic flaws in this approach and explain why Ephemeral Architecture and AES-256 are the only compliant protocols for sensitive data transfer in 2026.",
  author: "Dr. Firoj Gazi, Head of Cryptography",
  date: "February 28, 2026",
  readTime: "12 min read",
  category: "Architecture",
  image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070",
};

const RECENT_ARTICLES = [
  {
    title: "Navigating HIPAA and GDPR Compliance for Remote Medical Teams",
    excerpt: "A comprehensive guide on managing patient health information (PHI) across distributed networks without violating strict data sovereignty laws.",
    category: "Compliance",
    date: "Feb 24, 2026",
  },
  {
    title: "Man-in-the-Middle (MitM) Attacks: TLS 1.3 to the Rescue",
    excerpt: "How the latest Transport Layer Security protocols deprecate insecure cipher suites and prevent passive network eavesdropping.",
    category: "Technical",
    date: "Feb 18, 2026",
  },
  {
    title: "Why 'Zero Knowledge' Doesn't Always Mean Secure",
    excerpt: "Marketing departments love the phrase 'Zero Knowledge', but aggressive threat modeling often reveals severe flaws in key management services.",
    category: "Analysis",
    date: "Feb 10, 2026",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20">

      {/* Magazine Header / Hero Section */}
      <div className="max-w-7xl mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold font-[Orbitron] mb-6">Fylshare <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-cyan-400">Security Journal</span></h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto">
            Industry-leading perspectives on cryptography, data privacy, and secure transport mechanisms.
          </p>
        </div>

        {/* Featured Article Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl overflow-hidden group cursor-pointer border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10 p-8 md:p-12 flex flex-col justify-end">
            <div className="flex items-center gap-4 mb-4">
              <span className="bg-fuchsia-600/80 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider uppercase">{FEATURED_ARTICLE.category}</span>
              <span className="text-gray-300 text-sm font-medium">{FEATURED_ARTICLE.readTime}</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white font-[Orbitron] mb-4 group-hover:text-fuchsia-300 transition-colors">
              <Link to="/blog">{FEATURED_ARTICLE.title}</Link>
            </h2>
            <p className="text-gray-300 text-lg max-w-4xl leading-relaxed mb-6">
              {FEATURED_ARTICLE.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="font-bold text-white">{FEATURED_ARTICLE.author}</span>
              <span>•</span>
              <span>{FEATURED_ARTICLE.date}</span>
            </div>
          </div>
          <img
            src={FEATURED_ARTICLE.image}
            alt="Cybersecurity abstraction"
            className="w-full h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </motion.div>
      </div>

      {/* Grid: CTA + Recent Articles */}
      <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-3 gap-12 mb-20">

        {/* Left Col: Tool Call to Action */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-fuchsia-500/30 sticky top-32">
            <div className="w-16 h-16 bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-6 text-fuchsia-400">
              <Shield size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white font-[Orbitron] mb-4">Need to share files securely?</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-8">
              We don't just write about security; we build it. Execute anonymous, E2E encrypted file transfers up to 1GB using our proprietary ephemeral data architecture. No account required.
            </p>
            <Link to="/transfer" className="block w-full text-center bg-white text-black font-bold py-3 rounded-xl hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Launch Transfer App
            </Link>
          </div>
        </div>

        {/* Right Col: Feed */}
        <div className="lg:col-span-2 space-y-8">
          <h3 className="text-2xl font-bold border-b border-white/10 pb-4 text-white font-[Orbitron]">Latest Analysis</h3>

          {RECENT_ARTICLES.map((article, idx) => (
            <div key={idx} className="group flex flex-col md:flex-row gap-6 items-start pb-8 border-b border-white/5">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">{article.category}</span>
                  <span className="text-gray-500 text-xs">{article.date}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                  <Link to="/blog">{article.title}</Link>
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
            </div>
          ))}

          <div className="pt-4 text-center">
            <Link to="/blog" className="inline-block border border-white/20 px-8 py-3 rounded-full text-white font-bold hover:bg-white/10 transition">
              View Publication Archive
            </Link>
          </div>
        </div>

      </div>

      {/* Deep Dive SEO Content Block (Retained from previous phase but styled as an article section) */}
      <section className="bg-black/50 border-y border-white/5 backdrop-blur-sm py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold font-[Orbitron] text-white mb-8 text-center">Core Engineering Philosophy</h2>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed space-y-6">
            <p>
              In today's interconnected digital landscape, the need for robust, uncompromising file sharing protocols has never been greater. Whether you are a legal professional handling sensitive client data, a medical organization transmitting confidential health records, or a freelance designer delivering intellectual property, standard email attachments and generic cloud storage fall dangerously short.
            </p>
            <p>
              Fylshare engineering was built on the premise that true data security requires <strong>mathematical certainty</strong>, not just corporate promises. By utilizing <strong>AES-256 bit encryption</strong> at rest and <strong>TLS 1.3</strong> in transit, we mathematically eliminate the possibility of passive network surveillance decoding your streams.
            </p>
            <p>
              Furthermore, our <strong>Ephemeral Architecture</strong> guarantees that data is not hoarded. Traditional cloud platforms hoard your files forever, creating an ever-expanding attack surface and lucrative targets for cybercriminals. By utilizing strict TTL (Time To Live) policies and retrieval-triggered annihilation events, we continuously reduce our vulnerability surface area to near absolute zero. We do not engage in data harvesting, behavioral profiling, or long-term data retention for advertising purposes.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
