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
> - **AI-Assisted Cost Estimator (`/` & `/pricing`):** Transparent diagnostic, labor, parts, and tax calculations with clear out-of-scope domain guards.
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
| `npm test` | Run the complete automated test suite (5 suites) | **100% Pass Rate** (`search`, `estimator`, `dates`, `state`, `metrics`) |
| `npm run build` | Compile optimized Next.js production bundle | **0 Errors**, static prerendering across all 14 routes |
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

## 6. Documentation System & Quick Links

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