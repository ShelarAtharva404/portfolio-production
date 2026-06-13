import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogOut, MessageSquare, Briefcase, Award, User, Trash2, Plus, Edit2, Save, X, Eye, ArrowLeft } from "lucide-react";

export default function AdminPanel({ projects, certifications, profile, onRefresh }) {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("portfolio_admin_token") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  
  // Login State
  const [loginForm, setLoginForm] = useState({ username: "admin", password: "" });
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State: "messages" | "projects" | "certifications" | "profile"
  const [activeTab, setActiveTab] = useState("messages");
  
  // Data State
  const [messages, setMessages] = useState([]);
  const [msgLoading, setMsgLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" }); // type: "success" | "error"

  // CRUD Forms State
  const [projectForm, setProjectForm] = useState({ id: "", title: "", category: "DevOps & Infrastructure", description: "", stack: "", color: "#6C63FF", icon: "⚡", featured: false, github: "#" });
  const [showProjForm, setShowProjForm] = useState(false);
  const [projFormMode, setProjFormMode] = useState("add"); // "add" | "edit"

  const [certForm, setCertForm] = useState({ id: "", title: "", issuer: "", date: "", credentialId: "", link: "", category: "Cloud", image: "" });
  const [showCertForm, setShowCertForm] = useState(false);
  const [certFormMode, setCertFormMode] = useState("add"); // "add" | "edit"

  const [profileForm, setProfileForm] = useState({
    name: profile?.personal?.name || "",
    title: profile?.personal?.title || "",
    subtitle: profile?.personal?.subtitle || "",
    tagline: profile?.personal?.tagline || "",
    bio: profile?.personal?.bio || "",
    location: profile?.personal?.location || "",
    email: profile?.personal?.email || "",
    phone: profile?.personal?.phone || "",
    github: profile?.personal?.github || "",
    linkedin: profile?.personal?.linkedin || "",
    cgpa: profile?.personal?.cgpa || "",
    projectsCount: profile?.personal?.projects || "",
    internshipsCount: profile?.personal?.internships || "",
    cv: profile?.personal?.cv || "",
    resume: profile?.personal?.resume || "",
    avatar: profile?.personal?.avatar || ""
  });

  // Sync profileForm state when profile prop updates
  useEffect(() => {
    if (profile?.personal) {
      const timer = setTimeout(() => {
        setProfileForm({
          name: profile.personal.name || "",
          title: profile.personal.title || "",
          subtitle: profile.personal.subtitle || "",
          tagline: profile.personal.tagline || "",
          bio: profile.personal.bio || "",
          location: profile.personal.location || "",
          email: profile.personal.email || "",
          phone: profile.personal.phone || "",
          github: profile.personal.github || "",
          linkedin: profile.personal.linkedin || "",
          cgpa: profile.personal.cgpa || "",
          projectsCount: profile.personal.projects || "",
          internshipsCount: profile.personal.internships || "",
          cv: profile.personal.cv || "",
          resume: profile.personal.resume || "",
          avatar: profile.personal.avatar || ""
        });
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [profile]);



  const apiURL = import.meta.env.VITE_API_URL || "";

  // Helper: Trigger custom flash message
  const triggerStatus = (type, text) => {
    setStatusMsg({ type, text });
    setTimeout(() => setStatusMsg({ type: "", text: "" }), 4000);
  };

  // Handle Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("portfolio_admin_token");
    setToken("");
    setIsAuthenticated(false);
    navigate("/admin");
  }, [navigate]);

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    if (!token) return;
    setMsgLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else if (res.status === 401 || res.status === 403) {
        handleLogout();
      }
    } catch {
      console.error("Failed to fetch messages");
    } finally {
      setMsgLoading(false);
    }
  }, [token, apiURL, handleLogout]);

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        fetchMessages();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, fetchMessages]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch(`${apiURL}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("portfolio_admin_token", data.token);
        setToken(data.token);
        setIsAuthenticated(true);
        setLoginForm({ username: "admin", password: "" });
      } else {
        setLoginError(data.error || "Login failed. Please check credentials.");
      }
    } catch {
      setLoginError("Server offline. Using offline mode is blocked for secure administration.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this contact message inquiry?")) return;
    try {
      const res = await fetch(`${apiURL}/api/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setMessages(messages.filter(m => m._id !== id));
        triggerStatus("success", "Message deleted successfully.");
      } else {
        triggerStatus("error", "Failed to delete message.");
      }
    } catch {
      triggerStatus("error", "Network error deleting message.");
    }
  };

  // --- Projects CRUD handlers ---
  
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: projectForm.title,
      category: projectForm.category,
      description: projectForm.description,
      stack: projectForm.stack.split(",").map(s => s.trim()).filter(Boolean),
      color: projectForm.color,
      icon: projectForm.icon,
      featured: projectForm.featured,
      github: projectForm.github
    };

    const url = projFormMode === "add" 
      ? `${apiURL}/api/admin/projects` 
      : `${apiURL}/api/admin/projects/${projectForm.id}`;
    
    const method = projFormMode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerStatus("success", `Project ${projFormMode === "add" ? "created" : "updated"} successfully!`);
        setShowProjForm(false);
        setProjectForm({ id: "", title: "", category: "DevOps & Infrastructure", description: "", stack: "", color: "#6C63FF", icon: "⚡", featured: false, github: "#" });
        onRefresh();
      } else {
        const d = await res.json();
        triggerStatus("error", d.error || "Failed to save project.");
      }
    } catch {
      triggerStatus("error", "Network error saving project.");
    }
  };

  const handleEditProjectClick = (p) => {
    setProjectForm({
      id: p._id,
      title: p.title,
      category: p.category,
      description: p.description,
      stack: p.stack.join(", "),
      color: p.color,
      icon: p.icon,
      featured: p.featured,
      github: p.github
    });
    setProjFormMode("edit");
    setShowProjForm(true);
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`${apiURL}/api/admin/projects/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerStatus("success", "Project deleted successfully.");
        onRefresh();
      } else {
        triggerStatus("error", "Failed to delete project.");
      }
    } catch {
      triggerStatus("error", "Network error deleting project.");
    }
  };

  // --- Certifications CRUD handlers ---
  
  const handleCertImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload image files only (PNG/JPEG/WebP).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image is too large. Please upload an image under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCertForm(prev => ({ ...prev, image: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCertImage = () => {
    setCertForm(prev => ({ ...prev, image: "" }));
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    const url = certFormMode === "add" 
      ? `${apiURL}/api/admin/certifications` 
      : `${apiURL}/api/admin/certifications/${certForm.id}`;
    
    const method = certFormMode === "add" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(certForm)
      });

      if (res.ok) {
        triggerStatus("success", `Certification ${certFormMode === "add" ? "created" : "updated"} successfully!`);
        setShowCertForm(false);
        setCertForm({ id: "", title: "", issuer: "", date: "", credentialId: "", link: "", category: "Cloud", image: "" });
        onRefresh();
      } else {
        const d = await res.json();
        triggerStatus("error", d.error || "Failed to save certification.");
      }
    } catch {
      triggerStatus("error", "Network error saving certification.");
    }
  };

  const handleEditCertClick = (c) => {
    setCertForm({
      id: c._id,
      title: c.title,
      issuer: c.issuer,
      date: c.date,
      credentialId: c.credentialId || "",
      link: c.link || "",
      category: c.category,
      image: c.image || ""
    });
    setCertFormMode("edit");
    setShowCertForm(true);
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certification?")) return;
    try {
      const res = await fetch(`${apiURL}/api/admin/certifications/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        triggerStatus("success", "Certification deleted successfully.");
        onRefresh();
      } else {
        triggerStatus("error", "Failed to delete certification.");
      }
    } catch {
      triggerStatus("error", "Network error deleting certification.");
    }
  };

  // --- Profile CRUD handler ---
  
  const handleViewPDF = (base64PDF) => {
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
      console.error("Error opening PDF:", err);
      alert("Failed to open PDF view. Please download it instead.");
    }
  };

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF document only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("PDF file is too large. Please upload a PDF under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setProfileForm(prev => ({ ...prev, cv: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteCV = () => {
    if (window.confirm("Remove current CV from profile?")) {
      setProfileForm(prev => ({ ...prev, cv: "" }));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Please upload a PDF document only.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("PDF file is too large. Please upload a PDF under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setProfileForm(prev => ({ ...prev, resume: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteResume = () => {
    if (window.confirm("Remove current Resume from profile?")) {
      setProfileForm(prev => ({ ...prev, resume: "" }));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please upload image files only (PNG/JPEG/WebP).");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image is too large. Please upload an image under 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setProfileForm(prev => ({ ...prev, avatar: uploadEvent.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteAvatar = () => {
    if (window.confirm("Remove profile photo?")) {
      setProfileForm(prev => ({ ...prev, avatar: "" }));
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    // Structure backend-friendly update payload
    const payload = {
      personal: {
        name: profileForm.name,
        title: profileForm.title,
        subtitle: profileForm.subtitle,
        tagline: profileForm.tagline,
        bio: profileForm.bio,
        location: profileForm.location,
        email: profileForm.email,
        phone: profileForm.phone,
        github: profileForm.github,
        linkedin: profileForm.linkedin,
        cgpa: profileForm.cgpa,
        projects: profileForm.projectsCount,
        internships: profileForm.internshipsCount,
        cv: profileForm.cv,
        resume: profileForm.resume,
        avatar: profileForm.avatar
      }
    };

    try {
      const res = await fetch(`${apiURL}/api/admin/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        triggerStatus("success", "Bio / Profile updated successfully!");
        onRefresh();
      } else {
        const d = await res.json();
        triggerStatus("error", d.error || "Failed to update profile.");
      }
    } catch {
      triggerStatus("error", "Network error updating profile.");
    }
  };

  // ================== LOGIN VIEW ==================
  if (!isAuthenticated) {
    return (
      <div className="relative min-h-screen bg-void flex flex-col justify-center items-center px-4">
        <div className="noise" />
        <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono text-text-muted hover:text-accent transition-colors">
          <ArrowLeft size={14} /> Back to Site
        </Link>
        <div className="w-full max-w-md glass border border-[#1E1E30] rounded-2xl p-8 shadow-2xl relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-accent/10 border border-accent/30 text-accent rounded-full flex items-center justify-center mb-3">
              <Lock size={20} />
            </div>
            <h1 className="font-display font-bold text-2xl text-text-primary text-center">Admin Console</h1>
            <p className="text-text-muted text-xs font-mono mt-1">Authorized access only</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/10 transition-all"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs text-center font-mono">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl font-medium text-sm bg-accent text-white hover:bg-accent/80 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-accent/20"
            >
              {loginLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  <Eye size={16} /> Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ================== ADMIN DASHBOARD VIEW ==================
  return (
    <div className="relative min-h-screen bg-carbon text-text-primary flex flex-col">
      <div className="noise" />
      
      {/* Admin Navbar */}
      <header className="sticky top-0 z-40 bg-[#0C0C14]/80 backdrop-blur-md border-b border-[#1E1E30] py-4 px-6 flex justify-between items-center relative">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          <h1 className="font-display font-bold text-lg tracking-tight">Admin Console</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-xs font-mono text-text-muted hover:text-text-primary transition-colors flex items-center gap-1">
            <ArrowLeft size={12} /> View Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 text-xs font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut size={12} /> Logout
          </button>
        </div>
      </header>

      {/* Main Panel Content */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 relative z-10">
        
        {/* Status Toast Banner */}
        {statusMsg.text && (
          <div className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl border shadow-xl text-sm font-mono flex items-center gap-2 animate-bounce ${
            statusMsg.type === "success" 
              ? "bg-green-500/10 border-green-500/30 text-green-400" 
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}>
            <span>{statusMsg.text}</span>
          </div>
        )}

        {/* Sidebar Nav */}
        <aside className="lg:col-span-1 space-y-2">
          <div className="glass border border-[#1E1E30] rounded-2xl p-4 space-y-1.5">
            <div className="text-[10px] font-mono text-text-muted uppercase tracking-widest px-3 mb-2">Sections</div>
            <button
              onClick={() => setActiveTab("messages")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "messages" ? "bg-accent/15 text-accent border border-accent/25" : "text-text-secondary hover:bg-[#1E1E30]/40 border border-transparent"
              }`}
            >
              <MessageSquare size={16} /> Contact Inquiries
              {messages.length > 0 && (
                <span className="ml-auto bg-accent text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                  {messages.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("projects")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "projects" ? "bg-accent/15 text-accent border border-accent/25" : "text-text-secondary hover:bg-[#1E1E30]/40 border border-transparent"
              }`}
            >
              <Briefcase size={16} /> Projects
            </button>
            <button
              onClick={() => setActiveTab("certifications")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "certifications" ? "bg-accent/15 text-accent border border-accent/25" : "text-text-secondary hover:bg-[#1E1E30]/40 border border-transparent"
              }`}
            >
              <Award size={16} /> Certifications
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2.5 transition-colors cursor-pointer ${
                activeTab === "profile" ? "bg-accent/15 text-accent border border-accent/25" : "text-text-secondary hover:bg-[#1E1E30]/40 border border-transparent"
              }`}
            >
              <User size={16} /> Profile & Biography
            </button>
          </div>

          <div className="glass border border-[#1E1E30] rounded-2xl p-4 text-xs font-mono text-text-muted text-center space-y-1">
            <div>Database status: Connected</div>
            <div>Cluster: MongoDB Atlas</div>
          </div>
        </aside>

        {/* Tab Detail View */}
        <main className="lg:col-span-3">
          
          {/* TAB: MESSAGES */}
          {activeTab === "messages" && (
            <div className="glass border border-[#1E1E30] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#1E1E30] pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-text-primary">Contact Inquiries</h2>
                  <p className="text-text-secondary text-xs font-mono mt-0.5">Inbox of incoming client requests</p>
                </div>
                <button 
                  onClick={fetchMessages}
                  className="px-2.5 py-1 text-xs bg-[#1E1E30]/50 hover:bg-[#1E1E30] border border-[#1E1E30] text-text-muted hover:text-text-primary transition-all font-mono rounded-lg cursor-pointer"
                >
                  Refresh
                </button>
              </div>

              {msgLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="w-10 h-10 border-2 border-accent/10 border-t-accent rounded-full animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-20 text-text-muted font-mono text-sm">
                  Inbox is completely clean. No messages received.
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m._id} className="p-4 rounded-xl bg-[#09090F] border border-[#1E1E30] hover:border-[#2A2A3F] transition-all relative group">
                      <button
                        onClick={() => handleDeleteMessage(m._id)}
                        className="absolute top-4 right-4 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                        title="Delete Inquiry"
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 border-b border-[#1E1E30]/60 pb-2">
                        <div>
                          <span className="text-[10px] font-mono text-text-muted block uppercase tracking-wider">From</span>
                          <span className="text-sm font-semibold text-text-primary">{m.name}</span>
                          <span className="text-xs text-text-muted font-mono block">{m.email}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="text-[10px] font-mono text-text-muted block uppercase tracking-wider">Submitted On</span>
                          <span className="text-xs text-text-muted font-mono">{new Date(m.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-[10px] font-mono text-text-muted block uppercase tracking-wider">Subject</span>
                        <p className="text-sm text-text-primary font-medium">{m.subject}</p>
                      </div>
                      <div className="mt-3 bg-void/50 p-3 rounded-lg border border-[#1E1E30]/40">
                        <span className="text-[10px] font-mono text-text-muted block uppercase tracking-wider mb-1">Message</span>
                        <p className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed">{m.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === "projects" && (
            <div className="glass border border-[#1E1E30] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#1E1E30] pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-text-primary">Projects Manager</h2>
                  <p className="text-text-secondary text-xs font-mono mt-0.5">Add, edit, or remove showcase work</p>
                </div>
                {!showProjForm && (
                  <button
                    onClick={() => {
                      setProjFormMode("add");
                      setProjectForm({ id: "", title: "", category: "DevOps & Infrastructure", description: "", stack: "", color: "#6C63FF", icon: "⚡", featured: false, github: "#" });
                      setShowProjForm(true);
                    }}
                    className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-accent/15"
                  >
                    <Plus size={14} /> Add Project
                  </button>
                )}
              </div>

              {showProjForm ? (
                /* Projects Form */
                <form onSubmit={handleProjectSubmit} className="space-y-4 bg-void/30 p-5 rounded-xl border border-[#1E1E30]">
                  <div className="flex items-center justify-between border-b border-[#1E1E30] pb-3 mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                      {projFormMode === "add" ? "Create New Project" : "Edit Project Details"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowProjForm(false)}
                      className="text-text-muted hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Project Title</label>
                      <input
                        type="text"
                        required
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={projectForm.category}
                        onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50 cursor-pointer"
                      >
                        <option>DevOps & Infrastructure</option>
                        <option>Full-Stack & Cloud Applications</option>
                        <option>Cloud & AWS</option>
                        <option>AI & Firebase</option>
                        <option>Brand Design & Devops</option>
                        <option>Systems & CS</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Description</label>
                    <textarea
                      required
                      rows={3}
                      value={projectForm.description}
                      onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Tech Stack (Comma-separated)</label>
                    <input
                      type="text"
                      placeholder="React, Docker, Kubernetes, Node.js"
                      required
                      value={projectForm.stack}
                      onChange={(e) => setProjectForm({ ...projectForm, stack: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Theme Color (Hex)</label>
                      <input
                        type="text"
                        value={projectForm.color}
                        onChange={(e) => setProjectForm({ ...projectForm, color: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Icon Emoji</label>
                      <input
                        type="text"
                        value={projectForm.icon}
                        onChange={(e) => setProjectForm({ ...projectForm, icon: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">GitHub / Demo Link</label>
                      <input
                        type="text"
                        value={projectForm.github}
                        onChange={(e) => setProjectForm({ ...projectForm, github: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 py-2">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={projectForm.featured}
                      onChange={(e) => setProjectForm({ ...projectForm, featured: e.target.checked })}
                      className="w-4 h-4 accent-accent rounded focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs font-mono text-text-primary select-none cursor-pointer">
                      Feature this project at the top of the grid
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/80 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Save Project
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowProjForm(false)}
                      className="px-4 py-2 rounded-xl bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Projects List */
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p._id} className="p-4 rounded-xl bg-[#09090F] border border-[#1E1E30] hover:border-[#2A2A3F] transition-all flex items-center justify-between group">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{p.icon}</span>
                          <span className="font-semibold text-sm text-text-primary">{p.title}</span>
                          {p.featured && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 uppercase tracking-widest">
                              Featured
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-text-muted mt-0.5 font-mono">{p.category}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProjectClick(p)}
                          className="p-1.5 rounded-lg bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-accent transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p._id)}
                          className="p-1.5 rounded-lg bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: CERTIFICATIONS */}
          {activeTab === "certifications" && (
            <div className="glass border border-[#1E1E30] rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-[#1E1E30] pb-4">
                <div>
                  <h2 className="font-display font-bold text-xl text-text-primary">Certifications Manager</h2>
                  <p className="text-text-secondary text-xs font-mono mt-0.5">Manage credentials and verify links</p>
                </div>
                {!showCertForm && (
                  <button
                    onClick={() => {
                      setCertFormMode("add");
                      setCertForm({ id: "", title: "", issuer: "", date: "", credentialId: "", link: "", category: "Cloud" });
                      setShowCertForm(true);
                    }}
                    className="px-3 py-1.5 bg-accent hover:bg-accent/80 text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer shadow-md shadow-accent/15"
                  >
                    <Plus size={14} /> Add Credential
                  </button>
                )}
              </div>

              {showCertForm ? (
                /* Certifications Form */
                <form onSubmit={handleCertSubmit} className="space-y-4 bg-void/30 p-5 rounded-xl border border-[#1E1E30]">
                  <div className="flex items-center justify-between border-b border-[#1E1E30] pb-3 mb-4">
                    <span className="text-xs font-mono font-semibold uppercase tracking-wider text-accent">
                      {certFormMode === "add" ? "Create New Credential" : "Edit Credential Details"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowCertForm(false)}
                      className="text-text-muted hover:text-white cursor-pointer"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Credential Name</label>
                      <input
                        type="text"
                        required
                        value={certForm.title}
                        onChange={(e) => setCertForm({ ...certForm, title: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Issuer</label>
                      <input
                        type="text"
                        placeholder="AWS, Google, Linux Foundation"
                        required
                        value={certForm.issuer}
                        onChange={(e) => setCertForm({ ...certForm, issuer: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Issued Date</label>
                      <input
                        type="text"
                        placeholder="Oct 2025"
                        required
                        value={certForm.date}
                        onChange={(e) => setCertForm({ ...certForm, date: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Credential ID (Optional)</label>
                      <input
                        type="text"
                        value={certForm.credentialId}
                        onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Category</label>
                      <select
                        value={certForm.category}
                        onChange={(e) => setCertForm({ ...certForm, category: e.target.value })}
                        className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none cursor-pointer"
                      >
                        <option>Cloud</option>
                        <option>DevOps</option>
                        <option>Full-Stack</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Validation Verification URL</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={certForm.link}
                      onChange={(e) => setCertForm({ ...certForm, link: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Certification Image (PNG/JPEG/WebP)</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCertImageChange}
                        className="hidden"
                        id="cert-image-upload-input"
                      />
                      <label
                        htmlFor="cert-image-upload-input"
                        className="px-4 py-2.5 rounded-xl border border-dashed border-[#1E1E30] hover:border-accent/50 text-text-secondary hover:text-text-primary text-xs font-mono text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 bg-[#09090F]/50"
                      >
                        📷 Select Image File
                      </label>
                      {certForm.image ? (
                        <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                          <div className="flex items-center gap-2">
                            <img
                              src={certForm.image}
                              alt="Preview"
                              className="w-10 h-10 object-cover rounded-lg border border-[#1E1E30]"
                            />
                            <span className="text-xs text-accent font-mono">Image selected</span>
                          </div>
                          <button
                            type="button"
                            onClick={handleDeleteCertImage}
                            className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-mono py-2.5">
                          No image uploaded. Fallback badge will be rendered.
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-accent hover:bg-accent/80 text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Save Credential
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCertForm(false)}
                      className="px-4 py-2 rounded-xl bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-white text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                /* Certifications List */
                <div className="space-y-3">
                  {certifications.map((c) => (
                    <div key={c._id} className="p-4 rounded-xl bg-[#09090F] border border-[#1E1E30] hover:border-[#2A2A3F] transition-all flex items-center justify-between group">
                      <div>
                        <div className="font-semibold text-sm text-text-primary">{c.title}</div>
                        <div className="text-xs text-text-muted mt-0.5 font-mono">{c.issuer} • {c.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditCertClick(c)}
                          className="p-1.5 rounded-lg bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-accent transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteCert(c._id)}
                          className="p-1.5 rounded-lg bg-[#1E1E30] hover:bg-[#2A2A3F] text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === "profile" && (
            <div className="glass border border-[#1E1E30] rounded-2xl p-6 space-y-6">
              <div className="border-b border-[#1E1E30] pb-4">
                <h2 className="font-display font-bold text-xl text-text-primary">Profile & Biography</h2>
                <p className="text-text-secondary text-xs font-mono mt-0.5">Edit personal biography text and details</p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                {/* Profile Photo Uploader */}
                <div className="p-4 rounded-xl bg-[#09090F] border border-[#1E1E30] flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#1E1E30] bg-void flex items-center justify-center">
                      {profileForm.avatar ? (
                        <img
                          src={profileForm.avatar}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-3xl">👤</span>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <h3 className="text-sm font-semibold text-text-primary">Profile Photo</h3>
                    <p className="text-text-muted text-xs font-mono">JPG, PNG or WebP. Max size 3MB.</p>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                        id="profile-avatar-upload"
                      />
                      <label
                        htmlFor="profile-avatar-upload"
                        className="px-3.5 py-1.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-xs font-semibold cursor-pointer transition-all shadow-md shadow-accent/15"
                      >
                        Upload Photo
                      </label>
                      {profileForm.avatar && (
                        <button
                          type="button"
                          onClick={handleDeleteAvatar}
                          className="px-3.5 py-1.5 rounded-xl border border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10 text-xs font-semibold cursor-pointer transition-all"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Title</label>
                    <input
                      type="text"
                      required
                      value={profileForm.title}
                      onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Subtitle / Subheaders</label>
                    <input
                      type="text"
                      required
                      value={profileForm.subtitle}
                      onChange={(e) => setProfileForm({ ...profileForm, subtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Tagline</label>
                    <input
                      type="text"
                      required
                      value={profileForm.tagline}
                      onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Short Biography (Bio)</label>
                  <textarea
                    required
                    rows={4}
                    value={profileForm.bio}
                    onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-[#1E1E30] pt-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">CGPA</label>
                    <input
                      type="text"
                      value={profileForm.cgpa}
                      onChange={(e) => setProfileForm({ ...profileForm, cgpa: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Projects Count</label>
                    <input
                      type="text"
                      value={profileForm.projectsCount}
                      onChange={(e) => setProfileForm({ ...profileForm, projectsCount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Internships Count</label>
                    <input
                      type="text"
                      value={profileForm.internshipsCount}
                      onChange={(e) => setProfileForm({ ...profileForm, internshipsCount: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#1E1E30] pt-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Email Address</label>
                    <input
                      type="email"
                      required
                      value={profileForm.email}
                      onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Phone</label>
                    <input
                      type="text"
                      required
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none focus:border-accent/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Location</label>
                    <input
                      type="text"
                      required
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">GitHub URL</label>
                    <input
                      type="text"
                      value={profileForm.github}
                      onChange={(e) => setProfileForm({ ...profileForm, github: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">LinkedIn URL</label>
                    <input
                      type="text"
                      value={profileForm.linkedin}
                      onChange={(e) => setProfileForm({ ...profileForm, linkedin: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl bg-[#09090F] border border-[#1E1E30] text-text-primary text-sm focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-[#1E1E30] pt-6">
                  {/* CV Upload */}
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Curriculum Vitae (CV PDF)</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleCVChange}
                        className="hidden"
                        id="cv-upload-input"
                      />
                      <label
                        htmlFor="cv-upload-input"
                        className="px-4 py-2.5 rounded-xl border border-dashed border-[#1E1E30] hover:border-accent/50 text-text-secondary hover:text-text-primary text-xs font-mono text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 bg-[#09090F]/50"
                      >
                        📂 Select PDF CV
                      </label>
                      {profileForm.cv ? (
                        <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                          <span className="text-xs text-accent font-mono truncate max-w-[150px]">
                            📄 CV PDF Uploaded
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewPDF(profileForm.cv)}
                              className="text-xs text-text-secondary hover:text-accent font-mono transition-colors cursor-pointer"
                            >
                              View
                            </button>
                            <span className="text-text-muted text-[10px]">|</span>
                            <button
                              type="button"
                              onClick={handleDeleteCV}
                              className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-mono py-2.5">
                          No CV uploaded.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resume Upload */}
                  <div>
                    <label className="block text-xs font-mono text-text-muted uppercase tracking-wider mb-2">Resume (Resume PDF)</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleResumeChange}
                        className="hidden"
                        id="resume-upload-input"
                      />
                      <label
                        htmlFor="resume-upload-input"
                        className="px-4 py-2.5 rounded-xl border border-dashed border-[#1E1E30] hover:border-accent/50 text-text-secondary hover:text-text-primary text-xs font-mono text-center cursor-pointer transition-all flex items-center justify-center gap-1.5 bg-[#09090F]/50"
                      >
                        📂 Select PDF Resume
                      </label>
                      {profileForm.resume ? (
                        <div className="flex-1 flex items-center justify-between px-4 py-2 rounded-xl bg-accent/5 border border-accent/10">
                          <span className="text-xs text-accent font-mono truncate max-w-[150px]">
                            📄 Resume PDF Uploaded
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewPDF(profileForm.resume)}
                              className="text-xs text-text-secondary hover:text-accent font-mono transition-colors cursor-pointer"
                            >
                              View
                            </button>
                            <span className="text-text-muted text-[10px]">|</span>
                            <button
                              type="button"
                              onClick={handleDeleteResume}
                              className="text-xs text-red-400 hover:text-red-300 font-mono transition-colors cursor-pointer"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-text-muted font-mono py-2.5">
                          No Resume uploaded.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-[#1E1E30] pt-4">
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-accent hover:bg-accent/80 text-white text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 shadow-md shadow-accent/15"
                  >
                    <Save size={14} /> Save Profile Changes
                  </button>
                </div>
              </form>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
