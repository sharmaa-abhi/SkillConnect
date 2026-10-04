# MASTER PROMPT — SkillConnect Phase 1 Frontend

You are a senior product designer and senior frontend engineer. Build a polished, production-quality **frontend-only Phase 1 prototype** for **SkillConnect**, a local-services marketplace that connects customers with trusted local service professionals such as electricians, plumbers, carpenters, cleaners, appliance repair technicians, and painters.

Read all Markdown specifications in this pack before coding, especially `01-PRODUCT-SCOPE.md`, `02-UI-DESIGN-SYSTEM.md`, `03-PAGES-AND-COMPONENTS.md`, `04-FRONTEND-INTERACTIONS.md`, `05-IMPLEMENTATION-PLAN.md`, and `06-QUALITY-ACCEPTANCE-CHECKLIST.md`.

## First: inspect the project

1. Inspect the existing repository, `package.json`, current routes, installed dependencies, and established conventions.
2. If an app already exists, improve it in place. Preserve working functionality and avoid replacing files unnecessarily.
3. If the repository is empty, create a Next.js App Router application with TypeScript, Tailwind CSS, ESLint, and the `@/*` import alias.
4. Use the package manager already in the repository. Do not create duplicate apps or nested projects.
5. Do not stop after writing a plan or creating a static mockup. Implement the working frontend, run the available checks, and fix issues.

## Product and scope

Build SkillConnect as a friendly, trustworthy, modern marketplace for local home services. The core customer journey is:

**Search for a service → browse professionals → compare price, rating, distance/area, skills, and availability → open a professional profile → complete a demo booking flow → see a confirmation state.**

Phase 1 includes the website foundation, public landing page, service discovery, professional cards and profiles, frontend-only sign-in/sign-up screens, and simple customer/worker dashboard views. It is a demonstration prototype; all data can be mocked.

