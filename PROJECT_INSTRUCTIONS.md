# Project Instructions — Power/Water Cut Alert & Reporting System

## Context
This is a **4-hour mini hackathon build** for the SE3090 – Software Engineering Frameworks module (SLIIT, Year 3 Semester 1). The full assignment specification, rules, minimum requirements, and marking rubric are in the uploaded PDF: **`2026-S1-SE3090-Assignment_2_-_Mini_Hackathon_SpecificationWithMarkingScheme.pdf`**.

**Always check that PDF for anything unclear or not covered in this file — it is the source of truth for grading and rules.** This document is a build-focused summary and technical spec layered on top of it, not a replacement for it.

---

## Project Summary

**Problem:** In Sri Lanka, scheduled and unscheduled power cuts (CEB) and water cuts (NWSB) are common, but residents often have no easy way to know when a cut will happen, how long it will last, or to report an unexpected outage in their area. This app addresses that gap.

**Solution:** A web app with two roles — **Admin** and **User**.

- **Admin** can issue official outage alerts directly, and can review/approve outage reports submitted by users.
- **Users** can see active outage alerts relevant to their area, see a live countdown to restoration, and submit their own outage reports.

---

## Tech Stack
**MERN** — MongoDB, Express.js, React, Node.js.

- Use a clean separation: `/server` (Express + MongoDB/Mongoose API) and `/client` (React frontend).
- Keep dependencies minimal and stable — this is a 4-hour build, avoid anything experimental or requiring complex setup.
- Use JWT-based auth for login sessions (simple, no need for OAuth or third-party auth providers).
- **The project must be Dockerized** — see the "Docker Setup" section below.

---

## Roles & Auth

