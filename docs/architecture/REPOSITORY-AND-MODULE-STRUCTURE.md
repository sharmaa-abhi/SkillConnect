# Repository and Module Structure — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-ARCH-003` |
| **Status** | Approved |
| **Owner** | Lead Full-Stack Architect |
| **Target Audience** | All Developers, Coding Agents, QA Engineers |
| **Last Updated** | October 2026 |

---

## 1. Directory Tree & Architectural Layout

SkillConnect adheres to standard Next.js App Router conventions with strong modular encapsulation under `src/`:

```text
skillconnect/
├── docs/                        # Complete SaaS Markdown specifications
│   ├── product/                 # Strategy, requirements, personas, roadmaps
│   ├── design/                  # Design system, pages, motion, a11y
│   ├── architecture/            # Technical architecture, DB, APIs, integrations
│   ├── security/                # Threat model, RBAC, verification, privacy
│   ├── policies/                # Terms, cancellations, cookies, safety
│   ├── operations/              # CI/CD, environments, testing, support playbooks
│   └── project/                 # Governance, changelog, audit, ADRs
├── public/                      # Static assets
│   ├── images/                  # Service photography, portraits, category icons
│   └── favicon.ico              # Platform favicon
├── src/
│   ├── app/                     # Next.js App Router routes and pages
│   │   ├── layout.tsx           # Global Root Layout (Header, Footer, ToastProvider)
│   │   ├── page.tsx             # Homepage (Hero, Categories, Featured Pros)
│   │   ├── globals.css          # Tailwind CSS directives & CSS custom properties
│   │   ├── not-found.tsx        # Custom 404 Recovery Page
│   │   ├── services/
│   │   │   └── page.tsx         # Services Directory page
│   │   ├── professionals/
│   │   │   ├── page.tsx         # Professional Directory & multi-filter catalog
│   │   │   └── [slug]/
│   │   │       └── page.tsx     # Dynamic Professional Profile page
│   │   ├── login/
│   │   │   └── page.tsx         # Sign In authentication page
│   │   ├── register/
│   │   │   └── page.tsx         # Account registration page (Customer vs Pro)
│   │   ├── customer/
│   │   │   └── dashboard/
│   │   │       └── page.tsx     # Customer bookings & saved favorites
│   │   └── worker/
│   │       └── dashboard/
│   │           └── page.tsx     # Worker schedule, requests & availability
│   ├── components/              # Modular UI components
│   │   ├── layout/              # SiteHeader, SiteFooter, MobileNav, Container
│   │   ├── home/                # Hero, ServiceCategories, FeaturedPros, HowItWorks
│   │   ├── professionals/       # ProfessionalCard, FilterSidebar, RatingDisplay
│   │   ├── booking/             # BookingFlowDialog, StepWizard, BookingConfirmation
│   │   ├── dashboard/           # BookingListItem, JobRequestCard, StatCard
│   │   ├── forms/               # TextField, SelectField, AvailabilitySwitch
│   │   └── ui/                  # Button, Badge, Toast, EmptyState, Dialog
│   ├── data/                    # Typed mock datasets (Phase 1)
│   │   ├── services.ts          # Category definitions, icons, descriptions
│   │   ├── professionals.ts     # Realistic technician profiles, reviews, rates
│   │   └── bookings.ts          # Sample customer and worker booking items
│   ├── lib/                     # Shared utilities and helpers
│   │   ├── formatters.ts        # Currency, date, telephone, rating formatters
│   │   ├── search.ts            # Client-side multi-attribute search and filter engine
│   │   ├── demo-storage.ts      # Guarded LocalStorage hydration for favorites/bookings
│   │   └── motion-variants.ts   # Centralized Motion for React animation presets
│   └── types/                   # TypeScript interfaces and domain schemas
│       ├── service.ts           # Service & Category interfaces
│       ├── professional.ts      # ProfessionalProfile, Review, Pricing interfaces
│       ├── booking.ts           # BookingRequest, BookingState, Estimate interfaces
│       └── index.ts             # Barrel export of all domain types
├── package.json                 # Dependency manifest
├── tsconfig.json                # TypeScript compiler configuration (@/* alias)
├── tailwind.config.ts           # Tailwind CSS theme extensions
└── README.md                    # Root project documentation gateway
```

---

## 2. Module Responsibilities & Coding Rules

### 2.1 Server Components vs. Client Components Boundary
* **Rule**: Files are Server Components by default. Add `'use client';` only at the top of leaf components requiring:
  * React hooks (`useState`, `useEffect`, `useReducer`, `useCallback`).
  * Browser API access (`localStorage`, `window.matchMedia`).
  * Event handlers (`onClick`, `onChange`, `onSubmit`).
  * Framer Motion interactive animations.
* **Server Components**: Keep page wrapper layouts, static copy blocks, and SEO metadata in Server Components to ensure zero client JavaScript overhead.

### 2.2 Import Alias Standard
* Always use the `@/*` alias mapped to `./src/*` in `tsconfig.json`.
* Example:
  ```typescript
  import { SiteHeader } from '@/components/layout/site-header';
  import { professionals } from '@/data/professionals';
  import type { ProfessionalProfile } from '@/types';
  ```

### 2.3 Mock Data Integrity (`src/data/`)
* Mock data must be strongly typed and declared with `as const` or typed interfaces.
* Avoid dummy placeholder strings (e.g., "Lorem ipsum dolor sit amet"). All technician names, bio descriptions, tool certifications, and neighborhood addresses must reflect realistic trade domain contexts.

---

## 3. Related Documentation
* [System Architecture](file:///docs/architecture/SYSTEM-ARCHITECTURE.md)
* [Technology Stack and Rationale](file:///docs/architecture/TECHNOLOGY-STACK-AND-RATIONALE.md)
* [Development and Code Quality Standards](file:///docs/operations/DEVELOPMENT-AND-CODE-QUALITY-STANDARDS.md)
