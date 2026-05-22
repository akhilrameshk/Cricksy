import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers";


export const metadata: Metadata = {
  title: "Cricksy",
  description: "Live cricket scores and tournaments",
   manifest: "/manifest.json",
  themeColor: "#0d6bde",
   icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};
export const viewport: Viewport = {
  themeColor: "#0d6bde",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="google-adsense-account"
          content="ca-pub-5590321516536916"
        />
      </head>

      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}