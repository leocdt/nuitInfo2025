import type { Metadata } from "next";
import { VT323 } from "next/font/google";
import "./globals.css";

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Retro RPG Dialogue",
  description: "A retro-styled RPG dialogue component with synchronized audio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${vt323.variable} antialiased bg-[#202020] text-white overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}