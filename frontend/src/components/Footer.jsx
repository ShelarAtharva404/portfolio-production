import { personal } from "../data/portfolio";
import { Code2, Link2, Mail, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-10 px-4 sm:px-6 border-t border-[#1E1E30]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
            <span className="font-mono text-xs font-bold text-accent">A</span>
          </div>
          <span className="font-display text-sm text-text-secondary">
            Atharva Shelar<span className="text-accent">.</span>
          </span>
        </div>

        <p className="text-text-muted text-xs font-mono flex items-center gap-1">
          Built with <Heart size={10} className="text-accent fill-accent" /> using React + Node.js + MongoDB
        </p>

        <div className="flex items-center gap-3">
          {[
            { icon: Code2, href: personal.github, label: "GitHub" },
            { icon: Link2, href: personal.linkedin, label: "LinkedIn" },
            { icon: Mail, href: `mailto:${personal.email}`, label: "Email" },
          ].map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
              aria-label={label}
            >
              <Icon size={15} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
