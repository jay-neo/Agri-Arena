"use client";

import clsx from "clsx";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { HOMEPAGE } from "~/lib/routes";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { signup } from "~/app/actions/auth";
import { Button } from "~/components/ui/form/button";
import { useFormState, useFormStatus } from "react-dom";
import { OpenedEye, ClosedEye } from "~/lib/arena-icons";

const inputField = `absolute left-0 top-1/2 transform -translate-y-1/2 text-base pointer-events-none transition-all peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:-translate-y-full peer-valid:top-0 peer-valid:text-xs peer-valid:-translate-y-full`;

export function SignupForm() {
  const [state, action] = useFormState(signup, undefined);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
      redirect(HOMEPAGE);
    }
  }, [state?.error, state?.message, state?.success]);

  return (
    <>
      <form noValidate={true} className="flex flex-col gap-2" action={action}>
        <h1 className="text-2xl font-bold mb-6 dark:text-amber-500">
          Create an account
        </h1>
        <div className="relative border-b-2">
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="off"
            required
            className="w-full h-10 bg-transparent border-none outline-none peer"
          />
          <label className={clsx(inputField)}>Enter your name</label>
        </div>
        {state?.errors?.name && (
          <p className="text-sm text-red-800">{state.errors.name}</p>
        )}
        <div className="relative border-b-2 mt-6">
          <input
            id="email"
            type="text"
            name="email"
            autoComplete="off"
            required
            className="w-full h-10 bg-transparent border-none outline-none text-base peer"
          />
          <label className={clsx(inputField)}>Enter your email</label>
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
            onChange={handlePasswordChange}
            className="w-full h-10 bg-transparent border-none outline-none text-base peer"
          />
          <label className={clsx(inputField)}>Enter your password</label>
          {password && (
            <div
              className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={togglePasswordVisibility}
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
          <div className="text-sm text-red-800">
            <p>Password must:</p>
            <ul>
              {state.errors.password.map((error) => (
                <li key={error}>- {error}</li>
              ))}
            </ul>
          </div>
        )}
        <SignupButton />

        <div className="mt-2">
          <p>
            Already have an account!!{" "}
            <Link
              href="/login"
              className="border-x border-blue-600 rounded-full px-2 py-1  underline underline-offset-2 hover:text-lime-400 hover:border-yellow-400"
            >
              Login
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}

export function SignupButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      className="mt-4 dark:bg-white dark:text-black hover:text-black font-semibold py-3 px-5 rounded-lg hover:bg-teal-400 transition-all dark:hover:bg-teal-400"
    >
      {pending ? "Submitting..." : "Sign up"}
    </Button>
  );
}
