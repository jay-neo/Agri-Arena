import Link from "next/link";
import Image from "next/image";
import { getFormattedDate } from "~/lib/formatters/date";
import { IotSvg, Location,  } from "~/lib/arena-icons";
import { TreePalm } from "lucide-react";

export const ArenaPreview = async ({ arena }: { arena: ArenaOverview }) => {
  return (
    <div className="">
      <Link
        key={`${arena.idx}`}
        href={`arena/${arena.idx}`}
        className="block container mx-2 w-[22rem] h-48 rounded-2xl bg-sky-200/80 dark:bg-white/5 p-3 shadow-surface-elevation-low transition duration-300 hover:bg-sky-300/80 dark:hover:bg-white/10 dark:hover:shadow-surface-elevation-medium"
      >
        <div>
          <h3 className="text-xl transition duration-300 truncate">
            {arena.title}
          </h3>
          <div className="flex flex-row justify-start items-baseline h-6">
            <div className="mr-1">
              <Image src={Location} alt=":>" className="w-4 dark:invert mt-1" />
            </div>
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              {arena.location}
            </p>
          </div>
          <div className="flex flex-row justify-start items-baseline h-6">
            <div className="mr-1">
              <TreePalm className="w-4 dark:invert" />
            </div>
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              Current Crop: {arena.currentCrop || "Not specified"}
            </p>
          </div>
          <div className="flex flex-row justify-start items-baseline h-6">
            <div className="mr-1">
              {/* <Image src={AreaIcon} alt=":>" className="w-4 dark:invert" /> */}
            </div>
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              Area: {arena.area || "Not specified"}
            </p>
          </div>
          <div className="flex flex-row justify-start items-baseline h-6">
            <div className="mr-1">
              {/* <Image src={Soil} alt=":>" className="w-4 dark:invert" /> */}
            </div>
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              Soil Type: {arena.soilType || "Not specified"}
            </p>
          </div>
          <div className="flex flex-row justify-start items-baseline h-6">
            <div className="mr-1">
              <Image src={IotSvg} alt=":>" className="w-4 dark:invert" />
            </div>
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              Deployed IoTs{" - "}
              {arena.iots}
            </p>
          </div>
          <div className="flex flex-row items-center justify-end h-6">
            <p className="mt-4 text-sm dark:text-rose-100 truncate">
              {getFormattedDate(arena.updatedAt)}
            </p>
          </div>
        </div>
      </Link>
      <br />
    </div>
  );
};