# User Stories & Acceptance Criteria — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROD-005` |
| **Status** | Approved |
| **Owner** | Product Management & QA Lead |
| **Target Audience** | QA Engineers, Frontend/Backend Developers, System Architects |
| **Last Updated** | October 2026 |

---

## 1. Structure and Traceability

All user stories follow the standard format:
> *As a* `[Role]`, *I want to* `[Action]`, *so that* `[Outcome/Benefit]`.

Acceptance criteria are defined using verifiable conditions and Gherkin specifications (`Given / When / Then`).

---

## 2. Customer Epics & Stories

### US-CUST-01: Service Search and Discovery
* **User Story**: *As a homeowner with a clogged drain*, I want to search for licensed plumbers in my neighborhood and filter by same-day availability, *so that I can quickly resolve an urgent plumbing issue with a verified technician.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Searching by category and postal code
    Given I am on the SkillConnect homepage or /services page
    When I select the "Plumbing" category and enter postal code "94107"
    And I toggle the "Available Today" filter
    Then the system displays only professionals tagged with "Plumbing" operating within 94107 who have availability today
    And each professional card displays: Name, Specialty, Rating, Review Count, Sample Starting Price, and "View Profile" CTA
  ```

### US-CUST-02: Professional Comparison and Profile Review
* **User Story**: *As a customer*, I want to view a professional's verified profile details, reviews, itemized price list, and credentials, *so that I can assess their trustworthiness and fair pricing before booking.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Viewing a professional profile
    Given I navigate to /professionals/marcus-vance-plumbing
    Then I see Marcus's verified status badge, bio, years of experience, and service area
    And I see an itemized pricing list including the standard diagnostic fee
    And I see a list of authentic customer reviews with timestamps and ratings
    And I have an accessible "Book Appointment" button that launches the booking flow
  ```

### US-CUST-03: Multi-Step Booking Flow
* **User Story**: *As a customer*, I want to schedule a specific appointment slot and review an estimated price breakdown, *so that I have full clarity on expected arrival and costs before committing.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Completing a demo booking flow
    Given I click "Book Appointment" on a professional profile
    When Step 1: I describe my issue as "Kitchen sink leak under cabinet"
    And Step 2: I select an available date and morning time slot
    And Step 3: I review the sample diagnostic estimate ($65 inspection fee + hourly rate)
    And Step 4: I click "Confirm Demo Booking"
    Then the dialog renders a success confirmation with reference code "DEMO-BOOK-xxxx"
    And a clear disclaimer states "This is a demonstration; no real technician was booked"
    And the booking is saved to my demo customer dashboard
  ```

---

## 3. Service Professional Epics & Stories

### US-PRO-01: Real-Time Availability Management
* **User Story**: *As an independent electrician*, I want to toggle my availability status between "Available Today" and "Off Duty" in one click, *so that I only receive requests when I am actively able to take jobs.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Toggling availability in worker dashboard
    Given I am on the /worker/dashboard page
    When I click the availability switch
    Then the UI updates immediately to "Available Today" (or "Off Duty")
    And the change is confirmed via an accessible toast notification
    And search results reflect my current availability status
  ```

### US-PRO-02: Job Request Review and Response
* **User Story**: *As a service technician*, I want to view incoming job requests with location, issue photos, and requested times, *so that I can decide whether to accept or decline based on my schedule.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Accepting a job request
    Given I have a pending job card in my worker dashboard
    When I click "Accept Request"
    Then the card status transitions to "Confirmed"
    And a toast explains "Demo request accepted (no external notification sent in Phase 1)"
  ```

---

## 4. Administration & Support Epics & Stories

### US-ADMIN-01: Professional License & Credential Verification
* **User Story**: *As a platform compliance officer*, I want to review submitted trade licenses and identity documents in an administrative queue, *so that only legitimate, insured technicians receive the "Verified" platform badge.*
* **Acceptance Criteria**:
  ```gherkin
  Scenario: Approving a professional verification application
    Given an unverified professional has submitted trade license #PL-98214
    When I verify the license with state municipal database and click "Approve"
    Then the professional profile record is updated to "status: VERIFIED"
    And the verified checkmark badge appears on their public directory profile
    And an audit log entry records the compliance officer ID, timestamp, and document hash
  ```

---

## 5. Related Documentation
* [Product Requirements](file:///docs/product/PRODUCT-REQUIREMENTS.md)
* [User Journeys](file:///docs/product/USER-JOURNEYS.md)
* [Route and Page Inventory](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md)
* [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md)
