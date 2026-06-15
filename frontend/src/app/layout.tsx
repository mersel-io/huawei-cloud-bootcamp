import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";
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
  title: "Portfolify - Dijital Kartvizitiniz",
  description:
    "Yazılımcılar ve teknoloji öğrencileri için dijital kartvizit platformu. Tüm varlıklarınızı tek bir şık sayfada toplayın.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t py-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Portfolify. Tüm hakları saklıdır.</p>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
