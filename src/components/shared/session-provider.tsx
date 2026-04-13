"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

/**
 * Session provider wrapper component for NextAuth.js
 * Must wrap the entire application to enable authentication context
 */
export function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
