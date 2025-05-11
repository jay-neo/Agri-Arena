"use client";

import { toast } from "sonner";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { GridRowsProp } from "@mui/x-data-grid";
import { getArenaInfo } from "~/app/actions/arena";
import { ReactButton } from "~/lib/neo/ReactButton";
import { IoTState } from "~/app/actions/iot/iot.schema";
import { TextField, Autocomplete, Tooltip, Fade } from "@mui/material";
import clsx from "clsx";

export const IoTForm = ({
  data,
  action,
  setRows,
  formType,
  setIsOpen,
  setNewRow,
}: {
  data?: IoT;
  formType: "create" | "edit";
  setRows?: React.Dispatch<React.SetStateAction<IoT[]>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewRow?: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
  action: (_state: IoTState, formData: FormData) => Promise<IoTState>;
}) => {
  const [state, neoAction] = useFormState(action, undefined);
  const [arenas, setArenas] = useState<ArenaInfo[]>([]);
  const [selectedArena, setSelectedArena] = useState<{
    arena: string;
    arenaId: string;
  } | null>(data ? { arena: data.arena, arenaId: data.arenaId } : null);

  useEffect(() => {
    (async () => setArenas(await getArenaInfo()))();
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
            row.id === data.id ? { ...row, ...neoData } : row,
          ),
        );
      }
      setIsOpen(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6">
      <div
        className="fixed inset-0 bg-black/70"
        onClick={() => setIsOpen(false)}
      ></div>

      <div className="relative bg-white dark:bg-[#2f2f61] p-5 md:p-10 scrollbar-hide rounded-lg shadow-lg w-full  max-w-2xl max-h-full h-auto overflow-auto">
        <h1 className="font-semibold text-2xl mb-4 text-center">
          {formType == "create" ? "Create IoT" : "Update IoT"}
        </h1>
        <button
          className="absolute top-2 right-5 font-bold text-gray-600 hover:text-gray-900 text-3xl"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>
        <form action={neoAction} className="mt-6 md:mt-1 dark:invert">
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="This is your preferred IoT identification title"
          >
            <TextField
              margin="dense"
              label="Title"
              name="title"
              fullWidth
              required
              defaultValue={data?.title}
              className="dark:invert"
            />
          </Tooltip>
          {state?.errors?.title && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.title}
            </div>
          )}
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="Device ID is unique identifier provided with IoT device"
          >
            <TextField
              margin="dense"
              label="Device ID"
              name="device"
              type="text"
              required
              disabled={formType === "edit"}
              fullWidth
              defaultValue={data?.device}
              className="dark:invert"
            />
          </Tooltip>
          {state?.errors?.device && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.device}
            </div>
          )}
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="Interval used to group similar experiments in single unit"
          >
            <TextField
              margin="dense"
              label="Interval (in Days)"
              name="interval"
              type="number"
              required
              fullWidth
              defaultValue={data?.interval || 1}
              className="dark:invert"
            />
          </Tooltip>
          {state?.errors?.interval && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors?.interval}
            </div>
          )}
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="This is your accurate IoT location deployed in the arena"
          >
            <TextField
              margin="dense"
              label="Location"
              name="location"
              type="text"
              fullWidth
              defaultValue={data?.location}
              className="dark:invert"
            />
          </Tooltip>
          {state?.errors?.location && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.location}
            </div>
          )}
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="Select your arena where IoT is deployed"
          >
            <Autocomplete
              fullWidth
              value={
                (arenas &&
                  arenas.find(
                    (arena) => arena.id === selectedArena?.arenaId,
                  )) ||
                null
              }
              onChange={(event: any, value: ArenaInfo | null) => {
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
              getOptionLabel={(option: ArenaInfo) => option.title || ""}
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
          </Tooltip>
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
          <Tooltip
            arrow
            placement="right"
            describeChild
            disableHoverListener
            disableTouchListener
            TransitionComponent={Fade}
            title="This is a description about your IoT device"
          >
            <TextField
              margin="dense"
              label="Description"
              name="description"
              fullWidth
              value={data?.description}
              className="dark:invert"
            />
          </Tooltip>
          {state?.errors?.description && (
            <div className="text-red-500 text-sm mb-1">
              {state.errors.description}
            </div>
          )}
          {formType === "edit" && (
            <input type="hidden" name="device" value={data?.device || ""} />
          )}
          <div className="flex flex-row items-center justify-center gap-4 mt-2">
            <ReactButton
              onStatic="Save"
              onAction="Saving "
              className={clsx(
                "m-1 px-6 py-1.5 min-w-24 text-white font-semibold rounded-lg transition duration-300 disabled:bg-rose-600/70",
                "bg-purple-600/80 hover:bg-purple-600 dark:bg-rose-600/70 hover:dark:bg-rose-600",
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
