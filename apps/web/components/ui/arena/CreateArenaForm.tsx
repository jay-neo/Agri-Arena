"use client";

import clsx from "clsx";
import { toast } from "sonner";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { ReactButton } from "~/lib/neo/button";
import { createArena } from "~/app/server/arena";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ArrowDownIcon } from "lucide-react";

const LABEL = "flex w-full pb-1";
const ERROR = "text-sm text-red-500 dark:text-yellow-400";
const TEXTAREA = `text-sm block ps-3 p-2.5 bg-black/20 w-full rounded-md focus:outline-none focus:ring-1 focus:ring-gray-700`;

const FormField = ({
  id,
  name,
  label,
  rows = 1,
  errors,
}: {
  id: string;
  name: string;
  label: string;
  rows?: number;
  errors?: string[] | string;
}) => (
  <div className="container mt-5">
    <label className={LABEL}>{label}</label>
    <textarea
      id={id}
      name={name}
      autoComplete="off"
      placeholder=""
      rows={rows}
      className={clsx(TEXTAREA)}
    />
    {errors && (
      <div className={ERROR}>
        {Array.isArray(errors) ? (
          <ul>
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        ) : (
          <p>{errors}</p>
        )}
      </div>
    )}
  </div>
);

const AdditionalInfoAccordion = ({ state }: { state: any }) => (
  <div className="container mt-5">
    <Accordion
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none", // removes the shadow if needed
        "&:before": {
          display: "none", // removes the default divider line
        },
      }}
    >
      <AccordionSummary
        expandIcon={<ArrowDownIcon className="w-5 h-5" />}
        aria-controls="panel2-content"
        id="panel2-header"
        sx={{
          backgroundColor: "none",
        }}
      >
        <Typography
          component="span"
          className="text-sm font-light"
          sx={{ fontSize: 13 }}
        >
          Optional
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          backgroundColor: "none",
        }}
      >
        <FormField
          id="currentCrop"
          name="currentCrop"
          label="Current Crop"
          errors={state?.errors?.currentCrop}
        />
        <FormField
          id="area"
          name="area"
          label="Area (in acres)"
          errors={state?.errors?.area}
        />
        <FormField
          id="soilType"
          name="soilType"
          label="Soil Type"
          errors={state?.errors?.soilType}
        />
      </AccordionDetails>
    </Accordion>
  </div>
);

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
      <FormField
        id="title"
        name="title"
        label="Title"
        errors={state?.errors?.title}
      />

      <FormField
        id="location"
        name="location"
        label="Location"
        errors={state?.errors?.location}
      />

      <FormField
        id="description"
        name="description"
        label="Description"
        rows={2}
        errors={state?.errors?.description}
      />

      <AdditionalInfoAccordion state={state} />

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
