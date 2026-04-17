import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavLinks } from "@/components/NavLinks";
import { UserMenu } from "@/components/UserMenu";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
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
  title: "Journal de Jueguitos",
  description: "Rastrea tu viaje como jugador con integración de IGDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="game-journal-theme">
          <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
            <div className="w-full max-w-screen-2xl mx-auto px-6 flex h-16 items-center">
              <Link href="/" className="mr-8 flex items-center space-x-2 group">
                <span className="text-2xl font-bold text-gradient group-hover:opacity-80 transition-opacity">
                  Journal de Jueguitos
                </span>
              </Link>
              <nav className="flex items-center space-x-2 text-sm font-medium flex-1">
                <NavLinks />
              </nav>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <UserMenu />
              </div>
            </div>
          </nav>
          <main className="w-full min-h-screen py-8 px-6 animate-in">
            <div className="w-full max-w-screen-2xl mx-auto">
              {children}
            </div>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
