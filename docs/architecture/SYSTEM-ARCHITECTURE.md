# System Architecture — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-ARCH-001` |
| **Status** | Approved (Architecture Baseline) |
| **Owner** | Chief Systems Architect |
| **Target Audience** | All Engineering Teams, DevOps, Security Reviewers |
| **Last Updated** | October 2026 |

---

## 1. High-Level Architecture Overview

SkillConnect is architected as a modern, high-performance web platform built on **Next.js App Router (React 19 / Node.js)**, backed by a managed relational database (**PostgreSQL**) with spatial indexing (**PostGIS**), an in-memory caching and lock layer (**Redis**), object storage (**AWS S3 / Cloudflare R2**), and specialized SaaS integration engines (Stripe Connect, Twilio, Resend).

```mermaid
graph TD
    subgraph Client Layer
        Web["Next.js Web Client (App Router)"]
        MobilePWA["Mobile Responsive Web / PWA"]
    end

    subgraph Edge & API Gateway
        CDN["Vercel Edge Network / Cloudflare CDN"]
        NextServer["Next.js Node.js Server (API Routes / Server Actions)"]
    end

    subgraph Core Platform Services
        AuthService["Auth Engine (NextAuth / JWT / RBAC)"]
        CatalogService["Catalog & Geospatial Matcher"]
        BookingService["Booking State Machine"]
        PaymentService["Stripe Escrow Split Orchestrator"]
        AIService["Multimodal Scoping Engine (LLM Vision)"]
        NotificationService["Async Notification Dispatcher"]
    end

    subgraph Data & Storage Layer
        Postgres[("PostgreSQL 16 (PostGIS)")]
        RedisCache[("Redis 7 (Locks, Sessions, Rate Limits)")]
        S3Bucket[("Private S3 / R2 (Media, Licenses, Proof of Work)")]
    end

    subgraph External Partner Services
        StripeConnect["Stripe Connect (Escrow & KYC)"]
        Persona["Persona / Stripe Identity (ID Check)"]
        TwilioAPI["Twilio (SMS Alerts)"]
        ResendAPI["Resend (Transactional Email)"]
        LLMProvider["Google Gemini / OpenAI Vision"]
    end

    Client Layer --> CDN
    CDN --> NextServer
    NextServer --> Core Platform Services
    Core Platform Services --> Data & Storage Layer
    PaymentService --> StripeConnect
    AuthService --> Persona
    NotificationService --> TwilioAPI
    NotificationService --> ResendAPI
    AIService --> LLMProvider
```

---

## 2. Subsystem Boundaries and Responsibilities

### 2.1 Frontend & Edge Presentation Layer
* **Technology**: Next.js App Router, React 19, TypeScript, Tailwind CSS, Motion for React (`motion/react`).
* **Boundary**: Handles SSR, static generation of marketing pages, client-side interactive forms, local storage persistence for preferences, and UI accessibility.
* **Security Guard**: Never handles secret API keys, service role database tokens, or raw payment card data.

### 2.2 Application & Business Logic Layer (Next.js Server / Node.js)
* **API Handlers & Server Actions**: Validates all incoming requests via `zod` schemas.
* **Booking State Machine**: Enforces strict lifecycle transitions (`REQUESTED` -> `CONFIRMED` -> `IN_PROGRESS` -> `COMPLETED`).
* **Concurrency Engine**: Uses Redis distributed locks (`redlock`) to prevent double-booking of technician time slots.

### 2.3 Data & Persistence Layer
* **Relational Store**: PostgreSQL 16 managed via AWS RDS or Neon.
  * Spatial Queries: PostGIS extension calculates geographic proximity (`ST_DWithin`) between customer coordinates and technician service polygons.
  * ACID Guarantees: Multi-table financial and booking state updates executed within isolated database transactions.
* **Cache & Ephemeral Store**: Upstash Redis / AWS ElastiCache for session tokens, search cache, and rate-limiting counters.
* **Media Storage**: Private S3 buckets with signed URLs for customer issue photos, technician licenses, and job completion proofs.

---

## 3. Data Flow Scenarios

### 3.1 Geospatial Search Flow
1. Client submits Postal Code or Latitude/Longitude to `/api/v1/professionals/search`.
2. Server validates query with Zod.
3. Redis checked for cached query results (`TTL: 120s`).
4. On cache miss, PostgreSQL executes indexed spatial query:
   ```sql
   SELECT p.*, ST_Distance(p.location_geom, ST_SetSRID(ST_Point($lon, $lat), 4326)) AS distance_meters
   FROM professionals p
   WHERE p.is_active = true 
     AND p.verified_status = 'VERIFIED'
     AND ST_DWithin(p.location_geom, ST_SetSRID(ST_Point($lon, $lat), 4326), p.service_radius_meters)
   ORDER BY distance_meters ASC
   LIMIT 20;
   ```
5. Result enriched with aggregated review stars and returned to client.

### 3.2 Escrow Payment Hold & Release Flow
1. Customer initiates booking checkout.
2. Server calls Stripe Connect API to create a `PaymentIntent` with `capture_method: manual` (holding funds without settling).
3. Slot confirmed; booking state updated to `CONFIRMED`.
4. Upon job completion, customer clicks "Sign Off & Release Payment" in dashboard.
5. Server calls Stripe `PaymentIntent.capture()`, automatically transferring 87.5% to technician's connected account and retaining 12.5% platform commission.

---

## 4. Failure Modes & Resilience Patterns

| Failure Scenario | Mitigation / Circuit Breaker Pattern |
| :--- | :--- |
| **PostgreSQL Outage / Read Spike** | Read-replicas handle catalog searches; Redis serves stale cached search results with `stale-while-revalidate`. |
| **Stripe API Timeout** | Webhook reconciliation worker retries via exponential backoff; booking transitions to `PAYMENT_PENDING` until webhook acknowledges. |
| **SMS Gateway Failure (Twilio)** | System falls back to transactional email (Resend) and queues retry in Redis Dead Letter Queue (DLQ). |
| **AI Vision Service Latency** | Client displays 5-second timeout; gracefully falls back to standard category hourly labor ranges. |

---

## 5. Related Documentation
* [Technology Stack and Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md)
* [Data Model and Relationships](file:///docs/architecture/DATA-MODEL-AND-RELATIONSHIPS.md)
* [API Contract Specification](file:///docs/architecture/API-CONTRACT-SPECIFICATION.md)
* [Booking Lifecycle and Business Rules](file:///docs/architecture/BOOKING-LIFECYCLE-AND-BUSINESS-RULES.md)
