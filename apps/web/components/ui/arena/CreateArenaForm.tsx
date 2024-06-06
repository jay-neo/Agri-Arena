"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { createArena } from "~/app/server/arena";
import { useFormState, useFormStatus } from "react-dom";

export const CreateArenaForm = ({ onClose }: { onClose: () => void }) => {
  const [state, action] = useFormState(createArena, undefined);

  useEffect(() => {
    if (state?.message) {
      toast.success("Arena created successfully");
      onClose();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state, onClose]);

  return (
    <form action={action} className="dark:bg-amber-500">
      <div className="container">
        <label className="flex w-full dark:text-black font-bold pb-1">
          Name
        </label>
        <textarea
          id="title"
          name="title"
          autoComplete="off"
          placeholder={""}
          rows={1}
          className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5  bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
        />
        {state?.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title}</p>
        )}
      </div>

      <div className="container mt-5">
        <label className="flex text-black font-bold pb-1">Location</label>
        <textarea
          id="location"
          name="location"
          autoComplete="off"
          placeholder={""}
          rows={1}
          className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
        />
        {state?.errors?.location && (
          <p className="text-sm text-red-500">{state.errors.location}</p>
        )}
      </div>

      <div className="container mt-5">
        <label className="flex dark:text-black font-bold  pb-1">
          Description:
        </label>
        <div className="truncate">
          <textarea
            id="description"
            name="description"
            autoComplete="off"
            placeholder={""}
            className={`flex flex-col text-gray-900 text-sm text-wrap focus:ring-blue-500 focus:border-blue-500  ps-3 p-2.5 dark:text-black h-24 bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
          />
        </div>
        {state?.errors?.description && (
          <p className="text-sm text-red-500">{state.errors.description}</p>
        )}
      </div>
      <div className="flex items-center justify-center pt-4">
        <CreatButton />
      </div>
    </form>
  );
};

const CreatButton = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="m-1 px-3 py-1.5 border flex flex-row-reverse text-black border-black rounded-md hover:bg-orange-400"
    >
      {pending ? "Creating..." : "Create"}
    </button>
  );
};
