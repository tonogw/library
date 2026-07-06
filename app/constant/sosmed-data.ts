import type { TargetAndTransition, Transition } from "motion/react";

type MotionConfig = {
  animate: TargetAndTransition;
  transition: Transition;
};

export type SosmedIconProps = {
  src: string;
  motion: MotionConfig;
  // transition: Transition;
  hoverSrc: string;
  href: string;
  alt: string;
  width: number;
  height: number;
  hoverBg: string;
};

export const sosmedIcon: SosmedIconProps[] = [
  {
    src: "/icons/fb.png",
    motion: {
      animate: {
        y: [0, -6, 0],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
      },
    },
    hoverSrc: "/icons/fb-light.png",
    href: "https://facebook.com/",
    alt: "facebook",
    width: 48,
    height: 48,
    // Color brand: bg-pink outline-dark-pink
    hoverBg: "hover:bg-[#0a66c2] hover:animate-bounce ",
  },

  {
    src: "/icons/ig.png",
    motion: {
      animate: {
        scale: [1, 1.1, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    hoverSrc: "/icons/ig-light.png",
    href: "https://www.instagram.com/",
    alt: "Instagram",
    width: 48,
    height: 48,
    hoverBg:
      "hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] hover:text-white",
  },
  {
    src: "/icons/linkedin.png",
    motion: {
      animate: {
        scale: [1, 1.08, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    hoverSrc: "/icons/linkedin-light.png",
    href: "https://www.linkedin.com/",
    alt: "Linkedin",
    width: 48,
    height: 48,
    hoverBg: "hover:bg-[#0a66c2] hover:text-white",
  },

  {
    src: "/icons/tiktok.png",
    motion: {
      animate: {
        scale: [1, 1.08, 1],
      },
      transition: {
        duration: 2,
        repeat: Infinity,
      },
    },
    hoverSrc: "/icons/tiktok-light.png",
    href: "https://www.tiktok.com/",
    alt: "Tiktok",
    width: 48,
    height: 48,
    hoverBg: "hover:bg-gray-900 hover:text-white",
  },
];
