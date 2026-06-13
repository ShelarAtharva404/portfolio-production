import { useInView } from "react-intersection-observer";
import { education as staticEducation, achievements as staticAchievements, personal as staticPersonal } from "../data/portfolio";
import { GraduationCap, Trophy, MapPin, Zap } from "lucide-react";

export default function About({ personal, education: propEducation, achievements: propAchievements }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const data = personal || staticPersonal;
  const eduList = propEducation || staticEducation;
  const achList = propAchievements || staticAchievements;

  return (
    <section id="about" className="py-24 px-4 sm:px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div ref={ref} className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">About</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Who I Am
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Bio + quick facts */}
          <div className="space-y-6">
            <div className="glass rounded-2xl p-6 border border-[#1E1E30]">
              <p className="text-text-secondary leading-relaxed mb-6">{data.bio}</p>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Location", value: data.location || "Surat, Gujarat", icon: MapPin },
                  { label: "Focus", value: "Cloud + Full-Stack", icon: Zap },
                  { label: "CGPA", value: `${data.cgpa || "8.61"} / 10`, icon: GraduationCap },
                  { label: "Projects", value: `${data.projects || "15+"} Deployed`, icon: Trophy },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={14} className="text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-text-muted font-mono uppercase tracking-wider">{label}</div>
                      <div className="text-sm text-text-primary font-medium mt-0.5">{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass rounded-2xl p-6 border border-gold/15">
              <div className="flex items-center gap-2 mb-4">
                <Trophy size={16} className="text-gold" />
                <span className="text-xs font-mono uppercase tracking-widest text-gold">Achievements</span>
              </div>
              <ul className="space-y-3">
                {achList.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                    <span className="text-gold mt-0.5 text-xs font-mono">{String(i + 1).padStart(2, "0")}</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Education */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap size={16} className="text-accent" />
              <span className="text-xs font-mono uppercase tracking-widest text-accent">Education</span>
            </div>
            {eduList.map((edu, i) => (
              <EducationCard key={i} edu={edu} index={i} />
            ))}

            {/* Interests */}
            <div className="glass rounded-2xl p-6 border border-[#1E1E30] mt-6">
              <div className="text-xs font-mono uppercase tracking-widest text-text-muted mb-4">Interests</div>
              <div className="flex flex-wrap gap-2">
                {["Formula 1 🏎️", "Photography 📷", "Cloud Architecture ☁️", "Board Games 🎲", "Music 🎵"].map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1.5 rounded-xl text-sm glass border border-[#1E1E30] text-text-secondary hover:text-text-primary hover:border-accent/30 transition-colors cursor-default"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function EducationCard({ edu, index }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`glass rounded-2xl p-5 border border-[#1E1E30] card-hover transition-all duration-700 ${
        inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
      }`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="font-display font-semibold text-text-primary text-sm mb-1">{edu.degree}</h3>
          <p className="text-text-secondary text-xs">{edu.school}</p>
          {edu.highlight && (
            <p className="text-gold text-xs mt-1 font-medium">{edu.highlight}</p>
          )}
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-accent font-mono font-bold text-sm">{edu.score}</div>
          <div className="text-text-muted text-xs mt-0.5">{edu.period}</div>
        </div>
      </div>
    </div>
  );
}
