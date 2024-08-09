"use client";
import React from "react";
import ThemeProvider from "./ThemeToggle/theme-provider";
import { TRPCReactProvider } from "@/trpc/react";
import { SessionProvider, type SessionProviderProps } from "next-auth/react";

export default function Providers({
  children,
  session,
}: {
  session: SessionProviderProps["session"];
  children: React.ReactNode;
}) {
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <SessionProvider session={session}>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </SessionProvider>
      </ThemeProvider>
    </>
  );
}
