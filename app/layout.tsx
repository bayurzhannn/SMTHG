import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeacherOS — Планировщик уроков",
  description: "Создавайте уроки по ФГОС с помощью ИИ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
