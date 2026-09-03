import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "BuatUndangan - Platform Otomatisasi Undangan",
  description: "Solusi membuat undangan digital yang praktis dan cepat.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${plusJakarta.variable} h-full antialiased scroll-smooth`}>
      <body className="min-h-full flex flex-col font-sans text-slate-900 bg-slate-50">
        {children}
      </body>
    </html>
  );
}
