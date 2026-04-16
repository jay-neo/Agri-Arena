import { Metadata } from "next";
import { signIn } from "~/auth";
import { LoginForm } from "./form";
import { HOMEPAGE } from "~/lib/routes";
import LoginWithGoogleButton from "./LoginWithGoogleButton";

export const metadata: Metadata = {
  title: "Login",
};

export default async () => {
  return (
    <>
      <div className="relative flex flex-col p-4 lg:w-1/3 z-10">
        <div className="mt-6 relative w-[22rem] p-8 text-center bg-opacity-5 shadow-lg backdrop-blur-3xl border border-black dark:border-white/50 rounded-lg">
          <LoginForm />
          <div className="flex items-center justify-center mt-10">
            <form
              action={async () => {
                "use server";
                await signIn("google", { redirectTo: HOMEPAGE });
              }}
            >
              <LoginWithGoogleButton />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
