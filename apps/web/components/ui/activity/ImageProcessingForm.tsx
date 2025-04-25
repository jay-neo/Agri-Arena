"use client";

import { toast } from "sonner";
import { neoFormAction } from "~/lib/hooks";
import { ReactButton } from "~/lib/neo/button";
import { getArenaInfo } from "~/app/actions/arena/getArenaInfo";
import { fileUploadAction } from "~/app/actions/file-upload/aws-s3";
import { Autocomplete, Fade, TextField, Tooltip } from "@mui/material";
import { useState, useRef, ChangeEvent, DragEvent, useEffect } from "react";
import { diseaseDetectionModelAction } from "~/app/actions/ai-models/diseaseDetectionModelAction";
import { getDiseaseDetectionModelsInfo } from "~/app/actions/ai-models/getDiseaseDetectionModelsInfo";

export default function DiseaseDetectionForm() {
  const [uploadState, uploadAction] = neoFormAction(fileUploadAction);
  const [_detectionState, detectionAction] = neoFormAction(
    diseaseDetectionModelAction
  );

  const [arenas, setArenas] = useState<ArenaInfo[]>([]);
  const [formData, setFormData] = useState<{ image: string }>(null);
  const [crops, setCrops] = useState<DiseaseDetectionModelInfo[]>([]);
  const [selectedArena, setSelectedArena] = useState<ArenaInfo | null>(null);
  const [selectedCrop, setSelectedCrop] =
    useState<DiseaseDetectionModelInfo | null>(null);

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

  // Reset form handler
  const handleReset = () => {
    setFormData(null);
    setSelectedCrop(null);
    setSelectedArena(null);

    if (uploadState?.data?.imageUrl) {
      uploadState.data = null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setCrops(await getDiseaseDetectionModelsInfo());
        setArenas(await getArenaInfo());
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load necessary data");
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      {!uploadState?.data?.imageUrl ? (
        <form
          className="border-none"
          action={uploadAction}
          onSubmit={(e) => {
            if (!fileInputRef.current?.files?.[0]) {
              e.preventDefault();
              toast.error("Please select an image");
            }
          }}
        >
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
            className="img-area relative w-full h-60 bg-fuchsia-300/30 dark:bg-black/30 mb-6 rounded-lg overflow-hidden flex justify-center items-center flex-col"
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

          <div className="flex gap-4 items-center justify-center">
            {!formData?.image ? (
              <button
                type="button"
                className="mx-auto select-image text-sm text-white px-4 py-2 bg-purple-600 dark:bg-rose-600/70 font-semibold rounded-lg transition duration-300 hover:dark:bg-rose-600/90"
                onClick={() => fileInputRef.current?.click()}
              >
                Select Image
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="select-image text-sm text-white px-4 py-2 bg-purple-600 dark:bg-rose-600/70 hover:dark:bg-rose-600 font-semibold rounded-lg transition duration-300"
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  className="cancel-image text-sm px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-red-700"
                  onClick={handleReset}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      ) : (
        <form className="border-none" action={detectionAction}>
          {crops && arenas ? (
            <>
              <input
                type="hidden"
                name="imageUrl"
                value={uploadState?.data?.imageUrl}
              />

              <div className="mb-6">
                <img
                  src={uploadState?.data?.imageUrl}
                  alt="Uploaded image"
                  className="w-full h-60 object-cover border-2 border-black rounded-lg"
                />
              </div>

              <Tooltip
                disableFocusListener
                followCursor
                describeChild
                TransitionComponent={Fade}
                title="Select the crop you want to process"
              >
                <Autocomplete
                  fullWidth
                  value={selectedCrop}
                  onChange={(
                    _event: any,
                    value: DiseaseDetectionModelInfo | null
                  ) => {
                    setSelectedCrop(value);
                  }}
                  id="crop-autocomplete"
                  options={crops}
                  getOptionLabel={(option: DiseaseDetectionModelInfo) =>
                    option.displayCrop || ""
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Crop"
                      name="crop"
                      type="string"
                      fullWidth
                      className="dark:invert"
                    />
                  )}
                  noOptionsText="No crops found"
                />
              </Tooltip>

              <input
                type="hidden"
                name="modelId"
                value={selectedCrop?.id || ""}
              />

              <Tooltip
                disableFocusListener
                followCursor
                describeChild
                TransitionComponent={Fade}
                title="Select the arena for processing"
              >
                <Autocomplete
                  fullWidth
                  value={selectedArena}
                  onChange={(_event: any, value: ArenaInfo | null) => {
                    setSelectedArena(value);
                  }}
                  id="arena-autocomplete"
                  options={arenas}
                  getOptionLabel={(option: ArenaInfo) => option.title || ""}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      margin="dense"
                      label="Arena"
                      name="arena"
                      type="string"
                      fullWidth
                      className="dark:invert"
                    />
                  )}
                  noOptionsText="No arenas found"
                />
              </Tooltip>

              <input
                type="hidden"
                name="arenaId"
                value={selectedArena?.id || ""}
              />

              <div className="mt-2 flex gap-4 items-center justify-center">
                <ReactButton
                  onStatic="Process"
                  onAction="Processing..."
                  className="upload-image text-sm px-4 py-2 dark:bg-rose-600/70 hover:dark:bg-rose-600 text-white font-semibold rounded-lg transition duration-300 disabled:bg-rose-600/70"
                />
                <button
                  type="button"
                  className="cancel-image text-sm px-4 py-2 bg-red-600 text-white font-semibold rounded-lg transition duration-300 hover:bg-red-700"
                  onClick={handleReset}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <div>Loading crops and arenas...</div>
          )}
        </form>
      )}
    </div>
  );
}
