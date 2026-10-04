# Environment and Configuration Plan — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-OPS-001` |
| **Status** | Approved |
| **Owner** | Lead DevOps Architect & Platform Engineer |
| **Target Audience** | DevOps, System Administrators, Backend Developers |
| **Last Updated** | October 2026 |

---

## 1. Environment Tiers and Topology

SkillConnect maintains four strictly isolated operational environments:

```mermaid
graph LR
    Dev[Local Development: localhost:3000] --> CI[CI Pipeline: GitHub Actions]
    CI --> Staging[Staging / Preview: staging.skillconnect.com]
    Staging --> Prod[Production: skillconnect.com]
```

| Environment | Host Infrastructure | Database | External Integrations | Access Restriction |
| :--- | :--- | :--- | :--- | :--- |
| **Local Dev** | Local workstation | Docker PostgreSQL / Local mock | Stripe Test Mode, Twilio Sandbox | Developers only |
| **CI Runner** | GitHub Actions Ubuntu | Ephemeral PostgreSQL container | Mocks & Sandbox Stubs | Automated runners |
| **Staging** | Vercel Preview / AWS ECS | AWS RDS PostgreSQL (Sanitized copy)| Stripe Test Mode, Twilio Sandbox | Internal Team & QA |
| **Production** | Vercel Edge / AWS Multi-AZ | AWS RDS Multi-AZ Primary + Replica | Stripe Live Mode, Production APIs | Public / Restricted Admin |

---

## 2. Environment Variable Schema (Markdown Specification Only)

```ini
# Core Application Configuration
NEXT_PUBLIC_APP_URL="https://skillconnect.com"
NEXT_PUBLIC_ENVIRONMENT="production" # "development" | "staging" | "production"
NEXT_PUBLIC_ENABLE_DEMO_MODE="false" # "true" for Phase 1 Prototype

# Database Persistence Layer
DATABASE_URL="postgresql://user:password@host:5432/skillconnect?sslmode=require"
DIRECT_URL="postgresql://user:password@host:5432/skillconnect" # For connection poolers

# Distributed Cache & Slot Locks
REDIS_URL="rediss://default:token@host:6379"

# Authentication & Session Security
NEXTAUTH_URL="https://skillconnect.com"
NEXTAUTH_SECRET="[Cryptographically Secure 64-char Hex String]"

# Payment Processing (Stripe Connect)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."

# Communications Infrastructure
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_PHONE_NUMBER="+18005550199"
RESEND_API_KEY="re_..."

# Object Storage (Private S3)
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="us-west-2"
S3_BUCKET_NAME="skillconnect-prod-private"
```

---

## 3. Secret Management & Compliance Rules

* **Zero Plaintext Secrets**: No environment files (`.env`, `.env.local`) containing production credentials shall ever be checked into Git version control (`.gitignore` enforced).
* **Automated Secret Scanning**: Pre-commit hooks (`gitleaks`) and GitHub Secret Scanning continuously scan every pull request for accidental credential leaks.

---

## 4. Related Documentation
* [Development and Code Quality Standards](file:///docs/operations/DEVELOPMENT-AND-CODE-QUALITY-STANDARDS.md)
* [CI/CD and Deployment Plan](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md)
* [Security Requirements](file:///docs/security/SECURITY-REQUIREMENTS.md)
