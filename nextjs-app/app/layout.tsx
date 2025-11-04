import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Launderette Near Me | Find 1,057+ UK Launderettes & Laundrettes | LaunderetteNear.me",
    template: "%s | LaunderetteNear.me",
  },
  description: "Find your nearest launderette in seconds. Search 1,057+ launderettes across 79 UK cities. Service wash, 24 hour, self-service & more. Real reviews, opening hours & prices.",
  keywords: ["launderette", "laundromat", "laundry service", "UK launderette", "self-service laundry"],
  authors: [{ name: "LaunderetteNear.me" }],
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://launderettenear.me",
    siteName: "LaunderetteNear.me",
    title: "Launderette Near Me | Find UK Launderettes & Laundrettes",
    description: "Find your nearest launderette in seconds. Search 1,057+ launderettes across 79 UK cities with reviews, hours & prices.",
    images: [
      {
        url: "https://launderettenear.me/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "LaunderetteNear.me - UK Launderette Directory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Launderette Near Me | Find UK Launderettes",
    description: "Find your nearest launderette in seconds. 1,057+ locations across 79 UK cities.",
    images: ["https://launderettenear.me/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <Script
          id="adsense-script"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9361445858164574"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
