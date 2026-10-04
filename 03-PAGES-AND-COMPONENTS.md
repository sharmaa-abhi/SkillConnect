# 03 — Pages, Routes, and Components

Use the existing app router conventions if present. For a new project, use `src/app/` and `src/components/` where appropriate.

## Required routes

### `/` — Home

- Responsive header and footer.
- Clear hero headline, explanatory copy, service search, optional location input, and popular category chips.
- Curated hero-side visual: a featured professional profile card, sample booking preview, or locally created composition.
- Service category section.
- Featured professional cards.
- Short “How it works” section.
- Trust and transparent pricing section.
- Call-to-action for service professionals.
- Optional FAQ using accessible disclosure controls.

### `/services` — Services directory

- Page title and short helper text.
- Search field.
- Category cards/list.
- Filter by category and optional sample price range.
- Empty state with “clear filters.”
- Links from each service to related professionals.

### `/professionals` — Professional directory

- Search by worker name, service, or locality in mock data.
- Filters: service category, minimum rating, available today, and sample price range.
- Sort: recommended, highest rated, price low-to-high.
- Active filter chips and clear-all control.
- Responsive card grid and count of matching sample results.
- Empty state for no matches.

### `/professionals/[slug]` — Professional profile

- Profile hero with image, name, specialty, service area, sample rating, and a clearly demo-only status/trust badge.
- Bio, skills, services offered, experience, sample starting price, service hours, and sample reviews.
- Desktop booking panel; mobile sticky booking action only if it does not cover other controls.
- Favorite button.
- “Book a demo appointment” action launching a dialog/drawer or navigating through booking steps.
- Related professionals section.
- Handle unknown slug with a proper not-found state.

### `/login` — Sign in prototype

- Calm, minimal split layout or centered panel that matches the brand.
- Email and password inputs, field-level validation, visibility toggle if included, remember-me only if its demo behavior is clear, link to register, and helpful demo state.
- On submit, do not authenticate; show a clear demo success notice and an obvious route to sample customer/worker dashboards.
- Never store the entered password.

### `/register` — Create account prototype

- Choose customer or professional account type.
- Name, email, password, and confirmation fields; show accessible validation.
- For professional account, optionally collect service category in demo form.
- Submit gives demo feedback only; no account is created on a server.
- Never store the entered password or claim the account is live.

### `/customer/dashboard` — Customer demo dashboard

- Greeting using sample identity, dashboard summary cards, upcoming/recent demo bookings, favorite professionals, and links to find services.
- Provide helpful empty states when relevant.
- If bookings persist in localStorage, hydrate safely and provide seed data fallback.

### `/worker/dashboard` — Worker demo dashboard

- Sample profile completion/status card, availability toggle, sample job request cards, and recent reviews.
- Availability toggle should visibly update state.
- Actions such as “Accept request” should only change demo UI state and clearly indicate that no real customer/job is involved.
- Provide a link to edit the demo profile if supported.

### `not-found`

- Branded, friendly not-found page with navigation home and service discovery.

## Shared components

Create a reusable component system rather than duplicating markup:

- `SiteHeader`, `MobileNav`, `SiteFooter`
- `Container`, `SectionHeading`, `PageHeading`, `Eyebrow`
- `Button` variants or shared button styles
- `ServiceSearch`, `LocationField` (mock location only), `CategoryChip`, `ServiceCategoryCard`
- `ProfessionalCard`, `ProfessionalGrid`, `RatingDisplay`, `PriceLabel`, `SampleStatusBadge`, `FavoriteButton`
- `FilterSidebar` / `MobileFilterDrawer`, `SortSelect`, `ActiveFilterChips`, `EmptyState`
- `BookingDialog` or `BookingFlow`, `BookingStepIndicator`, `BookingConfirmation`
- `TextField`, `SelectField`, `FormError`, `Toast` (use appropriate existing component patterns if the repo already has them)
- `DashboardShell`, `StatCard`, `BookingListItem`, `JobRequestCard`
- `SectionReveal` or a small set of reusable motion variants where it improves consistency

Don't create a component for every one-off wrapper. Keep components cohesive and easy to test.

## Typed mock data

Put data in one or more files such as `src/data/services.ts`, `src/data/professionals.ts`, and `src/data/bookings.ts`.

Each professional should include fields such as:

- `id`, `slug`, `name`, `profession`, `category`, `bio`, `serviceArea`, `experienceYears`
- `rating`, `reviewCount`, `startingPrice`, `priceUnit`
- `skills`, `servicesOffered`, `availability` or `availableToday`
- `image` (local asset or reliable configured source)
- `reviews` with reviewer label, date label, rating, and concise sample comment
- `isDemo: true` or another typed marker so data is recognized as illustrative

All pricing and review examples are for demonstration. Avoid real phone numbers, personal addresses, and claims of actual verification.
