import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Certifications from "./components/Certifications";
import Resume from "./components/Resume";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";
import { personal as staticPersonal, skills as staticSkills, experience as staticExperience, projects as staticProjects, education as staticEducation, achievements as staticAchievements, currentlyLearning as staticCurrentlyLearning } from "./data/portfolio";

const staticProfile = {
  personal: { ...staticPersonal, cv: "", resume: "", avatar: "" },
  skills: staticSkills,
  experience: staticExperience,
  education: staticEducation,
  achievements: staticAchievements,
  currentlyLearning: staticCurrentlyLearning
};

const defaultCerts = [
  {
    _id: "static-1",
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services (AWS)",
    date: "Oct 2025",
    credentialId: "AWS-ASA-12345",
    link: "https://aws.amazon.com/verification",
    category: "Cloud",
    image: "",
  },
  {
    _id: "static-2",
    title: "Certified Kubernetes Application Developer (CKAD)",
    issuer: "The Linux Foundation",
    date: "Nov 2025",
    credentialId: "LF-CKAD-9876",
    link: "https://training.linuxfoundation.org",
    category: "DevOps",
    image: "",
  },
  {
    _id: "static-3",
    title: "HashiCorp Certified: Terraform Associate",
    issuer: "HashiCorp",
    date: "Aug 2025",
    credentialId: "HC-TFA-5543",
    link: "https://credly.com",
    category: "DevOps",
    image: "",
  }
];

export default function App() {
  const [portfolioData, setPortfolioData] = useState({
    profile: null,
    projects: [],
    certifications: [],
    loading: true,
  });

  const fetchData = useCallback(async () => {
    try {
      const apiURL = import.meta.env.VITE_API_URL || "";
      const res = await fetch(`${apiURL}/api/portfolio-data`);
      if (!res.ok) throw new Error("Failed to load from API");
      const data = await res.json();
      setPortfolioData({
        profile: data.profile || staticProfile,
        projects: data.projects && data.projects.length > 0 ? data.projects : staticProjects,
        certifications: data.certifications && data.certifications.length > 0 ? data.certifications : defaultCerts,
        loading: false,
      });
    } catch {
      console.warn("Backend API unavailable. Falling back to static data.");
      setPortfolioData({
        profile: staticProfile,
        projects: staticProjects,
        certifications: defaultCerts,
        loading: false,
      });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchData]);

  if (portfolioData.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-void">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
        </div>
      </div>
    );
  }

  const { profile, projects, certifications } = portfolioData;

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="relative min-h-screen bg-carbon">
              <div className="noise" />
              <Navbar />
              <main>
                <Hero personal={profile.personal} />
                <About 
                  personal={profile.personal} 
                  education={profile.education} 
                  achievements={profile.achievements} 
                  currentlyLearning={profile.currentlyLearning} 
                />
                <Skills skills={profile.skills} />
                <Experience experience={profile.experience} />
                <Projects projects={projects} />
                <Certifications certifications={certifications} />
                <Resume personal={profile.personal} education={profile.education} experience={profile.experience} />
                <Contact personal={profile.personal} />
              </main>
              <Footer personal={profile.personal} />
            </div>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminPanel
              projects={projects}
              certifications={certifications}
              profile={profile}
              onRefresh={fetchData}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
