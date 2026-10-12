# Real-World Feedback Review Summary
## GREVIX AfterCode | Challenge Card 2: Real-World Feedback

**Platform:** SkillConnect  
**Context:** Comprehensive Code Inspection, Architectural Bug Fixes, Automated Verification, and QA Audit  
**Date:** October 2026  

---

## 1. Source of Feedback

The feedback incorporated in this review was genuinely received from reviewer evaluation of the SkillConnect platform during **GREVIX AfterCode Challenge Card 2**. No fictional personas, fabricated ratings, manufactured review quotations, or simulated response statistics are used in this document.

---

## 2. Reviewer Observations & Identified Issues

The reviewer highlighted six core observations and defect areas across the platform:

### Observation 1: Positive Shared State Architecture with Inconsistent Decline/Escrow Handling
- **Reviewer Note:** Customer, Professional (Pro), and Admin appear to share application state. This unified state architecture is a strong foundational feature.
- **The Defect:** When a Professional declines a service request, the Customer does not consistently see the updated status, and escrow/payment handling does not follow the correct business rules. Escrow holds must not be released to a Pro upon declining a request, but refunded/released back to the Customer.

### Observation 2: Search Failure ("leaky sink" + ZIP 94107)
- **Reviewer Note:** Searching for common multiword homeowner queries such as `"leaky sink"` with ZIP code `94107` returns no professionals (`0 results`), despite genuine licensed plumbers being configured in San Francisco covering that ZIP.
- **The Defect:** Search terms were unnormalized, lacked trade synonym and multiword phrase resolution, and discarded ZIP code filters when query strings were present.

### Observation 3: Incorrect Service Estimation (Defaulting to Plumbing)
- **Reviewer Note:** Submitting an unsupported or out-of-domain request such as `"I need a babysitter"` into the AI cost estimator causes the platform to default to the first category in the array (Plumbing), generating a confusing plumbing estimate for childcare.
- **The Defect:** The estimator lacked upfront category intent validation and unsupported domain detection. When a service is out-of-scope or unidentified, it must display: *"We can't estimate this service yet."*

### Observation 4: Date and Weekday Inconsistencies
- **Reviewer Note:** Displayed date labels and weekdays disagree. For instance, booking slots hardcoded `"Wednesday, Oct 13"`, whereas on the actual calendar October 13, 2026 is a Tuesday.
- **The Defect:** Weekday names were hardcoded as static strings rather than dynamically derived from calendar date math using the configured market timezone (`America/Los_Angeles`).

### Observation 5: Inconsistent Fees, Metrics, and Counts Across Dashboards
- **Reviewer Note:** Customer, Worker, and Admin dashboards showed conflicting figures, hardcoded fallback metrics (e.g., static `$4,280` earnings or independent counts), and non-centralized fee calculation logic.
- **The Defect:** Pricing rules, tax rates (8.75%), diagnostic credits, and dashboard aggregations were duplicated in local component states rather than derived from a single source of truth.

### Observation 6: Simulated Data Disclosure & Prototype Transparency
- **Reviewer Note:** The application uses simulated mock data and prototype state transitions without clear disclosure to users, risking misunderstanding regarding real financial transactions.
- **The Defect:** The application lacked clear, accessible prototype notices distinguishing simulated demo data from live financial transactions.

---

## 3. Implementation Priorities

All six feedback categories were selected for immediate, end-to-end engineering implementation:

| Priority | Area | Core Objectives | Status |
| :--- | :--- | :--- | :--- |
| **P0 (Critical)** | **Search & Service Discovery** | Normalize inputs, map synonyms to trades, enforce genuine ZIP 94107 coverage without fabricating fake pros, detect unsupported services | **Completed & Verified** |
| **P0 (Critical)** | **Estimate Calculator** | Validate service categories, reject childcare/babysitting, display *"We can't estimate this service yet."*, centralize fee formulas | **Completed & Verified** |
| **P1 (High)** | **Shared State & Escrow Safety** | Synchronize Customer, Pro, and Admin on decline, refund escrow hold to Customer (never to Pro), prevent illegal transitions | **Completed & Verified** |
| **P1 (High)** | **Date & Weekday Consistency** | Derive weekdays dynamically with timezone awareness (`America/Los_Angeles`), ensure Oct 13, 2026 = Tuesday | **Completed & Verified** |
| **P1 (High)** | **Single Source of Truth** | Centralize fee and metric aggregations, eliminate hardcoded figures like `$4,280`, align dashboard counts | **Completed & Verified** |
| **P2 (Standard)** | **Prototype Disclaimer** | Add accessible `"Prototype — Simulated Data"` notice to headers, footers, and dashboards | **Completed & Verified** |
| **P2 (Standard)** | **Mobile Responsiveness** | Verify and test layouts across 320px, 375px, 390px, 430px, 768px, 1024px, 1440px viewports | **Completed & Verified** |

---

## 4. Preservation of Architectural Strengths

Per reviewer guidance, the positive shared-state architecture was strictly preserved and reinforced:
- The reactive client persistence layer (`src/lib/demo-storage.ts` using React 19's `useSyncExternalStore`) was maintained.
- Bidirectional linkage between `DemoBooking` (Customer/Admin view) and `JobRequest` (Worker/Admin view) via `associatedBookingId` was established so state mutations cascade authoritatively across all three portals without page reloads.
- No artificial backend rewrite was forced; rather, the existing architecture was repaired safely and cleanly.
