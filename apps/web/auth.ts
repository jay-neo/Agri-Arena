import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "~/lib/prisma";
// import bcrypt from "bcrypt";

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
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
        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({
          where: { email: email },
        });

        if (!user) {
          throw new CredentialsSignin({
            message: "Invalied Email or Password",
          });
        }
        if (!user.password) {
          throw new CredentialsSignin({
            message: "Invalied Email or Password",
          });
        }

        // const isMatch = await bcrypt.compare(password, user.password);

        // if (!isMatch) {
        //   throw new CredentialsSignin({ cause: "Invalied Email or Password" });
        // }

        return { name: user.name, email: user.email, id: user.id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account, credentials }) => {
      if (credentials) {
        try {
          const existingUser = await db.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await db.user.create({
              data: {
                name: user.name,
                email: user.email,
                password: String(credentials.password),
              },
            });
          }
        } catch (err) {
          console.log("Error from Auth ==> ", err);
          throw new AuthError("Error while creating user");
        }
      }

      // try {
      //   const profile = await db.profile.upsert({
      //     where: {
      //       userId: user.id,
      //     },
      //     update: {},
      //     create: {
      //       userId: user.id,
      //     },
      //   });

      //   const monitor = await db.activity_Monitoring.upsert({
      //     where: {
      //       userId: user.id,
      //     },
      //     update: {},
      //     create: {
      //       userId: user.id,
      //     },
      //   });
      // } catch (error) {
      //   console.log(error);
      // }

      return true;
    },
  },
});

// https://authjs.dev/getting-started/session-management/login
// https://authjs.dev/getting-started/authentication/credentials
