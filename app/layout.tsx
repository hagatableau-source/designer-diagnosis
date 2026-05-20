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
  title: "Design Cognitive Analysis",
  description: "Design Cognitive Analysis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="m-0 min-h-screen overflow-x-hidden antialiased">
        {children}

        <div className="w-full text-center py-4">
          <p className="text-[10px] tracking-wide text-white/70">
            © 2026 Graphic Center Niigata / Haga Masaaki
          </p>
        </div>
      </body>
    </html>
  );
}