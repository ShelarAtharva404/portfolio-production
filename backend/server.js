const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-dev-key";

// Security & middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json({ limit: "50mb" })); // Increased limit to support profile edits (e.g., large base64 PDFs)
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: { error: "Too many requests. Please try again later." },
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio", { dbName: "portfolio" }).then(() => {
  console.log("✅ MongoDB connected");
  seedData(); // Seed data on startup
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
});

// Auth Middleware
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Invalid permissions." });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

// --- Models ---

// Message Schema
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  subject: { type: String, required: true, trim: true, maxlength: 200 },
  message: { type: String, required: true, trim: true, maxlength: 2000 },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});
const Message = mongoose.model("Message", messageSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  stack: [{ type: String }],
  color: { type: String, default: "#6C63FF" },
  icon: { type: String, default: "⚡" },
  featured: { type: Boolean, default: false },
  github: { type: String, default: "#" },
});
const Project = mongoose.model("Project", projectSchema);

// Certification Schema
const certificationSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  issuer: { type: String, required: true, trim: true },
  date: { type: String, required: true, trim: true },
  credentialId: { type: String, default: "" },
  link: { type: String, default: "" },
  category: { type: String, default: "Cloud" },
  image: { type: String, default: "" },
});
const Certification = mongoose.model("Certification", certificationSchema);

// Profile Schema (Saves editable biography/skills/experiences/educations)
const profileSchema = new mongoose.Schema({
  personal: {
    name: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    location: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    github: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    cgpa: { type: String, default: "" },
    projects: { type: String, default: "" },
    internships: { type: String, default: "" },
    cv: { type: String, default: "" },
    resume: { type: String, default: "" },
    avatar: { type: String, default: "" },
  },
  skills: { type: Map, of: [String] },
  experience: [{
    role: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String, required: true },
    type: { type: String, required: true },
    color: { type: String, default: "#6C63FF" },
    highlights: [{ type: String }],
  }],
  education: [{
    degree: { type: String, required: true },
    school: { type: String, required: true },
    period: { type: String, required: true },
    score: { type: String, default: "" },
    highlight: { type: String, default: null },
  }],
  achievements: [{ type: String }],
  currentlyLearning: [{ type: String }],
});
const Profile = mongoose.model("Profile", profileSchema);

