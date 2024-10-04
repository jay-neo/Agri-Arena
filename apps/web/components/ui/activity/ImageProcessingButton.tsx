"use client";

import Image from "next/image";
import { Camera } from "~/lib/arena-icons";
import Tooltip from "@mui/material/Tooltip";
import ImageProcessingForm from "./ImageProcessingForm";

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/components/ui/redix/dialog";

export default async () => (
  <Dialog>
    <DialogTrigger asChild>
      <Tooltip describeChild title="Detect disease using Image Processing">
        <button
          type="button"
          className="flex flex-row text-sm px-2.5 py-2 text-white font-semibold rounded-lg transition duration-300 bg-rose-700/70 hover:bg-rose-600 "
        >
          <Image
            src={Camera}
            alt="Camera"
            width={32}
            height={30}
            className="dark:invert"
          />
        </button>
      </Tooltip>
    </DialogTrigger>
    <DialogContent className="border-none bg-[#f7ecfa] dark:bg-[#212146]">
      <ImageProcessingForm />
    </DialogContent>
  </Dialog>
);
