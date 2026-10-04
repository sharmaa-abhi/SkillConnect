# Threat Model and Risk Assessment — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-SEC-004` |
| **Status** | Approved |
| **Owner** | Lead Security Architect |
| **Target Audience** | Security Engineers, System Architects, Product Leadership |
| **Last Updated** | October 2026 |

---

## 1. Threat Modeling Methodology (STRIDE)

SkillConnect is analyzed using Microsoft's **STRIDE** methodology, adapted to address the specific vulnerabilities of physical-world, two-sided local marketplaces.

---

## 2. Threat Analysis & Mitigation Register

| STRIDE Category | Specific Threat Scenario | Likelihood | Impact | Platform Countermeasure / Mitigation | Residual Risk |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Spoofing** | Fraudulent actor poses as licensed master electrician using stolen license ID. | Medium | High | Two-factor verification: Automated state license database audit + Persona government photo ID matching. | Low |
| **Tampering** | Rogue user intercepts API request to alter technician payout bank account ID. | Low | Critical | Stripe Connect handles all banking payouts directly; zero bank account fields exist in SkillConnect DB. | Negligible |
| **Repudiation** | Customer claims technician never arrived to avoid paying diagnostic fee. | High | Medium | Geostamped arrival check-in via mobile device + GPS bounding radius verification (+/- 500m). | Low |
| **Information Disclosure** | Scraping bot harvests unmasked homeowner addresses across city directory. | Medium | High | Strict address masking: Exact street address hidden until booking confirmed; rate-limited directory API. | Low |
| **Denial of Service** | Botnet floods booking reservation endpoint to lock out legitimate customers. | Medium | Medium | Redis distributed lock TTL (15 mins) + IP and authenticated user rate-limiting + Cloudflare Turnstile. | Low |
| **Elevation of Privilege** | Compromised support agent attempts to access administrative commission overrides. | Low | Critical | Strict RBAC enforced at API and database RLS layer; immutable audit logging on all privileged actions. | Low |

---

## 3. Marketplace-Specific Business Risks

### 3.1 Platform Disintermediation (Off-Platform Settlement)
* **Risk**: Customer and technician meet on-site and agree to transact in cash to bypass platform commission.
* **Mitigation**:
  * Platform craftsmanship warranty (30–90 days) and $50k property damage guarantee only apply to transactions settled on-platform.
  * Reduced commission for Pro subscribers (8.5%) lowers economic incentive to defect.
  * Direct customer-reported off-platform solicitations result in technician account suspension.

### 3.2 Fake Reviews & Astroturfing
* **Risk**: Technicians generate bogus accounts to write glowing 5-star reviews.
* **Mitigation**: Verified Booking Gate: Reviews can only be submitted after a verified, paid on-platform booking completion. Open-web unverified reviews are strictly barred.

---

## 4. Related Documentation
* [Security Requirements](file:///docs/security/SECURITY-REQUIREMENTS.md)
* [Identity and Skill Verification](file:///docs/security/IDENTITY-AND-SKILL-VERIFICATION.md)
* [Security Incident Response](file:///docs/security/SECURITY-INCIDENT-RESPONSE.md)
