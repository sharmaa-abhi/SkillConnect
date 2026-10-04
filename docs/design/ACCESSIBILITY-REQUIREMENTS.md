# Accessibility Requirements (A11y) — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-DSGN-007` |
| **Status** | Approved |
| **Owner** | Accessibility Specialist & QA Lead |
| **Target Audience** | Frontend Developers, QA Engineers, UI Designers |
| **Last Updated** | October 2026 |

---

## 1. Compliance Standard

SkillConnect adheres strictly to **WCAG 2.1 Level AA** across all public pages, booking flows, authentication forms, and dashboard environments.

---

## 2. Color Contrast Standards

* **Normal Text (< 18pt or < 14pt bold)**: Minimum contrast ratio of **4.5:1** against adjacent background.
* **Large Text (>= 18pt or >= 14pt bold)**: Minimum contrast ratio of **3.0:1**.
* **UI Components & Graphical Objects**: Minimum contrast ratio of **3.0:1** for input borders, interactive icons, and focus rings.

### Contrast Verification Table
| UI Element | Foreground Color | Background Color | Contrast Ratio | Conformance |
| :--- | :--- | :--- | :--- | :--- |
| Primary Body Copy | `#172522` (Ink) | `#F8F8F4` (Canvas) | **14.2:1** | Pass (AAA) |
| Secondary Text | `#66716D` (Muted) | `#FFFFFF` (Card) | **5.1:1** | Pass (AA) |
| Primary CTA Button | `#FFFFFF` (White) | `#237A63` (Green) | **4.8:1** | Pass (AA) |
| Secondary Chip | `#143D35` (Deep Forest) | `#E7F4ED` (Mint) | **9.6:1** | Pass (AAA) |
| Error Message | `#B42318` (Error Red) | `#FFFFFF` (Card) | **5.4:1** | Pass (AA) |
| Star Rating Label | `#965B00` (Contrast Amber)| `#FFFFFF` (Card) | **4.6:1** | Pass (AA) |

---

## 3. Keyboard Navigation & Focus Management

All interactive controls must be operable without a pointing device:

| Key | Context | Expected Interaction |
| :--- | :--- | :--- |
| `Tab` | Global | Advances focus forward through interactive elements in natural DOM sequence |
| `Shift + Tab` | Global | Reverses focus backwards through interactive elements |
| `Enter` / `Space` | Buttons / Links / Toggles | Activates the focused button, link, or switches toggle state |
| `Escape` | Modals / Drawers / Menus | Closes the open modal or drawer and restores focus to the triggering element |
| `Arrow Keys` | Radio Groups / Tabs / Sliders | Navigates between sibling options in dashboard tabs or date pickers |

### Focus Ring Standards
* Never suppress focus rings with `outline: none` without providing an enhanced visible alternative.
* Default Focus Ring: `ring-2 ring-[#237A63] ring-offset-2 ring-offset-white`.
* Focus Trap: When `BookingFlowDialog` or mobile navigation drawer opens, focus must be trapped within the overlay container; background elements receive `aria-hidden="true"`.

---

## 4. ARIA Attributes & Semantic HTML

* **Buttons vs Links**:
  * Use `<button>` for actions that alter application state (e.g., opening a modal, toggling a filter, submitting a booking).
  * Use `<a>` (or `next/link`) for navigation between distinct URLs.
* **Icon-Only Buttons**:
  * Any button rendering an icon without visible text (e.g., Favorite heart, Close 'X', Hamburger menu) must include an `aria-label` attribute (e.g., `aria-label="Close booking dialog"`).
* **Live Regions**:
  * Toasts, search result counts, and dynamic form errors must utilize `aria-live="polite"` or `role="status"` so assistive technologies announce updates automatically.
* **Form Inputs**:
  * Every `<input>`, `<select>`, and `<textarea>` must have an associated `<label>` connected via `id` and `htmlFor`.
  * Inline validation errors must link to the input via `aria-describedby="[input-id]-error"`.

---

## 5. Screen Reader Testing Protocol

All pages must be validated using:
1. **VoiceOver** (macOS / iOS Safari)
2. **NVDA** (Windows Chrome / Firefox)
3. Automated auditing via **axe-core** / **Lighthouse Accessibility Audit** (Target score: 100/100).

---

## 6. Related Documentation
* [UI Design System](file:///docs/design/UI-DESIGN-SYSTEM.md)
* [Frontend Requirements](file:///docs/design/FRONTEND-REQUIREMENTS.md)
* [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md)
