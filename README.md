# Atharva Shelar — Portfolio

A full-stack portfolio built with **React + Vite**, **Node.js + Express**, and **MongoDB Atlas**.

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Animations | react-intersection-observer, CSS animations |

---

## 📁 Project Structure

```
portfolio/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx       # Particle canvas + typing animation
│   │   │   ├── About.jsx      # Bio, education, achievements
│   │   │   ├── Skills.jsx     # Skill grid + learning section
│   │   │   ├── Experience.jsx # Timeline layout
│   │   │   ├── Projects.jsx   # Filterable project cards
│   │   │   ├── Contact.jsx    # Form → MongoDB via API
│   │   │   └── Footer.jsx
│   │   ├── data/
│   │   │   └── portfolio.js   # ← Edit your content here
│   │   └── index.css
│   └── .env                   # VITE_API_URL
│
└── backend/           # Node.js + Express API
    ├── server.js
    └── .env           # MONGODB_URI, PORT, CLIENT_URL
```

---

## ⚡ Quick Start

### 1. Clone & install

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Set up MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Create `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.xxxx.mongodb.net/portfolio
CLIENT_URL=http://localhost:5173
```

### 3. Set up frontend env

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run

```bash
# Terminal 1 — Backend
cd backend
npm start      # or: npm run dev (with nodemon)

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## ✏️ Customization

All content lives in `frontend/src/data/portfolio.js`. Edit:
- `personal` — name, bio, links, stats
- `skills` — your tech stack
- `experience` — work history
- `projects` — portfolio projects
- `education` — academic background
- `achievements` — awards and highlights

---

## 📦 Deploy

**Frontend** → [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- Set `VITE_API_URL` to your backend URL

**Backend** → [Railway](https://railway.app) or [Render](https://render.com)
- Set `MONGODB_URI` and `CLIENT_URL` environment variables

---

## 📬 Contact Form

Messages submitted through the contact form are stored in MongoDB Atlas under the `messages` collection. Retrieve them at:

```
GET /api/messages
```

> Add authentication middleware before exposing this in production.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/contact` | Submit contact form |
| GET | `/api/messages` | Retrieve all messages |
