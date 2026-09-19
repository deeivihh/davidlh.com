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
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${titles.variable} ${body.variable}`}>
      <body className="max-xl:px-8">{children}</body>
    </html>
  );
}
