import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CineStream - Watch Movies & Series Online",
  description: "Stream your favorite movies and series online with CineStream. High-quality content with embed player support.",
  keywords: ["movies", "series", "streaming", "online", "watch", "cinema"],
  authors: [{ name: "CineStream" }],
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
