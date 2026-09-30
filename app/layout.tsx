import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const barlow = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance",
  description:
    "TripleArc GRC Solutions. Independent governance, risk and compliance advisory for regulated organisations that cannot afford uncertainty.",
};

export const viewport: Viewport = {
  themeColor: "#0b2ea6",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${barlow.variable} ${plex.variable}`}>
      <body>{children}</body>
    </html>
  );
}
