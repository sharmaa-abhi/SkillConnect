# Content and UI Copy Guidelines — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-DSGN-008` |
| **Status** | Approved |
| **Owner** | Lead UX Writer & Brand Strategist |
| **Target Audience** | Frontend Developers, Content Designers, Product Managers |
| **Last Updated** | October 2026 |

---

## 1. Brand Voice and Tone

SkillConnect communicates with clarity, competence, and empathy. Our voice balances professional expertise with welcoming local neighborliness.

| Tone Attribute | How We Sound | How We Never Sound |
| :--- | :--- | :--- |
| **Capable & Clear** | Direct, concise, and jargon-free. Explains diagnostic processes simply. | Bureaucratic, hyper-technical, or dismissive. |
| **Reassuring & Transparent** | Upfront about pricing, diagnostic fees, and timing. | Vague, misleading, or evasive about costs. |
| **Dignified & Respectful** | Treats service technicians as master craftspeople and independent entrepreneurs. | Devaluing them as disposable gig workers or anonymous labor. |
| **Honest & Ethical** | Explicit about prototype limitations, mock data, and safety boundaries. | Over-promising "100% crime-free guarantees" or deceptive certifications. |

---

## 2. Terminology & Word Choice Standards

### Approved Terminology
* **"Service Professional"** or **"Technician"** or **"Pro"** (Never: "handyman", "gig worker", "laborer").
* **"Diagnostic Inspection Fee"** (Never: "hidden fee", "call-out penalty").
* **"Sample Estimate"** (Never: "guaranteed final price" before technician on-site evaluation).
* **"Verified Trade License"** (Never: "government certified platform operator").
* **"Customer Review"** (Never: "endorsed testimonial").

---

## 3. UI Copy Templates & Component Strings

### 3.1 Hero & Discovery Copy
* **H1 Headline**: `Find trusted help. Book confidently.`
* **Supporting Body**: `Connect with licensed local plumbers, electricians, carpenters, and repair specialists. Upfront pricing, verified reviews, and guaranteed craftsmanship.`
* **Search Placeholders**:
  * Service Input: `"What do you need help with? (e.g. leaky sink, wiring)"`
  * Location Input: `"Neighborhood or Postal Code (e.g. 94107)"`

### 3.2 Booking Flow & Cost Disclosure
* **Inspection Fee Heading**: `Standard Diagnostic Inspection`
* **Inspection Subtext**: `A standard diagnostic fee applies to evaluate the issue on-site. If you proceed with the recommended repair, this fee is credited 100% toward your labor total.`
* **Demo Confirmation Title**: `Demonstration Booking Confirmed`
* **Demo Disclaimer Notice**: `Notice: SkillConnect is currently operating in demonstration mode. No real technician has been dispatched, and no payment has been processed.`

### 3.3 Worker Call to Action
* **Banner Title**: `Are You a Skilled Local Professional?`
* **Banner Body**: `Stop paying upfront for junk leads. Join SkillConnect to connect with real local clients, manage your schedule, and get paid automatically upon job completion.`
* **Action CTA**: `Create a Free Pro Profile`

### 3.4 Empty & Error States
* **Zero Search Results**:
  * Heading: `No professionals found matching your search`
  * Body: `We couldn't find any professionals matching "[Query]" in this area. Try clearing your filters or exploring our popular trade categories below.`
  * CTA Button: `Reset All Filters`
* **404 Not Found**:
  * Heading: `Page not found`
  * Body: `The link you followed may be broken or the page may have been removed. Let's get you back on track.`
  * CTA Button: `Return to Homepage`

---

## 4. Anti-Deception & Regulatory Guardrails

1. **Badge Honesty**: When rendering verified badges on mock cards, an informative tooltip or note must read: *"Sample profile verification indicator for prototype demonstration."*
2. **No False Guarantees**: Never use terms like "100% Risk Free" or "Completely Vetted by Police" unless backed by verified criminal history APIs in production.
3. **Price Ranges**: Always prefix uninspected costs with *"Starting at"* or *"Estimated Range"*.

---

## 5. Related Documentation
* [UI Design System](file:///docs/design/UI-DESIGN-SYSTEM.md)
* [Route and Page Inventory](file:///docs/design/ROUTE-AND-PAGE-INVENTORY.md)
* [Terms of Service Requirements](file:///docs/policies/TERMS-OF-SERVICE-REQUIREMENTS.md)
