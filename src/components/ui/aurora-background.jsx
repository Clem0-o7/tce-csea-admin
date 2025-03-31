"use client";
import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <motion.div
      className={cn(
        "relative w-full min-h-screen bg-zinc-50 dark:bg-zinc-900 text-slate-950 transition-bg",
        className
      )}
      initial={{ opacity: 0.0, y: 40 }} // Initial state for animation
      whileInView={{ opacity: 1, y: 0 }} // Animation state when in view
      transition={{
        delay: 0.3, // Delay before the animation starts
        duration: 0.8, // Duration of the animation
        ease: "easeInOut", // Easing function for smooth transition
      }}
      {...props}
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className={cn(`
            [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)]
            [--dark-gradient:repeating-linear-gradient(100deg,var(--black)_0%,var(--black)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--black)_16%)]
            [--aurora:repeating-linear-gradient(100deg,var(--blue-500)_10%,var(--indigo-300)_15%,var(--blue-300)_20%,var(--violet-200)_25%,var(--blue-400)_30%)]
            [background-image:var(--white-gradient),var(--aurora)]
            dark:[background-image:var(--dark-gradient),var(--aurora)]
            [background-size:300%,200%]
            [background-position:50%_50%,50%_50%]
            filter blur-[10px] invert dark:invert-0
            after:content-[""] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] 
            after:dark:[background-image:var(--dark-gradient),var(--aurora)]
            after:[background-size:200%,100%] 
            after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference
            pointer-events-none
            absolute -inset-[10px] opacity-50 will-change-transform`,
            showRadialGradient &&
              `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
          )}
        ></motion.div>
      </div>
      {children}
    </motion.div>
  );
};
