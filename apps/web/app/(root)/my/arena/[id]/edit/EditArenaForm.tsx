"use client";

import Link from "next/link";
import Image from "next/image";
import { neoFormAction } from "~/lib/hooks";
import { ReactButton } from "~/lib/neo/ReactButton";
import { updateArenaAction } from "~/app/actions/arena";
import { ArenaFormField } from "~/components/ui/arena/ArenaFormField";

export const EditArenaForm = ({ arena }: Readonly<{ arena: ArenaDetails }>) => {
  const placeholders = {
    title: "Enter your unique arena name",
    location: "Add your arena location",
    description: "Say about your arena description",
    area: "",
    currectCrop: "",
    soilType: "",
  };
  const [state, action] = neoFormAction(updateArenaAction, undefined);

  return (
    <form className="md:px-3 w-full mx-0.5" action={action}>
      <Image
        src={arena.image}
        alt="Arena Avatar"
        className="w-full h-56 object-cover rounded-lg shadow-lg mb-12"
        width={600}
        height={400}
      />

      <div className="md:px-20">
        <input type="hidden" name="idx" value={arena.idx} />
        <ArenaFormField
          id="title"
          placeholder={placeholders.title}
          errors={state?.errors?.title}
          defaultValue={arena?.title}
          labelClass="font-semibold"
          required
        />
        <ArenaFormField
          id="location"
          placeholder={placeholders.location}
          errors={state?.errors?.location}
          defaultValue={arena?.location}
          labelClass="font-semibold"
          required
        />
        <ArenaFormField
          id="description"
          errors={state?.errors?.description}
          defaultValue={arena?.description}
          labelClass="font-semibold"
        />
        <ArenaFormField
          id="area"
          label="Area (in acres)"
          type="number"
          errors={state?.errors?.area}
          defaultValue={arena?.area}
          labelClass="font-semibold"
        />
        <ArenaFormField
          id="soilType"
          label="Soil type"
          errors={state?.errors?.soilType}
          defaultValue={arena?.soilType}
          labelClass="font-semibold"
        />
        <ArenaFormField
          id="currentCrop"
          label="Current crop"
          errors={state?.errors?.currentCrop}
          defaultValue={arena?.currentCrop}
          labelClass="font-semibold"
        />

        <div className="mt-4 mb-10  flex justify-end w-full">
          <Link
            type="button"
            href={`/my/arena/${arena.idx}`}
            className="text-sm border dark:border-none dark:text-white hover:text-red-500 px-4 py-2 rounded-lg shadow-lg transition-colors"
          >
            Cancel
          </Link>
          <ReactButton
            onStatic={"Save"}
            onAction={"Saving..."}
            className="ml-2 text-sm border hover:border-blue-400 hover:text-green-500 dark:text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
          />
        </div>
      </div>
    </form>
  );
};
