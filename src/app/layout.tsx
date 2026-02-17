import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineStream - Watch Movies & Series Online",
  description: "Stream your favorite movies and series online with CineStream. High-quality content with embed player support.",
  keywords: ["movies", "series", "streaming", "online", "watch", "cinema"],
  authors: [{ name: "CineStream" }],
  manifest: "/manifest.json",
  openGraph: {
    title: "CineStream - Watch Movies & Series Online",
    description: "Stream your favorite movies and series online with CineStream.",
    type: "website",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#F5C542",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
