# Privacy and Data Handling — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-SEC-002` |
| **Status** | Approved |
| **Owner** | Data Protection Officer (DPO) & Privacy Counsel |
| **Target Audience** | All Engineers, Product Managers, Compliance Teams |
| **Last Updated** | October 2026 |

---

## 1. Privacy Principles and Compliance Scope

SkillConnect complies with international data privacy regulations, including the **General Data Protection Regulation (GDPR)** and the **California Consumer Privacy Act (CCPA/CPRA)**.

### Core Data Principles
* **Data Minimization**: Collect only information strictly necessary to facilitate local trade services.
* **Purpose Limitation**: Customer data shall never be sold, leased, or monetized for third-party behavioral advertising.
* **Storage Limitation**: Retain sensitive personal data only as long as necessary to fulfill service agreements or tax obligations.

---

## 2. Personal Identifiable Information (PII) Classification

| PII Data Category | Storage Location | Protection Level | Access Role Restriction |
| :--- | :--- | :--- | :--- |
| **User Email & Password Hash** | PostgreSQL `users` table | High (Encrypted at rest, Argon2id) | Auth subsystem only |
| **Customer Street Address** | PostgreSQL `bookings` table | Critical (Column AES-256 encrypted)| Hidden from Pro until booking confirmed |
| **User Phone Number** | PostgreSQL `users` table | Critical (Encrypted at rest) | Masked via Twilio Proxy; never exposed |
| **Technician Government ID & License**| Private S3 Bucket | Critical (Signed URL, SSE-KMS) | Compliance Officers only |
| **Payment Card Details** | Stripe Vault | Extreme (PCI-DSS Level 1) | Zero card data touches SkillConnect servers|

---

## 3. Customer Address Masking Protocol

To protect homeowner safety:
1. When browsing professionals or viewing search results, technicians see only general neighborhood names or postal codes (e.g., *"SoMa, 94107"*).
2. The customer's exact street address and apartment number are revealed to the assigned technician **only after** the technician accepts the booking.
3. Post-service: 7 days after job completion, the customer's exact street address is automatically redacted from the technician's mobile view.

---

## 4. User Privacy Rights (GDPR / CCPA)

* **Right to Access (Data Export)**: Users can download a machine-readable JSON archive of their profile, bookings, reviews, and transaction ledger.
* **Right to Erasure (Account Deletion)**: Users can request complete account deletion. Financial audit logs (payments, invoices) are anonymized and retained in compliance with standard 7-year IRS tax retention laws.

---

## 5. Related Documentation
* [Security Requirements](file:///docs/security/SECURITY-REQUIREMENTS.md)
* [Privacy Policy Requirements](file:///docs/policies/PRIVACY-POLICY-REQUIREMENTS.md)
* [Data Model and Relationships](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md)
