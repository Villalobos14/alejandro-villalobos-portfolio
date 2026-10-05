import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import ReactLenis from 'lenis/react'
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import HomeDock from "@/components/home/HomeDock";
import { CurtainProvider } from "@/components/curtain/CurtainProvider";
import { LightboxProvider } from "@/components/media/LightboxProvider";
import PetWorldProvider from "@/components/pet-world/PetWorldProvider";
import HashScroll from "@/components/ui/HashScroll";
import { siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

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
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title: siteTitle,
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sanFrancisco.className} antialiased bg-primary`}
      >
        <a
          href="#main-content"
          className="sr-only rounded-full bg-secondary px-5 py-3 text-label text-black focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Skip to content
        </a>
        <CurtainProvider>
          <CustomCursor />
          <ReactLenis root options={{ lerp: 0.5, duration: 0.8, syncTouch: false }}>
            <PetWorldProvider>
              <LightboxProvider>
                <HashScroll />
                <HomeDock />
                <main
                  id="main-content"
                  tabIndex={-1}
                  className="flex w-full min-w-0 flex-col gap-stack focus:outline-none"
                >
                  {children}
                </main>
                <Footer />
              </LightboxProvider>
            </PetWorldProvider>
          </ReactLenis>
        </CurtainProvider>
      </body>
    </html>
  );
}
