# Responsive Design Specifications — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-DSGN-005` |
| **Status** | Approved |
| **Owner** | Lead Frontend Architect |
| **Target Audience** | Frontend Developers, QA Engineers, UI Designers |
| **Last Updated** | October 2026 |

---

## 1. Breakpoint System

SkillConnect is built strictly **mobile-first**, progressively enhancing layout density and multi-column structures across standard Tailwind CSS breakpoints:

| Breakpoint | Min-Width | Target Device Class | Primary Layout Behavior |
| :--- | :--- | :--- | :--- |
| **Base / Mobile** | `< 640px` (tested at 360px & 390px) | iPhone SE, iPhone 14/15, Pixel | Single-column stack, hamburger menu, sticky booking bar, filter bottom-sheet drawer |
| **`sm` (Small Tablet)** | `640px` | Large phones, small tablets | 2-column category grid, inline search bar |
| **`md` (Tablet)** | `768px` | iPad, Android tablets | 2-column pro directory grid, collapsible filter sidebar |
| **`lg` (Laptop/Desktop)** | `1024px` | MacBook Air, standard desktop | Full header navigation, fixed left filter sidebar + 2/3-column pro grid, sticky profile booking panel |
| **`xl` (Wide Desktop)** | `1280px` | 24"+ Monitors | 3-column pro grid, 4-column category grid, max-width container constraints |

---

## 2. Layout Transformation Rules

### 2.1 Navigation & Header
* **Mobile (< 1024px)**:
  * Brand logo on left, compact menu trigger (hamburger icon) on right.
  * Tapping trigger slides in an accessible full-height navigation overlay from right (`max-w-xs`).
  * Closes automatically upon route selection or tapping outside/pressing `Escape`.
* **Desktop (>= 1024px)**:
  * Persistent horizontal navigation links.
  * Right-aligned utility actions ("Sign In" ghost button + "Join as a Pro" primary CTA).

### 2.2 Hero Search Form
* **Mobile (< 768px)**:
  * Search inputs stack vertically: Service Query input on top, Location input below, full-width "Search" button at bottom.
  * Popular category chips wrap horizontally with smooth scroll container or multi-line wrap.
* **Desktop (>= 768px)**:
  * Unified single-row search pill container.
  * Service query on left (flex-1), vertical divider line, Location input (w-64), and primary search button with icon.

### 2.3 Professional Directory Grid & Filters
* **Mobile (< 1024px)**:
  * Sticky or floating "Filters & Sort" button with active badge count.
  * Tapping button opens full-screen or slide-up filter drawer with "Apply Filters" and "Reset" controls.
  * Results grid rendered as a single vertical card stack (`grid-cols-1`).
* **Desktop (>= 1024px)**:
  * Two-column layout: Left column (`w-72 flex-shrink-0`) displays persistent filter sidebar; Right column (`flex-1`) displays 2-to-3 column responsive grid (`grid-cols-2 xl:grid-cols-3`).

### 2.4 Professional Profile & Booking Action
* **Mobile (< 1024px)**:
  * Profile sections stack sequentially: Header -> Bio -> Services/Rates -> Reviews -> Hours.
  * Fixed bottom booking bar: Displays starting price and full-width "Book Appointment" CTA that triggers bottom sheet.
  * Safe-area padding applied at bottom (`pb-24`) to prevent content obstruction.
* **Desktop (>= 1024px)**:
  * Two-column layout: Left area (2/3 width) displays comprehensive profile details; Right area (1/3 width) houses sticky booking card with calendar preview.

---

## 3. Responsive Quality Gates

1. **Zero Horizontal Scroll**: At any viewport width between 360px and 2560px, the page must not produce a horizontal scrollbar (`overflow-x-hidden` on root container).
2. **Touch Targets**: All interactive elements (buttons, links, chips, toggles) must maintain minimum touch targets of `44x44px` on touch viewports.
3. **Typography Scaling**: Headings dynamically scale down on mobile (e.g., Hero Display H1 scales from 44px on desktop to 32px on mobile) to prevent orphan words or awkward line wrapping.

---

## 4. Related Documentation
* [UI Design System](file:///docs/design/UI-DESIGN-SYSTEM.md)
* [Frontend Requirements](file:///docs/design/FRONTEND-REQUIREMENTS.md)
* [Accessibility Requirements](file:///docs/design/ACCESSIBILITY-REQUIREMENTS.md)
