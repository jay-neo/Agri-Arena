"use client";

import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { login } from "~/app/server/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/form/button";
import { useFormState, useFormStatus } from "react-dom";
import { OpenedEye, ClosedEye } from "~/lib/arena-icons";

export function LoginForm() {
  const [state, action] = useFormState(login, undefined);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      state.error = null;
    } else if (state?.message) {
      toast.message(state.message);
      state.message = null;
    } else if (state?.success) {
      toast.success(state.success);
      state.success = null;
      redirect(`/activity`);
    }
  }, [state?.error, state?.message, state?.success]);

  return (
    <>
      <form noValidate={true} className="flex flex-col gap-2" action={action}>
        <h1 className="text-2xl font-bold mb-5 text-black dark:text-lime-500">
          Login
        </h1>
        <div className="relative border-b-2">
          <input
            id="email"
            type="text"
            name="email"
            autoComplete="off"
            // value={email}
            // onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            //   setEmail(event.target.value);
            // }}
            required
            className="w-full h-10 bg-transparent border-none outline-none text-base peer"
          />
          <label
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-base pointer-events-none transition-all 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-full 
              peer-valid:top-0 peer-valid:text-xs peer-valid:-translate-y-full"
          >
            Enter your email
          </label>
        </div>
        {state?.errors?.email && (
          <p className="text-sm text-red-800">{state.errors.email}</p>
        )}
        <div className="relative border-b-2 border-gray-300 mt-6">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            autoComplete="off"
            required
            value={password}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(event.target.value);
            }}
            className="w-full h-10 bg-transparent border-none outline-none text-base peer"
          />
          <label
            className="absolute left-0 top-1/2 transform -translate-y-1/2 text-base pointer-events-none transition-all 
              peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base 
              peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-full 
              peer-valid:top-0 peer-valid:text-xs peer-valid:-translate-y-full"
          >
            Enter your password
          </label>
          {password && (
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            >
              {showPassword ? (
                <Image src={ClosedEye} alt="" width={20} height={20} />
              ) : (
                <Image src={OpenedEye} alt="" width={20} height={20} />
              )}
            </div>
          )}
        </div>
        {state?.errors?.password && (
          <p className="text-sm text-red-800">{state.errors.password}</p>
        )}
        {/* <div className="flex items-center justify-end mb-8 text-white">
          <Link href="/forgot-password" className="hover:underline">
            Forgot password?
          </Link>
        </div> */}
        <LoginButton />

        <div className="mt-1">
          <p>
            Don't have an account!{" "}
            <Link
              href="/signup"
              className="border-x border-blue-600 rounded-full px-2 underline underline-offset-2 hover:text-yellow-400 hover:border-lime-500"
            >
              Register
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      className="mt-4 dark:bg-white dark:text-black font-semibold py-3 px-5 rounded-lg hover:bg-teal-400 transition-all hover:text-black dark:hover:bg-teal-400"
    >
      {pending ? "Submitting..." : "Login"}
    </Button>
  );
}
