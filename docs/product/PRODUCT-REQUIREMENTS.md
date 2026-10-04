# Product Requirements Specification (PRS) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROD-002` |
| **Status** | Reviewed (Implementation Ready) |
| **Owner** | Lead Product Architect |
| **Target Audience** | Engineering Leads, QA Teams, Security Reviewers, System Designers |
| **Last Updated** | October 2026 |

---

## 1. Document Scope and Conventions

This specification details the comprehensive Functional Requirements (FR) and Non-Functional Requirements (NFR) for the **SkillConnect** local services platform across its evolution from frontend prototype through multi-phase SaaS production.

### Requirement ID Conventions
* `FR-AUTH-xxx`: Authentication & Identity
* `FR-DISC-xxx`: Search, Discovery & Catalog
* `FR-BOOK-xxx`: Booking, Scheduling & Milestones
* `FR-PRO-xxx`: Professional Onboarding & Profile Management
* `FR-PAY-xxx`: Payments, Invoicing & Escrow
* `FR-AI-xxx`: AI Estimation & Matching
* `FR-COMM-xxx`: Notifications & Communications
* `FR-ADMIN-xxx`: Administration & Moderation
* `NFR-PERF-xxx`: Performance & Scalability
* `NFR-SEC-xxx`: Security, Privacy & Integrity
* `NFR-A11Y-xxx`: Accessibility & Usability

---

## 2. Functional Requirements (FR)

### 2.1 Authentication & Profile Management
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-AUTH-001` | System must support customer registration via Email/Password, Google OAuth, and Apple ID. | High | Phase 2 |
| `FR-AUTH-002` | Professional registration must capture trade category, operational radius, license numbers, and insurance certificate uploads. | High | Phase 2 |
| `FR-AUTH-003` | Passwords must satisfy security criteria: minimum 12 chars, uppercase, lowercase, number, symbol. | High | Phase 2 |
| `FR-AUTH-004` | Multi-Factor Authentication (MFA via TOTP or SMS OTP) mandatory for Professional payouts and Administrator access. | Critical | Phase 2 |
| `FR-AUTH-005` | Prototype / Demo Mode: Local frontend form validation must display clear prototype submission states without persisting credentials or creating server sessions. | Mandatory | Phase 1 |

### 2.2 Search, Discovery & Catalog
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-DISC-001` | Service directory must provide category filtering (Plumbing, Electrical, Carpentry, Painting, Cleaning, HVAC, Appliance Repair). | Critical | Phase 1 (Mock) / Phase 3 (API) |
| `FR-DISC-002` | Location-based search must accept Postal/Zip codes, neighborhood strings, and optional browser geolocation. | High | Phase 1 (Mock) / Phase 3 (PostGIS) |
| `FR-DISC-003` | Directory must support multi-attribute filtering: Category, Minimum Rating (3.5+, 4.0+, 4.5+), Available Today toggle, and Price Range ($ - $$$$). | High | Phase 1 (Local) / Phase 3 (Server) |
| `FR-DISC-004` | Directory sorting must support: "Recommended" (algorithmic balance of distance/rating/relevance), "Highest Rated", "Price: Low to High", and "Fastest Response". | Medium | Phase 1 |
| `FR-DISC-005` | Professional profile views must display verified trade badges, bio, years of experience, service areas, itemized price list, working hours, and paginated customer reviews. | Critical | Phase 1 |
| `FR-DISC-006` | Prototype Safety Guard: All mock profiles, starting prices, and ratings must be explicitly labeled as demonstration data. | Critical | Phase 1 |

### 2.3 Booking, Scheduling & Milestones
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-BOOK-001` | Booking workflow must follow a 4-step sequence: (1) Scope & Issue Description, (2) Date & Time Slot Selection, (3) Price Estimate Review, (4) Booking Confirmation. | Critical | Phase 1 |
| `FR-BOOK-002` | System must prevent double-booking by locking selected time slots during the checkout session (15-minute reservation TTL). | High | Phase 3 |
| `FR-BOOK-003` | Booking lifecycle must support discrete states: `REQUESTED`, `CONFIRMED`, `EN_ROUTE`, `IN_PROGRESS`, `PENDING_REVIEW`, `COMPLETED`, `CANCELLED`, `DISPUTED`. | Critical | Phase 2 |
| `FR-BOOK-004` | Customer must have the ability to reschedule or cancel a booking in accordance with the professional's cancellation window (e.g., free up to 2 hours prior). | Medium | Phase 3 |
| `FR-BOOK-005` | Phase 1 Demo Booking: Must generate stable deterministic confirmation references (e.g., `DEMO-BOOK-1042`) and save non-sensitive records in browser localStorage for customer dashboard viewing. | Mandatory | Phase 1 |

### 2.4 Professional Dashboard & Availability
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-PRO-001` | Professional dashboard must provide an interactive availability toggle ("Available Today" / "Off Duty") reflecting immediate status updates. | High | Phase 1 |
| `FR-PRO-002` | Professional dashboard must display pending job requests, upcoming schedule, lifetime completed jobs, and average rating metrics. | High | Phase 1 |
| `FR-PRO-003` | Mock job request cards must support "Accept" and "Decline" actions with explanatory demo toasts explaining that no actual client is affected. | Medium | Phase 1 |

