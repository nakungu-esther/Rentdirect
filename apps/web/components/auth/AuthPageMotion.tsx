"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function AuthPageMotion({
  className,
  children,
}: {
  className: string | undefined;
  children: ReactNode;
}) {
  return (
    <motion.div
      className={className ?? ""}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
