import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jota Bot — Grid trading automático",
    template: "%s · Jota Bot",
  },
  description:
    "Plataforma de grid trading para cripto. Creá bots de rejilla, hacé backtest con datos reales de Binance y monitorizá tu cartera en tiempo real. Empezá en modo simulación, sin riesgo.",
  keywords: ["grid trading", "trading bot", "cripto", "Binance", "bot de trading", "automatización"],
  authors: [{ name: "Jota Bot" }],
  openGraph: {
    title: "Jota Bot — Grid trading automático",
    description: "Trading con disciplina, no con suerte. Bots de grid que ganan con la volatilidad, 24/7.",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport = {
  themeColor: "#0a1020",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
