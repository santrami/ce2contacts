"use client";
import "../globals.css";
import SearchInput from "../SearchInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-10 items-center pt-0 mt-3">
      <div className="flex gap-5">
        <Button variant={"secondary"}>
          <Link href="/newContact">Create contact</Link>
        </Button>
        <Button variant={"secondary"}>
          <Link href="/newOrganization">Create organization</Link>
        </Button>
        <Button variant={"ce2"}>
          <Link href="/project-participants">Project participant list</Link>
        </Button>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchInput />
      </Suspense>
      <div className="lg:w-2/3 w-full p-5">{children}</div>
    </div> 
  );
}