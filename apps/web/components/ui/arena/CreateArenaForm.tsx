"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { ReactButton } from "~/lib/neo/button";
import { createArena } from "~/app/server/arena";
import clsx from "clsx";

const LABEL = "flex w-full pb-1";
const ERROR = "text-sm text-red-500 dark:text-yellow-400";
const TEXTAREA = `text-sm block ps-3 p-2.5 bg-black/20 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700`;

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
    <form action={action} className="dark:bg-[#2f2f61] p-2 rounded-lg">
      <div className="container">
        <label className={LABEL}>Name</label>
        <textarea
          id="title"
          name="title"
          autoComplete="off"
          placeholder={""}
          rows={1}
          className={clsx(TEXTAREA)}
        />
        {state?.errors?.title && <p className={ERROR}>{state.errors.title}</p>}
      </div>

      <div className="container mt-5">
        <label className={LABEL}>Location</label>
        <textarea
          id="location"
          name="location"
          autoComplete="off"
          placeholder={""}
          rows={1}
          className={clsx(TEXTAREA)}
        />
        {state?.errors?.location && (
          <p className={ERROR}>{state.errors.location}</p>
        )}
      </div>

      <div className="container mt-5">
        <label className={LABEL}>Description:</label>
        <div className="truncate">
          <textarea
            id="description"
            name="description"
            autoComplete="off"
            placeholder={""}
            className={clsx(TEXTAREA)}
          />
        </div>
        {state?.errors?.description && (
          <p className={ERROR}>{state.errors.description}</p>
        )}
      </div>
      <div className="flex items-center justify-center mt-4">
        <ReactButton
          onStatic="Create"
          onAction="Creating..."
          className={clsx(
            "m-1 px-6 py-1.5 min-w-24 text-white font-semibold rounded-lg transition duration-300 disabled:bg-rose-600/70",
            "bg-purple-600/80 hover:bg-purple-600 dark:bg-rose-600/70 hover:dark:bg-rose-600"
          )}
        />
      </div>
    </form>
  );
};
