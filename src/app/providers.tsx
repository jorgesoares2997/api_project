"use client";

import { NextAuthProvider } from "@/providers/NextAuthProvider";
import DynamicBackground from "@/components/DynamicBackground";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <DynamicBackground />
      {children}
    </NextAuthProvider>
  );
} 