import type { Metadata, Viewport } from "next";
import { Montserrat, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Montserrat({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

const serif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance, Engineered",
  description:
    "TripleArc GRC Solutions. Independent governance, risk and compliance advisory for regulated organisations that cannot afford uncertainty.",
};

export const viewport: Viewport = {
  themeColor: "#03081a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
