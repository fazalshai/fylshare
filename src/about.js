import React from "react";
import { motion } from "framer-motion";
import { Upload, Search, Box, Shield, Zap, Globe } from "lucide-react";

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
      desc: "Files are encrypted in transit and purged automatically after 24 hours.",
    },
  ];

  const sections = [
    {
      title: "How It Works: Upload",
      text: "Simply drag and drop your files onto the homepage. We'll generate a unique 6-digit code for you. Share this code with anyone you want to send the file to.",
      image: "/assets/home.png",
      reverse: false,
      features: [
        { icon: <Upload size={20} className="text-yellow-400" />, text: "No registration needed" },
        { icon: <Zap size={20} className="text-cyan-400" />, text: "Up to 1GB per upload" }
      ]
    },
    {
      title: "How It Works: Retrieval",
      text: "Navigate to the Search page and enter the 6-digit code. You'll instantly see the files associated with that code, ready for download.",
      image: "/assets/search.png",
      reverse: true,
      features: [
        { icon: <Search size={20} className="text-fuchsia-400" />, text: "Instant file preview" },
        { icon: <Globe size={20} className="text-green-400" />, text: "Works on any device" }
      ]
    },
    {
      title: "Your Private Workspace",
      text: "Need to keep files longer? Create a 'Box' with a custom ID and PIN. This works like a cloud folder where you can manage files securely.",
      image: "/assets/workspace.png",
      reverse: false,
      features: [
        { icon: <Box size={20} className="text-purple-400" />, text: "PIN Protected" },
        { icon: <Shield size={20} className="text-blue-400" />, text: "Persistent Storage" }
      ]
    },
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

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-32">
        {features.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center hover:bg-white/10 transition-colors"
          >
            <div className="mb-4 bg-white/5 p-4 rounded-full">{f.icon}</div>
            <h3 className="text-xl font-bold mb-2 font-[Orbitron]">{f.title}</h3>
            <p className="text-sm text-gray-400">{f.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed Walkthrough Sections */}
      <div className="max-w-7xl mx-auto space-y-32">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: section.reverse ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`flex flex-col ${section.reverse ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
          >
            <div className="flex-1 space-y-6">
              <h2 className="text-4xl font-bold font-[Orbitron] text-fuchsia-300">{section.title}</h2>
              <p className="text-lg text-gray-300 leading-relaxed">{section.text}</p>
              <ul className="space-y-3 text-gray-400">
                {section.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3">
                    {feat.icon}
                    <span>{feat.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 w-full">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                <img
                  src={section.image}
                  alt={section.title}
                  className="relative rounded-2xl shadow-2xl border border-white/10 w-full object-cover hover:scale-[1.02] transition-transform duration-500"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer / CTA */}
      <div className="text-center mt-32 max-w-2xl mx-auto">
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
