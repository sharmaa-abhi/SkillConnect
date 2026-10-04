# Security Requirements — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-SEC-001` |
| **Status** | Approved |
| **Owner** | Chief Information Security Officer (CISO) |
| **Target Audience** | All Developers, DevOps, Security Reviewers, Auditors |
| **Last Updated** | October 2026 |

---

## 1. Security Baseline & Standards

SkillConnect enforces an enterprise-grade security architecture designed around the principle of **Defense in Depth**, adhering to:
* **OWASP Top 10 Web Application Security Risks (2021/2025)**
* **SOC 2 Type 1 / Type 2 Trust Services Criteria**
* **NIST Cybersecurity Framework (CSF)**

---

## 2. Core Security Controls

### 2.1 Cryptographic Standards
* **Transport Encryption**: TLS 1.3 mandatory on all public and internal service communication. HSTS enforced with `max-age=31536000; includeSubDomains; preload`.
* **Password Hashing**: Passwords hashed using **Argon2id** (Memory: 64MB, Iterations: 3, Parallelism: 4) or Bcrypt (cost factor 12).
* **Data at Rest**:
  * PostgreSQL databases encrypted using AES-256 via AWS KMS.
  * Sensitive PII fields (customer physical street addresses, phone numbers) column-level encrypted using AES-256-GCM.
  * AWS S3 object storage encrypted using SSE-KMS with automated key rotation.

### 2.2 Application Hardening & Web Security Headers
All HTTP responses from the Next.js application server must include:
```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; connect-src 'self' https://api.stripe.com; frame-src https://js.stripe.com;
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(self)
```

### 2.3 Rate Limiting & Abuse Prevention
* **Authentication Endpoints** (`/api/auth/*`): Limited to **5 attempts per 15 minutes** per IP address.
* **Directory Search Endpoints** (`/api/v1/professionals`): Limited to **60 requests per minute** per IP.
* **Booking Creation** (`/api/v1/bookings`): Limited to **5 booking attempts per hour** per authenticated user.

---

## 3. Prototype Safety Guarantees (Phase 1)

1. **Zero Credential Storage**: Demo login forms run pure client-side schema validation. Entered passwords are wiped from JavaScript memory upon submit and never stored in `localStorage`, `sessionStorage`, or cookies.
2. **Sanitized Mock Data**: Mock professional profiles contain synthetic email addresses, phone numbers, and addresses. No real personal data is committed to the repository.

---

## 4. Related Documentation
* [Privacy and Data Handling](file:///docs/security/PRIVACY-AND-DATA-HANDLING.md)
* [Role Permission Matrix](file:///docs/security/ROLE-PERMISSION-MATRIX.md)
* [Threat Model and Risk Assessment](file:///docs/security/THREAT-MODEL-AND-RISK-ASSESSMENT.md)
