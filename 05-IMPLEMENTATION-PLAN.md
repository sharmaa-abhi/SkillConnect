# 05 — Implementation Plan and Architecture

## Before changing code

1. Inspect repository files, existing framework, `package.json`, routes, styles, and available assets.
2. Preserve current working configuration. Avoid reinstalling everything when suitable dependencies already exist.
3. Identify the package manager from the lockfile and use it consistently.
4. If no app exists, scaffold a Next.js App Router + TypeScript + Tailwind application using the current official `create-next-app` defaults.

## Recommended dependencies

- Next.js App Router and React with TypeScript.
- Tailwind CSS for styling.
- `motion` for animation, imported from `motion/react`.
- `lucide-react` for icons.
- Use an existing component library if the repository already has one and it fits the design. Avoid introducing a full UI system solely for basic buttons/dialogs.

Do not add a backend, database, payment library, authentication service, maps integration, or AI API during this phase.

## Suggested structure

Adapt this structure to the existing repository rather than forcing a rewrite:

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    services/
      page.tsx
    professionals/
      page.tsx
      [slug]/
        page.tsx
    login/
      page.tsx
    register/
      page.tsx
    customer/
      dashboard/
        page.tsx
    worker/
      dashboard/
        page.tsx
    not-found.tsx
  components/
    layout/
      site-header.tsx
      site-footer.tsx
      mobile-nav.tsx
    home/
      hero.tsx
      service-categories.tsx
      featured-professionals.tsx
      how-it-works.tsx
    professionals/
      professional-card.tsx
      professional-filters.tsx
      professional-profile.tsx
    booking/
      booking-flow.tsx
      booking-confirmation.tsx
    forms/
      text-field.tsx
    ui/
      button.tsx
      badge.tsx
      empty-state.tsx
      toast.tsx
  data/
    services.ts
    professionals.ts
    bookings.ts
  lib/
    formatters.ts
    search.ts
    demo-storage.ts
    motion-variants.ts
  types/
    index.ts
public/
  images/
```

This is a suggested architecture, not a demand to duplicate files if the current project already has an equivalent structure.

## Component and rendering strategy

- Keep static page structure in Server Components by default.
- Use Client Components for filters, dialogs, favorites, forms, menu state, dashboard toggles, and browser persistence.
- Do not access `window`, `document`, or `localStorage` during server rendering. Use effects or safe client-only utilities.
- Avoid hydration mismatch by giving the server and first client render the same initial output.
- Use semantic HTML and typed props.
- Keep sample content separate from page markup.
- Reuse card, section heading, button, field, badge, and layout patterns.
- Keep animation variants centralized if used in multiple components.

## Implementation order

1. Foundation: global styles, design tokens, root layout, font, metadata, header/footer, container, buttons, inputs, and responsive shell.
2. Data: typed mock service categories, professional profiles, reviews, prices, and booking samples.
3. Home page: hero, search, popular services, featured professional cards, how-it-works, trust/price section, worker CTA, footer.
4. Directories: `/services`, `/professionals`, filtering/search/sort, loading/empty states.
5. Profile details: dynamic slug route, sample profile content, favorites, demo booking launch.
6. Booking flow: multi-step state, validation, final confirmation, optional local demo history.
7. Forms and dashboards: login/register demo behavior, customer dashboard, worker dashboard and availability toggle.
8. Motion and responsive polish: reduced motion, mobile menu/drawer, transitions, all screen sizes.
9. Quality checks: lint, type checking, build, route audit, interaction audit, responsive check.

## Quality gates

At the end of each phase, ensure the app still runs. Don't wait until all pages are built to discover foundational configuration problems.

- No missing route destinations from primary UI.
- No React key warnings or hydration errors.
- No unhandled runtime errors.
- No horizontal overflow at narrow widths.
- No sensitive values written to localStorage.
- No claims that a demo booking/authentication/verification is real.
- No TypeScript or lint errors caused by the implementation.

## Final response expected from the coding agent

At completion, report:

- Implemented routes and interactions.
- Main components and mock data files created.
- Packages added, if any.
- Exact local run command and URL.
- Commands run for lint/type-check/build and their results.
- Any remaining limitations, especially interactions that require a future backend.
