"use client";

import React from "react";
import { ArenaFormState } from "~/app/server/arena/validation";

type FormData<T> = T;

export default ({
  state,
  arena,
  setArena,
  isEditing,
}: {
  arena: ArenaDetails;
  isEditing?: boolean;
  state?: FormData<ArenaFormState>;
  setArena?: React.Dispatch<React.SetStateAction<ArenaDetails>>;
}) => {
  const placeholders = {
    title: "Enter your unique arena name",
    location: "Add your arena location",
    description: "Say about your arena description",
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setArena((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  return (
    <>
      {isEditing ? (
        <>
          <div className="container">
            <label className="flex w-full text-gray-800 font-semibold dark:text-white pb-1">
              Name
            </label>
            <textarea
              id="name"
              name="title"
              autoComplete="off"
              placeholder={placeholders.title}
              onChange={handleInputChange}
              value={arena?.title}
              rows={1}
              className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 dark:text-white bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
            />
            {state?.errors?.title && (
              <p className="text-sm text-red-500">{state.errors.title}</p>
            )}
          </div>

          <div className="container mt-5">
            <label className="flex text-gray-800 font-semibold dark:text-white pb-1">
              Location
            </label>
            <textarea
              id="location"
              name="location"
              autoComplete="off"
              placeholder={placeholders.location}
              onChange={handleInputChange}
              value={arena?.location}
              rows={1}
              className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 dark:text-white bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
            />
            {state?.errors?.location && (
              <p className="text-sm text-red-500">{state.errors.location}</p>
            )}
          </div>

          <div className="container mt-5">
            <label className="flex text-gray-800 font-semibold dark:text-white pb-1">
              Description
            </label>
            <div className="truncate">
              <textarea
                id="description"
                name="description"
                autoComplete="off"
                value={arena?.description}
                onChange={handleInputChange}
                placeholder={placeholders.description}
                className={`flex flex-col text-black text-sm text-wrap focus:ring-blue-500 focus:border-blue-500  ps-3 p-2.5 dark:text-white h-24 bg-slate-300 dark:bg-sky-600/30 w-full border border-gray-300 dark:border-gray-600 rounded-md`}
              />
            </div>
            {state?.errors?.description && (
              <p className="text-sm text-red-500">{state.errors.description}</p>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="container">
            <label className="flex w-full text-gray-800 font-semibold dark:text-white pb-1">
              Name
            </label>
            <p
              className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 dark:text-white bg-slate-100 dark:bg-inherit w-9/12 md:w-6/12 h-auto text-wrap rounded-3xl border-2 border-rose-600`}
            >
              {arena.title || placeholders.title}
            </p>
          </div>
          {/* className="relative inline-block pr-4" */}

          <div className="container mt-5">
            <label className="flex text-gray-800 font-semibold dark:text-white pb-1">
              Location
            </label>
            <p
              className={`text-black text-sm focus:ring-blue-500 focus:border-blue-500 block ps-3 p-2.5 dark:text-white bg-slate-100 dark:bg-inherit w-7/12 md:w-5/12 text-wrap rounded-3xl border-2 border-rose-600`}
            >
              {arena.location || placeholders.location}
            </p>
          </div>

          <div className="container mt-5">
            <label className="flex text-gray-800 font-semibold dark:text-white pb-1">
              Description
            </label>
            <div className="truncate">
              <p
                className={`flex flex-col text-black text-sm text-wrap focus:ring-blue-500 focus:border-blue-500  ps-3 p-2.5 bg-slate-100 dark:bg-inherit w-10/12 md:w-2/3 truncate rounded-3xl border-2 border-rose-600
                  ${!arena.description ? "dark:text-gray-500" : "dark:text-white"}
                  `}
              >
                {arena.description || placeholders.description}
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
};
