import { Metadata } from "next";
import { signIn } from "~/auth";
import { SignupForm } from "./form";
import { HOMEPAGE } from "~/lib/routes";
import SignupWithGoogleButton from "./SignupWithGoogleButton";

export const metadata: Metadata = {
  title: "Sign up",
};

export default async () => {
  return (
    <div className="relative flex flex-col p-4 lg:w-1/3 z-10">
      <div className="relative w-[22rem] p-8 text-center border border-black dark:border-white/50 rounded-lg backdrop-blur-lg">
        <SignupForm />
        <div className="flex items-center justify-center mt-10">
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: HOMEPAGE });
            }}
          >
            <SignupWithGoogleButton />
          </form>
        </div>
      </div>
    </div>
  );
};
