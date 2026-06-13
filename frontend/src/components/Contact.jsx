import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { personal as staticPersonal } from "../data/portfolio";
import { Mail, Phone, MapPin, Send, Code2, Link2, CheckCircle2, AlertCircle } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Contact({ personal }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null); // null | "loading" | "success" | "error"

  const data = personal || staticPersonal;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const contactLinks = [
    { icon: Mail, label: "Email", value: data.email, href: `mailto:${data.email}` },
    { icon: Phone, label: "Phone", value: data.phone, href: `tel:${data.phone}` },
    { icon: MapPin, label: "Location", value: data.location, href: null },
    { icon: Code2, label: "GitHub", value: data.github.replace("https://", ""), href: data.github },
    { icon: Link2, label: "LinkedIn", value: data.linkedin.replace("https://", ""), href: data.linkedin },
  ];

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={ref} className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">Contact</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Let's Work Together
          </h2>
          <p className="text-text-secondary max-w-xl">
            Open to internships, freelance projects, and full-time roles. Drop me a message.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactLinks.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="glass rounded-xl p-4 border border-[#1E1E30] flex items-center gap-4 hover:border-accent/30 transition-colors group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/20 transition-colors">
                  <Icon size={16} className="text-accent" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wider">{label}</div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="text-sm text-text-primary hover:text-accent transition-colors truncate block"
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm text-text-primary truncate block">{value}</span>
                  )}
                </div>
              </div>
            ))}

            {/* Availability badge */}
            <div className="glass rounded-xl p-4 border border-green-500/20 bg-green-500/5">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-xs font-mono uppercase tracking-wider">Available Now</span>
              </div>
              <p className="text-text-secondary text-xs">
                Open to internships, freelance, and full-time roles in full-stack, cloud, or DevOps.
              </p>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 border border-[#1E1E30]">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full px-4 py-3 rounded-xl bg-void border border-[#1E1E30] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-void border border-[#1E1E30] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Internship opportunity / Project collaboration"
                    className="w-full px-4 py-3 rounded-xl bg-void border border-[#1E1E30] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Message</label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Tell me about the opportunity..."
                    className="w-full px-4 py-3 rounded-xl bg-void border border-[#1E1E30] text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all resize-none"
                  />
                </div>

                {/* Status messages */}
                {status === "success" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                    <CheckCircle2 size={16} />
                    Message sent! I'll get back to you soon.
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    <AlertCircle size={16} />
                    Something went wrong. Please email me directly.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-3 px-6 rounded-xl font-medium text-sm bg-accent text-white hover:bg-accent/80 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 glow-accent flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
