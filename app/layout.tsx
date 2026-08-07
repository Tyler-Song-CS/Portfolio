import type { Metadata } from "next";
import { MotionProvider } from "./components/MotionProvider";
import { siteUrl } from "./lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Tyler Song — Senior Software Engineer",
    template: "%s · Tyler Song",
  },
  description:
    "Portfolio of Tyler Song, a senior software engineer building calm, clear systems for complex work.",
  icons: {
    icon: `${siteUrl}/favicon.svg`,
    shortcut: `${siteUrl}/favicon.svg`,
  },
  openGraph: {
    title: "Tyler Song — Senior Software Engineer",
    description: "I make complex systems feel calm & clear.",
    type: "website",
    url: siteUrl,
    images: [{ url: `${siteUrl}/og.png`, width: 1200, height: 630, alt: "Tyler Song portfolio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tyler Song — Senior Software Engineer",
    description: "I make complex systems feel calm & clear.",
    images: [`${siteUrl}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MotionProvider />
        {children}
      </body>
    </html>
  );
}
