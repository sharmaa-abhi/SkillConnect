# Requirements Traceability Matrix (RTM) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROJ-006` |
| **Status** | Approved |
| **Owner** | Lead Systems Architect & QA Lead |
| **Target Audience** | QA Engineers, Product Managers, System Architects |
| **Last Updated** | October 2026 |

---

## 1. Traceability Matrix

This matrix establishes bidirectional traceability from high-level business requirements to user stories, target routes, architecture subsystems, and automated acceptance tests:

| Requirement ID | Description | User Story | Target Route / Page | Architecture Module | Acceptance Test ID |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `FR-AUTH-001` | Multi-provider customer registration | `US-CUST-01` | `/register` | Auth Engine (NextAuth) | `TC-AUTH-01` |
| `FR-AUTH-005` | Demo mode validation without credentials storage | `US-CUST-01` | `/login`, `/register` | Client Form Reducer | `TC-AUTH-DEMO` |
| `FR-DISC-001` | Category filtering across 7 trades | `US-CUST-01` | `/services`, `/professionals`| Catalog Service | `TC-SEARCH-CAT` |
| `FR-DISC-002` | Geospatial location search & postal radius | `US-CUST-01` | `/`, `/professionals` | PostGIS Spatial Matcher | `TC-SEARCH-GEO` |
| `FR-DISC-003` | Multi-attribute filter (Rating, Today, Price) | `US-CUST-01` | `/professionals` | Search Matcher | `TC-FILTER-MULTI` |
| `FR-DISC-005` | Profile views with reviews, rates, hours | `US-CUST-02` | `/professionals/[slug]` | Profile Service | `TC-PRO-PROFILE` |
| `FR-BOOK-001` | 4-step wizard booking flow | `US-CUST-03` | `BookingFlowDialog` | Booking FSM Engine | `TC-BOOK-WIZARD` |
| `FR-BOOK-002` | Distributed slot locking (15-min TTL) | `US-CUST-03` | `/api/v1/bookings` | Redis Distributed Lock | `TC-LOCK-CONCUR` |
| `FR-BOOK-005` | LocalStorage demo booking persistence | `US-CUST-03` | `/customer/dashboard` | Demo Storage Utility | `TC-DASH-CUST` |
| `FR-PRO-001` | Interactive worker availability toggle | `US-PRO-01` | `/worker/dashboard` | Worker Service | `TC-WORKER-AVAIL`|
| `FR-PRO-003` | Job request acceptance simulation | `US-PRO-02` | `/worker/dashboard` | Worker Service | `TC-WORKER-JOBS` |
| `FR-PAY-001` | Two-step payment pre-auth & capture | `US-CUST-03` | Checkout API | Stripe Connect Escrow | `TC-PAY-ESCROW` |
| `FR-PAY-002` | Automated 12.5% platform commission split | `US-PRO-02` | Invoice Engine | Financial Ledger Service | `TC-PAY-COMM` |
| `FR-ADMIN-001`| Trade license compliance verification | `US-ADMIN-01`| `/admin/verifications` | Admin Compliance Queue | `TC-ADMIN-AUDIT` |
| `NFR-PERF-001`| Core Web Vitals (LCP < 2.0s, CLS < 0.05) | All | All Routes | Next.js Edge SSR / CDN | `TC-PERF-CWV` |
| `NFR-SEC-001` | Customer street address masking protocol | `US-CUST-02` | `/professionals`, API | PII Data Masking Filter | `TC-SEC-ADDR` |
| `NFR-A11Y-001`| WCAG 2.1 Level AA conformance | All | All Routes | UI Design System | `TC-A11Y-AUDIT` |

---

## 2. Related Documentation
* [Product Requirements](file:///docs/product/PRODUCT-REQUIREMENTS.md)
* [User Stories and Acceptance Criteria](file:///docs/product/USER-STORIES-AND-ACCEPTANCE-CRITERIA.md)
* [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md)
