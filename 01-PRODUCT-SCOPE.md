# 01 — Product Scope and User Flows

## Product summary

**SkillConnect** is a local-services marketplace concept. It connects people who need household or local services with professionals who offer them. The intended value is easier discovery, clearer comparison, convenient booking, and stronger digital visibility for workers.

**Tagline:** Find trusted help. Book confidently.

## Primary users

### Customer

Needs a local task completed and wants to find an appropriate professional, compare details, understand likely costs, schedule a visit, and review the result.

### Service professional

Wants to show skills and service areas, manage availability, receive leads, and develop an online reputation.

### Platform operator (out of scope for a full admin system in this phase)

Would eventually oversee profiles, safety reports, disputes, and platform quality. In Phase 1, only a basic demo status or placeholder may be included if it supports the prototype.

## Phase 1 goals

- Establish a cohesive frontend and brand identity.
- Make the service-discovery journey understandable and attractive.
- Provide realistic service and professional listings using mock data.
- Demonstrate professional profile details and a frontend-only booking journey.
- Present customer and worker dashboards to show the two-sided nature of the product.
- Provide sign-in and registration screens for future integration.
- Make the whole prototype responsive, keyboard usable, and smooth to navigate.

## Out of scope for Phase 1

- Real accounts, production authentication, OAuth, or password recovery delivery.
- Backend API, database, real-time data, and server-side booking persistence.
- Processing money, payment forms that accept real card data, invoices, or payouts.
- Genuine government-ID checks, background checks, certification checks, or guaranteed insurance/safety protection.
- Real GPS tracking, maps APIs, route optimization, SMS, email, push alerts, or real scheduling integration.
- External AI services. Use a clearly labelled local mock estimate/recommendation rule only if needed for interaction.
- Production analytics, subscription billing, and contractual business partnerships.

## Main customer journey

1. Land on the homepage.
2. Search a service or choose a category.
3. Review a directory and adjust filters/sort order.
4. Open a professional profile.
5. Inspect skills, service details, sample ratings/reviews, availability, and sample pricing.
6. Open a demo booking flow and choose an available date/time.
7. Review a labelled estimate and confirm the demo flow.
8. See a confirmation that explicitly says it is a prototype and no real booking was made.
9. Optionally view the booking in the local demo dashboard.

## Main professional journey

1. Visit the worker call-to-action.
2. Open a demo registration/profile screen.
3. View the sample worker dashboard.
4. Inspect sample job requests and toggle demo availability.
5. Understand that real job requests require future backend integration.

## Product principles

- Trustworthy, not fear-driven.
- Transparent about mock data and prototype limitations.
- Professional workers are presented with dignity and skill, not as generic stock avatars.
- Pricing is described as an estimate or starting price unless it is truly fixed.
- No claim that a professional is truly verified just because a mock profile displays a badge.
- No dead-end buttons or interaction controls without behavior.
- Prioritize the core discovery-to-booking journey over decorative effects.
