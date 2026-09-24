import type { Metadata } from "next";
import { Instrument_Serif, Lora } from "next/font/google";
import "./globals.css";

const titles = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-title",
});

const body = Lora({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "David Lahoz",
  description: "David Lahoz is a frontend developer and marketing student working across digital products, data, AI and brand experiences",
  themeColor: "#FFFFFF",
  alternates: {
    canonical: "https://davidlh.com",
  },
  openGraph: {
    images: [
      {
        url: "https://davidlh.com/og/og-image.jpg",
        width: 1920,
        height: 1080,
        alt: "David Lahoz",
      },
    ],
    title: "David Lahoz",
    description: "David Lahoz is a frontend developer and marketing student working across digital products, data, AI and brand experiences",
    type: "website",
    url: "https://davidlh.com",
    siteName: "David Lahoz",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    images: "https://davidlh.com/og/og-image.jpg",
    title: "David Lahoz",
    site: "@deeivihh",
    description: "David Lahoz is a frontend developer and marketing student working across digital products, data, AI and brand experiences",
  },
  icons: {
    icon: [
      { url: "/og/favicon.jpg" },
    ],
  },
  keywords: ["David Lahoz", "davidlh", "frontend", "developer", "marketing", "data", "AI", "brand", "experiences"],
  authors: [{ name: "David Lahoz" }],
  creator: "David Lahoz",
  publisher: "David Lahoz",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${titles.variable} ${body.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "David Lahoz",
              "description": "David Lahoz is a frontend developer and marketing student working across digital products, data, AI and brand experiences",
              "url": "https://davidlh.com",
            }),
          }}
        />
      </head>
      <body className="max-xl:px-8">{children}</body>
    </html>
  );
}
