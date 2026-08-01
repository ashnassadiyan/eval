"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  // Trigger top route shimmer flare on route change
  useEffect(() => {
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 350);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative w-full min-h-full flex flex-col flex-1">
      {/* Top Monochromatic Shimmer Flare Beam on Route Change */}
      {isNavigating && (
        <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-foreground to-transparent z-[9999] animate-pulse pointer-events-none" />
      )}

      {/* Pure Silky Fade Page Content Wrapper — No Scaling, Shifts, or Shaking */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className="w-full flex-1 flex flex-col min-w-0"
      >
        {children}
      </motion.div>
    </div>
  );
}

export default PageTransition;
