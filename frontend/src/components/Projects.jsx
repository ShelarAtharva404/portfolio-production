import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { projects } from "../data/portfolio";
import { Code2, Star } from "lucide-react";

const CATEGORIES = ["All", "DevOps & Infrastructure", "Full-Stack & Cloud Applications", "Cloud & AWS", "AI & Firebase", "Brand Design & Devops", "Systems & CS"];

function ProjectCard({ project, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  return (
    <div
      ref={ref}
      className={`group glass rounded-2xl p-6 border border-[#1E1E30] card-hover flex flex-col gap-4 transition-all duration-700 ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${project.featured ? "sm:col-span-1 lg:col-span-1" : ""}`}
      style={{ transitionDelay: `${(index % 6) * 80}ms` }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border"
          style={{ background: `${project.color}15`, borderColor: `${project.color}30` }}
        >
          {project.icon}
        </div>
        <div className="flex items-center gap-2">
          {project.featured && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono border border-gold/30 bg-gold/10 text-gold">
              <Star size={10} fill="currentColor" /> Featured
            </span>
          )}
          <a
            href={project.github}
            className="p-2 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors"
            aria-label="View on GitHub"
          >
            <Code2 size={16} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-xs font-mono uppercase tracking-wider"
            style={{ color: project.color }}
          >
            {project.category}
          </span>
        </div>
        <h3 className="font-display font-bold text-lg text-text-primary mb-2 group-hover:text-gradient transition-all">
          {project.title}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">{project.description}</p>
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1E1E30]">
        {project.stack.slice(0, 5).map((tech) => (
          <span key={tech} className="skill-tag text-xs">
            {tech}
          </span>
        ))}
        {project.stack.length > 5 && (
          <span className="skill-tag text-xs">+{project.stack.length - 5}</span>
        )}
      </div>
    </div>
  );
}

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState("All");
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.05 });

  const filtered = activeFilter === "All"
    ? projects
    : projects.filter((p) => p.category === activeFilter);

  return (
    <section id="projects" className="py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={ref} className={`mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">Work</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Projects
          </h2>
          <p className="text-text-secondary max-w-xl">
            15+ deployed projects across full-stack, cloud infrastructure, DevOps, and AI.
          </p>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-mono whitespace-nowrap transition-all duration-200 border ${
                activeFilter === cat
                  ? "bg-accent text-white border-accent"
                  : "border-[#1E1E30] text-text-muted hover:text-text-primary hover:border-accent/30 glass"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-text-muted">
            No projects in this category yet.
          </div>
        )}
      </div>
    </section>
  );
}
