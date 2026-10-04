# 06 — Quality and Acceptance Checklist

The build is considered complete only when the applicable items below have been verified.

## Product and content

- [ ] Brand reads SkillConnect and the product purpose is immediately understandable.
- [ ] Homepage explains how customers find and compare professionals.
- [ ] Core customer flow works from home/search through profile and demo booking confirmation.
- [ ] Worker-facing call-to-action and worker dashboard communicate the supply-side value.
- [ ] Mock data is consistent across homepage, listings, profiles, and dashboards.
- [ ] Sample reviews, prices, ratings, badges, and bookings are not presented as independently verified facts.
- [ ] No lorem ipsum, empty decorative sections, or misleading guarantees.

## Visual quality

- [ ] Consistent design tokens for colors, typography, spacing, shadows, radii, and button sizes.
- [ ] Strong headline and search area above the fold.
- [ ] Image styles and crop ratios are consistent.
- [ ] All card grids align and have clear hierarchy.
- [ ] Section lengths, gutters, and vertical rhythm are deliberate.
- [ ] Hover, focus, pressed, disabled, selected, and error states are consistent.
- [ ] No broken images, overflow, accidental overlaps, or unstyled elements.
- [ ] Interface feels cohesive on all required routes, not only the homepage.

## Routes and navigation

- [ ] `/` loads correctly.
- [ ] `/services` loads and search/filter controls work.
- [ ] `/professionals` loads and search/filter/sort controls work.
- [ ] Valid `/professionals/[slug]` routes show profile data.
- [ ] Invalid profile slug shows graceful not-found UI.
- [ ] `/login` and `/register` validate locally and show honest demo feedback.
- [ ] `/customer/dashboard` shows usable sample data and appropriate empty states.
- [ ] `/worker/dashboard` has functioning demo controls.
- [ ] Not-found route has working navigation back to the site.
- [ ] Header, footer, category links, CTA buttons, cards, and back actions don't lead to dead ends.

## Frontend interaction

- [ ] Search works with Enter and button click.
- [ ] Filters and sorting change results; clear-all resets them.
- [ ] Favorite toggles selected state and remains coherent across relevant views if persistence is used.
- [ ] Demo booking validates each step and shows a confirmation.
- [ ] Confirmation plainly states no real appointment was booked.
- [ ] Forms never persist entered passwords.
- [ ] Mobile navigation, filter drawer, dialogs, and toasts can be opened and closed.
- [ ] Escape closes suitable overlay UI.
- [ ] Keyboard users can reach every action and see focus clearly.
- [ ] No buttons are decorative/inert without an intentional disabled state.

## Responsive behavior

- [ ] Review approximately 360px, 390px, 768px, 1024px, and 1440px viewports.
- [ ] No horizontal page scrollbar on narrow screens.
- [ ] Text doesn't clip or wrap awkwardly into narrow columns.
- [ ] Header and menus fit mobile screens.
- [ ] Search forms and filters remain usable on touch screens.
- [ ] Cards and detail layouts reflow rather than becoming miniature desktop layouts.
- [ ] Fixed or sticky controls do not hide important content or buttons.

## Motion and accessibility

- [ ] Entrance animations are brief and do not delay interaction.
- [ ] Hover and layout animations do not produce layout shifts or disorienting scaling.
- [ ] Reduced-motion preference is respected.
- [ ] Semantic landmarks and logical heading structure exist.
- [ ] Inputs have persistent labels and associated error messages.
- [ ] Icon-only buttons have accessible names.
- [ ] Dialogs/drawers have names, close controls, sensible focus handling, and keyboard support.
- [ ] Statuses don't rely only on color.
- [ ] Images have appropriate alt text; decorative images have empty alt text.

## Code health

- [ ] No implementation-caused TypeScript errors.
- [ ] No implementation-caused lint errors.
- [ ] Production build succeeds if dependencies/environment allow.
- [ ] No hydration errors or unhandled console exceptions in tested paths.
- [ ] No secret keys or credentials included.
- [ ] No real API or backend integration has been accidentally added.
- [ ] Browser storage is guarded and handles parse/availability errors.
- [ ] Relevant commands and their results are stated honestly in the completion summary.
