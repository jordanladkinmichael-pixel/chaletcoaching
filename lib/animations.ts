import { Variants } from "framer-motion";

// Motion system constants (Coach-First Design System)
const EASING = [0.2, 0.8, 0.2, 1] as const; // cubic-bezier(0.2, 0.8, 0.2, 1)
const DURATION_FAST = 0.14; // 140ms
const DURATION_NORMAL = 0.18; // 180ms
const DURATION_SLOW = 0.22; // 220ms

// Simple opacity fade (respects reduced motion)
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      duration: DURATION_NORMAL,
      ease: EASING,
    },
  },
};

// Y-axis movement + fade (respects reduced motion)
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATION_NORMAL,
      ease: EASING,
    },
  },
};

// Stagger container for lists
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Pulse animation for small indicators only (respects reduced motion)
export const pulse: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: {
    opacity: [1, 0.8, 1],
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Slide down variant
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: DURATION_NORMAL,
      ease: EASING,
    },
  },
};

// Scale in variant (for modals/panels)
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: DURATION_SLOW,
      ease: EASING,
    },
  },
};

// Button hover scale (1.02-1.03)
export const buttonHover: Variants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: {
      duration: DURATION_FAST,
      ease: EASING,
    },
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: DURATION_FAST,
      ease: EASING,
    },
  },
};

// Button hover lift (translateY -1/-2px, subtle glow)
export const buttonHoverLift: Variants = {
  rest: { y: 0, boxShadow: "0 0 0 0 rgba(217, 249, 157, 0)" },
  hover: { 
    y: -2, 
    boxShadow: "0 4px 12px rgba(217, 249, 157, 0.15)",
    transition: { duration: 0.15, ease: EASING }
  },
  tap: { y: 0, transition: { duration: 0.1 } },
};

// Card hover lift + border highlight
export const cardHoverLift: Variants = {
  rest: { y: 0, borderColor: "rgba(255, 255, 255, 0.08)" },
  hover: { 
    y: -2, 
    borderColor: "rgba(255, 255, 255, 0.14)",
    transition: { duration: 0.18, ease: EASING }
  },
};

