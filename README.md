# AuditEX

**AI Spend Intelligence Platform**

AuditEX is a premium SaaS-style web application that helps startups and teams audit spend across AI subscriptions and API vendors including ChatGPT, Claude, Cursor, GitHub Copilot, Gemini, OpenAI API, Anthropic API, Windsurf, and v0.

The product tracks AI tools, calculates monthly and yearly spend, detects overspending, suggests cheaper alternatives, estimates savings, generates shareable audit reports, and captures consultation leads after results.

## Screenshots

Add screenshots after deployment:

- `screenshots/landing.png`
- `screenshots/audit-form.png`
- `screenshots/results-dashboard.png`
- `screenshots/public-report.png`

## Features

- Premium dark SaaS UI inspired by Vercel, Linear, Stripe, and Framer
- React Three Fiber animated background with particles, spheres, and grid
- Dynamic AI tool form with add/remove rows, validation, and localStorage persistence
- Intelligent audit engine for seat waste, plan mismatch, API routing, duplicate tools, and consolidation
- Recharts dashboard with pie, bar, and savings curve charts
- Animated results with severity badges and savings estimates
- Shareable public audit reports at `/audit/:id`
- Open Graph metadata updates for public reports
- Lead capture form for saved audit reports
- Express + MongoDB backend with typed models and deployment-ready environment config

## Tech Stack

Frontend:

- React + Vite + TypeScript
- Tailwind CSS
- Framer Motion
- React Three Fiber + Three.js
- React Router DOM
- Recharts
- Lucide React
- Axios
- Zustand

Backend:

- Node.js + Express + TypeScript
- MongoDB + Mongoose
- dotenv
- cors
- uuid
- nodemon + tsx

## Project Structure

```text
AuditEX/
├── frontend/
│   ├── src/components/
│   ├── src/pages/
│   ├── src/data/
│   ├── src/store/
│   ├── src/utils/
│   ├── src/hooks/
│   ├── src/types/
│   └── src/styles/
├── backend/
│   ├── src/config/
│   ├── src/controllers/
│   ├── src/models/
│   ├── src/routes/
│   ├── src/middleware/
│   ├── src/utils/
│   └── src/types/
└── README.md
```

## Installation

Install frontend dependencies:

```bash
cd frontend
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

## Frontend Setup

```bash
cd frontend
npm run dev
```

The frontend runs at `http://localhost:5173`.

Optional environment variable:

```bash
VITE_API_URL=http://localhost:5000/api
```

For Vercel, set `VITE_API_URL` to the deployed backend API URL.

## Backend Setup

Copy the example environment file:

```bash
cd backend
cp .env.example .env
```

Configure:

```bash
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auditex
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/audits` | Save audit and generate a unique `auditId` |
| GET | `/api/audits/:id` | Fetch public audit report |
| POST | `/api/leads` | Save lead capture data |

## Audit Engine

AuditEX evaluates:

- Total monthly and yearly AI spend
- Unused seats compared with team size
- Plan mismatch against team size and use case
- Spend above realistic benchmark pricing
- Duplicate coding tools and general assistant overlap
- API spend routing opportunities
- Consolidation opportunities across tool categories
- Estimated monthly and yearly savings
- Recommendation severity: Low, Medium, High

## Deployment

Frontend on Vercel:

1. Set root directory to `frontend`.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add `VITE_API_URL` with your backend URL.

Backend on Render or Railway:

1. Set root directory to `backend`.
2. Build command: `npm install && npm run build`.
3. Start command: `npm start`.
4. Add `PORT`, `MONGODB_URI`, and `CLIENT_URL`.

## Internship Submission Notes

AuditEX is structured like a production SaaS project with separate frontend and backend apps, typed data contracts, reusable UI components, modular audit logic, deployable API routes, MongoDB persistence, and a polished responsive interface. The project demonstrates frontend engineering, backend API design, database modeling, business logic, state management, animated UX, and deployment readiness.
