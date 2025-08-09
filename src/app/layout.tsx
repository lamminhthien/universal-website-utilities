import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import ClientProviders from "./components/ClientProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universal Website Utilities",
  description: "A colorful hub of mini tools: news, weather, travel photos, anime, retro music, and cartoons.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#06080f]`}>
        <ClientProviders>
          <div className="min-h-screen flex flex-col neon-bg">
            <Navbar />
            <main className="flex-1 container mx-auto px-4 py-6">
              {children}
            </main>
            <footer className="border-t border-white/10 backdrop-blur bg-black/20">
              <div className="container mx-auto px-4 py-6 text-xs ">
                © {new Date().getFullYear()} Universal Website Utilities
              </div>
            </footer>
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