### User registration fields:
- username
- password
- email
- **area** (dropdown, fixed list — see "Area List" below)
- **address** (free text, full address — used only for admin's reference on user-submitted reports)

### Admin registration/seed fields:
- username
- password
- (no email, no area, no address needed for admin)

### Login:
- Both admin and user log in with **username + password** only.
- On login, redirect based on role (admin → admin dashboard, user → user dashboard).

---

## Area List
Define a **fixed, shared list of areas** used identically by both `User.area` and `Report.area` dropdowns. This must be the exact same list/enum in both places, or filtering breaks. Pick a small list (6–10 areas is enough) — e.g. a handful of Colombo/nearby suburbs. Keep it hardcoded as a shared constant, not free text.

---

## Data Models

### User
- username (unique)
- password (hashed)
- email
- area (enum, from shared area list)
- address (string)
- role: "user"

### Admin
- username (unique)
- password (hashed)
- role: "admin"

### Report
- type: "water" | "power"
- area (enum, from shared area list)
- startTime (datetime)
- estimatedEndTime (datetime)
- status: derive as "scheduled" / "ongoing" / "resolved" by comparing current time to startTime/estimatedEndTime — **do not store this as a manually-set field**, calculate it
- source: "admin" | "user"
- description (optional string)
- submittedBy (reference to User, only present if source = "user")
- approved (boolean, only relevant if source = "user" — admin-issued reports are auto-approved/live immediately)

---

## Core Features

### 1. User Dashboard
- Shows active/upcoming alerts **filtered to the user's own area by default**
- Toggle/option to view alerts from **all areas**
- For each active or upcoming alert relevant to the user: show a **live countdown** to `estimatedEndTime` (time remaining)
- Once a cut's `estimatedEndTime` has passed, that alert should visually return to "resolved" / normal state (no more countdown shown)
- Users can submit a new outage report via a form (type, area, start time, estimated end time, optional description) — address is pulled automatically from their profile, not re-entered

### 2. Admin Dashboard
- Admin can create/issue an official alert directly (type, area, start time, estimated end time, description) — goes live immediately, no approval needed
- Admin can view all **user-submitted reports**, including the reporting user's address, for review
- Admin can **approve** a user-submitted report (converts it into a live/official alert visible to users) or reject it
- Basic list/table view of all current and past reports for admin reference

### 3. Notifications/Alerts
- **In-app only** — no push notifications, SMS, or email sending (out of scope for a 4-hour build)
- A visible in-app indicator (e.g. banner or alert badge/bell icon) shown to users when a new official alert exists for their area

### 4. Demo Time-Skip Feature
- Add a simple admin-only control (e.g. a button or input) to **fast-forward the simulated "current time"** used by the app's countdown/status logic, so the demonstration video can show a cut transitioning from "upcoming" → "ongoing" → "resolved" without waiting in real time.
- This should only affect the app's internal reference clock for demo purposes, not actually alter real timestamps stored in the database in a way that breaks data integrity — implement it as a simple offset/override the app checks against instead of `Date.now()` directly.

---

## Docker Setup
The whole project must run via Docker so it's easy to spin up consistently and deploy.

- **`/server/Dockerfile`** — Node/Express backend image (install deps, expose the API port, run the server)
- **`/client/Dockerfile`** — React frontend image (build the static app, serve via a lightweight server, e.g. `nginx` or `serve`)
- **`docker-compose.yml`** at the project root, defining three services:
  - `mongo` — official MongoDB image, with a named volume for data persistence
  - `server` — built from `/server`, depends on `mongo`, reads DB connection string from environment variables
  - `client` — built from `/client`, depends on `server`
- Use a **`.env`** file (excluded via `.gitignore`) for secrets/config (Mongo URI, JWT secret, ports) — provide a `.env.example` in the repo so teammates and evaluators know what's needed
- Confirm `docker compose up --build` brings up the full stack (DB + API + frontend) with no manual steps beyond that
- Document Docker run instructions in the README (per the deliverables requirements below)
- If deploying to Render/Railway, confirm whether the platform builds directly from your Dockerfile (both support this) — simplifies deployment since you're not maintaining two separate build setups

---

## Team Workload Split (4 Members)
Based on the assignment's suggested role areas (Section 1.4 of the PDF), adapted for this project and MERN specifically. Roles can overlap where needed, but each area should have one clear owner — record actual contributions in the README as required by the submission rules.

### Member 1 — Problem & Solution Design + Backend Data Layer
- Own the problem framing and in-app problem explanation content
- Define and implement Mongoose schemas/models (User, Admin, Report) and the shared area-list constant
- Write seed/sample data script (reports across all areas, mixed types and statuses)
- Coordinate scope decisions if the team needs to cut features under time pressure

### Member 2 — Backend API & Auth
- Build Express routes/controllers: auth (register/login, JWT), report CRUD, admin approve/reject endpoints
- Implement server-side validation (end time after start time, required fields, area whitelist)
- Implement the demo time-skip/offset endpoint (admin-only "fast-forward" control logic)

### Member 3 — Frontend UI (User + Admin Dashboards)
- Build React pages: landing page, register/login forms, user dashboard (alerts list, area filter, countdown display), report submission form
- Build admin dashboard UI (issue alert form, review/approve user reports table)
- Ensure responsive layout (desktop + mobile) and friendly inline validation messages on the frontend

### Member 4 — Docker, Deployment, Git & Demo
- Write Dockerfiles for client and server, and the root `docker-compose.yml`
- Handle deployment (Render/Railway for backend+DB, Vercel/Netlify or same Docker-based host for frontend) and verify the public link works in an incognito window
- Manage the Git repository: branching, meaningful commits/PRs from all members, final merge
- Lead testing/bug-fixing pass during the "Polish" phase, and lead recording the 2-minute demo video
- Assemble the final submission PDF (repo link, deployed link, video link, team details, problem/solution description, tech + AI tools list)

**Note:** All four members should still write code and be able to explain any part of the app during the live demo/panel questions — the rubric awards marks for evidence that *every* registered member contributed meaningfully, not just the person listed as "owner" of an area.

---

## Minimum Functional Requirements Checklist (from the assignment PDF — verify all 10 are met)
1. Clear landing page / main UI
2. Explanation of the Sri Lankan problem (power/water cuts), shown inside the app
3. At least two functional features (e.g. alert dashboard + report submission, or admin issue + admin review)
4. At least one form with user input (report submission form, registration form)
5. Input validation with friendly error messages (e.g. end time after start time, required fields, area must be from the list)
6. A way to display/search/filter/calculate/update/process information (area filter, countdown calculation, admin approve/reject)
7. Responsive interface — works on both desktop and mobile
8. Basic navigation between main sections/screens
9. Sample data relevant to the problem (seed at least one report per area, mixing water and power cuts, and a mix of scheduled/ongoing/resolved)
10. Clear demonstration of the solution's value to Sri Lankan users

**Do not skip any of these — the marking scheme allocates 20 marks to this checklist alone.**

---

## Validation Requirements
- `estimatedEndTime` must be after `startTime`
- `area` must be one of the predefined list values (use a dropdown, not free text, to prevent invalid input)
- Registration: username must be unique, password must meet a minimum length, all required fields present
- All validation errors shown to the user must be **friendly and specific** (not raw server errors or generic "invalid input")

---

## Explicitly Out of Scope (do not build these — not needed and will waste time)
- Real push notifications, SMS, or email sending
- Real-time GPS/maps
- Payment processing
- OAuth/social login
- Complex role permissions beyond admin/user
- Automatic area-matching of alerts using geolocation

---

## Deployment & Submission Requirements (see PDF Section 1.5 & 1.7 for full detail)
- Push all code to a GitHub repository with a meaningful commit history from all team members
- README.md must include: project title, selected problem, proposed solution, main features, technologies used, AI tools used (with declaration per tool), team member details and contributions, install/run instructions, deployed app link, demo video link
- Deploy the app publicly (test in incognito/private window before submitting) — suitable hosts: Render/Railway for the Node/Express backend, Vercel/Netlify for the React frontend
- Record a demonstration video, no more than 2 minutes, covering: team + project briefly, the problem, the solution, a live demo of working features, the deployed app, and expected impact
- Maintain an AI Prompt Log for significant AI usage (tool, exact prompt, purpose, how output was checked/modified) — this is mandatory and must be included in the final submission PDF

---

## Reminder
This file is a working summary to guide the build. **Whenever there's ambiguity about a rule, requirement, or scoring detail, refer back to the original hackathon specification PDF (`2026-S1-SE3090-Assignment_2_-_Mini_Hackathon_SpecificationWithMarkingScheme.pdf`) rather than assuming.**
