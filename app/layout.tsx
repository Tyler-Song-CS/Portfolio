import type { Metadata } from "next";
import { headers } from "next/headers";
import { MotionProvider } from "./components/MotionProvider";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";

  let metadataBase = new URL("https://tylersong.dev");
  if (host) {
    try {
      metadataBase = new URL(`${protocol}://${host}`);
    } catch {
      // Keep the stable fallback when a preview host is malformed.
    }
  }

  return {
    metadataBase,
    title: {
      default: "Tyler Song — Senior Software Engineer",
      template: "%s · Tyler Song",
    },
    description:
      "Portfolio of Tyler Song, a senior software engineer building calm, clear systems for complex work.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Tyler Song — Senior Software Engineer",
      description: "I make complex systems feel calm & clear.",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "Tyler Song portfolio" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Tyler Song — Senior Software Engineer",
      description: "I make complex systems feel calm & clear.",
      images: ["/og.png"],
    },
  };
}

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
