# Cookies and Tracking Requirements — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-POL-007` |
| **Status** | Approved |
| **Owner** | Privacy Counsel & Frontend Architect |
| **Target Audience** | Frontend Developers, Compliance Officers |
| **Last Updated** | October 2026 |

---

## 1. Cookie & Storage Taxonomy

SkillConnect uses minimal browser storage strictly necessary to deliver core platform services:

| Category | Storage Medium | Key Identifier | Purpose | Consent Required? |
| :--- | :--- | :--- | :--- | :--- |
| **Strictly Necessary** | Cookie (`HttpOnly`) | `__Host-skillconnect_session` | User authentication & CSRF defense | **No** (Exempt under ePrivacy) |
| **Functional (Demo)** | Browser `localStorage`| `skillconnect_favorites` | Persists saved favorite pros locally | **No** (Pure client preference) |
| **Functional (Demo)** | Browser `localStorage`| `skillconnect_demo_bookings` | Displays local demo appointment history | **No** (Local demo utility) |
| **Analytics** | Cookie | `ph_posthog_id` | Aggregated funnel drop-off analytics | **Yes** (Opt-in banner required in EU) |
| **Third-Party Ads** | N/A | None | **SkillConnect utilizes zero ad tracking cookies** | **N/A** |

---

## 2. Cookie Consent Banner Specification

* **Regions**: Automatically shown to IP addresses originating from EU/EEA and UK.
* **Banner Behavior**:
  * Clear choices: "Accept All", "Reject Non-Essential", "Manage Preferences".
  * Non-essential analytics cookies blocked until explicit opt-in consent is recorded.
* **Prototype Safeguard**: In Phase 1 demonstration mode, only strictly functional client `localStorage` is accessed; no third-party marketing trackers are loaded.

---

## 3. Related Documentation
* [Privacy and Data Handling](file:///docs/security/PRIVACY-AND-DATA-HANDLING.md)
* [Privacy Policy Requirements](file:///docs/policies/PRIVACY-POLICY-REQUIREMENTS.md)
* [Frontend Requirements](file:///docs/design/FRONTEND-REQUIREMENTS.md)
