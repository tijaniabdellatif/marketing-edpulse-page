import { type Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
    y: 10
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeInOut"
    }
  }
};

export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  }
};

export const slideInFromLeft: Variants = {
  hidden: {
    x: -100,
    opacity: 0
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const slideInFromRight: Variants = {
  hidden: {
    x: 100,
    opacity: 0
  },
  show: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export const zoomIn: Variants = {
  hidden: {
    scale: 0.8,
    opacity: 0
  },
  show: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export const scaleIn: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.5 }
  }
};
