import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LayoutProvider from "@/components/layout/LayoutProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "EStore - Your Online Marketplace",
  description: "Discover amazing products at great prices. Electronics, fashion, home goods and more.",
  keywords: "ecommerce, online shopping, electronics, fashion, home goods",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <LayoutProvider>
          {children}
        </LayoutProvider>
      </body>
    </html>
  );
}
