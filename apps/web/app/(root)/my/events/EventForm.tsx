"use client";

import clsx from "clsx";
import moment from "moment";
import Image from "next/image";
import { toast } from "sonner";
import FormField from "./EventFormField";
import { Delete } from "~/lib/arena-icons";
import { neoFormAction } from "~/lib/hooks";
import { getArenaInfo } from "~/app/actions/arena";
import { ReactButton } from "~/lib/neo/ReactButton";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { createEventAction } from "~/app/actions/events/createEventAction";
import { updateEventAction } from "~/app/actions/events/updateEventAction";
import { deleteEventAction } from "~/app/actions/events/deleteEventAction";
import {
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

interface EventFormProps {
  isOpen: boolean;
  selectedDate: Date;
  selectedEvent: UserEvent | null;
  onAddEvent: (event: UserEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  setIsFormOpen: Dispatch<SetStateAction<boolean>>;
}

const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  setIsFormOpen,
  onAddEvent,
  onDeleteEvent,
  selectedDate,
  selectedEvent,
}) => {
  const formState = {
    title: selectedEvent?.title || "",
    description: selectedEvent?.description || "",
    startDate: selectedEvent
      ? moment(selectedEvent.startTime).format("YYYY-MM-DD")
      : moment(selectedDate).format("YYYY-MM-DD"),
    startTime: selectedEvent
      ? moment(selectedEvent.startTime).format("HH:mm")
      : moment(selectedDate).format("HH:mm"),
    endDate: selectedEvent
      ? moment(selectedEvent.endTime).format("YYYY-MM-DD")
      : moment(selectedDate).format("YYYY-MM-DD"),
    endTime: selectedEvent
      ? moment(selectedEvent.endTime).format("HH:mm")
      : moment(selectedDate).add(1, "hour").format("HH:mm"),
    alarmDate: selectedEvent
      ? moment(selectedEvent.endTime).format("YYYY-MM-DD")
      : "",
    alarmTime: selectedEvent
      ? moment(selectedEvent.endTime).format("HH:mm")
      : "",
    location: selectedEvent?.location || "",
    arenaId: selectedEvent?.arenaId || "",
    status: selectedEvent?.status || "pending",
  };
  const [eventStatus, setEventStatus] = useState(formState.status);

  const [submitEventState, submitEventAction] = neoFormAction(
    selectedEvent ? updateEventAction : createEventAction,
    setIsFormOpen,
  );
  const [arenas, setArenas] = useState<ArenaInfo[]>([]);
  const [selectedArena, setSelectedArena] = useState<{
    arena: string;
    arenaId: string;
  } | null>(null);

  // const [_deleteEventState, deleteEventActionExtended] = neoFormAction(deleteEventAction, setIsFormOpen);

  useEffect(() => {
    (async () => setArenas(await getArenaInfo()))();
  }, [isOpen]);

  const deleteEventActionExtended = async () => {
    try {
      await deleteEventAction(selectedEvent?.id);
      onDeleteEvent(selectedEvent?.id);
      toast.success("Event deleted successfully");
      setIsFormOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-[#2f2f61] p-6 rounded-lg shadow-lg w-full max-w-xl mx-4 sm:mx-6 md:mx-10 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            {selectedEvent ? "Edit Event" : "Add Event"}
          </h2>
          {selectedEvent && (
            <form action={deleteEventActionExtended}>
              <input type="hidden" name="id" value={selectedEvent?.id} />
              <ReactButton
                className="bg-red-300 dark:bg-red-500 hover:bg-red-400 hover:dark:bg-red-600 p-2 rounded-full transition-all duration-300"
                onStatic={
                  <Image
                    src={Delete}
                    alt="Del"
                    width={20}
                    height={20}
                    className="w-5 h-5"
                  />
                }
                onAction
              />
            </form>
          )}
        </div>
        <form action={submitEventAction}>
          <input type="hidden" name="id" value={selectedEvent?.id || ""} />
          <FormField
            label="Title"
            name="title"
            type="text"
            defaultValue={formState.title}
            error={submitEventState?.errors?.title}
            required
          />
          <FormField
            label="Description"
            name="description"
            type="text"
            defaultValue={formState.description}
            error={submitEventState?.errors?.description}
          />
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <FormField
              label="Start Date"
              name="startDate"
              type="date"
              defaultValue={formState.startDate}
              error={submitEventState?.errors?.startDate}
              className="flex-1"
              required
            />
            <FormField
              label="Start Time"
              name="startTime"
              type="time"
              defaultValue={formState.startTime}
              error={submitEventState?.errors?.startTime}
              className="flex-1"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <FormField
              label="End Date"
              name="endDate"
              type="date"
              defaultValue={formState.endDate}
              error={submitEventState?.errors?.endDate}
              className="flex-1"
              required
            />
            <FormField
              label="End Time"
              name="endTime"
              type="time"
              defaultValue={formState.endTime}
              error={submitEventState?.errors?.endTime}
              className="flex-1"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row sm:space-x-4">
            <FormField
              label="Alarm Date"
              name="alarmDate"
              type="date"
              defaultValue={formState.alarmDate}
              error={submitEventState?.errors?.alarmDate}
              className="flex-1"
            />
            <FormField
              label="Alarm Time"
              name="alarmTime"
              type="time"
              defaultValue={formState.alarmTime}
              error={submitEventState?.errors?.alarmTime}
              className="flex-1"
            />
          </div>
          <FormField
            label="Location"
            name="location"
            type="text"
            defaultValue={formState.location}
            error={submitEventState?.errors?.location}
          />
          <div className="mb-5 dark:invert">
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
            <input
              type="hidden"
              name="arenaId"
              value={selectedArena?.arenaId}
            />
            {submitEventState?.errors?.arenaId && (
              <div className="text-red-500 text-sm mb-1">
                {submitEventState.errors?.arenaId}
              </div>
            )}
          </div>
          {selectedEvent ? (
            <div className="mb-5 dark:invert">
              <FormControl fullWidth className="dark:invert">
                <InputLabel id="event-status">Status</InputLabel>
                <Select
                  labelId="event-status"
                  id="event-status-select"
                  name="status"
                  value={eventStatus}
                  label="Status"
                  onChange={(event: SelectChangeEvent) =>
                    setEventStatus(event.target.value as string)
                  }
                >
                  <MenuItem value={"pending"}>Pending</MenuItem>
                  <MenuItem value={"ongoing"}>Ongoing</MenuItem>
                  <MenuItem value={"finished"}>Finished</MenuItem>
                </Select>
              </FormControl>
              {submitEventState?.errors?.arenaId && (
                <div className="text-red-500 text-sm mb-1">
                  {submitEventState.errors?.arenaId}
                </div>
              )}
            </div>
          ) : (
            <input type="hidden" name="status" value={formState?.status} />
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="reset"
              onClick={() => {
                setIsFormOpen(!isOpen);
              }}
              className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
            <ReactButton
              onAction={selectedEvent ? "Updating" : "Adding"}
              onStatic={selectedEvent ? "Update Event" : "Add Event"}
              className={clsx(
                "px-4 py-2 rounded",
                "bg-purple-600/80 hover:bg-purple-600 dark:bg-rose-600/70 hover:dark:bg-rose-600",
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventForm;
