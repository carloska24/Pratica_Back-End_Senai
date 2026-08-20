import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Backend · Preparatório para o SENAI",
  description: "Curso preparatório independente de lógica, JavaScript e Backend com Node.js para aprofundamento no SENAI.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
