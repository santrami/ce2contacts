"use client";
import "../globals.css";
import SearchInput from "../SearchInput";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <div className="flex flex-col gap-10 items-center w-full">
        <SearchInput />
        <div className="flex flex-col items-center w-2/3">{children}</div>
      </div>
    </Suspense>
  );
}
