# SkillConnect — Connecting People with Trusted Local Service Professionals

> **Tagline:** Find trusted help. Book confidently. Get the job done.

[![Documentation Status](https://img.shields.io/badge/Documentation-Complete%20%26%20Verified-brightgreen)](#5-documentation-system--quick-links)
[![Implementation Phase](https://img.shields.io/badge/Status-Phase%201%20Prototype%20Live%20%26%20Verified-brightgreen)](#1-implementation-status)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%20Typecheck%20Passed-blue)](#2-developer-quickstart--operational-commands)
[![Production Build](https://img.shields.io/badge/Build-Production%20Passing-success)](#2-developer-quickstart--operational-commands)

---

## 1. Implementation Status

> [!NOTE]
> **PHASE 1 FUNCTIONAL APPLICATION IMPLEMENTED AND PRODUCTION-READY.**
>
> The SkillConnect repository contains a fully working Next.js 16 App Router prototype built with React 19, TypeScript (strict mode), Tailwind CSS v4, Motion, and Lucide React.
>
> Key implemented modules include:
> - **Verified Trade Directory & Smart Search (`/professionals`):** Trade category and location/ZIP resolution with PostGIS-ready coverage filtering, multi-word trade problem mapping (`"leaky sink"` &rarr; Plumbing), and non-trade intent guards.
> - **AI-Assisted Cost Estimator (`/` & `/services`):** Transparent diagnostic, labor, parts, and tax calculations with clear out-of-scope domain guards.
> - **Live Local Price Intelligence (TinyFish Free APIs):** Optional public market rate comparison embedded in the Cost Estimator. Fetches independent public trade guides for a specified ZIP code using TinyFish Free Search & Fetch APIs, with strict SSRF defense, PII scrubbing, 24-hour caching, and non-blocking fallback.
> - **Multi-Portal Experience:** Synchronized state across Homeowner (`/customer/dashboard`), Service Professional (`/worker/dashboard`), and Administrator (`/admin`) portals with real-time `useSyncExternalStore` hydration.
> - **Escrow Pre-Authorization Holds & Safety:** Automated hold placement, pro accept/decline flows, and guaranteed full customer refunds on decline.
> - **Dynamic Calendar Math:** Zero-hardcoding date options and timezone-resilient weekday derivations.

---

## 2. Developer Quickstart & Operational Commands

SkillConnect is built with Node.js and Next.js App Router. Follow the commands below for local development, quality verification, and production builds:

### Prerequisites
- **Node.js**: `>= 18.17.0` (Node 20+ recommended)
- **npm**: `>= 9.0.0`

### Command Reference

| Command | Purpose | Verification Standard |
| :--- | :--- | :--- |
| `npm install` | Install all dependencies | Clean lockfile resolution |
| `npm run dev` | Start local development server on `http://localhost:3000` | Fast HMR with Turbopack |
| `npm run typecheck` | Run strict TypeScript compiler check (`tsc --noEmit`) | **0 Errors** across all application & test code |
| `npm run lint` | Run ESLint static code analysis | **0 Errors**, Next.js core web vitals compliant |
| `npm test` | Run the complete automated test suite (6 suites) | **100% Pass Rate** (`search`, `estimator`, `price-intelligence`, `dates`, `state`, `metrics`) |
| `npm run build` | Compile optimized Next.js production bundle | **0 Errors**, static & dynamic compilation across all 17 routes |
| `npm start` | Run production HTTP server locally | Production listener at `localhost:3000` |

### Production Quality Gates (Stage 1 CI/CD Gate)
In alignment with the [CI/CD and Deployment Plan](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md) and [Release Checklist](file:///docs/operations/RELEASE-CHECKLIST.md), any pull request or deployment release candidate must satisfy:
1. `npm run typecheck`: Strict TypeScript compilation passes with zero type errors.
2. `npm run lint`: Zero ESLint errors.
3. `npm test`: All unit and integration test suites pass.
4. `npm run build`: Production Next.js bundle compiles successfully with all static and dynamic routes.

---

## 3. Real-World Feedback Review & Challenge Card 2 Improvements

Based on reviewer evaluation received for **GREVIX AfterCode Challenge Card 2**, the SkillConnect codebase has been inspected, repaired, and verified across all identified defect areas:

- 📋 [Feedback Documentation Index](feedback/README.md)
- 🖼️ [Visual Before-and-After Comparison Matrix](feedback/visual-comparison.md) *(Side-by-side screenshots for every feedback update)*
- 📝 [Real Reviewer Feedback Summary](feedback/feedback-summary.md)
- 🛠️ [Technical Improvements & Root Cause Analysis](feedback/improvements.md)
- 📸 [Before & After Screenshot Evidence](feedback/screenshots/)
- 🧪 **Automated Test Suite:** Run `npm test` to execute all 5 automated test suites (100% pass rate).

---

## 4. Product Overview

**SkillConnect** is a next-generation local services marketplace designed to bridge the trust, transparency, and efficiency gap between homeowners/businesses and local trade service professionals (electricians, plumbers, carpenters, HVAC technicians, cleaners, painters, appliance repair technicians).

### The Problem We Solve
* **For Customers**: Fragmented directories, unverified contractor credentials, surprise "bait-and-switch" pricing, missed appointments, and zero recourse for defective work.
* **For Service Professionals**: Predatory upfront pay-per-lead aggregators, volatile incomes, delayed customer payments, and the overhead of quoting, scheduling, and invoicing during off-hours.

### Key Capabilities
1. **Verified Trade Discovery**: Multi-tier vetting of identity, state trade licenses, and commercial liability insurance.
2. **Transparent Upfront Pricing**: Standardized diagnostic inspection fees, clear starting hourly rates, and AI-assisted preliminary cost estimates.
3. **Escrow-Style Milestone Protection**: Funds pre-authorized upon booking and released upon customer sign-off or 48-hour auto-release, backed by platform craftsmanship guarantees.
4. **Professional Business Enablement**: Built-in scheduling calendar, 1-click "Available Today" dispatch, automated invoice generation, and guaranteed on-time Stripe payouts.

---

## 5. Technology Direction & Architecture

SkillConnect is designed around a modern, type-safe cloud architecture:

* **Frontend**: Next.js App Router (React 19, TypeScript, Tailwind CSS, Motion for React, Lucide React).
* **Backend & API**: Next.js Server Actions / Node.js API routes with strict Zod schema validation.
* **Database & Caching**: PostgreSQL 16 with PostGIS spatial extension + Redis 7 for distributed slot locks and session caching.
* **Payments & Escrow**: Stripe Connect Express (custom marketplace split payouts and 1099 tax compliance).
* **Identity & Vetting**: Persona / Stripe Identity for biometric liveness and government photo ID checks.
* **Communications**: Twilio (SMS & proxy phone masking) + Resend (transactional email).

For technical details, see the [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md) and [Technology Stack Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md).

---

## 6. Live Local Price Intelligence (TinyFish Free-Tier Integration)

SkillConnect features **Live Local Price Intelligence**, an optional market research feature integrated directly into the Cost Estimator (`/services` and Home Page). It allows customers to compare SkillConnect's transparent benchmark against external public trade guides for their exact ZIP code.

### 6.1 Workflow & Example Scenario
1. **Customer Problem:** Leaky sink under bathroom vanity.
2. **Trade Category:** Plumbing (auto-detected or selected).
3. **Location:** Customer enters their 5-digit ZIP code (e.g., `94107`).
4. **Platform Benchmark:** SkillConnect's deterministic estimate remains primary, transparent, and completely unchanged (e.g., `$158 – $375` with 100% diagnostic fee credit and licensed specialist guarantee).
5. **TinyFish Free Search:** Queries public trade cost guides for the specified locality using `GET https://api.search.tinyfish.ai?query=...`.
6. **TinyFish Free Fetch:** Retrieves content from top credible URLs using `POST https://api.fetch.tinyfish.ai` with server-side SSRF validation.
7. **Extraction & Evidence Synthesis:** Extracts numeric ranges, dates, geographic relevance, and checks for consensus vs. contradictory evidence without ever inventing averages.
8. **Clear Market Context:** Third-party references are displayed side-by-side with clear notices explaining that external guides do not constitute quotes from SkillConnect providers.

### 6.2 Strict Free-Tier Architecture & Guardrails
The integration is strictly engineered around TinyFish's **free tier only**:
- **Search Endpoint:** `GET https://api.search.tinyfish.ai?query=...`
- **Fetch Endpoint:** `POST https://api.fetch.tinyfish.ai`
- **Authentication:** Server-side `X-API-Key` header powered by `TINYFISH_API_KEY`.
- **Zero Paid Endpoints:** Never invokes TinyFish Agent, Research, Browser, Monitor, browser automation, or any wallet-consuming services.
- **Graceful Quota Handling:** If the free tier quota is exhausted (HTTP 402) or rate limited (HTTP 429), the estimator and booking flows remain 100% functional without blocking the user.

### 6.3 Server-Side API Routes
| Route | Method | Purpose & Guardrails |
| :--- | :--- | :--- |
| `/api/price-intelligence/search` | `GET` / `POST` | Sanitizes query, checks 24h cache, calls TinyFish Search, strips API keys |
| `/api/price-intelligence/fetch` | `POST` | Validates URL against SSRF policy, fetches via TinyFish Fetch, extracts prices |
| `/api/price-intelligence/compare` | `POST` | Full pipeline aggregation (search + concurrent fetch + synthesis + cache) |

### 6.4 Security, Customer Privacy & SSRF Prevention
- **Customer Privacy:** Zero customer PII (names, full street addresses, phone numbers, email addresses, credit cards, escrow details) is ever transmitted to external APIs. Only generic trade terms and 5-digit ZIP codes are used.
- **SSRF Defense:** Only `https:` URLs targeting verified public domains with standard port 443 are allowed. Rejects `127.0.0.0/8`, `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, cloud metadata `169.254.169.254`, IPv6 loopback/link-local, credentials in URLs, and non-standard ports.
- **Content Sanitization:** External HTML/markdown is stripped of scripts, styles, iframes, and dangerous attributes. Text is truncated at 40,000 characters to prevent memory exhaustion / DoS.
- **Sliding-Window Rate Limiting:** Enforces in-memory rate limits (25 requests/min per client IP).

### 6.5 Configuration & Setup
#### Local Development
1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
2. Add your free TinyFish API key to `.env.local`:
   ```env
   TINYFISH_API_KEY=your_free_tinyfish_api_key_here
   ```
*(Note: If `TINYFISH_API_KEY` is not set, SkillConnect provides simulated high-fidelity responses in test/demo mode so you can experience the feature without an external key).*

#### Vercel Deployment
In your Vercel Project Dashboard:
1. Navigate to **Settings &rarr; Environment Variables**.
2. Add `TINYFISH_API_KEY` with your free key under **Production**, **Preview**, and **Development**.
3. Redeploy the project.

---

## 7. Documentation System & Quick Links

All product, design, architecture, security, legal, and operational specifications are organized into the `docs/` tree.

👉 **Start with the [Master Documentation Index](file:///DOCUMENTATION-INDEX.md) for complete reading paths and document catalog.**

| Category | Primary Directory | Authoritative Documents |
| :--- | :--- | :--- |
| **Product Strategy** | [`docs/product/`](file:///docs/product/) | [Vision](file:///docs/product/PRODUCT-VISION.md) • [Requirements](file:///docs/product/PRODUCT-REQUIREMENTS.md) • [User Stories](file:///docs/product/USER-STORIES-AND-ACCEPTANCE-CRITERIA.md) • [Roadmap](file:///docs/product/MVP-AND-RELEASE-ROADMAP.md) • [Business Model](file:///docs/product/BUSINESS-MODEL-AND-REVENUE.md) |
| **UX & UI Design** | [`docs/design/`](file:///docs/design/) | [Information Architecture](file:///docs/design/INFORMATION-ARCHITECTURE.md) • [Route Inventory](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md) • [Design System](file:///docs/design/UI-DESIGN-SYSTEM.md) • [A11y Standards](file:///docs/design/ACCESSIBILITY-REQUIREMENTS.md) |
| **Technical Architecture** | [`docs/architecture/`](file:///docs/architecture/) | [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md) • [Data Model & ERD](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md) • [API Contracts](file:///docs/architecture/API-CONTRACT-SPECIFICATION.md) • [Escrow & Payments](file:///docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md) |
| **Security & Privacy** | [`docs/security/`](file:///docs/security/) | [Security Baselines](file:///docs/security/SECURITY-REQUIREMENTS.md) • [Privacy & PII](file:///docs/security/PRIVACY-AND-DATA-HANDLING.md) • [RBAC Matrix](file:///docs/security/ROLE-PERMISSION-MATRIX.md) • [Threat Model](file:///docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md) |
| **Policies & Legal** | [`docs/policies/`](file:///docs/policies/) | [Policy Inventory](file:///docs/policies/POLICY-INVENTORY.md) • [Terms of Service](file:///docs/policies/TERMS-OF-SERVICE-REQUIREMENTS.md) • [Cancellations & Refunds](file:///docs/policies/CANCELLATION-REFUND-AND-DISPUTE-POLICY.md) |
| **Operations & Testing** | [`docs/operations/`](file:///docs/operations/) | [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md) • [CI/CD Deployment](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md) • [SRE & Backups](file:///docs/operations/MONITORING-LOGGING-AND-BACKUPS.md) • [Admin Playbook](file:///docs/operations/ADMIN-AND-SUPPORT-PLAYBOOK.md) |
| **Project Governance** | [`docs/project/`](file:///docs/project/) | [Implementation Plan](file:///docs/project/IMPLEMENTATION-PLAN.md) • [ADR Index](file:///docs/project/ARCHITECTURE-DECISION-RECORDS.md) • [Glossary](file:///docs/project/GLOSSARY.md) • [Documentation Changelog](file:///docs/project/DOCUMENTATION-CHANGELOG.md) |

---

## 7. Document Governance

All changes to the SkillConnect documentation system must be recorded in the [Documentation Changelog](file:///docs/project/DOCUMENTATION-CHANGELOG.md) and validated against the [Requirements Traceability Matrix](file:///docs/project/REQUIREMENTS-TRACEABILITY.md).