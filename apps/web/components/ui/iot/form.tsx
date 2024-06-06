"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import { getArenasWithId } from "~/app/server/arena";
import { Button } from "~/components/ui/form/button";
import { TextField, Autocomplete } from "@mui/material";
import { useFormState, useFormStatus } from "react-dom";
import { IoTFormState } from "~/app/server/iot/validation";

export const IoTForm = ({
  setIsOpen,
  data,
  setRows,
  setNewRow,
  formType,
  action,
}: {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewRow?: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  data?: IoT;
  setRows?: React.Dispatch<React.SetStateAction<IoT[]>>;
  formType: "create" | "edit";
  action: (_state: IoTFormState, formData: FormData) => Promise<IoTFormState>;
}) => {
  const [state, neoAction] = useFormState(action, undefined);
  const [arenas, setArenas] = useState<ArenaIds[]>([]);
  const [selectedArena, setSelectedArena] = useState<
    { arena: string; arenaId: string } | undefined
  >({ arena: data?.arena, arenaId: data?.arenaId } || undefined);

  useEffect(() => {
    (async () => setArenas(await getArenasWithId()))();
  }, []);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);

      const neoData = JSON.parse(state.code);
      if (formType === "create") {
        setNewRow((oldRows) => [...oldRows, neoData as GridRowsProp]);
      } else if (formType === "edit") {
        setRows((prevRows) =>
          prevRows.map((row) =>
            row.id === data.id ? { ...row, ...neoData } : row
          )
        );
      }
      setIsOpen(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6 bg-yellow-400/40">
      <div
        className="fixed inset-0 bg-gray-800 opacity-50"
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="relative bg-yellow-50 dark:bg-amber-500 p-5 md:p-10 scrollbar-hide rounded-lg shadow-lg w-full  max-w-2xl max-h-full h-auto overflow-auto">
        <button
          className="absolute top-2 right-5 font-bold text-gray-600 hover:text-gray-900 text-3xl"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <form action={neoAction}>
          <TextField
            margin="dense"
            label="Title"
            name="title"
            fullWidth
            defaultValue={data?.title}
            className="dark:invert"
          />
          {state?.errors?.title && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.title}
            </div>
          )}
          <TextField
            margin="dense"
            label="Device ID"
            name="device"
            type="text"
            disabled={formType === "edit"}
            fullWidth
            defaultValue={data?.device}
            className="dark:invert"
          />
          {state?.errors?.device && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.device}
            </div>
          )}
          <TextField
            margin="dense"
            label="Interval (in Days)"
            name="interval"
            type="number"
            fullWidth
            defaultValue={data?.interval || 1}
            className="dark:invert"
          />
          {state?.errors?.interval && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors?.interval}
            </div>
          )}
          <TextField
            margin="dense"
            label="Location"
            name="location"
            type="text"
            fullWidth
            defaultValue={data?.location}
            className="dark:invert"
          />
          {state?.errors?.location && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.location}
            </div>
          )}
          <Autocomplete
            fullWidth
            value={
              (arenas &&
                arenas.find((arena) => arena.id === selectedArena?.arenaId)) ||
              null
            }
            onChange={(event: any, value: ArenaIds | null) => {
              setSelectedArena({
                arena: value?.title,
                arenaId: value?.id,
              });
            }}
            inputValue={selectedArena?.arena || ""}
            onInputChange={(event, newInputValue) => {
              setSelectedArena({ ...selectedArena, arena: newInputValue });
            }}
            id="arena-autocomplete"
            options={arenas || []}
            getOptionLabel={(option: ArenaIds) => option.title || ""}
            renderInput={(params) => (
              <TextField
                {...params}
                margin="dense"
                label="Arena"
                name="arena"
                type="string"
                fullWidth
                value={selectedArena?.arena}
                className="dark:invert"
              />
            )}
            noOptionsText="No arena found"
          />
          {state?.errors?.arena && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors?.arena}
            </div>
          )}
          <input
            type="hidden"
            name="arenaId"
            value={selectedArena?.arenaId || ""}
          />
          <TextField
            margin="dense"
            label="Description"
            name="description"
            fullWidth
            value={data?.description}
            className="dark:invert"
          />
          {state?.errors?.description && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.description}
            </div>
          )}
          {formType === "edit" && (
            <input type="hidden" name="device" value={data?.device || ""} />
          )}
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
            <Button onClick={() => setIsOpen(false)}>Cancel</Button>
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();

  return <Button type="submit">{pending ? "Saving..." : "Save"}</Button>;
};
