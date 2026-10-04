# User Journeys — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROD-006` |
| **Status** | Approved |
| **Owner** | UI/UX Architecture & Product Strategy |
| **Target Audience** | Frontend Engineers, Designers, Product Managers |
| **Last Updated** | October 2026 |

---

## 1. Primary Customer Journey: Discovery to Confirmed Booking

```mermaid
sequenceDiagram
    autonumber
    actor Customer
    participant UI as SkillConnect Frontend
    participant Search as Search & Catalog
    participant Profile as Professional Profile
    participant Booking as Booking Engine
    participant Escrow as Payment/Escrow System

    Customer->>UI: Land on Homepage (/)
    Customer->>Search: Enter "Electrical" + Postal Code "10001"
    Search-->>UI: Render filtered directory (/professionals)
    Customer->>Profile: Select Pro "Elena Vance (Master Electrician)"
    Profile-->>Customer: Display Bio, Rates, Badges, Reviews, Calendar
    Customer->>Booking: Click "Book Appointment"
    Customer->>Booking: Step 1: Input issue description & photos
    Customer->>Booking: Step 2: Choose slot (Tomorrow, 10:00 AM)
    Customer->>Booking: Step 3: Review estimate ($75 inspection fee + $90/hr)
    Customer->>Escrow: Step 4: Authorize payment hold (or Demo Submit in Phase 1)
    Escrow-->>Booking: Hold Authorized / Demo State Validated
    Booking-->>Customer: Render Confirmation (Code: DEMO-BOOK-1042)
    Customer->>UI: View appointment in /customer/dashboard
```

---

## 2. Professional Onboarding & Daily Operational Journey

```mermaid
stateDiagram-v2
    [*] --> Registration: Signs up on /register (Role: Professional)
    Registration --> ProfileSetup: Submits Skills, Bio, Rates, Service Radius
    ProfileSetup --> ComplianceQueue: Uploads Trade License & Insurance
    ComplianceQueue --> UnderReview: Admin Compliance Audit
    UnderReview --> Approved: Status: VERIFIED
    
    state DailyOperations {
        [*] --> OffDuty
        OffDuty --> AvailableToday: Toggles Switch ON (/worker/dashboard)
        AvailableToday --> RequestReceived: Incoming Job Alert (SMS/Push)
        RequestReceived --> Accepted: Worker Reviews Scope & Accepts
        RequestReceived --> Declined: Worker Declines (Returns to pool)
        Accepted --> EnRoute: Worker departs for customer premises
        EnRoute --> OnSite: Diagnostic Inspection & Final Quote Agreed
        OnSite --> Completed: Work Finished & Invoice Signed
    }
    
    Approved --> DailyOperations
    Completed --> OffDuty: Daily Shift Finished
```

---

## 3. Exception & Dispute Resolution Journeys

### 3.1 Customer Cancellation Journey
1. **Initiation**: Customer navigates to `/customer/dashboard` -> Active Bookings -> Clicks "Cancel Appointment".
2. **Policy Verification**: System checks cancellation timestamp against appointment start time:
   * **> 2 Hours Prior**: Cancellation is free. Escrow payment pre-authorization is instantly released.
   * **< 2 Hours Prior**: Standard late cancellation fee ($25) charged; balance released. Fee disbursed to technician for wasted scheduling slot.
3. **Audit & Confirmation**: Booking status updated to `CANCELLED`; confirmation email dispatched.

### 3.2 Technician Dispute or Damage Escalation
1. **Trigger**: Customer reports damaged property or incomplete service via "Report Issue" in Dashboard within 48 hours of service completion.
2. **Escrow Freeze**: Automatic release of escrow funds to technician is paused immediately.
3. **Evidence Submission**:
   * Customer submits photos of defective work/damage.
   * Professional submits before-and-after work photos and signed paper/digital job ticket.
4. **Resolution by Support**: Support agent investigates within 24 hours. Outcomes include:
   * Re-dispatch of master technician to correct issue at platform expense.
   * Partial or full customer refund.
   * Payout release to technician if claim is found fraudulent.

---

## 4. Related Documentation
* [User Stories and Acceptance Criteria](file:///docs/product/USER-STORIES-AND-ACCEPTANCE-CRITERIA.md)
* [Route and Page Inventory](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md)
* [Booking Lifecycle and Business Rules](file:///docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md)
* [Cancellation, Refund, and Dispute Policy](file:///docs/policies/CANCELLATION-REFUND-AND-DISPUTE-POLICY.md)
