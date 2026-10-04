# API Contract Specification — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-ARCH-005` |
| **Status** | Approved |
| **Owner** | Lead Backend Architect |
| **Target Audience** | Backend Developers, Frontend Developers, QA Engineers |
| **Last Updated** | October 2026 |

---

## 1. Global Conventions & Standards

* **Base URL**: `/api/v1`
* **Transport**: HTTPS with TLS 1.3 enforced
* **Content-Type**: `application/json` (UTF-8)
* **Authentication**: Bearer JWT in `Authorization` header or secure `HttpOnly` session cookie (`skillconnect_session`)
* **Standard Error Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "SLOT_ALREADY_RESERVED",
      "message": "The selected appointment slot has just been reserved by another customer.",
      "details": [
        { "field": "startTime", "issue": "Conflict with existing booking" }
      ],
      "requestId": "req_01HPX7K9V4"
    }
  }
  ```

---

## 2. API Endpoints Catalog

### 2.1 Catalog & Discovery

#### `GET /api/v1/professionals`
* **Purpose**: Query directory of service professionals with filters and sorting.
* **Access**: Public (Unauthenticated Visitor, Customer, Pro)
* **Query Parameters**:
  * `category` (optional, string): e.g., `"plumbing"`
  * `location` (optional, string): postal code or neighborhood
  * `minRating` (optional, number): e.g., `4.5`
  * `availableToday` (optional, boolean): e.g., `true`
  * `sort` (optional, string): `"recommended" | "rating" | "price-asc"`
  * `page` (integer, default 1), `limit` (integer, default 20)
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "totalResults": 14,
      "page": 1,
      "totalPages": 1,
      "items": [
        {
          "id": "pro_981a2b",
          "slug": "marcus-vance-plumbing",
          "name": "Marcus Vance",
          "businessName": "Vance Master Plumbing",
          "profession": "Master Plumber",
          "category": "plumbing",
          "portraitImageUrl": "/images/pros/marcus-vance.webp",
          "rating": 4.95,
          "reviewCount": 142,
          "startingHourlyRate": 8500,
          "diagnosticFee": 6500,
          "availableToday": true,
          "verifiedStatus": "VERIFIED",
          "serviceAreas": ["Mission District", "SoMa", "94107", "94110"]
        }
      ]
    }
  }
  ```

#### `GET /api/v1/professionals/:slug`
* **Purpose**: Retrieve complete technician profile, itemized services, working hours, and reviews.
* **Access**: Public
* **Response (200 OK)**: Complete `ProfessionalDetail` object.
* **Response (404 Not Found)**: Profile slug does not exist.

---

### 2.2 Booking Operations

#### `POST /api/v1/bookings`
* **Purpose**: Initiate a booking request and reserve time slot.
* **Access**: Customer (`ROLE_CUSTOMER`)
* **Request Body**:
  ```json
  {
    "professionalId": "pro_981a2b",
    "serviceId": "srv_plumb_01",
    "scheduledStartTime": "2026-10-15T10:00:00Z",
    "issueDescription": "Kitchen sink pipe leaking under the garbage disposal unit.",
    "serviceAddress": {
      "streetAddress": "742 Evergreen Terrace, Apt 4B",
      "postalCode": "94107",
      "city": "San Francisco",
      "state": "CA"
    },
    "paymentMethodId": "pm_1PqR4x..."
  }
  ```
* **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "bookingId": "bk_9801",
      "referenceCode": "SC-2026-9801",
      "status": "CONFIRMED",
      "scheduledStartTime": "2026-10-15T10:00:00Z",
      "diagnosticFeeCents": 6500,
      "holdAuthorizedCents": 15000,
      "message": "Appointment confirmed. Professional dispatched on schedule."
    }
  }
  ```

#### `PATCH /api/v1/bookings/:id/status`
* **Purpose**: Transition booking lifecycle state (En Route, Arrived, Complete, Cancel).
* **Access**: Professional, Customer, or Admin (RBAC enforced per state transition).
* **Request Body**:
  ```json
  {
    "action": "COMPLETE_JOB",
    "finalLaborCents": 8500,
    "partsCents": 2400,
    "customerSignatureProofUrl": "https://storage.skillconnect.com/proofs/sig_8812.png"
  }
  ```

---

### 2.3 Worker Dashboard Operations

#### `PATCH /api/v1/worker/availability`
* **Purpose**: Real-time toggle of technician availability.
* **Access**: Professional (`ROLE_PROFESSIONAL`)
* **Request Body**:
  ```json
  {
    "availableToday": true
  }
  ```
* **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "availableToday": true,
      "updatedAt": "2026-10-04T17:15:00Z"
    }
  }
  ```

---

## 3. Related Documentation
* [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
* [Data Model and Relationships](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md)
* [Booking Lifecycle and Business Rules](file:///docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md)
* [Authentication and Authorization](file:///docs/architecture/AUTHENTICATION-AND-AUTHORIZATION.md)
