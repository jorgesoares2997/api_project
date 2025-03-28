import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import DocsButton from "@/components/DocsButton";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GitHub API Manager",
  description: "Gerenciador de times e repositórios do GitHub",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <DocsButton />
        </Providers>
      </body>
    </html>
  );
}