**Frontend-only means:**
- No backend server, API routes, Server Actions, database, ORM, real payment provider, maps API, external AI API, or real identity/background checks.
- Do not implement real authentication. Sign-in and registration forms should validate fields locally and show clearly labelled demo feedback only. Never store a real password in localStorage.
- Keep sample data in typed files under `src/data/` (or the repository's existing convention).
- Use browser state for temporary interactions. If persistence improves the demo, store only non-sensitive preferences such as favorites or demo bookings in `localStorage`, with safe client-side hydration and error handling.
- Label all mock prices, professionals, trust badges, reviews, booking outcomes, and estimates as sample/demo content where appropriate. Do not suggest that verification or ratings have been independently confirmed.
- Build extension points for future APIs without actually implementing backend functionality.

## Stack and engineering requirements

- Use **Next.js App Router + React + TypeScript**.
- Use Tailwind CSS for layout and styling. Follow the existing setup if it is already configured.
- Use **Motion for React** (`motion` package; import from `motion/react`) for purposeful entrance, hover, layout, and state-transition animations. Use CSS transitions for simple hover/focus changes.
- Use `lucide-react` for consistent icons. Avoid emoji as interface icons.
- Prefer Server Components by default; add `'use client'` only to components requiring state, browser APIs, or event handlers.
- Use `next/link` for internal navigation and `next/image` for local/remote imagery where correctly configured. Avoid adding unapproved external image hosts that break the build. For remote imagery, either configure approved hosts or use stable local assets/CSS illustrations.
- Create reusable, typed components; avoid huge page files, duplicated card markup, `any`, and unnecessary dependencies.
- Keep TypeScript strict and avoid suppressing lint/type errors.
- Add useful metadata, page titles, and a consistent root layout.

## Art direction

Create a distinctive, premium-but-approachable product—not a generic admin template and not a direct copy of another marketplace.

- Brand: **SkillConnect**
- Tagline: **Find trusted help. Book confidently.**
- Visual tone: clean, reassuring, modern, capable, human, locally relevant.
- Use the design tokens and layout rules in `02-UI-DESIGN-SYSTEM.md`.
- Build a confident editorial hero with a strong headline, concise copy, service search, service-category chips, and a visually rich professional/booking preview.
- Use clear typography, generous whitespace, strong alignment, rounded but not excessively pill-shaped surfaces, subtle borders, restrained shadows, and carefully chosen service imagery.
- Keep contrast high and the content hierarchy obvious. Use consistent spacing, icon sizes, card radii, and button heights.
- Do not use a wall of gradients, excessive glassmorphism, random floating elements, huge empty hero areas, or animations on every item.
- Include thoughtful loading/empty/error/success states where relevant, even if the data is local.

## Required routes and screens

Implement the routes listed in `03-PAGES-AND-COMPONENTS.md`. At minimum provide:

- `/` — full landing page with search, service categories, featured professionals, trust explanation, steps, worker CTA, and footer.
- `/services` — searchable/filterable service directory.
- `/professionals` — searchable/filterable professional directory with sort options.
- `/professionals/[slug]` — profile detail page using mock data and a demo booking action.
- `/login` and `/register` — polished accessible frontend-only forms with validation and demo success feedback.
- `/customer/dashboard` — demo customer dashboard with upcoming/recent bookings and saved professionals.
- `/worker/dashboard` — demo professional dashboard/profile preview with sample job requests and availability controls.
- A graceful not-found page.

If a static route is needed to make a button useful, implement it instead of leaving dead navigation. Do not build unlisted backend functionality.

## Functional interaction requirements

All visible controls must do something appropriate. Implement:

- Header navigation, mobile navigation, active states, and footer links.
- Search by service/professional and relevant empty states.
- Category cards/chips that navigate or filter results.
- Directory filters such as service category, rating, availability, and sample budget range, plus sort order and clear-filters behavior.
- Professional profile navigation, favorite toggles, and sample review display.
- A multi-step demo booking interaction: choose a service/date or time slot, review a clearly labelled sample estimate, submit, then show a confirmation view. Prevent invalid submissions and indicate that nothing is actually booked with a real worker.
- Login/register field validation and demo confirmation; do not persist passwords or claim a real session exists.
- Dashboard tabs/filters and availability toggles where shown.
- Functional mobile menu, dialogs/drawers, toasts, and close controls.
- Visible button pressed/hover/focus states, disabled states, and keyboard interaction.

See `04-FRONTEND-INTERACTIONS.md` for specific behavior.

## Animation requirements

Use animations to make the product feel smooth and intentional:

- Short hero content entrance with reduced stagger.
- Small staggered reveal of category and professional cards when they enter the viewport.
- Subtle card lift and image treatment on hover; avoid scaling that disrupts layout.
- Animated menu, filter panel, dialogs, toasts, and booking-step transitions.
- Light underline/indicator transitions in navigation and filters.
- Respect `prefers-reduced-motion`; disable or greatly reduce non-essential movement.
- Avoid long, blocking intro animations, scroll-jacking, continuously moving backgrounds, and motion that delays access to content.

## Responsive behavior

Design mobile-first and test at approximately 360px, 390px, 768px, 1024px, and 1440px widths.

- No horizontal page overflow.
- Desktop navigation condenses to an accessible mobile menu.
- Search fields and filters stack cleanly on mobile; filters can open in a drawer if needed.
- Card grids adapt naturally: one column on narrow screens, two columns on tablets when space allows, and three or four columns on wide screens where appropriate.
- Tap targets should be comfortably sized and forms should not be cramped.
- Avoid awkward text wrapping, clipped menus, and fixed-width sections.

## Accessibility and quality

- Semantic landmarks, logical heading levels, descriptive labels, keyboard navigation, visible focus, accessible dialog behavior, and meaningful alt text.
- Ensure text and interface contrast; don't convey state through color alone.
- Respect reduced motion and ensure controls work without a mouse.
- Use formatting, stable keys, typed props, reusable data, and meaningful empty states.
- Do not add lorem ipsum. Use realistic, concise product copy.
- Do not show fake live metrics, fake guarantees, or unverified safety claims.

## Required completion behavior

1. Implement the complete Phase 1 frontend, not just the home page.
2. Check all internal navigation and visible interactive elements.
3. Run the project's lint and type-check/build scripts that exist in `package.json`.
4. Fix errors caused by the implementation. Do not hide errors by disabling checks.
5. Verify responsiveness and browser console behavior if browser tools are available. If screenshots/browser testing are not available, clearly state that limitation rather than claiming visual verification.
6. Summarize the files/features created, exact commands to run locally, any checks that passed, and any remaining limitations.

Start by inspecting the repository and then implement the product directly. Make sensible design decisions without pausing for optional clarification.
