import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, MapPin, Clock, Shield, CheckCircle, ArrowRight } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    const subject = encodeURIComponent(form.subject || "Contact from Fylshare Website");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:hello@fylshare.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setError("");
  };

  const infoItems = [
    {
      icon: <Mail size={20} className="text-fuchsia-400" />,
      label: "Email",
      value: "hello@fylshare.com",
      sub: "Responds within 24 hours",
      href: "mailto:hello@fylshare.com",
      accent: "fuchsia",
    },
    {
      icon: <Clock size={20} className="text-cyan-400" />,
      label: "Support Hours",
      value: "Mon – Fri, 9AM – 6PM",
      sub: "Indian Standard Time (IST)",
      accent: "cyan",
    },
    {
      icon: <MapPin size={20} className="text-purple-400" />,
      label: "Location",
      value: "India",
      sub: "Serving users worldwide",
      accent: "purple",
    },
  ];

  const responseTimes = [
    { type: "General inquiries", time: "Within 24h", color: "text-emerald-400" },
    { type: "Technical support", time: "24 – 48h", color: "text-yellow-400" },
    { type: "Abuse reports", time: "Priority", color: "text-red-400" },
    { type: "Business partnerships", time: "2 – 5 days", color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Page Header ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-fuchsia-400 mb-4 bg-fuchsia-500/10 border border-fuchsia-500/20 px-4 py-2 rounded-full">
            Get In Touch
          </span>
          <h1 className="text-5xl md:text-7xl font-bold font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 mb-6 leading-tight">
            Contact Us
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Have a question, found a bug, or want to partner with us? We read every message personally.
          </p>
        </motion.div>

        {/* ── Main Grid ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start">

          {/* LEFT — Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 md:p-10 shadow-2xl shadow-black/40">
              {/* Glow accent */}
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-fuchsia-600/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-center py-16"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mb-6">
                      <CheckCircle size={40} className="text-emerald-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-3 font-[Orbitron]">Message Sent!</h3>
                    <p className="text-gray-400 max-w-xs">
                      Your email client opened with your message ready. We'll reply within 24 hours.
                    </p>
                    <button
                      onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-8 px-8 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-semibold transition"
                    >
                      Send Another Message
                    </button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-10 h-10 rounded-full bg-fuchsia-500/20 flex items-center justify-center">
                        <MessageSquare size={18} className="text-fuchsia-400" />
                      </div>
                      <h2 className="text-2xl font-bold font-[Orbitron] text-white">Send a Message</h2>
                    </div>

                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm mb-6"
                      >
                        {error}
                      </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                      {/* Name + Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            <User size={12} /> Full Name <span className="text-fuchsia-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Fazal Shaik"
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60 transition text-white placeholder-gray-600 text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                            <Mail size={12} /> Email <span className="text-fuchsia-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60 transition text-white placeholder-gray-600 text-sm"
                            required
                          />
                        </div>
                      </div>

                      {/* Subject */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          Subject
                        </label>
                        <input
                          type="text"
                          name="subject"
                          value={form.subject}
                          onChange={handleChange}
                          placeholder="What's this about?"
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60 transition text-white placeholder-gray-600 text-sm"
                        />
                      </div>

                      {/* Message */}
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                          <MessageSquare size={12} /> Message <span className="text-fuchsia-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Describe your question or issue in detail..."
                          rows={6}
                          className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/60 focus:border-fuchsia-500/60 transition text-white placeholder-gray-600 resize-none text-sm"
                          required
                        />
                      </div>

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-600/30 text-base"
                      >
                        <Send size={18} />
                        Send Message
                        <ArrowRight size={16} className="ml-1" />
                      </motion.button>

                      <p className="text-center text-gray-600 text-xs">
                        This opens your email client with your message pre-filled.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>
          </motion.div>

          {/* RIGHT — Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="space-y-6"
          >
            {/* Contact Info Cards */}
            {infoItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-start gap-5 p-6 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.06] transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="text-white font-bold text-lg hover:text-fuchsia-300 transition truncate block">
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-white font-bold text-lg">{item.value}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}

            {/* Response Times */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl border border-white/8 bg-white/[0.03] backdrop-blur-md"
            >
              <h3 className="font-bold font-[Orbitron] text-white text-sm mb-5 flex items-center gap-2">
                <Clock size={16} className="text-cyan-400" />
                Typical Response Times
              </h3>
              <div className="space-y-3">
                {responseTimes.map((r, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-gray-400 text-sm">{r.type}</span>
                    <span className={`font-bold text-sm ${r.color}`}>{r.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Privacy Note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-start gap-4 p-6 rounded-2xl border border-cyan-500/20 bg-cyan-900/10 backdrop-blur-md"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                <Shield size={18} className="text-cyan-400" />
              </div>
              <div>
                <h4 className="font-bold text-cyan-300 text-sm font-[Orbitron] mb-1">Privacy Committed</h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Your contact information is used only to respond to your inquiry. We never sell data or send unsolicited marketing.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── FAQ CTA Banner ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-20 relative overflow-hidden rounded-3xl border border-white/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-900/30 via-purple-900/20 to-cyan-900/30" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 p-10 md:p-14">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold font-[Orbitron] text-white mb-2">
                Looking for Quick Answers?
              </h2>
              <p className="text-gray-400">
                Our FAQ covers the most common questions about Fylshare — no waiting required.
              </p>
            </div>
            <a
              href="/faq"
              className="flex-shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-100 transition-all shadow-lg shadow-white/10 hover:shadow-white/20 text-sm whitespace-nowrap"
            >
              Browse FAQ
              <ArrowRight size={16} />
            </a>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
