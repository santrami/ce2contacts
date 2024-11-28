"use client";

import "../globals.css";
import SearchInput from "../SearchInput";
import { FilterPanel } from "@/components/FilterPanel";
import { MainNav } from "@/components/MainNav";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 items-center pt-0 mt-3">
      <MainNav />
      <Suspense fallback={<div>Loading search...</div>}>
        <SearchInput />
      </Suspense>
      <Suspense fallback={<div>Loading filters...</div>}>
        <FilterPanel />
      </Suspense>
      <div className="lg:w-2/3 w-full p-5">
        <Suspense fallback={<div>Loading content...</div>}>
          {children}
        </Suspense>
      </div>
    </div>
  );
}