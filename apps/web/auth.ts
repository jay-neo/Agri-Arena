import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import { authConfig } from "./auth.config";
// import bcrypt from "bcrypt";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
});

// https://authjs.dev/getting-started/session-management/login
// https://authjs.dev/getting-started/authentication/credentials
