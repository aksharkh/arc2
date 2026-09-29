import type { Metadata, Viewport } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance",
  description:
    "TripleArc GRC Solutions. Independent governance, risk and compliance advisory for regulated organisations that cannot afford uncertainty.",
};

export const viewport: Viewport = {
  themeColor: "#ebe8e2",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={interTight.variable}>
      <body>{children}</body>
    </html>
  );
}
