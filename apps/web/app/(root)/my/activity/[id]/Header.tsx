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
import Image from "next/image";
import { myUrl } from "~/lib/myenv";
import { useEffect, useState } from "react";
import { neoFormAction } from "~/lib/hooks";
import { createLink } from "~/app/actions/share";
import { getArenaInfo } from "~/app/actions/arena";
import { ReactButton } from "~/lib/neo/ReactButton";
import { SharePopUp } from "~/components/SharePopUp";
import { Button } from "~/components/ui/form/button";
import { Share, Edit, ExternalLink, Predict } from "~/lib/arena-icons";
import {
  deleteActivityAction,
  updateActivityAction,
} from "~/app/actions/activity";
import { cropPredictionModelAction } from "~/app/actions/ai-models/cropPredictionModelAction";

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

export default ({ data, idx }: { data: ActivityHeader; idx: number }) => {
  const [isShare, setShare] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [arenas, setArenas] = useState<ArenaInfo[] | undefined>();
  const [arena, setArena] = useState<ArenaInfo>({
    id: data.arenaId,
    title: data.arena,
    location: data.arenaLocation,
  });

  const [_statePredict, actionPredict] = neoFormAction(
    cropPredictionModelAction,
  );
  const [_stateDelete, actionDelete] = neoFormAction(deleteActivityAction);
  const [stateEdit, actionEdit] = neoFormAction(
    updateActivityAction,
    setIsEditing,
  );
  const [_stateShare, actionShare, sharingUrl] = neoFormAction(
    createLink,
    setShare,
    false,
  );

  const [sharingLink, setSharingLink] = useState<string | null>(null);

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
        setArenas(await getArenaInfo());
      }
    })();
  }, [isEditing]);

  useEffect(() => {
    if (sharingUrl !== null) {
      setSharingLink(sharingUrl);
    }
    setShare(true);
  }, [isShare]);

  return (
    <>
      <div className="mb-3 ml-2">
        {isEditing ? (
          <div className="relative">
            <form className="mb-3 ml-2" action={actionEdit}>
              <input
                type="number"
                name="idx"
                defaultValue={idx}
                className="hidden"
              />
              <input
                type="string"
                name="arena"
                value={arena.id}
                readOnly
                className="hidden"
              />
              <div className="relative flex justify-center items-center">
                <div className="container flex flex-col w-full justify-center items-center">
                  <input
                    type="text"
                    name="title"
                    className="text-2xl bg-inherit border-2 border-pink-500 rounded-2xl font-bold mb-1 ps-2 py-0.5 w-1/2 truncate"
                    defaultValue={data.title}
                    placeholder="Enter your awesome activity name ..."
                  />
                  {stateEdit?.errors?.title && (
                    <p className="text-sm text-red-500">
                      {stateEdit.errors.title}
                    </p>
                  )}
                </div>
              </div>
              <ReactButton
                onAction="Saving"
                onStatic="Save"
                className="absolute top-1 right-2 w-20 h-8 bg-teal-500/50 hover:bg-teal-500 rounded-md font-bold flex items-center justify-center"
              />
            </form>
            <Button
              className="absolute top-12 right-2 w-18 h-8 bg-orange-500/50 hover:bg-orange-500 rounded-md font-bold flex items-center justify-center"
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setIsEditing(false);
                if (stateEdit?.errors) {
                  stateEdit.errors = null;
                }
                if (stateEdit?.message) {
                  stateEdit.message = null;
                }
                if (stateEdit?.error) {
                  stateEdit.error = null;
                }
              }}
            >
              {"Cancel"}
            </Button>
            <form action={actionDelete}>
              <input
                type="number"
                name="idx"
                defaultValue={idx}
                className="hidden"
              />
              <ReactButton
                className="absolute top-24 right-2 w-18 h-8 bg-red-500/50 hover:bg-red-500 rounded-md font-bold flex items-center justify-center"
                onAction="Deleting"
                onStatic="Delete"
              />
            </form>
          </div>
        ) : (
          <div className="relative">
            <h2 className="text-2xl text-center font-bold mb-1">
              {data.title}
            </h2>
            <Tooltip disableFocusListener placement="left" title="Edit">
              <button
                className="absolute top-1 right-2 p-1 bg-teal-500/50 hover:bg-teal-500 rounded-md font-bold flex items-center justify-center"
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
      </div>

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
                href={`/my/activity/${data.ref}`}
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
                    href={`/my/activity/${data.ref}`}
                    className="flex items-center p-1.5 font-bold bg-blue-500/50 rounded-md hover:bg-blue-500/70 transition-colors duration-200"
                  >
                    <Image
                      className="dark:invert"
                      src={Predict}
                      alt="predict"
                    />
                  </Link>
                ) : (
                  <form action={actionPredict}>
                    <input
                      type="number"
                      name="idx"
                      defaultValue={idx}
                      className="hidden"
                    />
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
                    <ReactButton
                      className="w-7 h-7 flex items-center p-1.5 font-bold bg-fuchsia-500/50 rounded-md hover:bg-fuchsia-500/70 transition-colors duration-200"
                      onStatic={
                        <Image
                          className="dark:invert"
                          src={Predict}
                          width={20}
                          height={20}
                          alt="predict"
                        />
                      }
                      onAction={""}
                    />
                  </form>
                )}
              </Tooltip>
            </div>
          )}

          {/* {!isEditing && (
            <div className="m-1 p-1">
              <Tooltip disableFocusListener placement="left" title="Share">
                <form action={actionShare}>
                  <input
                    type="number"
                    name="idx"
                    defaultValue={idx}
                    className="hidden"
                  />
                  <button
                    className="items-center p-1.5 bg-lime-500/50 rounded-md"
                    type="submit"
                  >
                    <Image
                      className="dark:invert"
                      width={18}
                      height={18}
                      src={Share}
                      alt="share"
                    />
                  </button>
                </form>
              </Tooltip>
            </div>
          )} */}
        </div>
      </div>

      {/* For Sharing Dialog */}
      {sharingLink && (
        <div className="fixed inset-0 flex items-center justify-center z-50 md:py-6">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSharingLink(null)}
          ></div>

          <div className="relative bg-yellow-50 dark:bg-blue-800 p-5 md:p-10 scrollbar-hide rounded-lg shadow-lg w-full max-w-xl max-h-full h-auto overflow-auto">
            <button
              onClick={() => setSharingLink(null)}
              className="absolute top-2 right-5 font-bold text-gray-600 hover:text-gray-900 text-3xl dark:invert"
            >
              &times;
            </button>
            <div className="container mx-auto p-6">
              <SharePopUp url={`${myUrl}/share/${sharingLink}`} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
