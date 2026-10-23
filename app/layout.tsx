import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fredoka = localFont({
  src: "./fonts/Fredoka-latin.woff2",
  variable: "--font-fredoka",
  weight: "600 700",
});

const nunito = localFont({
  src: "./fonts/Nunito-latin.woff2",
  variable: "--font-nunito",
  weight: "400 700",
});

export const metadata: Metadata = {
  title: "AI Fluency",
  description: "Treine seu inglês com inteligência artificial.",

};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background">{children}</body>
    </html>
  );
}
