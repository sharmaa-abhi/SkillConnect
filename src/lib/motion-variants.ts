import { type Variants } from 'motion/react';

export const transitions = {
  springFast: { type: 'spring' as const, stiffness: 400, damping: 30 },
  springGentle: { type: 'spring' as const, stiffness: 300, damping: 25 },
  easeSmooth: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
  stepCrossfade: { duration: 0.2, ease: 'easeInOut' as const },
};

export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.easeSmooth,
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 8 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.springGentle,
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 8,
    transition: { duration: 0.15 },
  },
};

export const drawerVariants: Variants = {
  hidden: { y: '100%' },
  visible: {
    y: '0%',
    transition: transitions.springGentle,
  },
  exit: {
    y: '100%',
    transition: { duration: 0.2 },
  },
};
