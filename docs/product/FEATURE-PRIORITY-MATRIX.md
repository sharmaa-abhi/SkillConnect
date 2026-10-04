# Feature Priority Matrix — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-PROD-007` |
| **Status** | Approved |
| **Owner** | Product Leadership |
| **Target Audience** | Engineering Leads, Product Managers, Stakeholders |
| **Last Updated** | October 2026 |

---

## 1. Prioritization Framework (MoSCoW + RICE)

Features are evaluated using the **MoSCoW** convention (Must-Have, Should-Have, Could-Have, Won't-Have for initial launch) and scored using the **RICE** method (Reach, Impact, Confidence, Effort).

```mermaid
quadrantChart
    title SkillConnect Feature Value vs Complexity Matrix
    x-axis Low Technical Complexity --> High Technical Complexity
    y-axis Low Business Value / Trust --> High Business Value / Trust
    quadrant-1 High-Value Strategic Bets (AI Estimates, PostGIS Search)
    quadrant-2 Quick Wins & Core Essentials (Verified Badges, Transparent Pricing, Booking Flow)
    quadrant-3 Low Priority / Defer (In-app Video, Voice Bot)
    quadrant-4 Maintenance & Niche (Real-time GPS Tracking, Crypto)
    "Verified Badges": [0.25, 0.90]
    "Transparent Pricing": [0.20, 0.85]
    "Multi-step Booking Flow": [0.35, 0.88]
    "Worker Availability Toggle": [0.15, 0.75]
    "PostGIS Geospatial Matching": [0.65, 0.85]
    "Stripe Escrow Split Payments": [0.70, 0.92]
    "AI Vision Scoping": [0.75, 0.80]
    "Real-time GPS Van Tracking": [0.85, 0.30]
    "In-app Video Calls": [0.80, 0.25]
```

---

## 2. Priority Classification Table

| Feature Name | Category | MoSCoW | RICE Score | Target Phase | Implementation Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Brand Landing Page & Editorial Hero** | Discovery | **Must** | 92 | Phase 1 | Complete / Ready |
| **Category & Service Directory** | Discovery | **Must** | 90 | Phase 1 | Complete / Ready |
| **Professional Directory with Multi-Filters** | Discovery | **Must** | 95 | Phase 1 | Complete / Ready |
| **Detailed Professional Profiles with Reviews** | Trust | **Must** | 94 | Phase 1 | Complete / Ready |
| **Multi-Step Booking Flow Modal/Drawer** | Booking | **Must** | 96 | Phase 1 | Complete / Ready |
| **Worker Dashboard with Availability Switch** | Operations | **Must** | 88 | Phase 1 | Complete / Ready |
| **Customer Dashboard with Local Storage** | Operations | **Must** | 86 | Phase 1 | Complete / Ready |
| **PostgreSQL Database & Relational Schema** | Backend | **Must** | 98 | Phase 2 | Planned |
| **Production Authentication & Role-Based Auth** | Security | **Must** | 95 | Phase 2 | Planned |
| **PostGIS Geospatial Radius Matching** | Search | **Should** | 82 | Phase 3 | Planned |
| **Stripe Connect Escrow & Milestone Payouts** | Billing | **Must** | 92 | Phase 4 | Planned |
| **Automated SMS & Email Appointment Reminders** | Comms | **Should** | 84 | Phase 4 | Planned |
| **Third-Party Identity & License Verification** | Trust | **Must** | 89 | Phase 5 | Planned |
| **Admin Dispute & Moderation Portal** | Operations | **Should** | 78 | Phase 5 | Planned |
| **AI Price Estimation & Photo Scoping** | Intelligence | **Could** | 68 | Phase 6 | Planned |
| **Housing Society / B2B Bulk Maintenance** | Commercial | **Could** | 62 | Phase 8 | Future |
| **Real-time GPS Fleet Tracking** | Mobile | **Won't** | 32 | Post-Release | Excluded |
| **In-app Video Diagnostics** | Media | **Won't** | 28 | Post-Release | Excluded |

---

## 3. Related Documentation
* [Product Requirements](file:///docs/product/PRODUCT-REQUIREMENTS.md)
* [MVP and Release Roadmap](file:///docs/product/MVP-AND-RELEASE-ROADMAP.md)
* [Project Scope and Non-Goals](file:///docs/product/PROJECT-SCOPE-AND-NON-GOALS.md)
