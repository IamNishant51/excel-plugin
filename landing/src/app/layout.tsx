import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import SplashScreen from "@/components/SplashScreen";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl = "https://sheetos.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SheetOS AI — AI-Powered Excel & Word Automation",
    template: "%s | SheetOS AI",
  },
  description:
    "Describe what you want in plain English. SheetOS AI generates, validates, previews, and executes — inside Excel and Word. Free to use.",
  keywords: [
    "Excel automation",
    "Word automation",
    "AI spreadsheet",
    "SheetOS",
    "Office Add-in",
    "formula generator",
    "data cleaning",
    "AI for Excel",
  ],
  authors: [{ name: "SheetOS AI" }],
  creator: "SheetOS AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SheetOS AI",
    title: "SheetOS AI — AI-Powered Excel & Word Automation",
    description:
      "Describe what you want in plain English. SheetOS AI generates, validates, previews, and executes — inside Excel and Word.",
    images: [
      {
        url: "https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-80-v2.png",
        width: 80,
        height: 80,
        alt: "SheetOS AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "SheetOS AI — AI-Powered Excel & Word Automation",
    description:
      "AI automation inside Excel & Word. Describe tasks in plain English.",
    images: [
      "https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-80-v2.png",
    ],
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
  icons: {
    icon: [
      { url: "https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-32-v2.png", sizes: "32x32", type: "image/png" },
      { url: "https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-64-v2.png", sizes: "64x64", type: "image/png" },
    ],
    apple: "https://ik.imagekit.io/9pfz6g8ri/excel_plugin_assets/icon-80-v2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#0F7B5F" />
        <link rel="dns-prefetch" href="https://ik.imagekit.io" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Providers>
          <SplashScreen />
          {children}
        </Providers>
      </body>
    </html>
  );
}
