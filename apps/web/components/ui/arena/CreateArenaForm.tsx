"use client";

import { toast } from "sonner";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { ReactButton } from "~/lib/neo/button";
import { createArena } from "~/app/server/arena";

const LABEL = "flex w-full font-semibold text-black pb-1";
const ERROR = "text-sm text-red-500 dark:text-yellow-400";

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
    <form action={action} className="dark:bg-cyan-600 p-2 rounded-lg">
      <div className="container">
        <label className={LABEL}>Name</label>
        <textarea
          id="title"
          name="title"
          autoComplete="off"
          placeholder={""}
          rows={1}
          className={`text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5  bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
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
          className={`text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
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
            className={`flex flex-col text-sm text-wrap focus:ring-blue-500 focus:border-blue-500  ps-3 p-2.5 h-24 bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
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
          className="m-1 px-6 py-1.5 font-bold min-w-40 border border-2 rounded-3xl hover:bg-orange-400 hover:text-black hover:border-black"
        />
      </div>
    </form>
  );
};
