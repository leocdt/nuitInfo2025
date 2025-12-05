import type { Metadata } from "next";
import { vt323, irishGrover } from "@/lib/fonts";
import "./globals.css";
import { CursorManager } from "@/components/ui/CursorManager";

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
      <body
        className={`${vt323.variable} ${irishGrover.variable} antialiased bg-[#202020] text-white overflow-hidden`}
      >
        <CursorManager />
        {children}
      </body>
    </html>
  );
}