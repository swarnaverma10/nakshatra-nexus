# 🌌 NAKSHATRA NEXUS
### *Where Ancient Wisdom Meets AI*

> A premium AI-powered cosmic identity experience designed for exhibitions, malls, festivals, expos, brand activations, and experience centers.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Live Demo](#live-demo)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Visitor Journey](#visitor-journey)
- [Backend API](#backend-api)
- [Environment Variables](#environment-variables)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Features](#features)
- [Use Cases](#use-cases)

---

## 🚀 Overview

Nakshatra Nexus combines **Artificial Intelligence**, **Vedic Astrology**, **Computer Vision**, and **Generative Media** to create a deeply personalized cosmic journey for every visitor.

Participants enter their birth details, capture a selfie, and receive:

- 🎭 AI-generated cosmic avatar
- 🔮 Vedic astrology insights (zodiac, nakshatra, birth chart)
- ✨ Cosmic archetype identity
- 🌈 Aura analysis
- 🐯 Spirit animal discovery
- 🎡 Interactive blessing wheel
- 🛂 Digital cosmic passport
- 📱 QR-based shareable profile
- 📧 Email delivery of complete journey

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| Frontend | `https://nakshatra-nexus-frontend.onrender.com` |
| Backend API | `https://nakshatra-nexus-backend.onrender.com` |
| API Docs | `https://nakshatra-nexus-backend.onrender.com/docs` |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| Zustand | State management |
| Axios | API communication |

### Backend
| Technology | Purpose |
|-----------|---------|
| FastAPI | REST API framework |
| Python 3.11 | Runtime |
| MongoDB Atlas | Database |
| Cloudinary | Media storage |
| Swiss Ephemeris | Astrology engine |
| Resend | Email delivery |
| InsightFace | Computer vision / face detection |
| Pillow | Image processing |

---

## 📁 Project Structure

```
nakshatra-nexus/
├── frontend/
│   └── src/
│       ├── screens/          # All page screens
│       ├── components/       # Reusable UI components
│       ├── services/         # API calls (api.js)
│       ├── store/            # Zustand state store
│       └── App.jsx           # Routes
│
├── backend/
│   └── app/
│       ├── api/
│       │   └── routes/       # All API endpoints
│       ├── engines/          # Astrology, passport, QR engines
│       ├── services/         # Cloudinary, email, avatar services
│       ├── models/           # MongoDB models
│       ├── core/             # Config, database connection
│       └── main.py           # FastAPI app entry point
│
└── render.yaml               # Render deployment config
```

---

## 🌠 Visitor Journey

```
Landing Page
    ↓
Onboarding (Name, Email, DOB, Birth Place)
    ↓
Selfie Capture
    ↓
Processing Chamber
    ↓
AI Avatar Generation
    ↓
Cosmic Blueprint (Astrology)
    ↓
Cosmic Identity Reveal (Archetype)
    ↓
Aura Analysis
    ↓
Spirit Animal Discovery
    ↓
Cosmic Blessing Wheel
    ↓
Destiny Vault & AI Insight
    ↓
Cosmic Passport Generation
    ↓
QR Code Creation
    ↓
Email Delivery
    ↓
Journey Complete 🎉
```

---

## 🔌 Backend API

Base URL: `/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/visitors` | Create new visitor |
| GET | `/visitors/{id}` | Get visitor details |
| GET | `/visitors/{id}/profile` | Public profile (no auth) |
| POST | `/visitors/{id}/selfie` | Upload selfie |
| POST | `/visitors/{id}/avatar` | Generate AI avatar |
| POST | `/visitors/{id}/astrology` | Calculate astrology |
| POST | `/visitors/{id}/aura` | Reveal aura |
| POST | `/visitors/{id}/spirit-animal` | Discover spirit animal |
| POST | `/visitors/{id}/archetype` | Detect cosmic archetype |
| POST | `/visitors/{id}/wheel/spin` | Spin blessing wheel |
| POST | `/visitors/{id}/destiny-vault` | Generate destiny insights |
| POST | `/visitors/{id}/gemini-insight` | AI-powered insight |
| POST | `/visitors/{id}/passport` | Generate digital passport |
| POST | `/visitors/{id}/qr` | Generate QR code |
| POST | `/visitors/{id}/send-email` | Send email with passport |

Full interactive API docs available at `/docs` (Swagger UI).

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

```env
# App
ENVIRONMENT=production
SECRET_KEY=your-secret-key
APP_NAME=Nakshatra Nexus
API_PREFIX=/api/v1

# MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/
MONGODB_DB_NAME=nakshatra_nexus

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Resend (Email)
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com

# AI
GEMINI_API_KEY=your-gemini-key
FLUX_API_KEY=your-flux-key

# Frontend URL (for QR generation)
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (`frontend/.env`)

```env
VITE_API_BASE_URL=https://your-backend-domain.com/api/v1
```

---

## 💻 Local Development

### Prerequisites

- Python 3.11+
- Node.js 18+
- MongoDB Atlas account
- Cloudinary account
- Resend account

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # Windows
# source venv/bin/activate    # Mac/Linux

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: `http://localhost:8000`
API Docs at: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🚀 Deployment

This project is configured for **Render** deployment via `render.yaml`.

### Steps

1. Push code to GitHub
2. Go to [dashboard.render.com](https://dashboard.render.com)
3. Click **New → Blueprint**
4. Connect `swarnaverma10/nakshatra-nexus` repository
5. Fill in all environment variables
6. Deploy

Render will automatically deploy both frontend and backend services.

### Post-Deployment

After deployment, update these env vars:

```
FRONTEND_URL = https://nakshatra-nexus-frontend.onrender.com
VITE_API_BASE_URL = https://nakshatra-nexus-backend.onrender.com/api/v1
```

---

## ✨ Features

- 🤖 **AI Avatar Generation** — Personalized cosmic avatar from selfie
- 🔭 **Vedic Astrology Engine** — Swiss Ephemeris powered calculations
- 🌟 **Cosmic Archetype** — Unique identity (Healer, Explorer, Guardian...)
- 🌈 **Aura Analysis** — Energetic signature with symbolic meaning
- 🐾 **Spirit Animal** — Personalized animal guide
- 🎡 **Blessing Wheel** — Interactive spin experience
- 🛂 **Digital Passport** — Premium collectible cosmic artifact
- 📱 **QR Profile** — Shareable public cosmic profile
- 📧 **Email Delivery** — Complete journey delivered to inbox
- ☁️ **Cloud Storage** — Cloudinary-powered media delivery
- 📊 **MongoDB Atlas** — Scalable cloud database

---

## 🎯 Use Cases

Nakshatra Nexus is designed for high-footfall events:

- 🏛️ Trade Shows & Exhibitions
- 🛍️ Shopping Malls
- 🎪 Festivals & Fairs
- 🏢 Corporate Events
- 🎓 College Fests
- 🚀 Product Launches
- 🧘 Spiritual & Wellness Events
- 💼 Brand Activations
- 🎨 Experience Centers
- 📣 Marketing Campaigns

---

## 🔮 Future Roadmap

- [ ] Multi-language support
- [ ] Voice-guided cosmic journey
- [ ] Real-time AI companion
- [ ] AR cosmic experiences
- [ ] Large-screen event mode
- [ ] Analytics dashboard
- [ ] Event management portal
- [ ] Social media integration
- [ ] NFT-style collectible passports

---

## 👩‍💻 Author

**Swarna Verma**
GitHub: [@swarnaverma10](https://github.com/swarnaverma10)

---

## 📄 License

This project is proprietary software developed for commercial event deployment.

---

*NAKSHATRA NEXUS — Where Ancient Wisdom Meets AI* 🌌