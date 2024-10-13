"use client";

import { toast } from "sonner";
import { neoFormAction } from "~/lib/hooks";
import { ReactButton } from "~/lib/neo/button";
import { modelDD1V1 } from "~/app/server/models/agriarena";
import { useState, useRef, ChangeEvent, DragEvent } from "react";

type Image = {
  image: string;
};

export default () => {
  const [_state, action] = neoFormAction(modelDD1V1);
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
          className="img-area relative w-full h-60 bg-fuchsia-300/30 dark:bg-cyan-700  mb-6 rounded-lg overflow-hidden flex justify-center items-center flex-col"
          onDragOver={(event: DragEvent<HTMLDivElement>) =>
            event.preventDefault()
          }
          onDrop={handleDrop}
        >
          {!formData?.image ? (
            <>
              <i className="bx bxs-cloud-upload icon text-6xl"></i>
              <h3 className="text-xl font-semibold">Upload Image</h3>
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
              className="select-image text-sm text-white px-4 py-2 bg-purple-600 dark:bg-rose-600/70 font-semibold rounded-lg transition duration-300 hover:bg-purple-700 dark:hover:bg-fuchsia-600"
              onClick={(e: React.FormEvent) => {
                e.preventDefault();
                fileInputRef.current?.click();
              }}
            >
              Select Image
            </button>
          ) : (
            <>
              <ReactButton
                onStatic="Process"
                onAction="Processing..."
                className="upload-image text-sm px-4 py-2 bg-green-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-green-700"
              />
              <button
                type="button"
                className="cancel-image text-sm px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-red-700"
                onClick={(e: React.FormEvent) => {
                  e.preventDefault();
                  setFormData(null);
                }}
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
