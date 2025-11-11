import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Inazuma Avatar Hub - Partagez vos Codes d'Avatar",
  description: "Plateforme communautaire de partage de Codes d'Avatar pour Inazuma Eleven: Victory Road. Partagez, découvrez et votez pour les meilleurs avatars !",
  keywords: "Inazuma Eleven, Victory Road, Code Avatar, Partage Avatar, IE Victory Road",
  openGraph: {
    title: "Inazuma Avatar Hub",
    description: "Partagez et découvrez les meilleurs Codes d'Avatar pour Inazuma Eleven: Victory Road",
    type: "website",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
