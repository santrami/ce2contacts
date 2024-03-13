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
   
        <div className="flex flex-col gap-10 items-center p-6">
          <SigninButton />
          <SearchInput />
          <div className="flex flex-col items-center w-2/3">{children}</div>
        </div>
      
  );
}
