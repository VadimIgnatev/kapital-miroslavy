import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TelegramInit from "@/components/TelegramInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Капитал Мирославы",
  description: "Публичный портфель для ребёнка",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        {/* Telegram WebApp SDK — должен загружаться до рендера */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {/* Инициализация Telegram (ready + expand + log) */}
        <TelegramInit />
        <main className="flex-1 max-w-md mx-auto w-full px-4 pt-4 pb-20">
          {children}
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
