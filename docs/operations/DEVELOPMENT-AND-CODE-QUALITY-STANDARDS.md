# Development and Code Quality Standards — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-OPS-002` |
| **Status** | Approved |
| **Owner** | Lead Full-Stack Architect & Quality Lead |
| **Target Audience** | All Software Engineers, Reviewers, Coding Agents |
| **Last Updated** | October 2026 |

---

## 1. TypeScript Strictness & Type Safety Standards

SkillConnect enforces strict TypeScript settings (`strict: true` in `tsconfig.json`):
* **No Implicit `any`**: The use of `any` is strictly prohibited. Use typed interfaces, generic constraints, or `unknown` with runtime type narrowing via Zod or type guards.
* **Non-Null Assertions**: Avoid `!` non-null assertions unless mathematically provable within the immediate local block.
* **Component Prop Interfaces**: All React components must export a strongly typed props interface:
  ```typescript
  export interface ProfessionalCardProps {
    professional: ProfessionalProfile;
    isFavorite?: boolean;
    onToggleFavorite?: (id: string) => void;
    className?: string;
  }
  ```

---

## 2. Linting & Formatting Standards

* **ESLint Configuration**: Based on `eslint-config-next` with additional rules:
  * `@typescript-eslint/no-unused-vars`: `error` (ignoring variables prefixed with `_`).
  * `react-hooks/rules-of-hooks`: `error`.
  * `react-hooks/exhaustive-deps`: `warn`.
* **Prettier**:
  * Print Width: 100 characters.
  * Tab Width: 2 spaces.
  * Single Quotes: `true` for TS/TSX; double quotes for HTML/JSX attributes.
  * Trailing Commas: `es5`.

---

## 3. Git Branching & Commit Conventions

* **Branch Naming**:
  * Features: `feat/issue-12-booking-step-validation`
  * Bug Fixes: `fix/search-empty-state-reset`
  * Documentation: `docs/architecture-erd-update`
* **Conventional Commits**:
  * `feat(booking): add deterministic reference code generator`
  * `fix(search): normalize case for category filter chips`
  * `docs(security): document STRIDE threat model mitigations`
  * `test(dashboard): add unit tests for worker availability toggle`

---

## 4. Component Co-Location & Architecture Rules

1. **Colocate Component Sub-parts**: Complex components (like `BookingFlowDialog`) should reside in their own directory with sub-components (`booking-step-1.tsx`, `booking-step-2.tsx`, etc.).
2. **Error Boundaries**: Every top-level route under `src/app/` must include an adjacent `error.tsx` error boundary providing a friendly recovery UI.
3. **No Unhandled Promises**: All asynchronous operations must use `try / catch` blocks with localized user-facing feedback.

---

## 5. Related Documentation
* [Testing Strategy](file:///docs/operations/TESTING-STRATEGY.md)
* [CI/CD and Deployment Plan](file:///docs/operations/CI-CD-AND-DEPLOYMENT-PLAN.md)
* [Repository and Module Structure](file:///docs/architecture/REPOSITORY-AND-MODULE-STRUCTURE.md)
