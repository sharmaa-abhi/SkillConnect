# Release Checklist — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-OPS-007` |
| **Status** | Approved |
| **Owner** | Release Engineering Lead |
| **Target Audience** | Release Managers, QA Leads, DevOps |
| **Last Updated** | October 2026 |

---

## 1. Pre-Deployment Verification Checklist

Every production release candidate must satisfy all items below prior to deployment authorization:

### 1.1 Code Quality & Static Analysis
- [ ] `npm run lint` executes with 0 errors and 0 warnings.
- [ ] `npx tsc --noEmit` completes with 0 TypeScript compiler errors.
- [ ] Automated dependency vulnerability scan (`npm audit`) reports 0 critical or high CVEs.
- [ ] No `console.log` statements or development debugger breakpoints in production code.

### 1.2 Automated Test Coverage
- [ ] Unit test suite passes with `>= 80%` code coverage.
- [ ] Integration test suite verifies all API contract schemas via Zod.
- [ ] Playwright E2E suite passes across desktop and mobile viewports (Search, Booking, Dashboards).
- [ ] Automated accessibility audit (axe-core) reports 0 WCAG 2.1 AA violations.

### 1.3 Database & Migrations
- [ ] Database migration scripts tested in staging with forward and rollback plans.
- [ ] No table-locking queries or destructive column drops executed without dual-write phase.
- [ ] Database point-in-time recovery (PITR) backup snapshot verified within the last 1 hour.

---

## 2. Deployment & Smoke Verification

### 2.1 Deployment Execution
- [ ] Trigger atomic container deployment or Vercel production alias.
- [ ] Monitor real-time logs for startup exceptions or unhandled promise rejections.

### 2.2 Live Smoke Test Protocol
- [ ] Navigate to `/` (Homepage loads in < 1.5s, no layout shift).
- [ ] Execute search query on `/professionals` (Filters update, cards render).
- [ ] Open individual profile `/professionals/[slug]` (All tabs and rates visible).
- [ ] Execute test booking in demo/staging environment (Confirmation code generated).
- [ ] Verify Stripe webhook listener receives test ping (`200 OK`).

---

## 3. Post-Deployment Monitoring & Rollback Gates

* **15-Minute Soak Period**: SRE monitors Datadog dashboards for 15 minutes post-deploy.
* **Immediate Rollback Trigger**:
  * HTTP 5xx error rate exceeds **0.1%** of total traffic.
  * P95 latency exceeds **500ms** on core discovery routes.
  * Any unhandled critical security or payment anomaly detected.

---

## 4. Related Documentation
* [CI/CD and Deployment Plan](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md)
* [Quality and Acceptance Checklist](file:///06-QUALITY-ACCEPTANCE-CHECKLIST.md)
* [Disaster Recovery and Business Continuity](file:///docs/operations/DISASTER-RECOVERY-AND-BUSINESS-CONTINUITY.md)
