import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";
import ReactLenis from 'lenis/react'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: "Alejandro Villalobos | UX Designer",
  description: "UX designer with 3 years of experience, based in México. Currently with DaCodes working on Web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} font-sans antialiased `}
      >
        <ReactLenis root options={{ lerp: 0.5, duration: 0.8 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
