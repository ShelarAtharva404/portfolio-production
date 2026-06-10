import { useInView } from "react-intersection-observer";
import { skills, currentlyLearning } from "../data/portfolio";

const categoryColors = {
  Frontend: "#6C63FF",
  "Backend & APIs": "#00F5FF",
  "AWS Cloud": "#FFB800",
  "GCP & Firebase": "#FF4D4D",
  Azure: "#00B4D8",
  "DevOps & CI/CD": "#6C63FF",
  Monitoring: "#00F5FF",
  Databases: "#FFB800",
  Languages: "#FF4D4D",
};

function SkillCard({ category, items, delay }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const color = categoryColors[category] || "#6C63FF";

  return (
    <div
      ref={ref}
      className={`glass rounded-2xl p-5 border border-[#1E1E30] card-hover transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-2 h-2 rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
        />
        <span
          className="text-xs font-mono uppercase tracking-widest font-medium"
          style={{ color }}
        >
          {category}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((skill) => (
          <span key={skill} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Skills() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="skills" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div ref={ref} className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">
              Tech Stack
            </span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Skills & Technologies
          </h2>
          <p className="text-text-secondary max-w-xl">
            A full-spectrum toolkit — from pixel-perfect UIs to self-healing Kubernetes clusters.
          </p>
        </div>

        {/* Skill grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {Object.entries(skills).map(([cat, items], i) => (
            <SkillCard key={cat} category={cat} items={items} delay={i * 60} />
          ))}
        </div>

        {/* Currently learning */}
        <div className="glass rounded-2xl p-6 border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-mono uppercase tracking-widest text-accent">
              Currently Learning
            </span>
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          </div>
          <div className="flex flex-wrap gap-3">
            {currentlyLearning.map((item) => (
              <span
                key={item}
                className="px-4 py-2 rounded-xl text-sm font-mono border border-accent/30 bg-accent/10 text-accent hover:bg-accent/20 transition-colors cursor-default"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