### 2.5 Payments, Invoicing & Commissions
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-PAY-001` | Platform must support two-step payment authorization: Hold placed at booking confirmation; captured upon customer sign-off or 48-hour auto-release. | Critical | Phase 4 |
| `FR-PAY-002` | Platform commission (take rate: 10–15%) must be deducted automatically before disbursing payout to professional's connected account (Stripe Connect). | High | Phase 4 |
| `FR-PAY-003` | Diagnostic Fee Guarantee: Standard inspection fee ($49–$89 depending on category) must be clearly itemized as billable if customer declines on-site repair quote. | High | Phase 1 (UI) / Phase 4 (Billing) |

### 2.6 AI Price Estimation & Matching (Advanced)
| ID | Requirement Description | Priority | Target Phase |
| :--- | :--- | :--- | :--- |
| `FR-AI-001` | System will provide preliminary price ranges based on user text description and optional photo uploads. | Medium | Phase 6 |
| `FR-AI-002` | AI estimates must explicitly display disclaimers: "Preliminary estimate only. Final cost established on-site after diagnostic inspection." | Critical | Phase 1 (UI Mock) / Phase 6 (API) |
| `FR-AI-003` | Fallback rule: In the event of AI service timeout or low confidence (<75%), system defaults to category baseline hourly rates. | High | Phase 6 |

---

## 3. Non-Functional Requirements (NFR)

### 3.1 Performance & Scalability
* `NFR-PERF-001`: Core Web Vitals targets: Largest Contentful Paint (LCP) < 2.0s, Cumulative Layout Shift (CLS) < 0.05, First Input Delay (FID) / INP < 100ms on 4G mobile.
* `NFR-PERF-002`: Directory search API response time < 150ms for 95th percentile under 500 concurrent queries.
* `NFR-PERF-003`: Frontend bundle size budget: Initial JS payload < 120kB compressed.

### 3.2 Security, Privacy & Integrity
* `NFR-SEC-001`: Sensitive customer addresses (exact apartment/street number) hidden until booking is confirmed by professional.
* `NFR-SEC-002`: No credentials, unmasked credit cards, or government ID images stored in plaintext or accessible via client-side storage (`localStorage`/`sessionStorage`).
* `NFR-SEC-003`: Role-Based Access Control (RBAC) enforced across API boundaries (Customer, Professional, Administrator, Support).
* `NFR-SEC-004`: Rate limiting applied to authentication endpoints (max 5 failed attempts per 15 minutes per IP) and search endpoints.

### 3.3 Usability & Accessibility (A11y)
* `NFR-A11Y-001`: WCAG 2.1 Level AA conformance across all public, booking, and dashboard screens.
* `NFR-A11Y-002`: Minimum contrast ratio of 4.5:1 for body copy and 3.0:1 for large display elements.
* `NFR-A11Y-003`: Full keyboard navigation (Tab, Shift+Tab, Enter, Escape, Arrow keys) across all dialogs, mobile drawers, dropdowns, and interactive calendars.
* `NFR-A11Y-004`: Strict adherence to `prefers-reduced-motion`: animation durations suppressed to 0ms or gentle opacity-only transitions when detected.

---

## 4. Edge Cases and System Behavior

1. **Unrecognized Location Query**: When search input does not match known service areas, display nearest regional hub and invite user to enter postal code.
2. **Professional Cancels Confirmed Booking**: Instant customer SMS/Email notification; immediate 100% refund authorization; 1-click option to dispatch alternative top-rated professional in category with a $15 platform courtesy credit.
3. **Customer No-Show at Appointment**: Professional logs arrival in mobile portal with geo-stamped check-in; 15-minute grace window; diagnostic fee forfeited to professional to cover travel expense.
4. **Network Drop During Booking**: Checkout state preserved in client cache for 15 minutes; upon reconnection, user resumes at current step without duplicate charge.

---

## 5. Related Documentation
* [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
* [Data Model Specification](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md)
* [API Contract Specification](file:///docs/architecture/API-CONTRACT-SPECIFICATION.md)
* [Role Permission Matrix](file:///docs/security/ROLE-PERMISSION-MATRIX.md)
* [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md)
