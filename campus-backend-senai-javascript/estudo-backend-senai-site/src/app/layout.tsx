import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Campus Backend · Curso aberto de JavaScript Backend",
  description: "Curso paralelo de lógica, JavaScript e fundamentos de Backend com Node.js, criado para estudo próprio e compartilhado com outras pessoas.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
