"use client";

import { motion as m } from "motion/react";
// import Image from "";
import { Link } from "react-router";
import { sosmedIcon } from "~/constant/sosmed-data";
// import { useTheme } from "next-themes";

export default function Footer() {
  //   const { resolvedTheme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      id="footer"
      className="relative z-10 mx-auto flex max-w-360 flex-col justify-between overflow-visible bg-[#FDFDFD] pt-24 pb-12 text-gray-950"
    >
      <div className="pointer-events-none absolute inset-x-0 -top-35 bottom-0 z-0 overflow-visible select-none">
        <div className="custom-container pointer-events-none relative z-20 mx-auto flex h-full w-full flex-col justify-end px-6 pt-32 pb-12 md:px-12">
          <div className="mb-8 h-px w-full" />

          <div className="custom-container relative z-20 flex h-50.5 flex-col items-center justify-center text-center">
            <div className="mt-80 mb-4 flex items-center gap-2">
              <img
                src="/icons/Logo.svg"
                alt="Your Logo"
                width={54}
                height={54}
                style={{ width: "48px", height: "48px" }}
                className="items object-contain"
              />
              <h2 className="flex text-left text-display-2xl font-bold">
                Booky
              </h2>
            </div>

            <p className="mb-5 max-w-155 px-4 text-xs leading-relaxed font-medium text-neutral-500 md:text-sm dark:text-neutral-400">
              Discover inspiring stories & timeless knowledge, ready to borrow
              anytime. Explore online or visit our nearest library branch.
            </p>

            <div className="pointer-events-auto flex items-center gap-4 p-4">
              {sosmedIcon.map((icon) => (
                <Link
                  to={icon.href}
                  key={icon.alt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${icon.hoverBg} group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#FDFDFD] shadow-xl backdrop-blur-2xl transition-all duration-500`}
                >
                  <m.div
                    animate={icon.motion.animate}
                    transition={icon.motion.transition}
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={icon.src}
                      alt={icon.alt}
                      width={icon.width}
                      height={icon.height}
                      className="absolute inset-0 m-auto h-12 w-12 opacity-100 transition-opacity duration-300 group-hover:opacity-0 lg:h-12 lg:w-12"
                    />
                    <img
                      src={icon.hoverSrc}
                      alt={icon.alt}
                      width={icon.width}
                      height={icon.height}
                      className="h-12 w-12 opacity-0 transition-all duration-300 group-hover:opacity-100 lg:h-12 lg:w-12"
                    />
                  </m.div>
                </Link>
              ))}
            </div>

            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-center text-xs font-medium tracking-wide text-neutral-500 sm:text-left md:text-sm">
                &copy; {currentYear} Gunarto Wibisono. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
