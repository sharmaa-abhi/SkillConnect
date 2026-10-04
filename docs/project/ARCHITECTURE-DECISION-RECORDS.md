# Architecture Decision Records (ADRs) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROJ-004` |
| **Status** | Approved |
| **Owner** | Chief Systems Architect |
| **Target Audience** | All Architects, Engineers, Technical Leads |
| **Last Updated** | October 2026 |

---

## 1. ADR Index

* **`ADR-001`**: Next.js App Router for Unified Web Frontend and Edge SSR
* **`ADR-002`**: PostgreSQL + PostGIS for Relational Transactions and Spatial Radius Queries
* **`ADR-003`**: Tailwind CSS and Motion for React (`motion/react`) for UI & Transitions
* **`ADR-004`**: Stripe Connect Express for Escrow Payments and Regulatory Tax Handling
* **`ADR-005`**: Shared Marketplace Liquidity Pool with Logical RLS for B2B Housing Societies
* **`ADR-006`**: Guarded Client-Side Demo Storage for Phase 1 Prototype

---

## 2. Decision Records

### ADR-001: Next.js App Router for Unified Web Platform
* **Context**: Local service marketplaces depend heavily on organic search engine optimization (SEO) for geo-targeted queries (e.g., "plumber near me 94107"). Traditional single-page apps (SPAs) suffer search indexing penalties and slower FCP.
* **Decision**: Adopt Next.js App Router with React 19, TypeScript, and Server Components as the universal web platform.
* **Consequences**: Enables lightning-fast pre-rendered search landing pages, compact client bundles, and seamless transition to Server Actions in Phase 2.

### ADR-002: PostgreSQL with PostGIS Extension
* **Context**: The marketplace requires multi-table ACID consistency for booking state transitions, escrow authorizations, and spatial radial queries.
* **Decision**: Deploy managed PostgreSQL 16 with the PostGIS spatial extension.
* **Consequences**: Spatial bounding box queries (`ST_DWithin`) execute in microseconds; avoids the need for external search cluster infrastructure (e.g., Elasticsearch) in early phases.

### ADR-003: Tailwind CSS & Motion for React (`motion/react`)
* **Context**: SkillConnect requires an approachable, bespoke brand aesthetic that avoids generic SaaS admin template styling while maintaining strict accessibility and reduced-motion support.
* **Decision**: Utilize Tailwind CSS for design tokens and utilities, paired with the modern `motion` package (`import from 'motion/react'`).
* **Consequences**: Zero CSS runtime overhead; spring-physics transitions for booking wizards; zero-effort `useReducedMotion` compliance.

### ADR-004: Stripe Connect Express for Escrow Payouts
* **Context**: Managing multi-sided transactions, holding funds until customer sign-off, and disbursing split payouts triggers complex escrow and 1099 tax filing regulations.
* **Decision**: Integrate Stripe Connect Express with two-step manual capture authorization.
* **Consequences**: Offloads PCI compliance, automated identity/KYC checks, and IRS tax reporting to Stripe; platform never handles unmasked credit cards.

### ADR-005: Shared Marketplace Liquidity with Logical RLS
* **Context**: Evaluating whether multi-tenant isolated database schemas are required for B2B housing societies and commercial property partners.
* **Decision**: Maintain a unified shared database for the entire marketplace; implement logical tenancy for B2B partners via `organization_id` foreign keys and PostgreSQL Row-Level Security (RLS).
* **Consequences**: Preserves universal technician search and shared liquidity pool; avoids 10x database infrastructure inflation; provides bulletproof tenant data isolation.

### ADR-006: Guarded Client-Side Demo Storage for Phase 1
* **Context**: The Phase 1 prototype requires realistic user journeys (saving favorites, viewing recently booked appointments in the customer dashboard) without a live backend database.
* **Decision**: Use guarded browser `localStorage` hydration behind client-only effects for non-sensitive preferences (`skillconnect_favorites`, `skillconnect_demo_bookings`). Never store passwords or credentials.
* **Consequences**: Eliminates React hydration mismatch warnings; demonstrates full two-sided workflow without server dependencies.

---

## 3. Related Documentation
* [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
* [Technology Stack and Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md)
* [SaaS Organization and Tenancy Decisions](file:///docs/architecture/SAAS-ORGANIZATION-AND-TENANCY-DECISIONS.md)
