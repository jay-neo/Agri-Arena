import { type NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // debug: process.env.NODE_ENV === "development",

  callbacks: {},
  events: {},
  providers: [],
} satisfies NextAuthConfig;
