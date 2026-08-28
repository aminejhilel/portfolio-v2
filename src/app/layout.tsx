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
  title: "Mohammed BENRABAH | Apprenti Ingénieur Éco-Énergétique & CVC",
  description: "Portfolio de Mohammed BENRABAH, Apprenti Ingénieur en Éco-Énergétique. Recherche d'alternance en génie climatique, énergies renouvelables et efficacité énergétique.",
  keywords: ["éco-énergétique", "génie climatique", "CVC", "alternance", "énergies renouvelables", "efficacité énergétique", "ingénieur", "Amiens"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-100 min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
