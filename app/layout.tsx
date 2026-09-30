import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TripleArc — Governance, Risk & Compliance",
  description:
    "TripleArc GRC Solutions. Independent governance, risk and compliance advisory for regulated organisations that cannot afford uncertainty.",
};

export const viewport: Viewport = {
  themeColor: "#f1f3f9",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
