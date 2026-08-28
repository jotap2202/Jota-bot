import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NFSCAR Review Hub",
  description:
    "Manage NFC review cards and track customer engagement with smart redirects",
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
