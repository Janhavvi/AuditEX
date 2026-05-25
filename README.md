# AuditEX

**AI Spend Intelligence Platform**

AuditEX is an AI spend audit tool for seed to Series B founders, ops leads, and finance teams who need to understand whether their AI subscription and API spend is disciplined. It turns a manual list of tools, seats, plans, and monthly spend into deterministic savings recommendations, an AI-written executive summary, a shareable public report, and a qualified Credex lead path for high-savings cases.

Live deployed URL: https://main.d1gt3euco9a18p.amplifyapp.com
## Screenshots Or Recording

TODO: add at least three deployed-product screenshots or a 30-second YouTube/Loom walkthrough before submission. Localhost screenshots do not count.

- Screenshot 1: Landing page: ![alt text](image-1.png)
- Screenshot 2 : Audit form :![alt text](image.png)
- Screenshot 3: Audit results with savings :![alt text](image-2.png)
- Screenshot 4: Public shareable report - TODO

## Features

- Premium dark SaaS UI with custom-built product screens
- React Three Fiber animated background with particles, spheres, and grid
- Dynamic AI tool form with add/remove rows, validation, and localStorage persistence
- Intelligent audit engine for seat waste, plan mismatch, API routing, duplicate tools, and consolidation
- Recharts dashboard with pie, bar, and savings curve charts
- Animated results with severity badges and savings estimates
- Shareable public audit reports at `/audit/:id`
- Open Graph metadata updates for public reports
- Lead capture form with optional company, role, and team size fields
- Resend transactional confirmation emails with Credex follow-up messaging for high-savings audits
- Benchmark mode showing AI spend per developer against a modeled company-size baseline
- Referral codes appended to public share links for attribution
- Embeddable audit widget script at `/embed.js`
- Launch post and X/Twitter thread draft in `LAUNCH_POST.md`
- Express + MongoDB backend with typed models and deployment-ready environment config

## Tech Stack

Architecture and constraint rationale are documented in `ARCHITECTURE.md`.

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
PUBLIC_API_URL=http://localhost:5000
NVIDIA_NIM_API_KEY=your-nvidia-api-key
NVIDIA_NIM_MODEL=meta/llama-3.1-70b-instruct
RESEND_API_KEY=your-resend-api-key
RESEND_FROM_EMAIL=AuditEX <audit@auditex.ai>
```

Run the backend:

```bash
npm run dev
```

The backend runs at `http://localhost:5000`.

## Quick Start

```bash
git clone https://github.com/Janhavvi/AuditEX.git
cd AuditEX
npm --prefix frontend install
npm --prefix backend install
npm --prefix backend run dev
npm --prefix frontend run dev
```

Open `http://localhost:5173`, enter AI tool spend, generate results, then save the audit to create a public URL.

Deploy:

1. Deploy `backend` to Render, Railway, Fly.io, or equivalent.
2. Set backend env vars from `backend/.env.example`.
3. Deploy `frontend` to Vercel, Netlify, or Cloudflare Pages.
4. Set `VITE_API_URL` to the deployed backend `/api` URL.
5. Set `CLIENT_URL` on the backend to the deployed frontend URL.

## API Routes

| Method | Route | Description |
| --- | --- | --- |
| GET | `/api/health` | Health check |
| POST | `/api/audits` | Save audit and generate a unique `auditId` |
| GET | `/api/audits/:id` | Fetch public audit report |
| GET | `/api/audits/:id/share` | Public share preview with Open Graph and Twitter tags |
| GET | `/api/audits/:id/og.svg` | Dynamic social preview image |
| GET | `/api/audits/:id/pdf` | Export the public report as a PDF |
| POST | `/api/leads` | Save lead capture data |

## Shareable Reports

Each saved audit receives a unique `auditId` and a public report at `/audit/:id`. The public API response is sanitized before it leaves the backend: it includes tools, spend, savings, recommendations, summary, and timestamps only. Lead capture data such as email, company, and role is stored separately and is never embedded in the public audit payload, share preview, or PDF.

For clean link previews, share buttons use `/api/audits/:id/share`. That endpoint serves crawler-readable Open Graph and Twitter card tags, including a generated preview image at `/api/audits/:id/og.svg`, then redirects people to the frontend report at `/audit/:id`. Set `PUBLIC_API_URL` in production so preview images resolve to the deployed backend origin.

## Lead Capture

Lead capture stores submissions in MongoDB through Mongoose. Use MongoDB Atlas with `MONGODB_URI` in production; the in-memory fallback is only for local demos when a database is unavailable.

Captured fields:

- Required: `name`, `email`
- Optional: `company`, `role`, `teamSize`
- Audit context: `auditId`, `estimatedMonthlySavings`, `highSavings`

Transactional email is sent through Resend when `RESEND_API_KEY` is configured. The confirmation email includes the shareable audit link when available and notes that Credex will reach out when `estimatedMonthlySavings >= $500/mo`.

Abuse protection is intentionally lightweight for the no-login MVP:

- `/api` IP rate limit: 90 requests per minute
- Hidden honeypot field: `website`

This avoids adding hCaptcha friction after the user has completed an audit while still blocking low-effort automated spam. See `ABUSE_PROTECTION.md` for details.

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

## Decisions

1. React + Vite instead of Next.js: the app is interaction-heavy and the backend serves crawler-ready share previews, so a simple SPA kept the MVP smaller.
2. Deterministic audit math instead of LLM math: savings recommendations must be explainable and repeatable; AI is used only for the personalized summary paragraph.
3. MongoDB Atlas + Mongoose instead of a hosted spreadsheet or no-code store: audit reports and leads need real backend persistence with typed schemas.
4. Honeypot + rate limit instead of hCaptcha: the lead form appears after a completed audit, so low-friction abuse protection is better for conversion.
5. Public share endpoint instead of relying only on SPA meta tags: social crawlers need server-rendered Open Graph/Twitter tags, while humans can still land on the React report.

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
4. Add `PORT`, `MONGODB_URI`, `CLIENT_URL`, `NVIDIA_NIM_API_KEY`, `RESEND_API_KEY`, and `RESEND_FROM_EMAIL`.

AuditEX is structured like a production SaaS project with separate frontend and backend apps, typed data contracts, reusable UI components, modular audit logic, deployable API routes, MongoDB persistence, and a polished responsive interface. The project demonstrates frontend engineering, backend API design, database modeling, business logic, state management, animated UX, and deployment readiness.
