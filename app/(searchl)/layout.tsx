"use client"
import SigninButton from "@/components/SigninButton";
import "../globals.css";
import SearchInput from "../SearchInput";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

        <div className="flex flex-col gap-10 items-center pt-0">
          <SigninButton />
          <SearchInput />
          <div className="lg:w-2/3 p-5">{children}</div>
        </div>
  );
}