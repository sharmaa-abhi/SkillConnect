# Third-Party Integrations — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-ARCH-013` |
| **Status** | Approved |
| **Owner** | Lead Integrations Architect |
| **Target Audience** | Backend Engineers, Security Reviewers, DevOps |
| **Last Updated** | October 2026 |

---

## 1. Third-Party Ecosystem Matrix

| Integration Partner | Category / Domain | Production Purpose | Mock / Phase 1 Strategy |
| :--- | :--- | :--- | :--- |
| **Stripe Connect** | Payments & KYC | Pre-auth holding, milestone split payout, 1099 tax | Simulated checkout & deterministic references |
| **Persona / Stripe Identity**| Identity Verification | Gov ID scan, facial liveness check, trade license audit | Static profile badges with demo disclosure |
| **Twilio** | Communications | SMS dispatch, technician arrival alerts, proxy calling | Client-side accessible UI toasts |
| **Resend** | Communications | Transactional email confirmations, receipts, dispute alerts | In-app dashboard notifications |
| **Google Gemini / OpenAI** | AI Scoping | Multimodal image and text labor & parts cost estimation | Static representative sample estimate breakdown |
| **AWS S3 / Cloudflare R2** | Cloud Storage | Encrypted storage for job photos and compliance docs | Local project image assets (`/public/images/`) |
| **Sentry / Datadog** | Observability | Application performance monitoring, error telemetry | Next.js development console logs |

---

## 2. Integration Credentials & Secret Management

* **Zero Hardcoded Secrets**: Secrets (Stripe Secret Key, Twilio Auth Token, Database URL) are strictly injected via environment variables at runtime (`process.env`).
* **Environment Boundaries**:
  * Development: `.env.local` (Local developer machine, git-ignored).
  * Staging: Vercel / AWS Secrets Manager (Stripe Test Mode, Twilio Sandbox).
  * Production: AWS Secrets Manager / Vercel Encrypted Env (Strict production keys with IP restriction).
* **Client Exposure Safeguard**: No environment variable prefixed with `NEXT_PUBLIC_` may contain secret keys, private credentials, or administrative tokens.

---

## 3. Related Documentation
* [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
* [Technology Stack and Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md)
* [Security Requirements](file:///docs/security/SECURITY-REQUIREMENTS.md)