// --- Data Seeder ---
const seedData = async () => {
  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      const defaultProjects = [
        {
          title: "CI/CD Auto-Healer",
          category: "DevOps & Infrastructure",
          description: "Self-healing production pipeline. Detects deployment failures and auto-rolls back within ~60 seconds. Same SRE architecture patterns used by large-scale engineering teams.",
          stack: ["Kubernetes", "GitHub Actions", "Docker", "Prometheus", "Grafana", "Shell"],
          color: "#6C63FF",
          icon: "🔄",
          featured: true,
          github: "#",
        },
        {
          title: "DevOps Full Pipeline",
          category: "DevOps & Infrastructure",
          description: "Infra provisioned with Terraform, containerized with Docker, deployed via Jenkins. Reduced manual deployment steps by ~70% through pipeline automation.",
          stack: ["Docker", "Jenkins", "GitHub Actions", "AWS", "Terraform", "Prometheus", "Grafana"],
          color: "#00F5FF",
          icon: "⚡",
          featured: true,
          github: "#",
        },
        {
          title: "ERP System — Production",
          category: "Full-Stack & Cloud Applications",
          description: "3 role-based dashboards, JWT auth, real-time attendance, 10+ RESTful API endpoints. Directly formed live internship deliverables — not a side project.",
          stack: ["React (Vite)", "Node.js", "Express.js", "MongoDB", "JWT", "Tailwind CSS"],
          color: "#FF4D4D",
          icon: "🏗️",
          featured: true,
          github: "#",
        },
        {
          title: "Cloud Video Streaming",
          category: "Cloud & AWS",
          description: "Videos stored in S3, delivered via CloudFront CDN for global low-latency playback. Same architecture pattern as Netflix/YouTube at scale.",
          stack: ["AWS S3", "CloudFront CDN", "Node.js", "React"],
          color: "#FFB800",
          icon: "☁️",
          featured: false,
          github: "#",
        },
        {
          title: "Portfolio",
          category: "Cloud & AWS",
          description: "Portfolio application containerized and deployed automatically through CI/CD on AWS Elastic Kubernetes Service (EKS) and AWS ECR.",
          stack: ["AWS EC2", "AWS EKS", "Node.js", "React", "AWS ECR", "AWS S3", "Helm", "ArgoCD"],
          color: "#FFB800",
          icon: "☁️",
          featured: false,
          github: "#",
        },
        {
          title: "OCR Document Scanner",
          category: "AI & Firebase",
          description: "Image upload → Google Cloud Vision OCR → text stored in Firebase. A working AI-powered document processing pipeline.",
          stack: ["React", "Firebase", "Google Cloud Vision API"],
          color: "#6C63FF",
          icon: "🤖",
          featured: false,
          github: "#",
        },
        {
          title: "LaptopZone E-Commerce",
          category: "Full-Stack & Cloud Applications",
          description: "Complete e-commerce store with product catalogue, cart, checkout, and order management — full flow with search, filtering, and conversion-focused UX.",
          stack: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
          color: "#00F5FF",
          icon: "🛒",
          featured: false,
          github: "#",
        },
        {
          title: "Mercedes AMG F1 Site",
          category: "Brand Design & Devops",
          description: "High-fidelity motorsport brand site with race schedule, driver profiles, team stats, and animations matching real brand identity.",
          stack: ["React.js", "Node.js", "Kubernetes", "AWS" , "Docker", "Terraform", "GitHub Actions"],
          color: "#C0C0C0",
          icon: "🏎️",
          featured: false,
          github: "#",
        },
        {
          title: "Ferrari F1",
          category: "Brand Design & Devops",
          description: "High-fidelity motorsport brand site with race schedule, driver profiles, team stats, and animations matching real brand identity.",
          stack: ["React.js", "Node.js", "Kubernetes", "AWS" , "Docker", "Terraform", "GitHub Actions"],
          color: "#C0C0C0",
          icon: "🏎️",
          featured: false,
          github: "#",
        },
        {
          title: "Porsche Car site",
          category: "Brand Design & Devops",
          description: "High-fidelity motorsport brand site with race schedule, driver profiles, team stats, and animations matching real brand identity.",
          stack: ["React.js", "Node.js", "Kubernetes", "AWS" , "Docker", "Terraform", "GitHub Actions"],
          color: "#C0C0C0",
          icon: "🏎️",
          featured: false,
          github: "#",
        },
        {
          title: "Memory Allocation Simulator",
          category: "Systems & CS",
          description: "First Fit, Best Fit, and Worst Fit algorithms using linked lists — proves genuine low-level understanding of OS memory management.",
          stack: ["C", "Linked Lists", "Operating Systems"],
          color: "#FF4D4D",
          icon: "💾",
          featured: false,
          github: "#",
        },
        {
          title: "Online Quiz Manager C#",
          category: "Systems & CS",
          description: "Desktop quiz platform in C# — demonstrates comfort outside the JS/Node ecosystem and solid OOP design patterns.",
          stack: ["C# ", ".NET" , "WindowsForms" , "ADO.NET" , "SQL Server"],
          color: "#FF4D4D",
          icon: "💾",
          featured: false,
          github: "#",
        },
        {
          title: "Library Management System",
          category: "Systems & CS",
          description: "Full CRUD library solution — add, search, issue, return books; stacks, linked lists, sorting algorithms; MySQL persistence + web UI.",
          stack: ["C"," PHP" ," MySql" ," HTML" , "CSS" , "JavaScript"],
          color: "#FF4D4D",
          icon: "💾",
          featured: false,
          github: "#",
        }
      ];
      await Project.insertMany(defaultProjects);
      console.log("🌱 Default projects seeded in DB");
    }

    const certCount = await Certification.countDocuments();
    if (certCount === 0) {
      const defaultCerts = [
        {
          title: "AWS Certified Solutions Architect – Associate",
          issuer: "Amazon Web Services (AWS)",
          date: "Oct 2025",
          credentialId: "AWS-ASA-12345",
          link: "https://aws.amazon.com/verification",
          category: "Cloud",
          image: "",
        },
        {
          title: "Certified Kubernetes Application Developer (CKAD)",
          issuer: "The Linux Foundation",
          date: "Nov 2025",
          credentialId: "LF-CKAD-9876",
          link: "https://training.linuxfoundation.org",
          category: "DevOps",
          image: "",
        },
        {
          title: "HashiCorp Certified: Terraform Associate",
          issuer: "HashiCorp",
          date: "Aug 2025",
          credentialId: "HC-TFA-5543",
          link: "https://credly.com",
          category: "DevOps",
          image: "",
        }
      ];
      await Certification.insertMany(defaultCerts);
      console.log("🌱 Default certifications seeded in DB");
    }

    const profileCount = await Profile.countDocuments();
    if (profileCount === 0) {
      const defaultProfile = {
        personal: {
          name: "Atharva Shelar",
          title: "Full-Stack Developer",
          subtitle: "Cloud & DevOps Engineer",
          tagline: "I ship real products — not just tutorials.",
          bio: "Third-year Computer Engineering student (CGPA 8.61) who builds production-grade systems. Interned at two tech companies, deployed 15+ cloud-native applications, and architect self-healing Kubernetes pipelines. I work where full-stack meets cloud infrastructure.",
          location: "Surat, Gujarat, India",
          email: "atharvashelar1.10@gmail.com",
          phone: "+91 79844 11452",
          github: "https://github.com/ShelarAtharva404",
          linkedin: "https://linkedin.com/in/atharvashelar",
          cgpa: "8.61",
          projects: "15+",
          internships: "2",
          cv: "",
          resume: "",
          avatar: "",
        },
        skills: {
          Frontend: ["React (Vite)", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3", "Bootstrap"],
          "Backend & APIs": ["Node.js", "Express.js", "REST APIs", "JWT Auth", "PHP"],
          "AWS Cloud": ["S3 + CloudFront", "Lambda", "API Gateway", "DynamoDB", "EC2"],
          "GCP & Firebase": ["Firestore", "Cloud Functions", "Cloud Vision API"],
          Azure: ["Azure Fundamentals", "Azure DevOps", "Azure Pipelines"],
          "DevOps & CI/CD": ["Docker", "Kubernetes", "GitHub Actions", "Jenkins", "Terraform"],
          Monitoring: ["Prometheus", "Grafana"],
          Databases: ["MongoDB", "MySQL", "DynamoDB", "Firebase"],
          Languages: ["JavaScript", "TypeScript", "Python", "C", "Java", "C#"],
        },
        experience: [
          {
            role: "Full-Stack Developer Intern",
            company: "Flare Global Soft",
            period: "Mar – Jun 2025",
            type: "Remote",
            color: "#6C63FF",
            highlights: [
              "Shipped production ERP with role-based dashboards for Admin, Manager, and User using React, Tailwind, and Node.js",
              "Implemented JWT authentication with protected routing across all 3 role tiers",
              "Validated 20+ backend endpoints with Postman — zero post-release critical bugs",
              "Collaborated in a 5-person remote Agile team with daily standups and sprint planning",
            ],
          },
          {
            role: "Cloud Computing Intern",
            company: "DigiiFarm Technologies",
            period: "Jul – Nov 2025",
            type: "Remote",
            color: "#00F5FF",
            highlights: [
              "Configured cloud environments across IaaS, PaaS, and SaaS layers on live infrastructure",
              "Applied authentication, RBAC, and secure hosting patterns on production cloud systems",
              "Delivered ERP feature modules alongside cloud work — full-stack range in one role",
            ],
          },
          {
            role: "Freelance Web Developer",
            company: "Techno Lap",
            period: "2025",
            type: "Client Project",
            color: "#FFB800",
            highlights: [
              "Solo-built a fully responsive website from wireframe to live domain",
              "Achieved fast load times with cross-device compatibility and SEO best practices",
            ],
          },
        ],
        education: [
          {
            degree: "B.Tech — Computer Science Engineering",
            school: "Uka Tarsadia University",
            period: "2023 – 2027 (Expected)",
            score: "CGPA: 8.61",
            highlight: null,
          },
          {
            degree: "HSC — 12th Grade",
            school: "Presidency School (GSEB)",
            period: "2023",
            score: "65%",
            highlight: "Top scorer, Computer Science",
          },
          {
            degree: "SSC — 10th Grade",
            school: "Presidency School (GSEB)",
            period: "2020",
            score: "80.60%",
            highlight: "School Topper — Science & Mathematics",
          },
        ],
        achievements: [
          "Selected intern at Flare Global Soft from university batch",
          "15+ projects deployed across full-stack, cloud & DevOps",
          "1st Prize — Inter-School Science Exhibition",
          "School Topper — Science & Mathematics (SSC)",
        ],
        currentlyLearning: [
          "AWS Solutions Architect",
          "Advanced Kubernetes",
          "Helm Charts",
          "ArgoCD (GitOps)",
          "System Design",
        ],
      };
      await Profile.create(defaultProfile);
      console.log("🌱 Default profile details seeded in DB");
    }
  } catch (err) {
    console.error("❌ Data seeding error:", err.message);
  }
};

