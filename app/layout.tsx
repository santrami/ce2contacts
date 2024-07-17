"use client"
import Providers from "@/components/Providers";
import "./globals.css";
import SigninButton from "@/components/SigninButton";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className="bg-zinc-900 text-zinc-200">
        <Providers>
        <div className="container">
        <div className="flex flex-col justify-center items-center">
          <SigninButton />
        </div>
      </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
