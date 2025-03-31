"use client";

import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const FloatingNav = ({
  navItems,
  className,
  activeSection,
}) => {
  const [visible, setVisible] = useState(true);
  const { scrollY, scrollYProgress } = useScroll();
  const [hasScrolled, setHasScrolled] = useState(false);

  // Handle scroll visibility
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious();
    const direction = current - previous;
    
    // Show nav when:
    // 1. At the top of the page
    // 2. Scrolling up
    // 3. Minimal scroll threshold met
    if (current < 50) {
      setVisible(true);
    } else if (direction < 0) {
      setVisible(true);
    } else if (direction > 0 && current > 50) {
      setVisible(false);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={false}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "fixed inset-x-0 top-0 mx-auto z-[100] w-full",
          className
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-fit",
            "px-6 py-3 mt-4",
            "rounded-full",
            "transition-all duration-200",
            "flex items-center justify-center gap-4",
            hasScrolled ? 
              "dark:bg-black/80 bg-white/80 backdrop-blur-md border border-white/[0.2] shadow-lg" : 
              "dark:bg-transparent bg-transparent"
          )}
        >
          {navItems.map((navItem, idx) => (
            <Link
              key={`nav-${idx}`}
              href={navItem.link}
              className={cn(
                "relative flex items-center gap-2",
                "text-sm font-medium",
                "dark:text-neutral-50 text-neutral-600",
                "transition-colors duration-200",
                "hover:text-neutral-500 dark:hover:text-neutral-300",
                activeSection === navItem.link.replace('#', '') && "text-primary"
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="hidden sm:block">{navItem.name}</span>
              {activeSection === navItem.link.replace('#', '') && (
                <motion.span
                  layoutId="navUnderline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </Link>
          ))}
          
          <button
            className={cn(
              "relative px-4 py-2 text-sm font-medium rounded-full",
              "border dark:border-white/[0.2] border-neutral-200",
              "dark:text-white text-black",
              "transition-colors duration-200",
              hasScrolled ? "opacity-100" : "opacity-80 hover:opacity-100"
            )}
          >
            <span>Login</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FloatingNav;