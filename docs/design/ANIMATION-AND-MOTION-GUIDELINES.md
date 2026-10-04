# Animation and Motion Guidelines — SkillConnect

| Document Attribute | Details |
| :--- | :--- |
| **Document ID** | `DOC-DSGN-006` |
| **Status** | Approved |
| **Owner** | Lead Frontend / Motion Designer |
| **Target Audience** | Frontend Developers, UI Designers, QA Engineers |
| **Last Updated** | October 2026 |

---

## 1. Motion Principles & Constraints

Animation in SkillConnect is functional, not decorative. It guides user attention, clarifies spatial hierarchy, and confirms interaction state without inducing nausea or perceived latency.

### Core Rules
* **Snappy & Restrained**: Animation durations must not exceed `350ms` for standard interactions (typical: `150ms – 250ms`).
* **Hardware Accelerated**: Limit animated CSS properties to `transform` (translate, scale) and `opacity`. Avoid animating `width`, `height`, `margin`, or `padding` to prevent layout reflows.
* **Non-Blocking**: Key interface actions must remain immediately clickable; never make users wait for an animation to finish before interacting.
* **Strict Reduced Motion**: When `prefers-reduced-motion: reduce` is active, all structural transitions must revert to instantaneous state changes or subtle opacity-only fades.

---

## 2. Motion for React (`motion/react`) Standards

All React animations must import from `motion/react` (using the modern `motion` npm package):

### 2.1 Standard Motion Variants

```typescript
// Shared motion transition presets
export const transitions = {
  springFast: { type: 'spring', stiffness: 400, damping: 30 },
  easeSmooth: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
};

// Section / Card entrance variant
export const fadeInUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: transitions.easeSmooth 
  },
};

// Card container stagger
export const staggerContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};
```

---

## 3. Component-Specific Motion Specifications

### 3.1 Hero Section Reveal
* **Sequence**:
  1. H1 Headline fades and lifts 16px (duration 250ms).
  2. Supporting copy follows with 60ms delay.
  3. Search pill container enters with subtle spring expansion.
  4. Right-side card collage fades in with light stagger.
* **Total Entrance Duration**: Completed in `< 450ms` from page mount.

### 3.2 Professional & Category Card Hovers
* **Transform**: Subtle lift `translateY(-3px)` combined with soft shadow elevation (`shadow-sm` -> `shadow-md`).
* **Image Treatment**: Portrait photo scales subtly (`scale(1.02)`) within `overflow-hidden` container; duration: `200ms ease-out`.
* **Prohibited**: Extreme 3D tilts, large scalings (>1.03), or colorful pulsing outlines.

### 3.3 Dialog & Mobile Drawer Transitions
* **Backdrop**: Fades from `opacity: 0` to `opacity: 0.6` (black with blur backdrop) in `150ms`.
* **Desktop Dialog**: Scales from `0.96` to `1.0` with opacity fade from `0` to `1` in `200ms`.
* **Mobile Drawer**: Slides up from bottom (`translateY(100%)` to `translateY(0%)`) with spring damping.
* **Exit Transition**: Symmetrical reverse animation completing in `150ms`.

### 3.4 Multi-Step Booking Wizard
* Step transitions use an animated horizontal slide or directional crossfade (`motion.div` with key bound to current step).
* Outgoing step slides left (`x: -20, opacity: 0`); incoming step slides in from right (`x: 20, opacity: 1`).

---

## 4. Accessibility & Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
In React components:
```typescript
import { useReducedMotion } from 'motion/react';

export function AnimatedCard({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
    >
      {children}
    </motion.div>
  );
}
```

---

## 5. Related Documentation
* [UI Design System](file:///docs/design/UI-DESIGN-SYSTEM.md)
* [Frontend Requirements](file:///docs/design/FRONTEND-REQUIREMENTS.md)
* [Accessibility Requirements](file:///docs/design/ACCESSIBILITY-REQUIREMENTS.md)
