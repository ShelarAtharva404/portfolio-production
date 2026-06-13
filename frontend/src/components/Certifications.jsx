import { useState } from "react";
import { useInView } from "react-intersection-observer";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";

const CATEGORIES = ["All", "Cloud", "DevOps", "Full-Stack", "Other"];

export default function Certifications({ certifications }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [activeTab, setActiveTab] = useState("All");
  const [selectedCert, setSelectedCert] = useState(null);

  const filteredCerts = certifications.filter(cert => {
    if (activeTab === "All") return true;
    return cert.category.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <section id="certifications" className="py-24 px-4 sm:px-6 bg-surface/10 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

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
            <span className="text-accent font-mono text-xs uppercase tracking-widest">Credentials</span>
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-text-primary mb-4">
            Certifications & Training
          </h2>
          <p className="text-text-secondary max-w-xl">
            Verified credentials proving hands-on competence in full-stack, cloud computing, and DevOps engineering. Click any card with an image to expand.
          </p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-10 justify-start">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setActiveTab(category)}
              className={`px-4 py-2 rounded-xl text-xs font-mono tracking-wider transition-all duration-300 border ${
                activeTab === category
                  ? "bg-accent border-accent text-white shadow-lg shadow-accent/20"
                  : "bg-void/50 border-[#1E1E30] text-text-muted hover:text-text-primary hover:border-accent/40"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCerts.map((cert) => (
            <div
              key={cert._id}
              onClick={() => {
                if (cert.image) {
                  setSelectedCert(cert);
                }
              }}
              className={`group glass rounded-2xl border border-[#1E1E30] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                cert.image ? "cursor-pointer" : ""
              }`}
            >
              {cert.image && (
                <div className="w-full h-44 overflow-hidden relative border-b border-[#1E1E30]">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon via-transparent to-transparent opacity-60" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {/* Header Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-accent/10 border border-accent/20 text-accent uppercase tracking-wider">
                      {cert.category}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-accent/5 flex items-center justify-center text-accent group-hover:bg-accent/10 transition-colors">
                      <Award size={16} />
                    </div>
                  </div>

                  {/* Title & Issuer */}
                  <h3 className="font-display font-semibold text-text-primary text-base leading-snug group-hover:text-accent transition-colors mb-2">
                    {cert.title}
                  </h3>
                  <p className="text-sm text-text-secondary font-medium mb-4 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-accent/60" />
                    {cert.issuer}
                  </p>
                </div>

                {/* Footer details */}
                <div className="border-t border-[#1E1E30] pt-4 mt-4 flex items-center justify-between">
                  <div className="text-xs text-text-muted font-mono">
                    <span>Issued: {cert.date}</span>
                    {cert.credentialId && (
                      <div className="text-[10px] mt-0.5 opacity-80">ID: {cert.credentialId}</div>
                    )}
                  </div>

                  {cert.link && (
                    <a
                      href={cert.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-xs text-accent hover:text-white font-medium font-mono group/btn transition-colors"
                    >
                      Verify
                      <ExternalLink size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredCerts.length === 0 && (
          <div className="text-center py-16 glass rounded-2xl border border-[#1E1E30]">
            <p className="text-text-muted font-mono text-sm">No certifications found in this category.</p>
          </div>
        )}
      </div>

      {/* Certification Modal Viewer */}
      {selectedCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050508]/90 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedCert(null)}
        >
          <div 
            className="w-full max-w-4xl glass border border-[#1E1E30] rounded-2xl overflow-y-auto md:overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[90vh] md:max-h-none"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-[#09090F]/80 border border-[#1E1E30] text-text-muted hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              ✕
            </button>

            {/* Left: Certificate Image */}
            <div className="md:w-3/5 bg-void flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-[#1E1E30] overflow-hidden">
              <img
                src={selectedCert.image}
                alt={selectedCert.title}
                className="max-w-full max-h-[30vh] md:max-h-[60vh] object-contain rounded-lg shadow-lg"
              />
            </div>

            {/* Right: Info */}
            <div className="md:w-2/5 p-6 flex flex-col justify-between bg-surface/30">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 text-accent uppercase tracking-wider block w-fit mb-4">
                  {selectedCert.category}
                </span>
                <h3 className="font-display font-bold text-xl text-text-primary mb-2 leading-snug">
                  {selectedCert.title}
                </h3>
                <p className="text-sm text-text-secondary font-medium mb-6 flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-accent" />
                  {selectedCert.issuer}
                </p>

                <div className="space-y-3 font-mono text-xs text-text-muted border-t border-[#1E1E30] pt-4">
                  <div className="flex justify-between">
                    <span>Issued Date:</span>
                    <span className="text-text-primary">{selectedCert.date}</span>
                  </div>
                  {selectedCert.credentialId && (
                    <div className="flex justify-between">
                      <span>Credential ID:</span>
                      <span className="text-text-primary text-[10px] select-all">{selectedCert.credentialId}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                {selectedCert.link && (
                  <a
                    href={selectedCert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 bg-accent hover:bg-accent/80 text-white rounded-xl text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-all shadow-md shadow-accent/15"
                  >
                    <ExternalLink size={14} /> Verify Credential
                  </a>
                )}
                <button
                  onClick={() => setSelectedCert(null)}
                  className="flex-1 py-3 px-4 bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-white rounded-xl text-xs font-semibold text-center transition-colors cursor-pointer"
                >
                  Close Viewer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
