"use client";

import { NextAuthProvider } from "@/providers/NextAuthProvider";
import DynamicBackground from "@/components/DynamicBackground";
import { NotificationProvider } from "@/contexts/NotificationContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextAuthProvider>
      <NotificationProvider>
        <DynamicBackground />
        {children}
      </NotificationProvider>
    </NextAuthProvider>
  );
} 