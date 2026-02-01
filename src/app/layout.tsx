import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOJAI - AI-Powered Dental Diagnostics",
  description:
    "Advanced AI platform for dental diagnostics. Analyze CBCT scans with 99.8% accuracy across 130+ pathologies.",
  keywords: ["dental AI", "CBCT analysis", "dental diagnostics", "AI radiology"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
