# Sri Lanka Power & Water Cut Alert and Reporting System

[![Stack](https://img.shields.io/badge/Stack-MERN-green.svg)](https://github.com/)
[![Container](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Frontend](<https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg>)](https://vitejs.dev/)
[![Backend](<https://img.shields.io/badge/Backend-Node%20%2B%20Express-lightgrey.svg>)](https://expressjs.com/)
[![Database](https://img.shields.io/badge/Database-MongoDB-brightgreen.svg)](https://www.mongodb.com/)

> **SLIIT SE3090 – Software Engineering Frameworks (Year 3 | Semester 1 | 2026)**
> **Assignment 2 — Mini Hackathon: "Build for Sri Lanka"**

---

## 1. Selected Problem (Sri Lankan Context)

In Sri Lanka, scheduled and unscheduled utility interruptions — managed primarily by the **Ceylon Electricity Board (CEB)** and the **National Water Supply and Drainage Board (NWSB)** — pose significant daily hurdles for residents, small business owners, schools, and healthcare facilities.

### Key Pain Points:

- **Lack of Centralized Real-Time Information**: Citizens often experience sudden power or water cuts without prior notice, or miss announcements scattered across paper notices, disparate websites, or social media posts.
- **Unclear Duration & Restoration Times**: When utility supplies are interrupted, residents rarely know when service will resume, making it difficult to plan remote work, cooking, water storage, or backup generator usage.
- **Delayed Crowdsourced Reporting**: When unscheduled localized failures occur (such as transformer breakdowns or localized pipe bursts), reporting them usually involves congested hotlines with little visibility into whether authorities or neighbors are aware.

---

## 2. Proposed Solution

The **Power & Water Cut Alert and Reporting System** is a lightweight, responsive, civic web application designed to bridge the information divide between utility authorities and community members.

The system provides dual-role access:

1. **Public / Resident Users**:
   - View ongoing and scheduled power and water cuts filtered automatically by their **residential area**.
   - Watch a **live countdown timer** to estimated service restoration.
   - Submit real-time crowd-sourced outage reports (automatically tied to their registered address).
   - Receive immediate in-app visual alert indicators for newly published cuts in their vicinity.
2. **Administrators / Authorities**:
   - Issue official, instant utility alerts (outage type, affected area, start time, estimated restoration time, details).
   - Review, verify, and approve crowdsourced resident reports to turn verified community reports into official system-wide alerts.
   - Utilize a built-in **Demo Time-Skip Simulator** to demonstrate transition states ("scheduled" → "ongoing" → "resolved") in real time.

---

## 3. Main Features & Minimum Functional Requirements Checklist

This project is built directly against the **10 Minimum Software Requirements** defined in Section 1.3 of the assignment specification:

| #  | Requirement                                             | Implementation in Application                                                                   |          Status          |
| -- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | :----------------------: |
| 1  | **Clear landing page / main UI**                  | Civic portal hero with clear status overviews and fast navigation.                              |         ✅ Ready         |
| 2  | **In-app Sri Lankan problem explanation**         | Dedicated in-app banner and educational context explaining CEB & NWSB utility cuts.             |         ✅ Ready         |
| 3  | **At least two functional features**              | (1) Area-filtered live countdown dashboard, and (2) Resident outage report submission.          | ✅ Skeletons Scaffolding |
| 4  | **At least one form with user input**             | Outage Report submission form & User registration form.                                         | ✅ Skeletons Scaffolding |
| 5  | **Input validation with friendly error messages** | End time must be after start time; area dropdown enforcement; friendly inline alerts.           | ✅ Skeletons Scaffolding |
| 6  | **Search, filter, calculate & process data**      | Live countdown calculation (`estimatedEndTime`), area filtering, and admin approval workflow. | ✅ Skeletons Scaffolding |
| 7  | **Responsive interface (Desktop + Mobile)**       | Fluid CSS design system optimized for mobile viewports and desktop dashboards.                  |         ✅ Ready         |
| 8  | **Basic navigation between main sections**        | React Router navigation linking Landing, Login, Register, User Dashboard, and Admin Portal.     |         ✅ Ready         |
| 9  | **Sample data relevant to Sri Lanka**             | Database seeder script covering key Colombo & suburb areas with mixed utility cut types.        | ✅ Skeletons Scaffolding |
| 10 | **Demonstration of value to Sri Lankan users**    | Demonstrable reduction in downtime uncertainty and proactive community reporting.               |         ✅ Ready         |

---

## 4. System Architecture & Technologies Used

### Technology Stack

- **Frontend**: React (Vite), React Router, Lucide Icons, Pure Modern Vanilla CSS Design System (no heavy frameworks).
- **Backend API**: Node.js, Express.js REST API.
- **Database**: MongoDB with Mongoose ODM (persisted via Docker volumes).
- **Authentication**: Stateless JSON Web Tokens (JWT) + BCrypt password hashing.
- **DevOps & Containerization**: Docker & Docker Compose (multi-stage Nginx client build, Node Alpine server).

### Architecture Overview

```
                        ┌─────────────────────────────────────┐
                        │      Client Browser (React SPA)     │
                        │    Port 3000 (Served via Nginx)     │
                        └──────────────────┬──────────────────┘
                                           │ HTTP / REST API
                                           ▼
                        ┌─────────────────────────────────────┐
                        │      Express API Server (Node)      │
                        │    Port 5000 (/api/health, etc.)    │
                        └──────────────────┬──────────────────┘
                                           │ Mongoose ODM
                                           ▼
                        ┌─────────────────────────────────────┐
                        │       MongoDB Database Engine       │
                        │    Port 27017 (Volume: mongo-data)  │
                        └─────────────────────────────────────┘
```

---

## 5. Project Directory Structure

```
Power-and-Water-Cut-Alert-and-Reporting-System/
├── docker-compose.yml              # Root multi-container orchestration
├── .env.example                    # Environment variables template
├── .gitignore                      # Git exclusion rules
├── README.md                       # Project documentation & rubric evidence
├── PROJECT_INSTRUCTIONS.md         # Detailed hackathon specification
│
├── server/                         # Backend Express API
│   ├── Dockerfile                  # Server Docker container specification
│   ├── .dockerignore
│   ├── package.json                # Dependencies: express, mongoose, cors, etc.
│   └── src/
│       ├── server.js               # Express application entrypoint
│       ├── config/
│       │   ├── db.js               # MongoDB Mongoose connection
│       │   └── areas.js            # Shared Sri Lankan areas enum list
│       ├── models/                 # Mongoose schemas (Member 1)
│       │   ├── User.js
│       │   ├── Admin.js
│       │   └── Report.js
│       ├── controllers/            # Route controllers (Member 2)
│       │   ├── authController.js
│       │   ├── reportController.js
│       │   └── adminController.js
│       ├── routes/                 # API endpoint routers (Member 2)
│       │   ├── authRoutes.js
│       │   ├── reportRoutes.js
│       │   └── adminRoutes.js
│       ├── middleware/             # Security & error handling (Member 2)
│       │   ├── authMiddleware.js
│       │   └── errorHandler.js
│       └── seeds/                  # Seed dataset script (Member 1)
│           └── seed.js
│
└── client/                         # Frontend React Application
    ├── Dockerfile                  # Multi-stage Vite + Nginx container
    ├── nginx.conf                  # Nginx SPA fallback configuration
    ├── .dockerignore
    ├── index.html                  # HTML entrypoint with modern fonts
    ├── vite.config.js              # Vite server & proxy configuration
    ├── package.json
    └── src/
        ├── main.jsx                # React root mount
        ├── App.jsx                 # Routing configuration
        ├── index.css               # Design system & tokens
        ├── constants/
        │   └── areas.js            # Shared area list matching server
        ├── services/
        │   └── api.js              # Centralized API fetch helper
        ├── components/             # Reusable UI components
        │   ├── Navbar.jsx
        │   └── Footer.jsx
        └── pages/                  # Application views (Member 3)
            ├── LandingPage.jsx     # Problem framing & civic portal
            ├── LoginPage.jsx       # Auth login
            ├── RegisterPage.jsx    # User registration with area picker
            ├── UserDashboard.jsx   # Live countdown & report submission
            └── AdminDashboard.jsx  # Outage issue & verification portal
```

---

## 6. Team Members & Contribution Split

In accordance with Section 1.4 of the assignment guidelines, the workload is distributed across the 4 team members:

| Team Member                         | Student ID | Primary Area of Focus           | Specific Planned Responsibilities                                                                                                        |
| ----------------------------------- | ---------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Abeysinghe S.D**            | IT24100788 | **Problem & Data Layer**  | In-app Sri Lankan problem framing, Mongoose Data Models (`User`, `Admin`, `Report`), shared area enum, sample seed data generator. |
| **Srinuka D.G.U.**            | IT24100184 | **Backend API & Auth**    | Express API endpoints (Auth, Report CRUD, Admin approve/reject), JWT auth, validation logic, and Demo Time-Skip controller.              |
| **Gunawardana M.A.A.**        | IT24103038 | **Frontend UI & Views**   | User & Admin Dashboards, live countdown timer, report submission form, responsive styling, and inline validation alerts.                 |
| **Sooriyabandara U.R.G.W.K.** | IT24102798 | **Docker, DevOps & Demo** | Docker multi-container setup (`Dockerfile`s & `docker-compose`), Git repository management, live deployment, and 2-min demo video.   |

---

## 7. Installation & Execution Instructions

### Option A: Running with Docker (Recommended)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd Power-and-Water-Cut-Alert-and-Reporting-System
   ```
2. **Set up environment variables**:

   ```bash
   cp .env.example .env
   ```
3. **Start all services with Docker Compose**:

   ```bash
   docker compose up --build
   ```
4. **Access the application**:

   - **Frontend Web App**: [http://localhost:3000](http://localhost:3000)
   - **Backend Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)
   - **MongoDB Service**: `localhost:27017`

To stop the containers:

```bash
docker compose down
```

---

### Option B: Manual Local Development (Without Docker)

#### Prerequisites:

- Node.js (v18 or higher)
- MongoDB running locally on port 27017

#### 1. Backend Setup

```bash
cd server
npm install
npm run dev
```

*The server will start on [http://localhost:5000](http://localhost:5000).*

#### 2. Frontend Setup

Open a new terminal window:

```bash
cd client
npm install
npm run dev
```

*The React app will start on [http://localhost:3000](http://localhost:3000).*

---

## 8. AI Tools Usage Declaration (CLEAR Framework)

In accordance with Section 2 of the assignment requirements, the team declares the following AI usage:

| AI Tool                        | Prompt / Task Description                                                                                                                                   | Purpose in Project                                                                                                       | Verification & Modification Performed                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| **Antigravity / Gemini** | *"Build the basic foundation of the system without building major functions that are reserved for team members, like docker files and folder structure."* | Generated modular folder structure, Docker multi-stage configurations, Docker Compose orchestration, and starter layout. | Reviewed all paths, verified Docker networking and volume mounts, customized area constants to Sri Lanka suburbs. |
| **Antigravity / Gemini** | *"Draft README file fulfilling all 10 criteria from the SE3090 Assignment 2 PDF."*                                                                        | Structured initial markdown documentation, checklist, and contribution split.                                            | Audited against marking scheme rubric, verified checklist items, and formatted command guides.                    |

---

## 9. Deliverables & Links

- **Git Repository**: `https://github.com/<your-username>/Power-and-Water-Cut-Alert-and-Reporting-System`
- **Public Deployed Application**: `https://<your-deployment-url>.onrender.com` *(Test in an incognito window)*
- **Two-Minute Demonstration Video**: `https://1drv.ms/<your-video-link>`
