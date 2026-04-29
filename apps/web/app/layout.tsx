import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/app/siteConfig";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KryptaFlow — EVM Chain + KFL Token",
  description: "A BSC-like EVM chain starter with Blockscout explorer and the KFL token (OpenZeppelin-based, no public faucet mint).",
  metadataBase: new URL(`https://${siteConfig.domain}`),
  openGraph: {
    title: "KryptaFlow — EVM Chain + KFL Token",
    description: "Launch-ready EVM ecosystem experience for KryptaFlow (KFL).",
    url: "/",
    siteName: "KryptaFlow",
    images: [{ url: "/brand/banner.svg" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KryptaFlow — EVM Chain + KFL Token",
    description: "Launch-ready EVM ecosystem experience for KryptaFlow (KFL).",
    images: ["/brand/banner.svg"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
