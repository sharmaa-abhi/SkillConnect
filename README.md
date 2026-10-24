# SkillConnect 🛠️

### Modern SaaS Marketplace for Trusted Local Home Services

**Project Name:** `SkillConnect` (Phase 1 Working Prototype & Production SaaS Architecture)  
**Package Identifier:** `skillconnect` (v1.0.0)  
**Repository:** [sharmaa-abhi/SkillConnect](file:///README.md)

[![Status](https://img.shields.io/badge/Status-Phase%201%20Prototype%20Live-brightgreen)](#-core-features)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.8-black?logo=nextdotjs)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x%20Strict-blue?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)
[![Motion](https://img.shields.io/badge/Motion-14.0.0-FF0055?logo=framer)](https://motion.dev)
[![Lucide Icons](https://img.shields.io/badge/Lucide%20Icons-1.52.0-F97316)](https://lucide.dev)
[![TinyFish API](https://img.shields.io/badge/TinyFish-Live%20Price%20Intelligence-00C49F)](TINYFISH.md)
[![ESLint 9](https://img.shields.io/badge/ESLint-v9-4B32C3?logo=eslint)](https://eslint.org)
[![Tests](https://img.shields.io/badge/Tests-Automated%20Suites-brightgreen)](#-available-scripts)

---

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Comprehensive Tools & Technologies Inventory](#-comprehensive-tools--technologies-inventory)
  - [1. Frontend Framework & Core Libraries](#1-frontend-framework--core-libraries)
  - [2. Styling, UI Design System & Motion](#2-styling-ui-design-system--motion)
  - [3. Languages, Runtimes & Package Managers](#3-languages-runtimes--package-managers)
  - [4. Developer Tooling, Linters & Compilers](#4-developer-tooling-linters--compilers)
  - [5. External APIs & Web Intelligence Tools](#5-external-apis--web-intelligence-tools)
  - [6. Application State & Storage Tools](#6-application-state--storage-tools)
  - [7. Testing, QA & Verification Tools](#7-testing-qa--verification-tools)
  - [8. Production Cloud, Database & Infrastructure Tools](#8-production-cloud-database--infrastructure-tools)
  - [9. DevOps, CI/CD & Hosting Tools](#9-devops-cicd--hosting-tools)
- [⚡ Core Features](#-core-features)
- [🚀 Quickstart](#-quickstart)
  - [Prerequisites](#prerequisites)
  - [Installation & Setup](#setup)
- [📜 Available Scripts](#-available-scripts)
- [📁 Project Directory Structure](#-project-structure)
- [🔒 Security & Safe Execution Guardrails](#-security--safe-execution-guardrails)
- [📚 Master Documentation Index](#-documentation--reference)

---

## 🌟 Project Overview

**SkillConnect** is an enterprise-grade home services marketplace that bridges the trust gap between homeowners and verified trade professionals (electricians, plumbers, HVAC technicians, roofers, carpenters, and painters). 

Unlike legacy lead-generation directories that sell customer contacts to multiple contractors, SkillConnect introduces **guaranteed upfront pricing**, **AI-assisted diagnostic and cost estimation**, **real-time local price intelligence**, and **escrow-backed pre-authorization holding** to ensure fair, transparent, and dispute-free home repairs.

---

## 🛠️ Comprehensive Tools & Technologies Inventory

All tools, frameworks, packages, developer utilities, testing harnesses, APIs, and cloud services utilized in or architected for the pre-built **SkillConnect** project are disclosed below:

### Complete Pre-Built Tools & Packages Matrix

| Tool / Technology Name | Category | Version / Type | Exact Purpose in SkillConnect | Implementation Location |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js** | Core Framework | `16.3.8` | React Server Components (RSC), App Router, streaming SSR, API route handlers, layouts | `package.json`, [src/app/](file:///src/app) |
| **React** | UI Library | `19.2.8` | Declarative UI components, concurrent rendering, hooks, client/server boundaries | `package.json`, [src/components/](file:///src/components) |
| **React DOM** | DOM Renderer | `19.2.8` | Document Object Model reconciliation and client-side hydration | `package.json` |
| **TypeScript** | Programming Language | `^5.0.0` | Strict static type checking, interface definitions, compiler guards | `tsconfig.json`, [src/types/](file:///src/types) |
| **Tailwind CSS** | Styling Engine | `^4.0.0` | Modern utility-first CSS styling, theme tokens, responsive layouts | `src/app/globals.css` |
| **@tailwindcss/postcss** | PostCSS Plugin | `^4.0.0` | PostCSS processing pipeline for Tailwind v4 engine compilation | `postcss.config.mjs` |
| **Motion (`motion/react`)** | Animation Library | `^14.0.0` | Spring physics, layout animations, drawer transitions, accessible motion reduction | [src/lib/motion-variants.ts](file:///src/lib/motion-variants.ts) |
| **Lucide React** | Iconography | `^1.52.0` | Accessible, tree-shakeable SVG icons for trades, status badges, buttons | `src/components/` |
| **TinyFish API (Search)** | Web Intelligence | External REST | Real-time web search for public trade price guides and contractor benchmarks | [src/lib/price-intelligence/tinyfish-client.ts](file:///src/lib/price-intelligence/tinyfish-client.ts) |
| **TinyFish API (Fetch)** | Content Extraction | External REST | Server-side extraction of cleaned text/markdown from trade pricing articles | [src/lib/price-intelligence/tinyfish-client.ts](file:///src/lib/price-intelligence/tinyfish-client.ts) |
| **In-Memory TTL Cache** | Performance Caching | Built-in Engine | 24-hour cache layer to eliminate redundant external requests and respect rate limits | [src/lib/price-intelligence/cache.ts](file:///src/lib/price-intelligence/cache.ts) |
| **SSRF Defense Filter** | Security Tool | Custom Engine | Blocks private IP ranges (RFC 1918, loopback, link-local) and enforces HTTPS allowlists | [src/lib/price-intelligence/security.ts](file:///src/lib/price-intelligence/security.ts) |
| **PII Scrubbing Sanitizer**| Data Privacy Tool | Custom Engine | Automatically detects and redacts phone numbers, emails, and sensitive user tokens | [src/lib/price-intelligence/security.ts](file:///src/lib/price-intelligence/security.ts) |
| **ESLint** | Linter Tool | `^9.0.0` | Flat configuration code quality, syntax standards, and rule enforcement | [eslint.config.mjs](file:///eslint.config.mjs) |
| **eslint-config-next** | Next.js Lint Suite | `16.3.8` | Core Web Vitals checks, React hooks rules, and Next.js best practices | [eslint.config.mjs](file:///eslint.config.mjs) |
| **tsx** | Execution & Test Runner| `^4.23.15` | Fast TypeScript execution engine and automated test runner (`tsx --test`) | `package.json` |
| **Node.js Test Runner** | Testing Tool | Node.js Built-in | Native test assertions and execution harness for test files | `package.json` |
| **Node.js** | Server Runtime | `>= 18.17.0` (v20+) | High-performance JavaScript runtime for Next.js server and compilation | `package.json` |
| **npm** | Package Manager | `>= 9.0.0` | Dependency resolution, package scripts, and artifact management | `package-lock.json` |
| **Git** | Version Control | Latest | Distributed version control, branch management, and change tracking | `.gitignore` |
| **useSyncExternalStore** | State Synchronization | React 19 Core | Multi-tab and multi-portal synchronized state across Homeowner, Pro, and Admin | [src/lib/demo-storage.ts](file:///src/lib/demo-storage.ts) |
| **LocalStorage Engine** | Client Storage | Web Storage API | Client-side persistent cache for bookings, jobs, reviews, and credentials | [src/lib/demo-storage.ts](file:///src/lib/demo-storage.ts) |

---

### Architectural & Production Ecosystem Tools

The following tools and third-party platforms are fully specified and integrated into SkillConnect's production architecture:

| Tool Name | Technology Area | Purpose & Functional Specification | Architecture Reference |
| :--- | :--- | :--- | :--- |
| **PostgreSQL 16 + PostGIS** | Relational Database | ACID transactions for bookings/escrow with spatial radius queries (`ST_DWithin`) | [DOC-ARCH-002](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md) |
| **Prisma / Kysely** | Database ORM & Query Builder | Type-safe migrations, auto-generated schemas, and connection pooling | [DOC-ARCH-002](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md) |
| **Redis 7** | Distributed Cache & Locks | Fast session cache, real-time search queries, and distributed slot reservation locks | [DOC-ARCH-002](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md) |
| **Stripe Connect Express** | Marketplace Payments & Escrow | Diagnostic fee pre-authorization holds, split contractor payouts, 1099 tax handling | [DOC-ARCH-005](file:///docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md) |
| **Persona / Stripe Identity** | Identity & License Verification | Government photo ID verification, facial biometric liveness, trade license checks | [DOC-SEC-005](file:///docs/security/IDENTITY-AND-SKILL-VERIFICATION.md) |
| **Twilio** | Telecommunications | Two-way SMS alerts, technician arrival dispatch notices, and proxy calling | [DOC-ARCH-013](file:///docs/architecture/THIRD-PARTY-INTEGRATIONS.md) |
| **Resend** | Transactional Communications | Booking confirmations, tax receipts, diagnostic summaries, and dispute notices | [DOC-ARCH-013](file:///docs/architecture/THIRD-PARTY-INTEGRATIONS.md) |
| **AWS S3 / Cloudflare R2** | Cloud Object Storage | Encrypted storage for job diagnostic photos, repair permits, and insurance receipts | [DOC-ARCH-013](file:///docs/architecture/THIRD-PARTY-INTEGRATIONS.md) |
| **Zod** | Schema Validation | Comprehensive schema validation for form submissions, API query params, and DTOs | [DOC-ARCH-002](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md) |
| **Vitest & React Testing Library** | Unit Testing Suite | Fast component testing, pure function unit validation, and mock DOM assertions | [DOC-OPS-003](file:///docs/operations/TESTING-STRATEGY.md) |
| **Playwright** | End-to-End Testing (E2E) | Automated cross-browser user journeys (Desktop 1440px, Tablet 768px, Mobile 375px) | [DOC-OPS-003](file:///docs/operations/TESTING-STRATEGY.md) |
| **axe-core** | Accessibility Auditing | Automated WCAG 2.1 AA audits, screen reader checks, and contrast validations | [DOC-OPS-003](file:///docs/operations/TESTING-STRATEGY.md) |
| **GitHub Actions** | CI/CD Pipeline | Automated linting, strict type checks, test execution, and deployment gating | [DOC-OPS-004](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md) |
| **Vercel / AWS** | Cloud Hosting & Edge Platform | Edge serverless functions, globally distributed CDN, and instant rollback deployments | [DOC-OPS-004](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md) |
| **Sentry / Datadog** | APM & Error Observability | Production error tracking, performance waterfall monitoring, and audit logging | [DOC-ARCH-013](file:///docs/architecture/THIRD-PARTY-INTEGRATIONS.md) |

---

### Detailed Tool Breakdown

#### 1. Frontend Framework & Core Libraries
- **Next.js 16 (`16.3.8`)**: Leverages the Next.js App Router for server-first rendering, streaming UI, nested layouts, and edge-ready API routes. Eliminates bloated client bundles while ensuring maximum search engine crawlability (SEO) for local trade discovery.
- **React 19 (`19.2.8`)**: Implements React 19's unified Server/Client Component model, fast hydration, and concurrent state primitives.
- **React DOM (`19.2.8`)**: Handles DOM rendering and interaction binding.

#### 2. Styling, UI Design System & Motion
- **Tailwind CSS v4 (`^4.0.0`)**: Employs Tailwind v4 with a unified modern color palette, custom responsive breakpoint hierarchy (320px mobile to 1440px wide desktop), and fluid container utilities.
- **@tailwindcss/postcss (`^4.0.0`)**: Next-generation PostCSS plugin providing fast CSS bundling without legacy config overhead.
- **Motion for React (`motion` `^14.0.0`)**: Smooth physics-based spring animations for dialog popups, sliding filter drawers, toast notifications, and tabs with full `prefers-reduced-motion` accessibility support.
- **Lucide React (`^1.52.0`)**: Over 30 specialized icons covering trade tools, calendar dates, currency symbols, star ratings, and security badges.

#### 3. Languages, Runtimes & Package Managers
- **TypeScript 5 (`^5.0.0`)**: Strict-mode configuration with `@/*` path aliases, zero implicit `any`, and exhaustive union typing across all domains.
- **Node.js (`>= 18.17.0`, Node 20+ Recommended)**: Modern JavaScript engine running the development server and production builds.
- **npm (`>= 9.0.0`)**: Clean dependency graph resolution with locked package trees (`package-lock.json`).

#### 4. Developer Tooling, Linters & Compilers
- **ESLint 9 (`^9.0.0`)**: Modern flat config (`eslint.config.mjs`) enforcing consistent coding standards across JavaScript and TypeScript.
- **eslint-config-next (`16.3.8`)**: Next.js-specific linting rules preventing hydration bugs and invalid component exports.
- **TypeScript Compiler (`tsc`)**: Validates type safety (`npm run typecheck`) across all components and libraries without emitting artifacts.
- **tsx (`^4.23.15`)**: High-performance TypeScript executor for running scripts and tests directly.

#### 5. External APIs & Web Intelligence Tools
- **TinyFish Search API (`https://api.search.tinyfish.ai`)**: Searches public trade price guides, regional contractor benchmarks, and consumer repair indexes in real-time.
- **TinyFish Fetch API (`https://api.fetch.tinyfish.ai`)**: Extracts raw text and markdown content from authoritative price guides.
- **Price Extractor Regex Engine**: Custom algorithms in `src/lib/price-intelligence/price-extractor.ts` that parse extracted web text into structured low/median/high cost data.
- **SSRF Defense Guardrails**: Strict security middleware in `src/lib/price-intelligence/security.ts` blocking private, internal, and local network addresses.
- **PII Scrubbing Filter**: Cleanses queries and page contents to protect user privacy.
- **In-Memory 24h TTL Cache**: Key-value memory cache in `src/lib/price-intelligence/cache.ts` preventing repeated external calls.
- **Simulated Mock Intelligence Fallback**: Toggleable via `NEXT_PUBLIC_ENABLE_MOCK_INTELLIGENCE=true` for 100% offline development.

#### 6. Application State & Storage Tools
- **React Context API**: Powers the centralized authentication (`AuthContext`) and toast notifications (`ToastContext`).
- **useSyncExternalStore Engine (`src/lib/demo-storage.ts`)**: Cross-portal real-time synchronization so that customer bookings immediately appear in professional and admin dashboards.
- **LocalStorage**: Browser persistence layer allowing seamless testing without requiring an external database setup during Phase 1.

---

## ⚡ Core Features

- 🔍 **Smart Trade Search & Directory (`/professionals`)**: Natural language query detection (e.g. *"leaky sink"* &rarr; Plumbing; *"flickering light"* &rarr; Electrical), genuine ZIP coverage verification (e.g., `94107`), and strict guards against out-of-scope non-trade queries (e.g., babysitting, dog walking).
- 🧮 **AI Cost Estimator (`/services`)**: Transparent itemized breakdown containing diagnostic call-out fee, estimated labor hours, material costs, and local taxes.
- 🐟 **Live Market Price Intelligence**: Real-time web price comparison using [TinyFish Free Tier APIs](TINYFISH.md), showing independent market averages alongside SkillConnect quotes.
- 👥 **Multi-Portal Synchronized State**: Dedicated, reactive dashboards for:
  - **Homeowners** (`/customer/dashboard`): Active bookings, payment holds, and pro ratings.
  - **Service Professionals** (`/worker/dashboard`): Job requests, accept/decline actions, and earnings.
  - **Administrators** (`/admin`): Dispute moderation, trade verification, and escrow metrics.
- 🔒 **Escrow & Pre-Authorization Protection**: Diagnostic fee pre-authorization holds with zero upfront charges for unconfirmed jobs and guaranteed customer refunds upon cancellation or decline.
- 📅 **Dynamic Date Scheduling**: Real-time schedule calculations eliminating hardcoded date assumptions.

---

## 🚀 Quickstart

### Prerequisites

Ensure your system meets the following requirements:
- **Node.js**: `>= 18.17.0` (Node.js 20 LTS or later recommended)
- **npm**: `>= 9.0.0`
- **Modern Browser**: Chrome, Safari, Edge, or Firefox

### Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/skillconnect.git
cd skillconnect-phase1-md

# 2. Install all dependencies using npm
npm install

# 3. Configure local environment variables
cp .env.example .env.local

# 4. Run the local development server
npm run dev
```

Open [`http://localhost:3000`](http://localhost:3000) in your browser.

> [!TIP]
> **TinyFish API Configuration**: To enable live web price intelligence, set your free `TINYFISH_API_KEY` in `.env.local`. If left blank, the application automatically uses high-fidelity simulated intelligence so all features remain 100% functional offline!

---

## 📜 Available Scripts

Run the following commands in your terminal:

| NPM Command | Tool Behind It | Purpose & Action |
| :--- | :--- | :--- |
| `npm run dev` | **Next.js CLI** | Boots the local development server with Fast Refresh at `http://localhost:3000` |
| `npm run build` | **Next.js / TypeScript** | Compiles TypeScript and creates an optimized production bundle |
| `npm start` | **Next.js Production** | Starts the production-ready server |
| `npm test` | **tsx / Node Test Runner** | Executes the automated test suite across all application modules |
| `npm run typecheck` | **TypeScript Compiler (`tsc`)** | Performs strict static type validation with `tsc --noEmit` |
| `npm run lint` | **ESLint 9** | Analyzes codebase for syntax, React hooks, and Next.js linting errors |

---

## 📁 Project Structure

```text
skillconnect/
├── src/
│   ├── app/                                # Next.js 16 App Router pages & API routes
│   │   ├── admin/                          # Administrator dashboard & verification
│   │   ├── api/price-intelligence/         # TinyFish Search & Fetch API endpoints
│   │   │   ├── compare/route.ts            # Price comparison endpoint
│   │   │   ├── fetch/route.ts              # Content extraction proxy
│   │   │   └── search/route.ts             # Web search query proxy
│   │   ├── booking/                        # Multi-step service booking wizard
│   │   ├── checkout/                       # Escrow payment & authorization hold
│   │   ├── customer/dashboard/             # Homeowner dashboard & job tracking
│   │   ├── how-it-works/                   # Platform process & escrow guide
│   │   ├── login/ & register/              # Authentication & role-switch demo
│   │   ├── payments/                       # Escrow transaction ledger
│   │   ├── professionals/                  # Trade directory & professional profiles
│   │   ├── services/                       # Service catalog & AI cost estimator
│   │   ├── trust/                          # Guarantee & verification policies
│   │   ├── worker/dashboard/               # Professional dispatch & job requests
│   │   ├── globals.css                     # Tailwind CSS v4 styling sheet
│   │   └── layout.tsx                      # Root layout, navigation & context providers
│   ├── components/                         # Reusable UI component library
│   │   ├── booking/                        # Booking modal & confirmation dialogs
│   │   ├── dashboard/                      # Stat cards, request lists, job cards
│   │   ├── forms/                          # Accessible input fields, switches, selects
│   │   ├── home/                           # Landing page hero, categories, trust pillars
│   │   ├── layout/                         # Site header, footer, container, mobile nav
│   │   ├── pricing/                        # AI estimator & TinyFish price intelligence UI
│   │   ├── professionals/                  # Professional card, filters, compare modal
│   │   └── ui/                             # Buttons, badges, price labels, rating stars
│   ├── context/                            # React Context providers (AuthContext, ToastContext)
│   ├── data/                               # Initial datasets (professionals, bookings, services)
│   ├── lib/                                # Core domain logic & algorithms
│   │   ├── ai-estimator.ts                 # Diagnostic & repair estimation engine
│   │   ├── dates.ts                        # Dynamic date & scheduling utilities
│   │   ├── demo-storage.ts                 # useSyncExternalStore cross-portal state sync
│   │   ├── formatters.ts                   # Currency, date, and phone number formatters
│   │   ├── metrics.ts                      # Platform KPIs & escrow ledger calculations
│   │   ├── motion-variants.ts              # Framer Motion spring & easing animation tokens
│   │   ├── price-intelligence/             # TinyFish client, SSRF guard, cache & parser
│   │   ├── pricing.ts                      # Transparent fee calculations (labor, parts, tax)
│   │   └── search.ts                       # Natural language synonym parser & ZIP matcher
│   └── types/                              # Shared TypeScript type definitions & interfaces
├── docs/                                   # Full architectural & product specifications (45+ docs)
│   ├── architecture/                       # System architecture, data model, APIs, integrations
│   ├── design/                             # UI design system, responsiveness, accessibility
│   ├── operations/                         # CI/CD, testing strategy, disaster recovery
│   ├── policies/                           # Escrow terms, cancellation, privacy, safety
│   ├── product/                            # Vision, requirements, roadmap, user journeys
│   └── project/                            # Implementation plan, changelog, decision records
├── feedback/                               # Visual before/after verification evidence
├── eslint.config.mjs                       # ESLint 9 flat configuration
├── next.config.ts                          # Next.js 16 runtime and remote image configuration
├── postcss.config.mjs                      # PostCSS pipeline for Tailwind CSS v4
├── tsconfig.json                           # Strict TypeScript compiler options
└── package.json                            # Dependencies, metadata, and scripts
```

---

## 🔒 Security & Safe Execution Guardrails

SkillConnect implements enterprise-grade security practices across all layers:
1. **SSRF Defense (`src/lib/price-intelligence/security.ts`)**: Prevents Server-Side Request Forgery by disallowing private IP subnets (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16), IPv6 loopback (`::1`), AWS metadata services (`169.254.169.254`), and requiring HTTPS protocols.
2. **PII Sanitization**: Scrubs phone numbers, email addresses, and potential authentication tokens before forwarding search queries.
3. **Zero Secrets in Client Code**: All external API credentials (`TINYFISH_API_KEY`) remain strictly on the server-side Next.js route handlers. No `NEXT_PUBLIC_` prefixes are used for private keys.
4. **Escrow Guarantee**: Customer cards are never billed for full repair amounts upfront; only diagnostic fees are pre-authorized, with funds held in escrow until mutual homeowner and technician sign-off.

---

## 📚 Documentation & Reference

For comprehensive technical, product, and architectural specifications, consult our documentation suite:

- 📖 [Master Documentation Index](DOCUMENTATION-INDEX.md) — Unified directory covering all 45+ formal specifications.
- 🐟 [TinyFish API Integration Guide](TINYFISH.md) — Complete guide on real-time price intelligence, SSRF guards, and caching.
- 📋 [Feedback & Improvements Report](feedback/improvements.md) — Technical report detailing problem investigations, root causes, and solutions.
- 🎨 [UI Design System Specification](docs/design/UI-DESIGN-SYSTEM.md) — Complete color tokens, typography scales, and motion curves.
- 🏗️ [System Architecture Specification](docs/architecture/SYSTEM-ARCHITECTURE.md) — Subsystem boundaries, data flows, and edge split.
- 💳 [Payments, Escrow & Commissions](docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md) — Financial escrow flows, refund policies, and payout schedules.

---

<p align="center">
  <strong>SkillConnect</strong> • Built with Next.js 16, React 19, TypeScript, Tailwind CSS v4 & TinyFish Intelligence
</p>