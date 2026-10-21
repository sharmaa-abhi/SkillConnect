# SkillConnect 🛠️

> **Connecting homeowners with trusted local service professionals through upfront pricing, AI cost estimation, and escrow payment protection.**

[![Status](https://img.shields.io/badge/Status-Phase%201%20Prototype%20Live-brightgreen)](#-core-features)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.8-black?logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Passed-blue)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Tests Passing](https://img.shields.io/badge/Tests-100%25%20Passing-brightgreen)](#-available-scripts)

---

## ⚡ Core Features

- 🔍 **Smart Search & Trade Directory (`/professionals`)**: Auto-detects trade categories from natural language queries (e.g. *"leaky sink"* &rarr; Plumbing), filters by location/ZIP coverage, and guards against non-trade queries.
- 🧮 **AI-Assisted Cost Estimator (`/services`)**: Transparent pricing breakdown (diagnostic fee, labor, parts, tax) with clear scope validation.
- 🐟 **Live Market Price Intelligence**: Real-time market comparison via [TinyFish Free Tier APIs](TINYFISH.md) with SSRF defense, PII scrubbing, 24h caching, and mock fallback.
- 👥 **Multi-Portal Synchronized State**: Dedicated, synchronized dashboards for Homeowners (`/customer/dashboard`), Service Professionals (`/worker/dashboard`), and Admins (`/admin`).
- 🔒 **Escrow & Booking Protection**: Diagnostic fee pre-authorization holds, pro accept/decline flows, and guaranteed full customer refunds upon cancellation or decline.
- 📅 **Dynamic Calendar**: Real-time date calculation and scheduling without hardcoded date assumptions.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org) |
| **UI Library** | [React 19](https://react.dev) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com) |
| **Animations** | [Motion (Framer Motion 14)](https://motion.dev) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org) (Strict Mode) |
| **External APIs** | [TinyFish Free Tier](TINYFISH.md) (Search & Fetch APIs) |

---

## 🚀 Quickstart

### Prerequisites
- **Node.js**: `>= 18.17.0` (Node 20+ recommended)
- **npm**: `>= 9.0.0`

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/skillconnect.git
cd skillconnect-phase1-md

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local

# 4. Start local development server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

> [!TIP]
> **TinyFish API Key**: Setting `TINYFISH_API_KEY` in `.env.local` enables real-time market data fetching. If omitted, the app gracefully falls back to simulated realistic market intelligence for local development and testing.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles the optimized production build |
| `npm start` | Starts the production server |
| `npm test` | Runs the automated test suite across all 6 modules (100% pass rate) |
| `npm run typecheck` | Validates strict TypeScript compilation (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint checks |

---

## 📁 Project Structure

```text
skillconnect/
├── src/
│   ├── app/                      # Next.js App Router pages and API routes
│   │   ├── admin/                # Administrator portal
│   │   ├── customer/             # Homeowner dashboard & booking
│   │   ├── worker/               # Service professional dashboard
│   │   ├── professionals/        # Trade directory & professional profiles
│   │   ├── services/             # Service catalog & cost estimator
│   │   └── api/price-intelligence/ # TinyFish search & compare endpoints
│   ├── components/               # Modular UI components (booking, forms, home, layout)
│   ├── context/                  # React context providers (auth, toasts)
│   ├── data/                     # Mock data records (professionals, bookings, services)
│   ├── lib/                      # Core business logic (estimator, search, dates, pricing)
│   │   └── price-intelligence/   # TinyFish client, SSRF security, cache, extractor
│   └── types/                    # Shared TypeScript interfaces
├── tests/                        # Automated unit & integration test suites
├── docs/                         # Architecture, product specs, and security policies
└── feedback/                     # Reviewer feedback & visual verification artifacts
```

---

## 📚 Documentation & Reference

For comprehensive technical and architectural documentation, refer to:

- 📖 [Master Documentation Index](DOCUMENTATION-INDEX.md) — Complete guide across product, architecture, design, and security.
- 🐟 [TinyFish Integration Guide](TINYFISH.md) — Architecture, API proxies, SSRF guardrails, and caching specifications.
- 📋 [Feedback & Improvements](feedback/README.md) — Visual before-and-after verification and test results.

---

<p align="center">
  <strong>SkillConnect</strong> • Built with Next.js 16, React 19, TypeScript & Tailwind CSS
</p>