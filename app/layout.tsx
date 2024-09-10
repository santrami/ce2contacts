"use client";
import Providers from "@/components/Providers";
import Footer from "@/components/Footer";
import "./globals.css";
import SigninButton from "@/components/SigninButton";
import { Lato } from 'next/font/google'

const lato = Lato({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={lato.className} lang="en">
      <body
        suppressHydrationWarning={true}
        className="bg-[#021D61] text-zinc-200 flex flex-col h-full"
      >
        <Providers>
          <div className="container p-0 m-0 max-w-full">
            <div className="flex1 flex-col justify-center items-center">
              <SigninButton />
            </div>
          </div>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
