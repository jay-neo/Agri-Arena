import bcrypt from "bcrypt";
import { db } from "./lib/prisma";
import { authConfig } from "./auth.config";
import { neoUser } from "./app/actions/user";
import { Adapter } from "next-auth/adapters";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// import NodeMailer from "next-auth/providers/nodemailer";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db) as Adapter,

  callbacks: {
    authorized({ auth }) {
      print("Callback Authorize");

      const isAuthenticated = !!auth?.user;
      return isAuthenticated;
    },
    async jwt({ token, user, account, trigger, session }) {
      print("Callback JWT");
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
        print("JWT Trigger");
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
      print("Callback Session");
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
      print("Events SignOut");
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
        print("Authorize");
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
});

const print = (str: string) => {
  if (process.env.NODE_ENV !== "production") {
    // console.log(">>>=========================> ", str);
  }
};
