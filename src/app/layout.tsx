import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import DynamicBackground from "@/components/DynamicBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub Team & Repository Manager",
  description: "Manage your GitHub teams and repositories with ease",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <NextAuthProvider>
          <DynamicBackground />
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
