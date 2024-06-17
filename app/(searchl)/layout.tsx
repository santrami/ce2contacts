"use client"
import SigninButton from "@/components/SigninButton";
import "../globals.css";
import SearchInput from "../SearchInput";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

        <div className="flex flex-col gap-10 items-center pt-0">
          <SigninButton />
          <div>
            <Button variant={"secondary"}>
              <Link href="/newContact">Create contact</Link>
            </Button>
            
          </div>
          <SearchInput />
          <div className="lg:w-2/3 w-full p-5">{children}</div>
        </div>
  );
}