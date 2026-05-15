import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cricksy",
  description: "Live cricket scores and tournaments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-5590321516536916"
        />
      </head>

      <body>{children}</body>
    </html>
  );
}