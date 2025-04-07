import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Alejandro Villalobos | UX/UI Designer",
  description: "UX designer with over 4 years of experience, based in México. Currently open to work.",
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
