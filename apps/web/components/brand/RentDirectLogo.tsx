"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: { h: 26, pad: "px-1.5 py-0.5", maxW: 150 },
  md: { h: 32, pad: "px-2 py-1", maxW: 210 },
  lg: { h: 40, pad: "px-2.5 py-1.5", maxW: 280 },
};

/**
 * Official RentDirect wordmark (designed for dark charcoal).
 * Default `framed` uses a dark plate so the asset reads correctly on light headers.
 */
export function RentDirectLogo({
  size = "md",
  framed = true,
  priority = false,
  className,
}: {
  size?: keyof typeof SIZES;
  framed?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const img = (
    <Image
      src="/brand/rentdirect-logo.png"
      alt="RentDirect"
      width={520}
      height={160}
      className="w-auto object-contain object-left"
      style={{ height: s.h, maxWidth: s.maxW }}
      priority={priority}
    />
  );
  if (!framed) {
    return <span className={cn("inline-flex", className)}>{img}</span>;
  }
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-xl bg-[#020617] shadow-sm ring-1 ring-slate-800/80",
        s.pad,
        className,
      )}
    >
      {img}
    </span>
  );
}

/** Compact mark for collapsed sidebars (full asset scaled inside a square). */
export function RentDirectLogoChip({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#020617] p-1 ring-1 ring-slate-800/80",
        className,
      )}
    >
      <Image
        src="/brand/rentdirect-logo.png"
        alt="RentDirect"
        width={200}
        height={200}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
