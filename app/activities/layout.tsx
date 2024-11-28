"use client";

import { MainNav } from "@/components/MainNav";
import { Suspense } from "react";

export default function ActivitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 items-center pt-0 mt-3">
      <MainNav />
      <div className="lg:w-2/3 w-full p-5">
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}