"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LOAD_MS = 5000;

/**
 * Minimal landing: full-screen preloader, then `/login`.
 */
export function LandingPreloader() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const nextPath = "/login";

    const started = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const p = Math.min(100, ((now - started) / LOAD_MS) * 100);
      setProgress(p);
      if (p < 100) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const done = window.setTimeout(() => {
      router.replace(nextPath);
    }, LOAD_MS);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(done);
    };
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b09] text-white">
      <div
        className="pointer-events-none select-none text-[0.65rem] font-semibold uppercase tracking-[0.35em] text-emerald-500/50"
        aria-hidden
      >
        RentDirect
      </div>
      <div
        className="mt-6 h-10 w-10 animate-spin rounded-full border-2 border-emerald-500/20 border-t-emerald-400"
        role="status"
        aria-label="Loading"
      />
      <div className="mt-10 h-0.5 w-44 overflow-hidden rounded-full bg-white/[0.08]">
        <div
          className="h-full rounded-full bg-emerald-500/90 transition-[width] duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
