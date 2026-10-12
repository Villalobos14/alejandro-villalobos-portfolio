import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import ReactLenis from 'lenis/react'
import CustomCursor from "@/components/CustomCursor";
import Footer from "@/components/Footer";
import HomeDock from "@/components/home/HomeDock";
import { CurtainProvider } from "@/components/curtain/CurtainProvider";
import { LightboxProvider } from "@/components/media/LightboxProvider";
import PetWorldProvider from "@/components/pet-world/PetWorldProvider";
import HashScroll from "@/components/ui/HashScroll";
import StructuredData from "@/components/system/StructuredData";
import { personName, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: personName,
  authors: [{ name: personName, url: siteUrl }],
  creator: personName,
  robots: { index: true, follow: true },
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
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <a
          href="#main-content"
          className="sr-only rounded-full bg-accent text-body-s text-ink focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:min-h-11 focus-visible:px-5 focus-visible:py-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
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
        <StructuredData />
        <Analytics />
      </body>
    </html>
  );
}
