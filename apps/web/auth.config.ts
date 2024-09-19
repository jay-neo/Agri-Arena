import { db } from "./lib/prisma";
import { CredentialsSignin, type NextAuthConfig } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { neoUser } from "./app/server/user";
import { Adapter } from "next-auth/adapters";
import bcrypt from "bcrypt";

export const authConfig = {
  adapter: PrismaAdapter(db) as Adapter,
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  trustHost: true,
  // debug: process.env.NODE_ENV === "development",

  callbacks: {
    authorized({ auth }) {
      console.log(">>>=========================> Callback Authorize");

      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
    async jwt({ token, user, account, trigger, session }) {
      console.log(">>>=========================> Callback JWT");
      // console.log("User ==> ", user);
      // console.log("Session ==> ", session);
      // console.log("Token ==> ", token);

      if (user) {
        token.id = user.id;
        const existingUser = await db.profile.findUnique({
          where: {
            userId: user.id,
          },
        });
        if (!existingUser) {
          await neoUser(user.id);
        }
        // if (account?.provider === "credentials") {
        const expires = new Date(Date.now() + 60 * 60 * 24 * 30 * 1000);
        try {
          const session = await db.session.create!({
            data: {
              userId: user.id!,
              expires,
            },
          });
          token.sessionId = session.sessionToken;
        } catch (error) {}

        // }
      }

      if (trigger === "update") {
        console.log(">>>=========================> JWT Trigger");
        if (session?.user?.email) {
          token.email = session.user.email;
        }
        if (session?.user?.image) {
          token.image = session.user.image;
        }
        if (session?.user?.name) {
          token.name = session.user.name;
        }
      }

      // console.log("User ==> ", user);
      // console.log("Session ==> ", session);
      // console.log("Token ==> ", token);
      return token;
    },
    session({ session, token, trigger }) {
      console.log(">>>=========================> Callback Session");
      // console.log("Session ==> ", session);
      // console.log("Token ==> ", token);

      session.user.id = token.id as string;
      // Store and manage sessions in database here (for all creadentials and providers)

      // console.log("Session ==> ", session);
      // console.log("Token ==> ", token);

      return session;
    },
  },

  events: {
    async signOut(message) {
      console.log(">>>=========================> Events SignOut");
      // console.log(message);

      try {
        if ("token" in message && message?.token) {
          await db.session.delete({
            where: {
              sessionToken: message?.token?.sessionId as string,
            },
          });
        }
      } catch (error) {}
    },
  },

  providers: [
    Google,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        console.log(">>>=========================> Authorize");
        // console.log("Credentials ==> ", credentials);

        const email: string = credentials.email as string;
        const password: string = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email: email },
        });

        if (!user || !user.password) {
          throw new CredentialsSignin({
            cause: "Invalied Email or Password",
          });
        }
        const isMatch = bcrypt.compareSync(password, user.password);
        if (!isMatch) {
          throw new CredentialsSignin({
            cause: "Invalied Email or Password",
          });
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;

// https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
// https://github.com/tapascript/learn-next-auth/blob/05-middleware/src/middleware.js
// https://github.com/nextauthjs/next-auth/discussions/4394
