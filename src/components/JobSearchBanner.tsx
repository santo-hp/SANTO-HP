"use client";

import { Suspense } from "react";
import { JobSearchForm } from "@/components/JobSearchForm";

export function JobSearchBanner() {
  return (
    <div className="border-b border-slate-200 bg-white py-4 sm:py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Suspense>
          <JobSearchForm />
        </Suspense>
      </div>
    </div>
  );
}
