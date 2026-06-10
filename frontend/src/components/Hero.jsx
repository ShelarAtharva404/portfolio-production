import { useEffect, useRef, useState } from "react";
import { Code2, Link2, Mail, Phone, ArrowDown, Download } from "lucide-react";
import { personal } from "../data/portfolio";

const ROLES = [
  "Full-Stack Developer",
  "Cloud Engineer",
  "DevOps Engineer",
  "React Developer",
  "Node.js Developer",
  "Kubernetes Enthusiast",
];

function TypingText() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const target = ROLES[index];
    let timeout;
    if (!deleting && text === target) {
      timeout = setTimeout(() => setDeleting(true), 2000);
    } else if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
    } else {
      const speed = deleting ? 40 : 80;
      timeout = setTimeout(() => {
        setText((t) => deleting ? t.slice(0, -1) : target.slice(0, t.length + 1));
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [text, deleting, index]);

  return (
    <span className="text-gradient font-display font-bold">
      {text}
      <span className="animate-pulse text-accent">|</span>
    </span>
  );
}

function FloatingOrb({ size, color, style }) {
  return (
    <div
      className="absolute rounded-full opacity-20 animate-pulse-slow pointer-events-none"
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: "blur(40px)",
        ...style,
      }}
    />
  );
}

export default function Hero() {
  const canvasRef = useRef(null);

  // Particle canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const particles = [];
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108, 99, 255, ${p.opacity})`;
        ctx.fill();
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108, 99, 255, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg"
    >
      {/* Canvas background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Ambient orbs */}
      <FloatingOrb size="600px" color="#6C63FF" style={{ top: "-10%", right: "-10%" }} />
      <FloatingOrb size="400px" color="#00F5FF" style={{ bottom: "10%", left: "-5%" }} />
      <FloatingOrb size="300px" color="#FF4D4D" style={{ top: "50%", left: "60%" }} />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-32 text-center">
        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-accent/20 text-xs font-mono text-text-secondary mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Available for opportunities · Surat, Gujarat
        </div>

        {/* Name */}
        <h1 className="font-display font-bold text-4xl sm:text-6xl md:text-7xl text-text-primary mb-4 leading-tight">
          Hi, I'm{" "}
          <span className="relative inline-block">
            <span className="text-gradient">Atharva</span>
            <span
              className="absolute -bottom-1 left-0 right-0 h-1 rounded-full"
              style={{ background: "linear-gradient(90deg, #6C63FF, #00F5FF)" }}
            />
          </span>
        </h1>

        {/* Typing role */}
        <div className="text-2xl sm:text-3xl md:text-4xl mb-6 h-12 flex items-center justify-center">
          <TypingText />
        </div>

        {/* Tagline */}
        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-4 font-display">
          {personal.tagline}
        </p>
        <p className="text-text-muted text-sm sm:text-base max-w-xl mx-auto mb-10">
          {personal.bio}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 sm:gap-10 mb-10">
          {[
            { label: "CGPA", value: "8.61" },
            { label: "Projects", value: "15+" },
            { label: "Internships", value: "2" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-2xl sm:text-3xl text-gradient">
                {s.value}
              </div>
              <div className="text-text-muted text-xs font-mono uppercase tracking-widest mt-1">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href="#projects"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-sm bg-accent text-white hover:bg-accent/80 transition-all duration-300 glow-accent"
          >
            View Projects
          </a>
          <a
            href="#contact"
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-sm glass border border-accent/30 text-text-primary hover:border-accent/60 hover:bg-accent/10 transition-all duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Social Links */}
        <div className="flex items-center justify-center gap-4">
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
              className="p-3 rounded-xl glass border border-white/5 text-text-secondary hover:text-accent hover:border-accent/30 transition-all duration-200"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-text-muted hover:text-accent transition-colors group"
      >
        <span className="text-xs font-mono">scroll</span>
        <ArrowDown size={16} className="animate-bounce group-hover:text-accent" />
      </a>
    </section>
  );
}
