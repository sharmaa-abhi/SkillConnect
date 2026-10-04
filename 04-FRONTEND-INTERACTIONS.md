# 04 — Frontend Interactions and Demo State

## General rule

Every visible control must have a clear behavior. If a feature requires a backend, implement a front-end demonstration and label it as a demo rather than pretending the real operation happened.

## Search

- Search should work with Enter and the visible search button.
- Normalize input for matching (case-insensitive, trim whitespace).
- Match service names, service categories, professional names, skills, and mock service areas as appropriate.
- Homepage category chips should lead to the relevant filtered view.
- Empty results should explain that no demo results match and provide a clear-filters action.
- A location field may match a fixed set of sample areas; do not request real geolocation or imply GPS has been used.

## Directory filters and sorting

- Category filter.
- Minimum rating filter.
- “Available today” toggle/filter.
- Optional minimum/maximum price range using mock price values.
- Sort by recommended/sample default, highest rating, and price low-to-high.
- Show active filters and a clear-all action.
- Keep filter values in component state and reflect the actual result list.
- On mobile, use an accessible drawer or expandable filter panel with a clear Apply/Reset behavior.

## Favorites

- Favorite controls toggle selected/unselected state.
- Use a helpful accessible label that changes with state, such as “Save [name] to favorites” / “Remove [name] from favorites.”
- Optionally persist favorite IDs only in localStorage; protect browser access behind client-side logic and handle malformed storage.
- Never persist passwords, identity documents, payment data, or sensitive information.

## Demo booking flow

Use a simple accessible multi-step flow, preferably in a dialog/drawer that works on both desktop and mobile.

### Step 1: Service details

- Professional/service preselected when starting from a profile.
- Optional editable short problem description.
- Clear helper text that this is a frontend demo.

### Step 2: Date and time

- Provide a small set of future demo dates/time slots.
- Prevent selection of unavailable slots.
- Use labels, not color alone, to indicate selected/disabled times.

### Step 3: Estimate and review

- Show the selected professional/service, date/time, a sample starting cost/estimate, and any sample inspection fee if relevant.
- Explicitly call it a “sample estimate” and mention final costs may differ after inspection.
- Do not collect real payment/card details.

### Step 4: Confirmation

- Validate required inputs before continuing.
- Show a confirmation state with a demo reference like `DEMO-1042` (generate stable mock IDs or use a deterministic helper; don't imply this is a real booking reference).
- Clearly state: “Demo only — no real professional has been contacted and no appointment has been booked.”
- A local demo booking can appear in the customer dashboard. Store only non-sensitive booking metadata if localStorage is used.
- Include a “Close” action and an action to browse more professionals.
- Restore focus sensibly when the dialog closes.

## Login / registration

- Validate required fields and basic email format.
- Show field-level errors and an accessible overall status message.
- Password visibility toggle must be keyboard usable and labelled.
- On valid submit, show a “Demo form submitted” state and links to demo dashboards. Do not create a session, call an API, or persist the password.
- Account-type selection should update the form content for Customer vs Professional if supported.

## Dashboard controls

- Sample dashboard tabs or filter buttons should update displayed content.
- Worker availability toggle updates its label and visual state immediately.
- Demo job request actions update local UI only; show a message such as “Demo state updated — this did not notify a customer.”
- Customer booking list reflects the seeded mock data and any demo bookings created during the current browser session/local persistence.

## Toasts, dialogs, and mobile menus

- Toasts should appear after meaningful actions and dismiss automatically only if timing behavior is implemented accessibly; always allow manual close for longer messages.
- Dialogs must have a clear title, close button, sensible focus behavior, and keyboard support.
- Escape closes non-critical dialogs and menus.
- Mobile navigation closes after selecting a route.
- Lock background scrolling while a modal is open if practical; restore it on close.

## Loading, empty, and error states

- Since data is local, don't add fake long loading screens. Use brief skeletons only if they demonstrate a genuine loading transition.
- Provide empty states for filters, no saved professionals, and no bookings.
- Include inline error states for invalid form data and invalid profile slugs.
- Don't use alert boxes as the primary visual interaction; prefer an accessible toast, inline message, or dialog.
