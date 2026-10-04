# 02 — UI Design System

## Art direction

Design a refined local-services product that feels trustworthy, warm, practical, and modern. Think of a carefully art-directed consumer marketplace, not a generic SaaS admin template. The user should understand the service within the first viewport.

## Brand

- Product name: **SkillConnect**
- Tagline: **Find trusted help. Book confidently.**
- Brand attributes: capable, approachable, transparent, reliable, human, local.

## Suggested palette

Use these as design tokens and tune them consistently throughout the interface:

- Ink / primary text: `#172522`
- Deep forest: `#143D35`
- Primary green: `#237A63`
- Bright mint / pale green surface: `#E7F4ED`
- Warm off-white page surface: `#F8F8F4`
- White card surface: `#FFFFFF`
- Body secondary text: `#66716D`
- Border: `#E3E8E3`
- Warm highlight: `#F2B66D`
- Rating star: `#E5A33D`
- Error: a contrast-checked red such as `#B42318`
- Success: a contrast-checked green such as `#16794B`

Use the primary green strategically for key actions and brand anchors. Avoid painting every section green. Maintain readable contrast for all text and controls.

## Typography

- Use a clean UI sans-serif font. Prefer a modern variable font such as Geist or an already configured project font; avoid adding multiple font families without a reason.
- Display heading: bold but not oversized; use tight line height and short, confident line lengths.
- Body: comfortable 16px base size on desktop, with responsive adjustments for mobile.
- Eyebrows and labels: small, well-spaced, and readable rather than faint or tiny.
- Do not use all-caps for long content.

## Layout and spacing

- Use a centered content container, approximately `max-width: 1200–1280px`, with responsive horizontal gutters.
- Base spacing should follow a consistent scale such as 4, 8, 12, 16, 24, 32, 48, 64, 80.
- Desktop pages should have an intentional vertical rhythm; avoid packing every section together or leaving giant empty gaps.
- Use a strong grid and consistent column alignment across hero, section headings, cards, and footer.
- Header can be sticky if it remains compact and does not obscure content.
- Use section backgrounds sparingly to separate homepage chapters.

## Shape and depth

- Main cards: 16–22px radius.
- Inputs and buttons: 10–14px radius; do not make all rectangles giant pills.
- Pills are suitable for categories, ratings, status, and tags.
- Borders should be subtle but visible.
- Use light, soft shadows for elevation and hover only; don't rely on shadows to define every section.
- Layered hero composition may use a service search panel plus floating booking/profile preview cards, but they must remain aligned and purposeful rather than randomly floating.

## Homepage section order

1. **Announcement/trust strip** (optional, slim; never dominate the page).
2. **Header:** wordmark, primary navigation, sign-in, prominent “Find a professional” CTA.
3. **Hero:** left-side headline and supporting copy; service/location search; popular service chips. Right side: curated professional card collage or booking preview using sample content.
4. **Service categories:** clear icon-led cards for plumbing, electrical, cleaning, carpentry, appliance repair, painting, and more.
5. **Featured professionals:** 3–4 profile cards with image, name, specialty, area, sample rating/review count, sample starting price, and profile link.
6. **How it works:** search, compare, book, review in a short horizontal or responsive step layout.
7. **Trust and transparency:** explain profile information, reviews, and upfront estimates without making unsupported verification guarantees.
8. **Worker CTA:** invite local professionals to create a profile.
9. **FAQ or confidence section:** 3–5 concise useful questions, if it improves the page.
10. **Footer:** grouped navigation, service links, worker links, and prototype/legal note where appropriate.

## Professional cards

Every professional card should have a consistent hierarchy:

- Portrait/service image with consistent aspect ratio and proper crop.
- Name and primary service.
- One short service-area line.
- Rating and sample review count, clearly mock where appropriate.
- Starting price or price range.
- Availability/status label only if it is demo data.
- Favorite control with accessible label and clear selected state.
- Strong “View profile” or “View details” action.

Avoid showing more than 2–3 metadata rows on a small card. Put secondary details on the profile page.

## Forms and controls

- Labels must remain visible; placeholders are not labels.
- Inputs need default, hover, focus, invalid, disabled, and success states where relevant.
- Search should support keyboard submission and a clear action.
- Buttons need a consistent size hierarchy: primary, secondary, ghost, and destructive only where necessary.
- Show validation messages next to relevant fields.
- Focus rings must be visible and not removed.

## Image direction

Use cohesive service photography: natural lighting, real-looking working professionals, realistic tools and homes, and images with a matching color treatment. Keep image aspect ratios and crop positions consistent. Prefer assets that are licensed for the project, generated assets, or locally available assets. Do not rely on unstable third-party image URLs or configure arbitrary remote hosts just to make images load.

If no suitable image assets are available, make a deliberate placeholder system using CSS, subtle color blocks, and iconography. Do not leave broken image icons or random colored rectangles in production-looking layouts.

## Responsive rules

- Start with mobile layout constraints and progressively enhance for wide screens.
- At 360px wide, page content should not overflow horizontally.
- Mobile header: brand, compact menu trigger, and no crowded rows of actions.
- Hero stack order: headline, search form, service chips, visual preview.
- Search form can stack fields vertically on narrow screens; primary button should remain easy to find.
- Directory filter sidebar becomes a drawer or collapsible panel on mobile.
- Card grids should adapt without squashed columns or overly wide content.
- Dialogs become bottom sheets/full-width panels when that improves mobile usability.

## Animation principles

Use Motion for React (`motion` package; import from `motion/react`) and CSS transitions for refined interaction. Animation should guide attention, communicate state, and add polish—not decorate every pixel.

- Hero: brief fade + small vertical movement; stagger headline, copy, search, and visual by a few hundred milliseconds total.
- Cards: subtle hover elevation, image scale of at most a few percent, and soft border/shadow change.
- Viewport reveal: restrained opacity/vertical movement for major sections or card groups, only when appropriate.
- Dialogs and mobile navigation: animate opacity and small transform; provide exit states.
- Filter chips: animate selected state and underline/background changes.
- Booking flow: animate step/content changes without losing focus or keyboard context.
- Avoid long animation delays, infinite motion, autoplay carousels, huge zooms, motion that makes text hard to read, or scroll-jacking.
- Honor `prefers-reduced-motion`; remove/shorten entrance and scroll animations when requested.

## Accessibility basics

- Semantic HTML, proper landmarks, one primary H1 per page, logical heading order.
- Use buttons for actions and links for navigation.
- Accessible names for icon-only controls.
- Keyboard-accessible menus, dropdowns, dialogs, filters, tabs, and forms.
- Respect reduced motion and focus management in dialogs/drawers.
- Do not use color alone for status; add text or an icon.