// --- Routes ---

app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Atharva Shelar Portfolio API" });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    uptime: process.uptime(),
  });
});

// POST /api/contact — save message to MongoDB
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email address." });
    }

    const newMessage = new Message({ name, email, subject, message });
    await newMessage.save();

    console.log(`📧 New message from ${name} <${email}>`);
    res.status(201).json({ success: true, message: "Message received! I'll get back to you soon." });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

// GET /api/portfolio-data — Public endpoint to fetch all dynamic content
app.get("/api/portfolio-data", async (req, res) => {
  try {
    const profile = await Profile.findOne();
    const projects = await Project.find().sort({ featured: -1, _id: -1 });
    const certifications = await Certification.find().sort({ _id: -1 });
    res.json({
      profile: profile || null,
      projects: projects || [],
      certifications: certifications || [],
    });
  } catch (err) {
    res.status(500).json({ error: "Server error fetching portfolio data." });
  }
});

// POST /api/admin/login — Admin Authentication
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUser = "admin";
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";

    if (username === adminUser && password === adminPass) {
      const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "2h" });
      return res.json({ success: true, token });
    }
    return res.status(401).json({ error: "Invalid admin credentials." });
  } catch (err) {
    res.status(500).json({ error: "Login server error." });
  }
});

// GET /api/messages — admin: retrieve all messages
app.get("/api/messages", authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ count: messages.length, messages });
  } catch (err) {
    res.status(500).json({ error: "Server error retrieving messages." });
  }
});

