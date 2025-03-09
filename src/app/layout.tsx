import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'
import "./globals.css";
import ReactLenis from 'lenis/react'

const sanFrancisco = localFont(
  {
    src: [
      {
        path: './fonts/SF-Bold.woff',
        weight: '700',
        style: 'normal'
      },
      {
        path: './fonts/SF-Medium.woff',
        weight: '500',
        style: 'normal'
      },
      {
        path: './fonts/SF-Regular.woff',
        weight: '400',
        style: 'normal'
      }
    ],
    variable: '--font-sf',
  },
)


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
    <html lang="es">
      <body
        className={`${sanFrancisco.className} antialiased bg-primary`}
      >
        <ReactLenis root options={{ lerp: 0.5, duration: 0.8 }}>
          {children}
        </ReactLenis>
      </body>
    </html>
  );
}
