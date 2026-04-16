"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { contactWithCompany } from "~/app/actions/company";

export const ContactForm = ({
  name,
  email,
}: {
  name?: string;
  email?: string;
}) => {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    message: string;
  }>({ name: name || "", email: email || "", message: "" });
  const [state, action] = useFormState(contactWithCompany, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
      state.error = null;
    } else if (state?.message) {
      toast.message(state.message);
      state.message = null;
    } else if (state?.success) {
      setFormData((prevData) =>
        prevData ? { ...prevData, ["message"]: "" } : null,
      );
      toast.success(state.success);
      state.success = null;
    }
  }, [state?.error, state?.message, state?.success]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null,
    );
  };

  return (
    <form action={action} className="space-y-3 w-full max-w-xl">
      <div className="">
        <label
          htmlFor="name"
          className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData?.name}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        {state?.errors?.name && (
          <span className="text-red-500 text-sm">{state.errors.name}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData?.email}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
        {state?.errors?.email && (
          <span className="text-red-500 text-sm">{state.errors?.email}</span>
        )}
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1"
        >
          Your Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData?.message || ""}
          onChange={handleInputChange}
          className="w-full p-3 border rounded-md shadow-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        ></textarea>
        {state?.errors?.message && (
          <span className="text-red-500 text-sm">{state.errors?.message}</span>
        )}
      </div>

      <div className="flex items-center justify-center">
        <SubmitButton />
      </div>
    </form>
  );
};

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-[#6a0dad] px-3 py-2 w-32 dark:bg-yellow-300 text-white dark:text-black font-semibold rounded-md shadow-sm hover:bg-[#5c0b9b] dark:hover:bg-yellow-400"
    >
      {pending ? "Sending..." : "Send"}
    </button>
  );
};
