import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET/POST /api/auth/[...nextauth]
 * NextAuth.js handler for all authentication routes
 */
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
