# SkillConnect — Connecting People with Trusted Local Service Professionals

> **Tagline:** Find trusted help. Book confidently. Get the job done.

[![Documentation Status](https://img.shields.io/badge/Documentation-Complete%20%26%20Verified-brightgreen)](#documentation-system)
[![Implementation Phase](https://img.shields.io/badge/Status-Documentation%20Baseline%20Only-orange)](#important-implementation-notice)

---

## 1. Important Implementation Notice

> [!IMPORTANT]
> **THIS REPOSITORY CURRENTLY CONTAINS THE COMPREHENSIVE ARCHITECTURAL AND SPECIFICATION DOCUMENTATION ONLY.**
>
> The presence of detailed schemas, user stories, API contracts, and design systems **does not imply that the software product is implemented**. Actual application development will commence in strict accordance with the approved [Master Implementation Plan](file:///docs/project/IMPLEMENTATION-PLAN.md).

---

## 2. Product Overview

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

## 3. Technology Direction & Architecture

SkillConnect is designed around a modern, type-safe cloud architecture:

* **Frontend**: Next.js App Router (React 19, TypeScript, Tailwind CSS, Motion for React, Lucide React).
* **Backend & API**: Next.js Server Actions / Node.js API routes with strict Zod schema validation.
* **Database & Caching**: PostgreSQL 16 with PostGIS spatial extension + Redis 7 for distributed slot locks and session caching.
* **Payments & Escrow**: Stripe Connect Express (custom marketplace split payouts and 1099 tax compliance).
* **Identity & Vetting**: Persona / Stripe Identity for biometric liveness and government photo ID checks.
* **Communications**: Twilio (SMS & proxy phone masking) + Resend (transactional email).

For technical details, see the [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md) and [Technology Stack Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md).

---

## 4. Documentation System & Quick Links

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

## 5. Document Governance

All changes to the SkillConnect documentation system must be recorded in the [Documentation Changelog](file:///docs/project/DOCUMENTATION-CHANGELOG.md) and validated against the [Requirements Traceability Matrix](file:///docs/project/REQUIREMENTS-TRACEABILITY.md).