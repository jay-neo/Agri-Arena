"use client";

import { toast } from "sonner";
import Image from "next/image";
import { useFormState, useFormStatus } from "react-dom";
import { Edit } from "~/lib/arena-icons";
import { getProfile, setProfile } from "~/app/server/user";
import React, { useEffect, useState } from "react";

export default ({ myprofile }: { myprofile: Profile | null }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [formData, setFormData] = useState<Profile | null>(myprofile);
  const [state, action] = useFormState(setProfile, undefined);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      // (async () => setFormData(await getProfile()))();
      setIsEditMode(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) =>
      prevData ? { ...prevData, [name]: value } : null
    );
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prevData) =>
          prevData
            ? { ...prevData, image: event.target?.result as string }
            : null
        );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <form action={action}>
      <div className="flex justify-center mb-10 ">
        {isEditMode ? (
          <div className="flex flex-col items-center">
            <label htmlFor="avatar-upload" className="relative cursor-pointer">
              {formData?.image && (
                <img
                  src={
                    typeof formData.image === "string"
                      ? formData.image
                      : URL.createObjectURL(formData.image)
                  }
                  alt="Avatar"
                  className="rounded-full w-24 h-24 border-2 border-[#ff8c42]"
                />
              )}
              <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#007965] rounded-full flex items-center justify-center">
                <Image src={Edit} alt="edit" className="h-2 w-2 dark:invert" />
              </div>
            </label>
            <input
              type="file"
              id="avatar-upload"
              name="image"
              accept="image/jpeg, image/png, image/jpg"
              onChange={handleAvatarChange}
              className="hidden"
            />
            {state?.errors?.image && (
              <span className="text-red-500 text-sm">{state.errors.image}</span>
            )}
            <span className="text-[#007965] dark:text-white font-medium mt-2">
              Edit Avatar
            </span>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            {formData?.image && (
              <img
                src={
                  typeof formData.image === "string"
                    ? formData.image
                    : URL.createObjectURL(formData.image)
                }
                alt="Avatar"
                className="rounded-full w-24 h-24 border-2 border-[#ff8c42]"
              />
            )}
            <span className="font-bold text-xl text-amber-700 mt-2">
              My Profile
            </span>
          </div>
        )}
      </div>

      <div className="mt-5">
        {["Name", "Address", "City", "State", "Country", "Pincode"].map(
          (field) => {
            const lowerField = field.toLowerCase();
            return (
              <div key={field} className="flex justify-between mb-4">
                <span className="text-[#6a0dad] dark:text-white">{`${field}:`}</span>
                {isEditMode ? (
                  <div className="flex flex-col">
                    <input
                      type="text"
                      name={lowerField}
                      value={
                        formData
                          ? formData[lowerField as keyof typeof formData]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="text-amber-700 border-b ps-2 bg-inherit border-black dark:border-white focus:outline-none"
                    />
                    {state?.errors?.[lowerField] && (
                      <span className="text-red-500 text-sm">
                        {state.errors[lowerField]}
                      </span>
                    )}
                  </div>
                ) : (
                  <span
                    className={`${
                      formData && formData[lowerField as keyof typeof formData]
                        ? "text-[#006400] dark:text-yellow-300"
                        : "text-gray-500"
                    }`}
                  >
                    {formData
                      ? formData[lowerField as keyof typeof formData] ||
                        "not mentioned"
                      : "not mentioned"}
                  </span>
                )}
              </div>
            );
          }
        )}
      </div>

      <div className="flex justify-center mt-20">
        {isEditMode ? (
          <>
            <SubmitButton />
            <button
              type="reset"
              className="bg-[#faf3e0] text-black hover:text-red-500 border border-[#6a0dad] py-1 px-2 rounded-md shadow-sm hover:shadow-md ml-2"
              onClick={(e) => {
                e.preventDefault();
                setFormData(myprofile);
                setIsEditMode(false);
                state?.message && (state.message = null);
                state?.errors && (state.errors = null);
                state?.error && (state.error = null);
              }}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setIsEditMode(true);
            }}
            className="bg-[#faf3e0] text-black border border-black py-1 px-4 rounded-md shadow-sm hover:shadow-md"
          >
            Edit
          </button>
        )}
      </div>
    </form>
  );
};

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="bg-[#faf3e0] hover:text-green-700 text-black border border-[#6a0dad] py-1 px-4 rounded-md shadow-sm hover:shadow-md mr-2"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
};
