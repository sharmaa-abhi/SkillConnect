# Master Documentation Index — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-INDEX-001` |
| **Status** | Approved (Authoritative Gateway) |
| **Owner** | Lead Technical Writer & Governance Architect |
| **Target Audience** | All Engineering Teams, Product Managers, Stakeholders, AI Agents |
| **Last Updated** | October 2026 |

---

## 1. Executive Summary & Purpose

This document serves as the master navigation gateway and index for the **SkillConnect SaaS Documentation System**. It indexes every authoritative specification document, defining its purpose, target audience, lifecycle status, cross-dependencies, and optimal reading sequence.

> [!NOTE]
> **Status Conventions**:
> * **Approved**: Authoritative baseline; implementation-ready.
> * **Reviewed**: Evaluated by domain lead; pending minor stakeholder review.
> * **Proposed**: Forward-looking architecture proposal (e.g., Phase 6 AI Scoping).
> * **Draft**: Preliminary specification pending formal legal or compliance sign-off.

---

## 2. Recommended Reading Paths

### Path 1: Executive & Product Leadership
1. [`docs/product/PRODUCT-VISION.md`](file:///docs/product/PRODUCT-VISION.md)
2. [`docs/product/BUSINESS-MODEL-AND-REVENUE.md`](file:///docs/product/BUSINESS-MODEL-AND-REVENUE.md)
3. [`docs/product/MVP-AND-RELEASE-ROADMAP.md`](file:///docs/product/MVP-AND-RELEASE-ROADMAP.md)
4. [`docs/product/PRODUCT-METRICS-AND-KPIS.md`](file:///docs/product/PRODUCT-METRICS-AND-KPIS.md)
5. [`docs/project/RISKS-ASSUMPTIONS-AND-OPEN-QUESTIONS.md`](file:///docs/project/RISKS-ASSUMPTIONS-AND-OPEN-QUESTIONS.md)

### Path 2: UI/UX & Frontend Engineers (Phase 1 Prototype Builders)
1. [`docs/design/INFORMATION-ARCHITECTURE.md`](file:///docs/design/INFORMATION-ARCHITECTURE.md)
2. [`docs/design/ROUTE-AND-PAGE-INVENTORY.md`](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md)
3. [`docs/design/UI-DESIGN-SYSTEM.md`](file:///docs/design/UI-DESIGN-SYSTEM.md)
4. [`docs/design/FRONTEND-REQUIREMENTS.md`](file:///docs/design/FRONTEND-REQUIREMENTS.md)
5. [`docs/design/RESPONSIVE-DESIGN.md`](file:///docs/design/RESPONSIVE-DESIGN.md)
6. [`docs/design/ANIMATION-AND-MOTION-GUIDELINES.md`](file:///docs/design/ANIMATION-AND-MOTION-GUIDELINES.md)
7. [`docs/design/ACCESSIBILITY-REQUIREMENTS.md`](file:///docs/design/ACCESSIBILITY-REQUIREMENTS.md)
8. [`docs/design/CONTENT-AND-UI-COPY-GUIDELINES.md`](file:///docs/design/CONTENT-AND-UI-COPY-GUIDELINES.md)

### Path 3: Backend, Database & Cloud Architects (Phase 2+ Builders)
1. [`docs/architecture/SYSTEM-ARCHITECTURE.md`](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
2. [`docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md`](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md)
3. [`docs/architecture/REPOSITORY-AND-MODULE-STRUCTURE.md`](file:///docs/architecture/REPOSITORY-AND-MODULE-STRUCTURE.md)
4. [`docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md`](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md)
5. [`docs/architecture/API-CONTRACT-SPECIFICATION.md`](file:///docs/architecture/API-CONTRACT-SPECIFICATION.md)
6. [`docs/architecture/AUTHENTICATION-AND-AUTHORIZATION.md`](file:///docs/architecture/AUTHENTICATION-AND-AUTHORIZATION.md)
7. [`docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md`](file:///docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md)
8. [`docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md`](file:///docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md)

### Path 4: Security, Legal & Operations Reviewers
1. [`docs/security/SECURITY-REQUIREMENTS.md`](file:///docs/security/SECURITY-REQUIREMENTS.md)
2. [`docs/security/PRIVACY-AND-DATA-HANDLING.md`](file:///docs/security/PRIVACY-AND-DATA-HANDLING.md)
3. [`docs/security/ROLE-PERMISSION-MATRIX.md`](file:///docs/security/ROLE-PERMISSION-MATRIX.md)
4. [`docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md`](file:///docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md)
5. [`docs/policies/POLICY-INVENTORY.md`](file:///docs/policies/POLICY-INVENTORY.md)
6. [`docs/operations/ADMIN-AND-SUPPORT-PLAYBOOK.md`](file:///docs/operations/ADMIN-AND-SUPPORT-PLAYBOOK.md)

---

## 3. Master Document Directory

### A. Product Strategy and Requirements (`docs/product/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`PRODUCT-VISION.md`](file:///docs/product/PRODUCT-VISION.md) | High-level vision, market pain points, and strategic differentiators | All Stakeholders | Approved |
| [`PRODUCT-REQUIREMENTS.md`](file:///docs/product/PRODUCT-REQUIREMENTS.md) | Exhaustive FR and NFR specifications with requirement IDs | Engineers, QA | Reviewed |
| [`PROJECT-SCOPE-AND-NON-GOALS.md`](file:///docs/product/PROJECT-SCOPE-AND-NON-GOALS.md) | Scope boundaries, phased deliveries, and explicit non-goals | All Stakeholders | Approved |
| [`USER-PERSONAS-AND-ROLES.md`](file:///docs/product/USER-PERSONAS-AND-ROLES.md) | Archetypes, responsibilities, permissions, and restrictions | Designers, PMs | Approved |
| [`USER-STORIES-AND-ACCEPTANCE-CRITERIA.md`](file:///docs/product/USER-STORIES-AND-ACCEPTANCE-CRITERIA.md) | Gherkin-formatted user stories across customer, pro, admin | QA, Developers | Approved |
| [`USER-JOURNEYS.md`](file:///docs/product/USER-JOURNEYS.md) | Sequence and state diagrams for core and edge user paths | Designers, Devs | Approved |
| [`FEATURE-PRIORITY-MATRIX.md`](file:///docs/product/FEATURE-PRIORITY-MATRIX.md) | MoSCoW and RICE feature scoring and phase allocation | PMs, Leadership | Approved |
| [`MVP-AND-RELEASE-ROADMAP.md`](file:///docs/product/MVP-AND-RELEASE-ROADMAP.md) | Phase 0 to Phase 8 milestone plan with exit gates | PMs, DevOps | Approved |
| [`BUSINESS-MODEL-AND-REVENUE.md`](file:///docs/product/BUSINESS-MODEL-AND-REVENUE.md) | Marketplace commissions, subscriptions, and financial flows | Finance, Execs | Approved |
| [`PRODUCT-METRICS-AND-KPIS.md`](file:///docs/product/PRODUCT-METRICS-AND-KPIS.md) | Quantitative conversion metrics, liquidity KPIs, event taxonomy | Analytics, PMs | Approved |

### B. UX, UI, and Frontend Specifications (`docs/design/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`INFORMATION-ARCHITECTURE.md`](file:///docs/design/INFORMATION-ARCHITECTURE.md) | Sitemap, navigation taxonomy, and content hierarchy | Designers, Devs | Approved |
| [`ROUTE-AND-PAGE-INVENTORY.md`](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md) | Detailed specifications for all 9 required routes + 404 | Frontend Devs | Approved |
| [`UI-DESIGN-SYSTEM.md`](file:///docs/design/UI-DESIGN-SYSTEM.md) | Color tokens, typography scales, spacing, shadows, radii | Designers, Devs | Approved |
| [`FRONTEND-REQUIREMENTS.md`](file:///docs/design/FRONTEND-REQUIREMENTS.md) | Search filters, booking wizard, forms, validation, and states | Frontend Devs | Approved |
| [`RESPONSIVE-DESIGN.md`](file:///docs/design/RESPONSIVE-DESIGN.md) | Breakpoint rules (mobile-first), drawer shifts, layout rules | Frontend Devs | Approved |
| [`ANIMATION-AND-MOTION-GUIDELINES.md`](file:///docs/design/ANIMATION-AND-MOTION-GUIDELINES.md) | Motion for React guidelines, timing, spring variants, a11y | Frontend Devs | Approved |
| [`ACCESSIBILITY-REQUIREMENTS.md`](file:///docs/design/ACCESSIBILITY-REQUIREMENTS.md) | WCAG 2.1 AA rules, contrast ratios, keyboard navigation, ARIA | QA, Frontend | Approved |
| [`CONTENT-AND-UI-COPY-GUIDELINES.md`](file:///docs/design/CONTENT-AND-UI-COPY-GUIDELINES.md) | Voice, tone, copy templates, and anti-deception guardrails | Writers, Devs | Approved |

### C. Technical Architecture (`docs/architecture/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`SYSTEM-ARCHITECTURE.md`](file:///docs/architecture/SYSTEM-ARCHITECTURE.md) | Subsystem boundaries, data flows, edge split, resilience | System Architects | Approved |
| [`TECHNOLOGY-STACK-AND-RATIONALE.md`](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md) | Technology choices, trade-offs, and rejected alternatives | Architects, Devs | Approved |
| [`REPOSITORY-AND-MODULE-STRUCTURE.md`](file:///docs/architecture/REPOSITORY-AND-MODULE-STRUCTURE.md) | Folder organization, `@/*` import alias, Server/Client rules | Developers | Approved |
| [`DATA-MODEL-AND-RELATIONSHIPS.md`](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md) | Relational ERD, SQL schema definitions, indexes, constraints | Database Admins | Approved |
| [`API-CONTRACT-SPECIFICATION.md`](file:///docs/architecture/API-CONTRACT-SPECIFICATION.md) | RESTful API endpoints, request/response JSON schemas | Developers, QA | Approved |
| [`AUTHENTICATION-AND-AUTHORIZATION.md`](file:///docs/architecture/AUTHENTICATION-AND-AUTHORIZATION.md) | Session tokens, password hashing, OAuth, RBAC middleware | Security, Devs | Approved |
| [`SAAS-ORGANIZATION-AND-TENANCY-DECISIONS.md`](file:///docs/architecture/SAAS-ORGANIZATION-AND-TENANCY-DECISIONS.md) | Tenancy decisions: shared liquidity pool + B2B logical RLS | Architects | Approved |
| [`BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md`](file:///docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md) | Booking FSM states, transition matrix, and slot locking | Backend Devs | Approved |
| [`SEARCH-LOCATION-AND-MATCHING.md`](file:///docs/architecture/SEARCH-LOCATION-AND-MATCHING.md) | PostGIS spatial queries, candidate filtering, ranking scores | Backend Devs | Approved |
| [`AI-PRICE-ESTIMATION-AND-RECOMMENDATIONS.md`](file:///docs/architecture/AI-PRICE-ESTIMATION-AND-RECOMMENDATIONS.md) | Multimodal vision scoping, confidence thresholds, disclaimers | AI Engineers | Proposed |
| [`NOTIFICATIONS-AND-MESSAGING.md`](file:///docs/architecture/NOTIFICATIONS-AND-MESSAGING.md) | SMS, email, in-app alerts, queue architecture, phone masking | Backend Devs | Approved |
| [`PAYMENTS-COMMISSIONS-AND-REFUNDS.md`](file:///docs/architecture/PAYMENTS-COMMISSIONS-AND-REFUNDS.md) | Stripe Connect, two-step escrow pre-auth, commission formulas | Fintech Devs | Approved |
| [`THIRD-PARTY-INTEGRATIONS.md`](file:///docs/architecture/THIRD-PARTY-INTEGRATIONS.md) | External services, credentials, rate limiting, mock strategy | DevOps, Devs | Approved |

### D. Security, Privacy, and Authorization (`docs/security/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`SECURITY-REQUIREMENTS.md`](file:///docs/security/SECURITY-REQUIREMENTS.md) | Cryptography, web security headers, rate limits, audit rules | Security Leads | Approved |
| [`PRIVACY-AND-DATA-HANDLING.md`](file:///docs/security/PRIVACY-AND-DATA-HANDLING.md) | PII classification, address masking, GDPR/CCPA rights | DPO, Compliance | Approved |
| [`ROLE-PERMISSION-MATRIX.md`](file:///docs/security/ROLE-PERMISSION-MATRIX.md) | Detailed RBAC permissions matrix across all resources | Developers, QA | Approved |
| [`THREAT-MODEL-AND-RISK-ASSESSMENT.md`](file:///docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md) | STRIDE threat modeling, marketplace abuse, mitigations | Security Leads | Approved |
| [`IDENTITY-AND-SKILL-VERIFICATION.md`](file:///docs/security/IDENTITY-AND-SKILL-VERIFICATION.md) | 4-tier technician verification pipeline, badges, disclaimers | Operations, Trust | Approved |
| [`SECURITY-INCIDENT-RESPONSE.md`](file:///docs/security/SECURITY-INCIDENT-RESPONSE.md) | Incident severity levels (Sev 1–4), 5-stage response SOP | On-Call, DevOps | Approved |

### E. Policies and Legal Readiness (`docs/policies/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`POLICY-INVENTORY.md`](file:///docs/policies/POLICY-INVENTORY.md) | Master policy inventory and legal review requirements | General Counsel | Approved |
| [`TERMS-OF-SERVICE-REQUIREMENTS.md`](file:///docs/policies/TERMS-OF-SERVICE-REQUIREMENTS.md) | Terms of service, intermediary liability, arbitration clauses | Legal Advisors | Draft |
| [`PRIVACY-POLICY-REQUIREMENTS.md`](file:///docs/policies/PRIVACY-POLICY-REQUIREMENTS.md) | Privacy disclosures, sub-processors, consumer data rights | Privacy Counsel | Draft |
| [`CANCELLATION-REFUND-AND-DISPUTE-POLICY.md`](file:///docs/policies/CANCELLATION-REFUND-AND-DISPUTE-POLICY.md) | Cancellation windows, late fees, 48h escrow dispute rules | Operations, Ops | Approved |
| [`CUSTOMER-AND-PROFESSIONAL-TERMS.md`](file:///docs/policies/CUSTOMER-AND-PROFESSIONAL-TERMS.md) | Independent contractor terms, professional code of conduct | Labor Counsel | Approved |
| [`SAFETY-AND-ACCEPTABLE-USE.md`](file:///docs/policies/SAFETY-AND-ACCEPTABLE-USE.md) | Anti-harassment, zero-tolerance policies, emergency escalation | Trust & Safety | Approved |
| [`COOKIES-AND-TRACKING-REQUIREMENTS.md`](file:///docs/policies/COOKIES-AND-TRACKING-REQUIREMENTS.md) | Cookie classifications, local demo storage, ePrivacy consent | Privacy Counsel | Approved |

### F. Operations, Testing, and Delivery Planning (`docs/operations/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`ENVIRONMENT-AND-CONFIGURATION-PLAN.md`](file:///docs/operations/ENVIRONMENT-AND-CONFIGURATION-PLAN.md) | Tiers, env var schemas (Markdown only), secret injection | DevOps | Approved |
| [`DEVELOPMENT-AND-CODE-QUALITY-STANDARDS.md`](file:///docs/operations/DEVELOPMENT-AND-CODE-QUALITY-STANDARDS.md) | TypeScript strictness, linting, git conventions, component rules | Developers | Approved |
| [`TESTING-STRATEGY.md`](file:///docs/operations/TESTING-STRATEGY.md) | Testing pyramid (Vitest, Playwright, axe-core), coverage targets | QA Engineers | Approved |
| [`CI-CD-AND-DEPLOYMENT-PLAN.md`](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md) | Automated pipeline stages, quality gates, instant rollback | DevOps | Approved |
| [`MONITORING-LOGGING-AND-BACKUPS.md`](file:///docs/operations/MONITORING-LOGGING-AND-BACKUPS.md) | SRE observability, JSON logging, PII redaction, backup RPO/RTO | SRE, DevOps | Approved |
| [`ADMIN-AND-SUPPORT-PLAYBOOK.md`](file:///docs/operations/ADMIN-AND-SUPPORT-PLAYBOOK.md) | Support tiers, dispute mediation SOP, refund authorities | Support Agents | Approved |
| [`RELEASE-CHECKLIST.md`](file:///docs/operations/RELEASE-CHECKLIST.md) | Pre-release gates, live smoke tests, post-deploy soak criteria | Release Leads | Approved |
| [`DISASTER-RECOVERY-AND-BUSINESS-CONTINUITY.md`](file:///docs/operations/DISASTER-RECOVERY-AND-BUSINESS-CONTINUITY.md) | RPO/RTO resilience, cross-region failover, crisis communications | SRE, Leadership | Approved |

### G. Project Management and Governance (`docs/project/`)
| Document File | Purpose Summary | Primary Audience | Status |
| :--- | :--- | :--- | :--- |
| [`IMPLEMENTATION-PLAN.md`](file:///docs/project/IMPLEMENTATION-PLAN.md) | Phased delivery schedule, tasks, deliverables, exit gates | PMs, Architects | Approved |
| [`DEPENDENCY-AND-DELIVERY-PLAN.md`](file:///docs/project/DEPENDENCY-AND-DELIVERY-PLAN.md) | Critical path analysis, milestone schedules, dependencies | Program Leads | Approved |
| [`RISKS-ASSUMPTIONS-AND-OPEN-QUESTIONS.md`](file:///docs/project/RISKS-ASSUMPTIONS-AND-OPEN-QUESTIONS.md) | Assumptions, risk register, and unresolved questions log | All Stakeholders | Approved |
| [`ARCHITECTURE-DECISION-RECORDS.md`](file:///docs/project/ARCHITECTURE-DECISION-RECORDS.md) | ADR index (`ADR-001` through `ADR-006`) with architectural rationale | Architects | Approved |
| [`GLOSSARY.md`](file:///docs/project/GLOSSARY.md) | Standard platform vocabulary and domain terminology | All Stakeholders | Approved |
| [`REQUIREMENTS-TRACEABILITY.md`](file:///docs/project/REQUIREMENTS-TRACEABILITY.md) | Bidirectional RTM mapping requirements to stories, pages, tests | QA, Architects | Approved |
| [`DOCUMENTATION-CHANGELOG.md`](file:///docs/project/DOCUMENTATION-CHANGELOG.md) | Version history, documentation additions, and updates | All Stakeholders | Active |
| [`DOCUMENTATION-AUDIT.md`](file:///docs/project/DOCUMENTATION-AUDIT.md) | Completion audit report, coverage metrics, and sign-offs | Executive Review | Approved |

---

## 4. Related Documentation
* [README](file:///README.md)
* [Documentation Audit](file:///docs/project/DOCUMENTATION-AUDIT.md)
* [Requirements Traceability Matrix](file:///docs/project/REQUIREMENTS-TRACEABILITY.md)

