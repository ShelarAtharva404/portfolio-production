import { useInView } from "react-intersection-observer";
import { experience as staticExperience } from "../data/portfolio";
import { MapPin, Calendar, CheckCircle2 } from "lucide-react";

function ExperienceCard({ job, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`relative transition-all duration-700 ${
        inView ? "opacity-100 translate-x-0" : index % 2 === 0 ? "opacity-0 -translate-x-8" : "opacity-0 translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 120}ms` }}
    >
      {/* Timeline line (desktop) */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[#1E1E30] to-transparent" />

      <div className={`lg:grid lg:grid-cols-2 lg:gap-12 items-start ${index % 2 === 1 ? "lg:direction-rtl" : ""}`}>
        {/* Date badge - alternates sides */}
        <div className={`hidden lg:flex items-center ${index % 2 === 0 ? "justify-end" : "justify-start order-last"}`}>
          <div className="glass rounded-xl px-4 py-3 border border-[#1E1E30] text-center">
            <div className="text-xs font-mono text-text-muted uppercase tracking-widest mb-1">Period</div>
            <div className="font-display font-semibold text-sm" style={{ color: job.color }}>
              {job.period}
            </div>
          </div>
        </div>

        {/* Card */}
        <div className={`relative ${index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}`}>
          {/* Timeline dot */}
          <div
            className="hidden lg:block absolute top-6 w-3 h-3 rounded-full border-2 border-carbon z-10"
            style={{
              background: job.color,
              boxShadow: `0 0 12px ${job.color}`,
              [index % 2 === 0 ? "right" : "left"]: "-42px",
            }}
          />

          <div
            className="glass rounded-2xl p-6 border card-hover"
            style={{ borderColor: `${job.color}20` }}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-1">{job.role}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-sm" style={{ color: job.color }}>{job.company}</span>
                  <span className="text-text-muted text-xs">·</span>
                  <div className="flex items-center gap-1 text-text-muted text-xs">
                    <MapPin size={10} />
                    {job.type}
                  </div>
                  <div className="flex items-center gap-1 text-text-muted text-xs lg:hidden">
                    <Calendar size={10} />
                    {job.period}
                  </div>
                </div>
              </div>
              <div
                className="px-3 py-1 rounded-full text-xs font-mono border"
                style={{ color: job.color, borderColor: `${job.color}30`, background: `${job.color}10` }}
              >
                {job.type}
              </div>
            </div>

            {/* Highlights */}
            <ul className="space-y-2">
              {job.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: job.color }} />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Experience({ experience: propExperience }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const experienceList = propExperience || staticExperience;

  return (
    <section id="experience" className="py-24 px-4 sm:px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">Career</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Work Experience
          </h2>
          <p className="text-text-secondary max-w-xl">
            Real companies, real code, real deadlines — production work from day one.
          </p>
        </div>

        <div className="space-y-12 lg:space-y-16">
          {experienceList.map((job, i) => (
            <ExperienceCard key={`${job.company}-${job.role}-${i}`} job={job} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
