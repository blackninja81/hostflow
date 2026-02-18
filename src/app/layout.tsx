import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "../components/themeProvider";

// Modern, professional font pairing
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "HostFlow - Inventory & Analytics for AirBnB Hosts",
    template: "%s | HostFlow"
  },
  description: "The only inventory and analytics platform built specifically for AirBnB hosts. Track supplies, monitor profits, and scale your portfolio with confidence.",
  keywords: [
    "airbnb",
    "short-term rental",
    "inventory management",
    "property management",
    "vacation rental",
    "hosting tools",
    "profit analytics",
    "superhost"
  ],
  authors: [{ name: "HostFlow" }],
  creator: "HostFlow",
  publisher: "HostFlow",
  metadataBase: new URL("https://hostflow.com"), // Update with your actual domain
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://hostflow.com",
    title: "HostFlow - Inventory & Analytics for AirBnB Hosts",
    description: "Manage your stays. Master your margins. Professional inventory tracking and profit analytics for short-term rental hosts.",
    siteName: "HostFlow",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 1200,
        alt: "HostFlow - Smart Inventory Management for AirBnB Hosts"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "HostFlow - Inventory & Analytics for AirBnB Hosts",
    description: "Manage your stays. Master your margins.",
    images: ["/logo.png"],
    creator: "@hostflow" // Update with your actual Twitter handle
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
    }
  },
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/logo.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png", sizes: "32x32", type: "image/png" }
    ],
    apple: [
      { url: "/logo.png", sizes: "180x180", type: "image/png" }
    ],
    shortcut: "/logo.png"
  },
  manifest: "/site.webmanifest",
  themeColor: "#008489",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Additional meta tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${inter.variable} ${manrope.variable} font-sans antialiased bg-white text-[#484848]`}
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        </ThemeProvider>
      </body>
    </html>
  );
}