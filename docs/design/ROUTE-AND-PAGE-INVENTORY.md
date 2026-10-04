# Route and Page Inventory — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-DSGN-002` |
| **Status** | Approved |
| **Owner** | Lead Frontend Architect |
| **Target Audience** | Frontend Developers, QA Engineers, UI Designers |
| **Last Updated** | October 2026 |

---

## 1. Route Inventory Matrix

| Route URL | Page Name | Primary Objective | Rendering Target | Auth Required |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Homepage | Brand introduction, instant search, trust, and category navigation | Server Component (Client Islands) | Public |
| `/services` | Services Catalog | Service category explorer and sub-service breakdown | Server Component + Client Filters | Public |
| `/professionals` | Professional Directory | Search, filter, and compare service technicians | Client Component (Interactive State) | Public |
| `/professionals/[slug]` | Professional Profile | Technician deep dive, reviews, rates, and booking launch | Server Page + Client Booking Dialog | Public |
| `/login` | Sign In Portal | User authentication with field-level validation and demo state | Client Component | Public |
| `/register` | Registration Portal | Account creation for Customer and Pro roles with validation | Client Component | Public |
| `/customer/dashboard` | Customer Dashboard | Manage active bookings, view history, and access saved pros | Client Component (LocalStorage Hydration)| Demo Session |
| `/worker/dashboard` | Worker Dashboard | Toggle availability, review job requests, inspect metrics | Client Component (Stateful) | Demo Session |
| `/not-found` | 404 Error Recovery | Graceful recovery page with search and category shortcuts | Server Component | Public |

---

## 2. Detailed Page Specifications

### 2.1 `/` — Homepage
* **Header**: Sticky brand header, logo, navigation links, Sign In, and "Join as a Pro" CTA.
* **Hero Section**:
  * Left: Bold H1 ("Find trusted help. Book confidently."), supporting subhead, dual search inputs (Service Query + Location/Postal Code), quick-filter category chips (Plumbing, Electrical, Cleaning, etc.).
  * Right: Curated professional card collage featuring verified badges, sample rating card, and sample booking confirmation pill.
* **Service Categories Section**: 7 high-impact service cards with icons, service description, and starting price indicator.
* **Featured Professionals Grid**: 3–4 rich profile cards showing portrait photo, trade name, verified badge, rating star with count, starting hourly rate, and "View Profile" CTA.
* **How It Works**: 4-step progressive timeline: (1) Search & Filter, (2) Compare Profiles, (3) Book with Transparent Estimates, (4) Get Work Done & Sign Off.
* **Trust & Transparency Strip**: Highlighting verified identity badges, escrow payment protection, and transparent diagnostic pricing.
* **Worker Call-to-Action**: High-contrast banner inviting local tradespeople to grow their business with zero lead fees.
* **Global Footer**: Categorized links, compliance statements, prototype disclaimer.

### 2.2 `/services` — Services Directory
* **Page Header**: Title ("Browse Local Services"), explanatory subtitle, and quick search input.
* **Category Card Grid**: Expansive cards for Plumbing, Electrical Work, Carpentry, Painting, Cleaning, HVAC, and Appliance Repair.
* **Service Details**: Each card lists common jobs (e.g., "Leak repair, pipe replacement, drain unclogging") and indicative starting rates.
* **Action**: Direct navigation to `/professionals?category=[category]`.

### 2.3 `/professionals` — Professional Directory
* **Layout**: Two-column layout on desktop (Sticky Left Filter Sidebar + Right Results Grid); single-column on mobile with a Floating Filter Drawer button.
* **Controls**:
  * Search Bar: Full-text search matching name, specialty, and neighborhood.
  * Category Dropdown / Pills.
  * Rating Filter: All, 4.0+ Stars, 4.5+ Stars.
  * Availability Toggle: "Available Today".
  * Price Range Filter: Selectable budget tiers.
  * Sorting Dropdown: "Recommended", "Highest Rated", "Price: Low to High".
  * Active Filter Chips with individual dismiss and "Clear All" control.
* **Results Area**: Result count badge (e.g., "Showing 8 trusted professionals"), responsive card grid, and polished empty state for zero matches with "Reset Filters" action.

### 2.4 `/professionals/[slug]` — Professional Profile
* **Profile Header**: Technician photo, verified trade checkmark, name, trade specialty, years in business, service area list, favorite toggle button.
* **Content Tabs / Sections**:
  * *About & Bio*: Detailed background, craftsmanship philosophy, and certifications.
  * *Services & Transparent Pricing*: Itemized table of standard services, diagnostic fee, and hourly rates.
  * *Availability & Working Hours*: Weekly schedule table.
  * *Customer Reviews*: Verified review score breakdown (5-star distribution), review cards with timestamps, customer comments, and pro responses.
* **Sticky Booking Panel (Desktop)**: Card with diagnostic fee summary, next available slot, and prominent "Book Appointment" CTA button.
* **Related Professionals Carousel**: 3 alternative top-rated pros in the same category.
* **Dynamic Routing Guard**: If slug does not match mock/database records, renders custom in-page 404 recovery state.

### 2.5 `/customer/dashboard` — Customer Dashboard
* **Header**: Welcome banner ("Welcome back, Sarah"), quick stats (Total Bookings, Saved Pros, Open Issues).
* **Navigation Tabs**:
  * *Upcoming Bookings*: Displays active cards with scheduled time, pro details, address, and demo actions ("Reschedule", "Cancel").
  * *Past Bookings*: Completed jobs with "Leave Review" and "Book Again" actions.
  * *Saved Favorites*: Grid of favorited professional cards.
* **Empty States**: Friendly empty states with direct links to `/services` when no bookings or favorites exist.

### 2.6 `/worker/dashboard` — Worker Dashboard
* **Header**: Professional status card with photo, trade, and interactive Availability Switch ("Available Today" vs "Off Duty").
* **Key Metrics Cards**: Lifetime Jobs Completed, Overall Rating (e.g., 4.9/5), Monthly Earnings, Response Time.
* **Pending Job Requests**: Cards displaying incoming customer issues with photo thumbnails, requested timeslot, and "Accept" / "Decline" buttons.
* **Schedule Calendar**: Weekly timeline view of accepted jobs.

### 2.7 `/login` and `/register`
* **Sign In (`/login`)**:
  * Form: Email field, Password field (with accessible show/hide toggle), "Remember me" checkbox, Sign In button.
  * Demo Mode Notice: Clearly states that credentials are for demonstration and not stored.
  * Quick Demo Role Fill: One-click buttons to populate sample "Customer Demo" or "Worker Demo" credentials.
* **Registration (`/register`)**:
  * Role Switcher: Tabs for "I need home services" (Customer) and "I am a service professional" (Worker).
  * Fields: Full Name, Email, Password, Confirm Password; Worker role includes Category selection and Phone Number.
  * Form validation: Immediate inline error feedback on invalid email or mismatched passwords.

### 2.8 `/not-found` — Custom 404 Recovery Page
* **Visual**: Clean illustration, prominent H1 ("We couldn't find that page").
* **Recovery Actions**: Search input, quick links to top service categories, and a primary "Return to Homepage" button.

---

## 3. Related Documentation
* [Information Architecture](file:///docs/design/INFORMATION-ARCHITECTURE.md)
* [Frontend Requirements](file:///docs/design/FRONTEND-REQUIREMENTS.md)
* [UI Design System](file:///docs/design/UI-DESIGN-SYSTEM.md)
