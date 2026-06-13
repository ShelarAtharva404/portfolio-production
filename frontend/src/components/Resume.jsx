import { useState } from "react";
import { FileText, Download, Eye, Briefcase, GraduationCap, ShieldCheck, Mail, Phone, MapPin } from "lucide-react";
import { useInView } from "react-intersection-observer";

export default function Resume({ personal, education, experience }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [downloadingCV, setDownloadingCV] = useState(false);
  const [downloadingResume, setDownloadingResume] = useState(false);

  const hasCustomCV = !!(personal && personal.cv);
  const hasCustomResume = !!(personal && personal.resume);

  // Robust PDF viewer using Blob URLs
  const viewPDF = (base64PDF) => {
    if (!base64PDF) return;
    try {
      const base64Parts = base64PDF.split(";base64,");
      const contentType = base64Parts[0].split(":")[1] || "application/pdf";
      const base64Data = base64Parts[1] || base64Parts[0];

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: contentType });
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL, "_blank");
    } catch (err) {
      console.error("Error opening PDF viewer:", err);
      alert("Failed to view PDF directly. Please download the file instead.");
    }
  };

  const handleDownload = (base64PDF, fileName, setDownloading) => {
    if (!base64PDF) {
      window.print();
      return;
    }
    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = base64PDF;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download PDF", err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <section id="resume" className="py-24 px-4 sm:px-6 bg-surface/20 relative border-t border-[#1E1E30]/50">
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div 
          ref={ref} 
          className={`mb-16 transition-all duration-700 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px flex-1 max-w-12 bg-accent/40" />
            <span className="text-accent font-mono text-xs uppercase tracking-widest">Resume & CV</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Professional Documents
          </h2>
          <p className="text-text-secondary max-w-xl">
            Access, view, or download my targeted resume and comprehensive curriculum vitae. Documents are updated dynamically by the console.
          </p>
        </div>

        {/* Dual Card Layout for CV & Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card 1: CV */}
          <div className="glass rounded-2xl p-6 border border-[#1E1E30] flex flex-col justify-between space-y-6 bg-void/25">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center text-accent">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                  Curriculum Vitae (CV)
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {hasCustomCV 
                    ? "Atharva has uploaded a full academic and professional timeline PDF curriculum vitae outlining complete career history."
                    : "No custom CV PDF has been uploaded yet. You can download the dynamic web resume below."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleDownload(personal?.cv, `${personal?.name.replace(/\s+/g, "_")}_CV.pdf`, setDownloadingCV)}
                disabled={downloadingCV}
                className="flex-1 py-3 px-4 bg-accent hover:bg-accent/80 disabled:opacity-50 text-white rounded-xl text-xs font-semibold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-accent/15"
              >
                <Download size={12} /> {downloadingCV ? "Downloading..." : "Download CV"}
              </button>
              {hasCustomCV && (
                <button
                  onClick={() => viewPDF(personal.cv)}
                  className="flex-1 py-3 px-4 bg-[#1E1E30] hover:bg-[#2A2A3F] border border-[#1E1E30] text-text-secondary hover:text-white rounded-xl text-xs font-semibold font-mono tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye size={12} /> View CV
                </button>
              )}
            </div>
          </div>

          {/* Card 2: Resume */}
          <div className="glass rounded-2xl p-6 border border-[#1E1E30] flex flex-col justify-between space-y-6 bg-void/25">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#00F5FF]/10 border border-[#00F5FF]/20 flex items-center justify-center text-[#00F5FF]">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-display font-bold text-lg text-text-primary mb-2">
                  Professional Resume
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {hasCustomResume 
                    ? "Atharva has uploaded a concise, job-targeted resume PDF summarizing core skillsets and cloud/devops backgrounds."
                    : "No custom Resume PDF has been uploaded yet. You can download the dynamic web resume below."}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => handleDownload(personal?.resume, `${personal?.name.replace(/\s+/g, "_")}_Resume.pdf`, setDownloadingResume)}
                disabled={downloadingResume}
                className="flex-1 py-3 px-4 bg-[#00F5FF] hover:bg-[#00F5FF]/80 disabled:opacity-50 text-void rounded-xl text-xs font-semibold font-mono tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-[#00F5FF]/15"
              >
                <Download size={12} /> {downloadingResume ? "Downloading..." : "Download Resume"}
              </button>
              {hasCustomResume && (
                <button
                  onClick={() => viewPDF(personal.resume)}
                  className="flex-1 py-3 px-4 bg-[#1E1E30] hover:bg-[#2A2A3F] border border-[#1E1E30] text-text-secondary hover:text-white rounded-xl text-xs font-semibold font-mono tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye size={12} /> View Resume
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Live dynamic preview sheet */}
        <div className="glass rounded-2xl p-6 sm:p-8 border border-[#1E1E30] relative overflow-hidden flex flex-col justify-between bg-[#0A0A10]/60 backdrop-blur-md">
          {/* Corner Accent */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-accent/5 border-l border-b border-[#1E1E30] rounded-bl-2xl pointer-events-none" />

          <div>
            {/* CV Header */}
            <div className="pb-6 border-b border-[#1E1E30]/70 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div>
                <h3 className="font-display font-bold text-xl text-text-primary tracking-tight">
                  {personal?.name || "Atharva Shelar"}
                </h3>
                <p className="text-accent text-xs font-mono font-medium mt-0.5">
                  {personal?.subtitle || "Cloud & DevOps Engineer"}
                </p>
              </div>
              <div className="flex flex-col gap-1 text-[10px] font-mono text-text-muted">
                <span className="flex items-center gap-1.5"><Mail size={10} className="text-accent" /> {personal?.email}</span>
                <span className="flex items-center gap-1.5"><Phone size={10} className="text-accent" /> {personal?.phone}</span>
                <span className="flex items-center gap-1.5"><MapPin size={10} className="text-accent" /> {personal?.location}</span>
              </div>
            </div>

            {/* Experience Preview */}
            <div className="py-6 border-b border-[#1E1E30]/70">
              <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <Briefcase size={12} className="text-accent" /> Professional Experience
              </h4>
              <div className="space-y-4">
                {experience && experience.slice(0, 2).map((exp, idx) => (
                  <div key={idx} className="relative pl-4 border-l border-accent/20">
                    <div className="absolute top-1.5 -left-[5px] w-2 h-2 rounded-full bg-accent" />
                    <div className="flex justify-between items-start flex-wrap gap-1">
                      <h5 className="text-xs font-bold text-text-primary">{exp.role}</h5>
                      <span className="text-[9px] font-mono text-text-muted">{exp.period}</span>
                    </div>
                    <p className="text-[10px] text-text-secondary font-medium">{exp.company} • {exp.type}</p>
                    {exp.highlights && exp.highlights[0] && (
                      <p className="text-[10px] text-text-muted mt-1 italic line-clamp-1">
                        "{exp.highlights[0]}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Education Preview */}
            <div className="py-6">
              <h4 className="text-[10px] font-mono text-text-muted uppercase tracking-widest mb-4 flex items-center gap-1.5">
                <GraduationCap size={12} className="text-accent" /> Education
              </h4>
              <div className="space-y-4">
                {education && education.slice(0, 2).map((edu, idx) => (
                  <div key={idx} className="flex justify-between items-start gap-4">
                    <div>
                      <h5 className="text-xs font-bold text-text-primary">{edu.degree}</h5>
                      <p className="text-[10px] text-text-secondary mt-0.5">{edu.school}</p>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono text-[10px]">
                      <span className="text-accent font-bold block">{edu.score}</span>
                      <span className="text-text-muted">{edu.period}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CV Bottom Info */}
          <div className="border-t border-[#1E1E30]/70 pt-4 mt-4 flex items-center justify-between text-[9px] font-mono text-text-muted">
            <span>Verification ID: live-db-sync</span>
            <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-accent" /> Dynamic Web Authenticated</span>
          </div>
        </div>
      </div>
    </section>
  );
}
