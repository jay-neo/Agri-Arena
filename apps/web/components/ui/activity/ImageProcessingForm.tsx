"use client";

import { redirect } from "next/navigation";
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { uploadS3 } from "~/app/server/ip/upload-s3";
import { Button } from "~/components/ui/form/button";

type Image = {
  image: string;
};

export default () => {
  const [formData, setFormData] = useState<Image>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const image = e.target.files?.[0];
    if (
      image &&
      image.size < 2000000 &&
      /image\/(jpeg|jpg|png)/.test(image.type)
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ image: event.target?.result as string });
      };
      reader.readAsDataURL(image);
    } else {
      toast.error("Image must be jpg, jpeg, or png and less than 2MB");
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const image = e.dataTransfer.files?.[0];

    if (
      image &&
      image.size < 2000000 &&
      /image\/(jpeg|jpg|png)/.test(image.type)
    ) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData({ image: event.target?.result as string });
      };
      reader.readAsDataURL(image);
    } else {
      toast.error("Image must be jpg, jpeg, or png and less than 2MB");
    }
  };

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData(null);
  };

  const [state, action] = useFormState(uploadS3, undefined);

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.message) {
      redirect(`${state.message}`);
    }
  }, [state]);

  return (
    <form className="border-none" action={action}>
      <div className="container mx-auto p-6">
        <input
          type="file"
          id="image"
          name="image"
          accept="image/jpeg, image/png, image/jpg"
          className="hidden"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
        <div
          className="img-area relative w-full h-60 bg-fuchsia-300/30 dark:bg-gray-700  mb-6 rounded-lg overflow-hidden flex justify-center items-center flex-col"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {!formData?.image ? (
            <>
              <i className="bx bxs-cloud-upload icon text-6xl"></i>
              <h3 className="text-xl text-gray-400 font-semibold">
                Upload Image
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Image size must be less than <span>2MB</span>
              </p>
            </>
          ) : (
            <img
              src={formData?.image}
              alt="Preview"
              className="absolute top-0 left-0 w-full h-full object-cover border-2 border-black rounded-lg"
            />
          )}
        </div>
        <div className="flex justify-center space-x-4">
          {!formData?.image ? (
            <button
              type="button"
              className="select-image text-sm px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-purple-700"
              onClick={(e: React.FormEvent) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Select Image
            </button>
          ) : (
            <>
              <ProcessButton />
              <button
                type="button"
                className="cancel-image text-sm px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-red-700"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
};

const ProcessButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <Button
      aria-disabled={pending}
      type="submit"
      className="upload-image text-sm px-4 py-2 bg-green-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-green-700"
    >
      {pending ? "Processing..." : "Process"}
    </Button>
  );
};
