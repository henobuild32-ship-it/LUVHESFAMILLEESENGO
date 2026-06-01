import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ONGD Luvhes Famille Esengo — Sauvé Pour Servir",
  description:
    "ONGD Luvhes Famille Esengo : Espoir, Solidarité, Amour et Compassion. Ensemble, transformons des vies et apportons l'espoir aux communautés.",
  keywords: [
    "ONGD",
    "Luvhes",
    "Famille Esengo",
    "humanitaire",
    "solidarité",
    "espoir",
    "communauté",
    "dons",
  ],
  authors: [{ name: "ONGD Luvhes Famille Esengo" }],
  icons: {
    icon: "/logo.jpeg",
  },
  openGraph: {
    title: "ONGD Luvhes Famille Esengo — Sauvé Pour Servir",
    description:
      "Espoir, Solidarité, Amour et Compassion. Ensemble, transformons des vies.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
