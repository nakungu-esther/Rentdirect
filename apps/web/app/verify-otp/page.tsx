import { Suspense } from "react";
import VerifyOtpForm from "./VerifyOtpForm";

export default function VerifyOtpPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center bg-[#f8faf9] text-sm text-slate-500">
          Loading…
        </div>
      }
    >
      <VerifyOtpForm />
    </Suspense>
  );
}
