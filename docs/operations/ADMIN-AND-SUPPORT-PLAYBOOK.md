# Admin and Support Playbook — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-OPS-006` |
| **Status** | Approved |
| **Owner** | Head of Customer Operations & Support |
| **Target Audience** | Support Agents, Compliance Officers, Operations Leads |
| **Last Updated** | October 2026 |

---

## 1. Operational Support Roles & Authority Limits

| Support Tier | Scope & Responsibilities | Refund Authority Limit | Escalation Path |
| :--- | :--- | :--- | :--- |
| **Tier 1 (Frontline Support)** | Booking reschedules, basic FAQ, profile inquiries | Up to **$50.00** | Escalate to Tier 2 if unresolved |
| **Tier 2 (Dispute Specialist)** | Poor craftsmanship disputes, cancellation fee waivers | Up to **$250.00** | Escalate to Operations Lead |
| **Operations Lead / Admin** | Severe property damage claims, account suspensions | Up to **$2,500.00** | General Counsel / Insurance Broker |

---

## 2. Standard Operating Procedures (SOPs)

### SOP-01: Disputed Booking Mediation
1. **Trigger**: Customer clicks "Report Issue / Dispute" within 48h of invoice submission.
2. **Immediate Action**: Confirm escrow payout is paused in administrative portal.
3. **Investigation**:
   * Review job ticket, uploaded before/after photos, and customer complaint.
   * Place outbound call to technician within 4 business hours.
4. **Resolution Paths**:
   * *Remediation Agreement*: Pro agrees to re-visit customer within 24h to fix issue free of charge.
   * *Settlement*: Partial invoice reduction agreed upon by both parties.
   * *Refund*: If pro caused damage or failed to complete work, issue full refund to customer and levy account warning on technician.

### SOP-02: Technician Trade License Verification
1. Access the pending verification queue in `/admin/verifications`.
2. Inspect uploaded state license certificate against the municipal licensing board portal (e.g., California CSLB).
3. Verify: (a) License is Active and in good standing, (b) Trade classification matches applied profile (e.g., C-36 for Plumbing), (c) Workers' comp and general liability insurance are current.
4. If valid, click "Approve" (system applies "Verified" badge). If invalid, click "Reject" with specific feedback notes.

---

## 3. Related Documentation
* [Cancellation, Refund, and Dispute Policy](file:///docs/policies/CANCELLATION-REFUND-AND-DISPUTE-POLICY.md)
* [Identity and Skill Verification](file:///docs/security/IDENTITY-AND-SKILL-VERIFICATION.md)
* [Role Permission Matrix](file:///docs/security/ROLE-PERMISSION-MATRIX.md)