// DELETE /api/messages/:id — admin: delete single message
app.delete("/api/messages/:id", authMiddleware, async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Message deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error deleting message." });
  }
});

// --- Admin CRUD for Projects ---

app.post("/api/admin/projects", authMiddleware, async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: project });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/admin/projects/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete project." });
  }
});

// --- Admin CRUD for Certifications ---

app.post("/api/admin/certifications", authMiddleware, async (req, res) => {
  try {
    const cert = new Certification(req.body);
    await cert.save();
    res.status(201).json({ success: true, data: cert });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/api/admin/certifications/:id", authMiddleware, async (req, res) => {
  try {
    const cert = await Certification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: cert });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/api/admin/certifications/:id", authMiddleware, async (req, res) => {
  try {
    await Certification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Certification deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete certification." });
  }
});

// --- Admin CRUD for Profile Details ---

app.put("/api/admin/profile", authMiddleware, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile(req.body);
    } else {
      profile.personal = req.body.personal || profile.personal;
      profile.skills = req.body.skills || profile.skills;
      profile.experience = req.body.experience || profile.experience;
      profile.education = req.body.education || profile.education;
      profile.achievements = req.body.achievements || profile.achievements;
      profile.currentlyLearning = req.body.currentlyLearning || profile.currentlyLearning;
    }
    await profile.save();
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
