# Risks, Assumptions, and Open Questions (RAID) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROJ-003` |
| **Status** | Approved |
| **Owner** | Program Director & Risk Lead |
| **Target Audience** | All Stakeholders, Engineering Leads, Executive Sponsors |
| **Last Updated** | October 2026 |

---

## 1. Documented Assumptions

### 1.1 Technical Assumptions
1. **Next.js & React 19 Ecosystem**: The modern App Router architecture is sufficiently mature to handle high-traffic SSR search indexing and client-side interactive state.
2. **PostGIS Scalability**: A properly indexed PostgreSQL database with read replicas will support up to 5,000 active service technicians and 50,000 monthly bookings within a single metro area without sharding.
3. **Stripe Connect Escrow Compliance**: The two-step manual payment capture model complies with money transmission laws across our launch jurisdictions without requiring a separate state banking escrow license.

### 1.2 Commercial Assumptions
1. **Supply Side Willingness**: Independent trade technicians will adopt an 8.5%–12.5% transaction commission in exchange for zero upfront pay-per-lead fees and automated scheduling.
2. **Diagnostic Fee Acceptance**: Homeowners will accept a standard $49–$89 diagnostic inspection fee when guaranteed that it applies 100% toward subsequent repairs.

---

## 2. Risk Register

| Risk ID | Risk Description | Likelihood | Impact | Mitigation Strategy | Owner |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `RSK-01` | **Marketplace Disintermediation**: Users arrange cash deals off-platform. | High | High | Escrow warranties, property damage guarantee, Pro subscription incentives (8.5% fee). | CCO |
| `RSK-02` | **Licensing Regulatory Scrutiny**: Unlicensed contractors perform regulated electrical/gas work. | Medium | Critical | Mandatory Tier 3 license audits; automated annual insurance lapse alerts. | General Counsel |
| `RSK-03` | **Supply Liquidity Shortage**: Insufficient active technicians during initial launch causes high drop-offs. | High | High | Concentrated hyperlocal launch (single postal code cluster); guaranteed hourly minimums for pioneer pros. | Operations Lead |
| `RSK-04` | **AI Scoping Inaccuracy**: Hallucinated low quotes cause customer disputes on-site. | Medium | Medium | Strict disclaimers; minimum confidence threshold (>0.75); fallback to category hourly ranges. | Lead AI Architect |

---

## 3. Unresolved Questions & Decision Log

* [ ] **UQ-01: Commercial Insurance Partnership**: Which specialty commercial underwriter (e.g., Next Insurance, Hiscox) will provide the master $50,000 workmanship guarantee policy? *(Target Resolution: Phase 4)*
* [ ] **UQ-02: Instant Emergency Surcharge**: Should urgent emergency dispatch (< 60 minutes) carry a standardized 50% labor surge fee, or be determined by technician quote? *(Target Resolution: Phase 3)*
* [ ] **UQ-03: Multi-Currency & International Tax**: What is the expansion sequence beyond the United States (e.g., Canada, UK), and what VAT/GST rules apply? *(Target Resolution: Phase 8)*

---

## 4. Related Documentation
* [Architecture Decision Records](file:///docs/project/ARCHITECTURE-DECISION-RECORDS.md)
* [Master Implementation Plan](file:///docs/project/IMPLEMENTATION-PLAN.md)
* [Threat Model and Risk Assessment](file:///docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md)
