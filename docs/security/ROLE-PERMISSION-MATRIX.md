# Role Permission Matrix (RBAC) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-SEC-003` |
| **Status** | Approved |
| **Owner** | Lead Security Architect |
| **Target Audience** | Backend Engineers, Security Reviewers, QA Engineers |
| **Last Updated** | October 2026 |

---

## 1. Role Definitions

* `GUEST`: Unauthenticated visitor browsing public marketplace routes.
* `CUSTOMER`: Authenticated consumer booking household or commercial trade services.
* `PROFESSIONAL`: Authenticated trade technician offering skilled services.
* `PARTNER`: Housing society or commercial property management corporate account.
* `SUPPORT`: Platform customer support and dispute moderation agent.
* `ADMIN`: Platform super administrator with global operational authority.

---

## 2. Granular Permissions Matrix

| Resource & Action | GUEST | CUSTOMER | PROFESSIONAL | PARTNER | SUPPORT | ADMIN |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Browse Public Catalog & Search** | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **View Full Pro Profile & Reviews** | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Create Booking Request** | DENY | ALLOW | DENY | ALLOW | DENY | ALLOW |
| **Cancel Own Booking** | DENY | ALLOW | ALLOW | ALLOW | ALLOW | ALLOW |
| **Release Escrow Payment** | DENY | ALLOW | DENY | ALLOW | ALLOW | ALLOW |
| **Toggle Worker Availability** | DENY | DENY | ALLOW (Self) | DENY | DENY | ALLOW |
| **Submit Invoice / Extra Parts** | DENY | DENY | ALLOW (Self) | DENY | DENY | ALLOW |
| **Write Customer Review** | DENY | ALLOW (Own) | DENY | ALLOW (Own) | DENY | ALLOW |
| **Moderate Flagged Review** | DENY | DENY | DENY | DENY | ALLOW | ALLOW |
| **View Unmasked Customer Address** | DENY | ALLOW (Self) | ALLOW (Booked)| ALLOW (Self)| ALLOW | ALLOW |
| **Approve Trade Verification Badge**| DENY | DENY | DENY | DENY | ALLOW | ALLOW |
| **Alter Platform Take-Rate / Fee** | DENY | DENY | DENY | DENY | DENY | ALLOW |
| **Access Financial Audit Ledger** | DENY | DENY | DENY | DENY | DENY | ALLOW |

---

## 3. Related Documentation
* [Authentication and Authorization](file:///docs/architecture/AUTHENTICATION-AND-AUTHORIZATION.md)
* [Security Requirements](file:///docs/security/SECURITY-REQUIREMENTS.md)
* [User Personas and Roles](file:///docs/product/USER-PERSONAS-AND-ROLES.md)
