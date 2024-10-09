"use client";

import {
  Select,
  Tooltip,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  SelectChangeEvent,
} from "@mui/material";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { getArenasWithId } from "~/app/server/arena";
import { useFormState, useFormStatus } from "react-dom";
import { modelCP1V1 } from "~/app/server/models/agriarena";
import { Share, Edit, ExternalLink, Predict } from "~/lib/arena-icons";
import { deleteActivity, updateActivity } from "~/app/server/activity/CRUD";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
    sx: {
      "& .MuiMenu-list": {
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          backgroundColor: "#f1f1f1",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "#888",
          borderRadius: "4px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#555",
        },
      },
    },
  },
};

export default ({ data, idx }: { data: Activity_Header; idx: number }) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [state, action] = useFormState(updateActivity, undefined);
  const [statePredict, actionPredict] = useFormState(modelCP1V1, undefined);
  const [arenas, setArenas] = useState<ArenaIds[] | undefined>();
  const [arena, setArena] = useState<ArenaIds>({
    id: data.arenaId,
    title: data.arena,
    location: data.arenaLocation,
  });

  const handleChange = (event: SelectChangeEvent<string>) => {
    const selectedArenaId = event.target.value;

    const selectedArena = arenas?.find((a) => a.id === selectedArenaId);
    if (selectedArena) {
      setArena(selectedArena);
    }
  };

  useEffect(() => {
    (async () => {
      if (isEditing) {
        setArenas(await getArenasWithId());
      }
    })();
  }, [isEditing]);

  useEffect(() => {
    if (statePredict?.success) {
      redirect(statePredict.success);
    } else if (statePredict?.message) {
      toast.message(statePredict.message);
    } else if (statePredict?.error) {
      toast.error(statePredict.error);
    }
  }, [statePredict]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setIsEditing(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <>
      <form className="mb-3 ml-2" action={action}>
        <input type="number" name="idx" defaultValue={idx} className="hidden" />
        <input
          type="string"
          name="arena"
          value={arena.id}
          readOnly
          className="hidden"
        />
        {isEditing ? (
          <div className="relative flex justify-center items-center">
            <div className="container flex flex-col w-full justify-center items-center">
              <input
                type="text"
                name="title"
                className="text-2xl bg-inherit border-2 border-pink-500 rounded-2xl font-bold mb-1 ps-2 py-0.5 w-1/2 truncate"
                defaultValue={data.title}
                placeholder="Enter your awesome activity name ..."
              />
              {state?.errors?.title && (
                <p className="text-sm text-red-500">{state.errors.title}</p>
              )}
            </div>
            <div className="">
              <SaveButton />

              <button
                className="absolute top-12 right-2 py-1 px-2.5 bg-orange-500/50 rounded-md font-bold flex items-center justify-center"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(false);
                  if (state?.errors) {
                    state.errors = null;
                  }
                  if (state?.message) {
                    state.message = null;
                  }
                  if (state?.error) {
                    state.error = null;
                  }
                }}
              >
                {"Cancel"}
              </button>
              <button
                className="absolute top-24 right-2 py-1 px-3 bg-red-500/50 rounded-md font-bold flex items-center justify-center"
                type="button"
                onClick={async (e) => {
                  if (await deleteActivity(idx)) {
                    toast.success("Activity deleted successfully");
                    router.push("/activity");
                  } else {
                    setIsEditing(false);
                    toast.error("Something haappes wrong");
                    e.preventDefault();
                  }
                }}
              >
                {"Delete"}
              </button>
            </div>
          </div>
        ) : (
          <div className="relative">
            <h2 className="text-2xl text-center font-bold mb-1">
              {data.title}
            </h2>
            <Tooltip disableFocusListener placement="left" title="Edit">
              <button
                className="absolute top-1 right-2 p-1 bg-teal-500/50 rounded-md font-bold flex items-center justify-center"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsEditing(true);
                }}
              >
                <Image
                  className="dark:invert"
                  width={20}
                  height={20}
                  src={Edit}
                  alt="edit"
                />
              </button>
            </Tooltip>
          </div>
        )}
      </form>

      <form action={actionPredict}>
        <input type="number" name="idx" defaultValue={idx} className="hidden" />
        <input
          type="text"
          name="experimentsId"
          defaultValue={data?.experimentsId}
          className="hidden"
        />
        <input
          type="text"
          name="arenaId"
          defaultValue={data?.arenaId}
          className="hidden"
        />
        <div className="flex justify-between container mt-1">
          <div className="container mb-2">
            {data.type === "experiments" && (
              <div>
                <span className="font-bold text-lg">{"Device: "}</span>
                <span className="truncate">{data.iot}</span>
                <span className="text-gray-700/80 dark:text-gray-300/60 truncate">
                  {" ("}
                  {data.device}
                  {")"}
                </span>
              </div>
            )}
            {data.type === "predictions" && (
              <div className="flex items-center mb-2">
                <span className="font-bold text-lg">Experiments:</span>
                <Link
                  href={`/activity/${data.ref}`}
                  className="truncate text-blue-500 underline underline-offset-2 flex items-center ml-2 mr-1"
                >
                  View
                  <Image
                    className="dark:invert text-blue-500 underline underline-offset-2"
                    src={ExternalLink}
                    alt="Link"
                  />
                </Link>
              </div>
            )}

            <div className="container flex items-center gap-2">
              <span className={`font-bold text-lg`}>{"Arena:"}</span>
              {isEditing ? (
                <FormControl
                  sx={{
                    m: 1,
                    width: 200,
                    fontSize: 12,
                    "& .MuiInputBase-root": {
                      height: 30,
                    },
                    "& .MuiInputLabel-root": {
                      fontSize: 12,
                      lineHeight: 1,
                    },
                  }}
                  size="small"
                >
                  <InputLabel id="demo-single-select-label">Arena</InputLabel>
                  <Select
                    labelId="demo-single-select-label"
                    id="demo-single-select"
                    value={arena.id}
                    onChange={handleChange}
                    input={<OutlinedInput label="Arena" />}
                    MenuProps={MenuProps}
                  >
                    {arenas ? (
                      arenas.map((a) => (
                        <MenuItem key={a.id} value={a.id}>
                          {a.title}
                        </MenuItem>
                      ))
                    ) : (
                      <div className="px-2">No arena found</div>
                    )}
                  </Select>
                </FormControl>
              ) : (
                <span className="truncate">
                  {data.arena ? data.arena : "not assigned"}
                </span>
              )}
            </div>
          </div>

          <div className="">
            {data.type === "experiments" && !isEditing && (
              <div className="m-1 p-1">
                <Tooltip disableFocusListener placement="left" title="Predict">
                  {data.isPredicted ? (
                    <Link
                      href={`/activity/${data.ref}`}
                      className="flex items-center p-1.5 font-bold bg-blue-500/50 rounded-md"
                    >
                      <Image
                        className="dark:invert"
                        src={Predict}
                        alt="predict"
                      />
                    </Link>
                  ) : (
                    <PredictButton />
                  )}
                </Tooltip>
              </div>
            )}

            {!isEditing && (
              <div className="m-1 p-1">
                <Tooltip disableFocusListener placement="left" title="Share">
                  <button
                    className="items-center p-1.5 bg-lime-500/50 rounded-md"
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <Image
                      className="dark:invert"
                      width={18}
                      height={18}
                      src={Share}
                      alt="share"
                    />
                  </button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

const SaveButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="absolute top-1 right-2 py-1 px-4 bg-teal-500/50 rounded-md font-bold flex items-center justify-center"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
};

const PredictButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center p-1.5 font-bold bg-fuchsia-500/50 rounded-md"
    >
      {pending ? (
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
            ease: "easeInOut",
            times: [0, 0.5, 0.8, 1],
          }}
        >
          <Image className="dark:invert" src={Predict} alt="predict" />
        </motion.div>
      ) : (
        <Image className="dark:invert" src={Predict} alt="predict" />
      )}
    </button>
  );
};
