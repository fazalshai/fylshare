import React from "react";
import { motion } from "framer-motion";
import { Upload, Search, Box, Shield, Zap, Globe, Lock, Users } from "lucide-react";

export default function AboutUs() {
  const features = [
    {
      icon: <Upload size={32} className="text-fuchsia-400" />,
      title: "Fast Uploads",
      desc: "Drag & drop files up to 1GB. Instant 6-digit code generation.",
    },
    {
      icon: <Search size={32} className="text-cyan-400" />,
      title: "Instant Retrieval",
      desc: "Retrieve files anywhere using just a simple code. No login required.",
    },
    {
      icon: <Box size={32} className="text-purple-400" />,
      title: "Personal Workspace",
      desc: "Create a secure 'Box' to store files persistently with a PIN.",
    },
    {
      icon: <Shield size={32} className="text-green-400" />,
      title: "Secure & Private",
      desc: "Files are encrypted in transit and stored securely on Google Cloud.",
    },
  ];

  const howItWorks = [
    {
      step: "01",
      icon: <Upload size={28} className="text-fuchsia-400" />,
      title: "How It Works: Upload",
      text: "Simply drag and drop your files onto the homepage. We'll generate a unique 6-digit code for you. Share this code with anyone you want to send the file to. No registration, no sign-up, no email required — just upload and go.",
      highlights: [
        { icon: <Upload size={18} className="text-yellow-400" />, text: "No registration needed" },
        { icon: <Zap size={18} className="text-cyan-400" />, text: "Up to 1GB per upload" },
        { icon: <Lock size={18} className="text-green-400" />, text: "AES-256 encrypted at rest" },
      ],
    },
    {
      step: "02",
      icon: <Search size={28} className="text-cyan-400" />,
      title: "How It Works: Retrieval",
      text: "Navigate to the Search page and enter the 6-digit code. You'll instantly see the files associated with that code, ready for download. Works on any device — iPhone, Android, Windows, Mac, Linux — without installing any app.",
      highlights: [
        { icon: <Search size={18} className="text-fuchsia-400" />, text: "Instant file preview" },
        { icon: <Globe size={18} className="text-green-400" />, text: "Works on any device" },
        { icon: <Zap size={18} className="text-yellow-400" />, text: "Direct download links" },
      ],
    },
    {
      step: "03",
      icon: <Box size={28} className="text-purple-400" />,
      title: "Your Private Workspace",
      text: "Need to keep files longer? Create a 'Box' with a custom ID and PIN. This works like a secure cloud folder where you and your team can manage files collaboratively. The Box is persistent, PIN-protected, and built on Google Cloud infrastructure.",
      highlights: [
        { icon: <Box size={18} className="text-purple-400" />, text: "PIN Protected" },
        { icon: <Shield size={18} className="text-blue-400" />, text: "Persistent Storage" },
        { icon: <Users size={18} className="text-cyan-400" />, text: "Team Collaboration" },
      ],
    },
  ];

  const stats = [
    { value: "1 GB", label: "Max Upload Size" },
    { value: "10", label: "Files Per Upload" },
    { value: "0", label: "Registrations Required" },
    { value: "100%", label: "Free to Use" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-24 pb-20 px-4">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-20">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-7xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400"
        >
          About Fylshare
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-2xl mx-auto"
        >
          The fastest, simplest way to share files anonymously. No sign-ups, no hassle—just share.
        </motion.p>
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 mb-20"
      >
        {stats.map((s, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl text-center border border-white/10">
            <div className="text-3xl font-bold font-[Orbitron] text-fuchsia-400">{s.value}</div>
            <div className="text-gray-400 text-sm mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors border border-white/10"
          >
            <div className="mb-4 bg-white/5 p-4 rounded-full">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2 font-[Orbitron]">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* How It Works — Step-by-Step with Icons (no broken images) */}
      <div className="max-w-5xl mx-auto space-y-12 mb-24">
        {howItWorks.map((step, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className={`flex flex-col ${idx % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-10`}
          >
            {/* Text Side */}
            <div className="flex-1 space-y-5">
              <div className="flex items-center gap-4">
                <span className="text-5xl font-black font-[Orbitron] text-white/10">{step.step}</span>
                <div className="p-3 bg-white/5 rounded-full">{step.icon}</div>
              </div>
              <h2 className="text-3xl font-bold font-[Orbitron] text-fuchsia-300">{step.title}</h2>
              <p className="text-lg text-gray-300 leading-relaxed">{step.text}</p>
              <ul className="space-y-3">
                {step.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-400">
                    {h.icon}
                    <span>{h.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual Card Side */}
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative glass-panel rounded-2xl border border-white/10 p-8 text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-white/5 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <h4 className="text-xl font-bold font-[Orbitron] text-white">{step.title}</h4>
                  <p className="text-gray-400 text-sm">Step {step.step} of {howItWorks.length}</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {howItWorks.map((_, dotIdx) => (
                      <div
                        key={dotIdx}
                        className={`w-2 h-2 rounded-full ${dotIdx === idx ? "bg-fuchsia-400 w-6" : "bg-white/20"} transition-all`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mission Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto mb-20 bg-gradient-to-r from-fuchsia-900/20 to-cyan-900/20 rounded-3xl p-10 border border-fuchsia-500/20"
      >
        <h2 className="text-3xl font-bold font-[Orbitron] text-white mb-4">Our Mission</h2>
        <p className="text-gray-300 leading-relaxed text-lg">
          We built Fylshare because we believed the internet needed a truly frictionless, anonymous, and secure way to share files. In a world where every app demands your phone number, email, and date of birth just to send a document, we chose a different path. Fylshare proves that great software doesn't need to harvest your identity to serve you well.
        </p>
        <p className="text-gray-400 leading-relaxed mt-4">
          Fylshare is built by developers who believe in privacy as a fundamental right — not a premium feature. Every design decision we make starts with one question: does this protect the user?
        </p>
      </motion.div>

      {/* CTA */}
      <div className="text-center mt-12 max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 font-[Orbitron]">Ready to start sharing?</h2>
        <p className="text-gray-400 mb-8">Join thousands of users sharing files securely every day.</p>
        <a
          href="/"
          className="inline-block px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          Start Uploading Now
        </a>
      </div>
    </div>
  );
}
