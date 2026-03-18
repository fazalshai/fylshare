import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, MapPin, Clock, Shield } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in all required fields.");
      return;
    }
    // Open mailto link as a simple contact mechanism
    const subject = encodeURIComponent(form.subject || "Contact from Fylshare Website");
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
    );
    window.location.href = `mailto:hello@fylshare.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setError("");
  };

  const contacts = [
    {
      icon: <Mail size={24} className="text-fuchsia-400" />,
      title: "Email Us",
      detail: "hello@fylshare.com",
      sub: "We respond within 24 hours",
    },
    {
      icon: <Clock size={24} className="text-cyan-400" />,
      title: "Support Hours",
      detail: "Monday – Friday",
      sub: "9:00 AM – 6:00 PM IST",
    },
    {
      icon: <MapPin size={24} className="text-purple-400" />,
      title: "Based In",
      detail: "India",
      sub: "Serving users worldwide",
    },
  ];

  return (
    <div className="min-h-screen bg-transparent text-white font-[Poppins] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Hero */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6 font-[Orbitron] bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-300 text-lg max-w-2xl mx-auto"
          >
            Have a question, need help, or want to report an issue? We're here to help. Reach out and we'll get back to you as soon as possible.
          </motion.p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {contacts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel p-6 rounded-2xl border border-white/10 text-center hover:border-white/20 transition-all bg-black/40 backdrop-blur-md"
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-white/5 rounded-full">{c.icon}</div>
              </div>
              <h3 className="font-bold text-lg font-[Orbitron] text-white mb-1">{c.title}</h3>
              <p className="text-gray-200 font-medium">{c.detail}</p>
              <p className="text-gray-500 text-sm mt-1">{c.sub}</p>
            </motion.div>
          ))}
        </div>

        {/* Form + Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="glass-panel p-8 rounded-3xl border border-white/10 bg-black/40 backdrop-blur-md">
              <h2 className="text-2xl font-bold font-[Orbitron] text-white mb-6 flex items-center gap-3">
                <MessageSquare size={24} className="text-fuchsia-400" />
                Send Us a Message
              </h2>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-2 font-[Orbitron]">Message Sent!</h3>
                  <p className="text-gray-400">Your email client opened with your message. We'll reply to you within 24 hours.</p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-6 px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 rounded-full text-white font-semibold transition"
                  >
                    Send Another
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-red-400 text-sm">{error}</div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <User size={14} /> Full Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white placeholder-gray-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                        <Mail size={14} /> Email Address <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white placeholder-gray-600"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="What is your message about?"
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white placeholder-gray-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2 flex items-center gap-1">
                      <MessageSquare size={14} /> Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Describe your question or issue in detail..."
                      rows={6}
                      className="w-full p-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500 transition text-white placeholder-gray-600 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 rounded-xl text-white font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-fuchsia-500/20"
                  >
                    <Send size={18} />
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Side Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >

            {/* Direct Email */}
            <div className="glass-panel p-6 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-900/10 backdrop-blur-md">
              <h3 className="font-bold font-[Orbitron] text-fuchsia-300 mb-3 flex items-center gap-2">
                <Mail size={18} /> Direct Email
              </h3>
              <p className="text-gray-400 text-sm mb-3">Prefer to email directly? Reach us at:</p>
              <a
                href="mailto:hello@fylshare.com"
                className="text-fuchsia-400 font-bold hover:text-fuchsia-300 transition text-lg"
              >
                hello@fylshare.com
              </a>
              <p className="text-gray-500 text-xs mt-2">For support, abuse reports, and business inquiries.</p>
            </div>

            {/* Privacy Note */}
            <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-cyan-900/10 backdrop-blur-md">
              <h3 className="font-bold font-[Orbitron] text-cyan-300 mb-3 flex items-center gap-2">
                <Shield size={18} /> Privacy Committed
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your contact information is used only to respond to your inquiry. We never sell your data or contact you for marketing purposes without consent.
              </p>
            </div>

            {/* Response Times */}
            <div className="glass-panel p-6 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-md">
              <h3 className="font-bold font-[Orbitron] text-white mb-4">Typical Response Times</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex justify-between items-center">
                  <span>General inquiries</span>
                  <span className="text-green-400 font-bold">Within 24h</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Technical support</span>
                  <span className="text-yellow-400 font-bold">24–48h</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Abuse reports</span>
                  <span className="text-red-400 font-bold">Priority</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Business partnerships</span>
                  <span className="text-blue-400 font-bold">2–5 days</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* FAQ CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center bg-gradient-to-r from-fuchsia-900/20 to-cyan-900/20 rounded-3xl p-10 border border-white/10"
        >
          <h2 className="text-2xl font-bold font-[Orbitron] text-white mb-3">Looking for Quick Answers?</h2>
          <p className="text-gray-400 mb-6">Our FAQ page covers the most common questions about Fylshare.</p>
          <a
            href="/faq"
            className="inline-block px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
          >
            Browse FAQ →
          </a>
        </motion.div>

      </div>
    </div>
  );
}
