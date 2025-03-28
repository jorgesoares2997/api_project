import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import DocsButton from "@/components/DocsButton";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

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
          <div className="min-h-screen bg-gray-50">
            <Sidebar />
            <div className="md:pl-64 flex flex-col flex-1">
              <Header />
              <main className="flex-1">
                <div className="py-6">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    {children}
                  </div>
                </div>
              </main>
            </div>
          </div>
          <DocsButton />
        </Providers>
      </body>
    </html>
  );
}
