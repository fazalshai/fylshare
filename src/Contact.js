import React, { useState } from "react";
import { Mail, Clock, Shield, CheckCircle2 } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    category: "support",
    code: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.message.trim()) {
      setError("Please describe your request or issue.");
      return;
    }
    const subject = encodeURIComponent(
      `[Fylshare ${form.category.toUpperCase()}] ${
        form.code ? `Code ${form.code}` : "Inquiry"
      }`
    );
    const body = encodeURIComponent(
      `Category: ${form.category}\nTransfer Code (if applicable): ${
        form.code || "N/A"
      }\nContact Email: ${form.email || "Not provided"}\n\nDetails:\n${
        form.message
      }`
    );
    window.location.href = `mailto:fylshare.official@gmail.com?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <div className="bg-[#FFFFFF] text-[#1D1D1F] py-14 px-4 sm:px-6">
      <div className="max-w-[920px] mx-auto space-y-10">
        <header className="border-b border-[#D2D2D7] pb-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#6E6E73] mb-1">
            Support &amp; Trust
          </p>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-tight text-[#1D1D1F]">
            Contact Support or Report Abuse
          </h1>
          <p className="text-[15px] text-[#6E6E73] mt-2 max-w-2xl">
            Get help with a transfer, submit a copyright or abuse takedown notice, or request deletion assistance.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form (7 cols) */}
          <div className="lg:col-span-7 apple-card rounded-2xl p-6 sm:p-8">
            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 size={32} className="text-emerald-600 mx-auto" />
                <h2 className="text-[20px] font-semibold text-[#1D1D1F]">
                  Email Draft Prepared
                </h2>
                <p className="text-[13px] text-[#6E6E73] max-w-sm mx-auto leading-relaxed">
                  Your email client has opened with your message addressed to{" "}
                  <strong className="text-[#1D1D1F]">
                    fylshare.official@gmail.com
                  </strong>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      category: "support",
                      code: "",
                      email: "",
                      message: "",
                    });
                  }}
                  className="px-4 py-2 rounded-lg border border-[#D2D2D7] text-[13px] font-semibold text-[#1D1D1F]"
                >
                  Prepare Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
                {error && (
                  <div
                    role="alert"
                    className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800"
                  >
                    {error}
                  </div>
                )}

                <div>
                  <label
                    htmlFor="contact-category"
                    className="block font-medium text-[#1D1D1F] mb-1"
                  >
                    Request Type
                  </label>
                  <select
                    id="contact-category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  >
                    <option value="support">Technical Support</option>
                    <option value="abuse">
                      Report Abuse / Prohibited Content
                    </option>
                    <option value="copyright">
                      Copyright / DMCA Takedown Notice
                    </option>
                    <option value="privacy">
                      Privacy or Deletion Request
                    </option>
                    <option value="lawful">
                      Verified Lawful / Regulatory Request
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-code"
                      className="block font-medium text-[#1D1D1F] mb-1"
                    >
                      6-Digit Code{" "}
                      <span className="text-[#6E6E73] font-normal">
                        (if applicable)
                      </span>
                    </label>
                    <input
                      id="contact-code"
                      type="text"
                      name="code"
                      maxLength={6}
                      placeholder="e.g., 123456"
                      value={form.code}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] font-mono text-[#1D1D1F]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block font-medium text-[#1D1D1F] mb-1"
                    >
                      Reply Email{" "}
                      <span className="text-[#6E6E73] font-normal">
                        (optional)
                      </span>
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block font-medium text-[#1D1D1F] mb-1"
                  >
                    Details <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="Provide relevant details (such as the transfer code, approximate upload time, or nature of the violation). Do not attach or include government ID numbers."
                    value={form.message}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F5F5F7] border border-[#D2D2D7] text-[#1D1D1F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#0066CC] hover:bg-[#0055B3] text-white font-semibold text-[14px] transition-colors"
                >
                  Continue to Email
                </button>
              </form>
            )}
          </div>

          {/* Info Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4 text-[13px]">
            <div className="apple-surface rounded-2xl p-5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F]">
                <Mail size={16} className="text-[#0066CC]" />
                <span>Direct Email</span>
              </div>
              <p className="text-[#6E6E73]">
                <a
                  href="mailto:fylshare.official@gmail.com"
                  className="text-[#0066CC] hover:underline font-medium"
                >
                  fylshare.official@gmail.com
                </a>
              </p>
            </div>

            <div className="apple-surface rounded-2xl p-5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F]">
                <Clock size={16} className="text-[#0066CC]" />
                <span>Response Targets</span>
              </div>
              <ul className="space-y-1 text-[#6E6E73]">
                <li>Abuse &amp; takedown reports: Priority review</li>
                <li>Technical &amp; privacy inquiries: 24–48 hours</li>
              </ul>
            </div>

            <div className="apple-surface rounded-2xl p-5 space-y-1.5">
              <div className="flex items-center gap-2 font-semibold text-[#1D1D1F]">
                <Shield size={16} className="text-[#0066CC]" />
                <span>Safe Ownership Verification</span>
              </div>
              <p className="text-[#6E6E73] leading-relaxed">
                To request early deletion of an anonymous transfer when you no longer have browser access to your revocation token, provide the 6-digit code, exact filename(s), and approximate upload timestamp. Never send government identity documents through support forms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
