"use client";

import { toast } from "sonner";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";

import ArenaForm from "./ArenaForm";
import DataLinks from "./DataLinks";
import IoTsDetails from "./IoTsDetails";
import SettingButton from "./SettingButton";
import { updateArena } from "~/app/server/arena";

export default ({
  arenaIdx,
  arenaData,
  arenaDataCount,
  assignedIoTsData,
}: {
  arenaIdx: number;
  arenaData: Arena;
  assignedIoTsData: IoTIds[];
  arenaDataCount: ArenaDataCount;
}) => {
  const [arena, setArena] = useState<Arena>(arenaData);
  const [assignedIoTs, setAssignedIoTs] = useState<IoTIds[]>(
    assignedIoTsData || []
  );
  const [rejectedIoTs, setRejectedIoTs] = useState<IoTIds[]>([]);

  const [state, action] = useFormState(updateArena, undefined);

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setArena(arenaData);
    setAssignedIoTs(assignedIoTsData);
    setRejectedIoTs([]);
    setIsEditing(false);
  };

  const neoAction = async (formData: FormData) => {
    assignedIoTs.forEach((item, index) => {
      formData.append("assignedIoTs", item.id);
    });

    rejectedIoTs.forEach((item, index) => {
      formData.append("rejectedIoTs", item.id);
    });

    setIsSubmitting(true);
    await action(formData);
    setRejectedIoTs([]);
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (state?.message) {
      toast.success(state.message);
      setIsEditing(false);
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form className="md:px-3 w-full mx-0.5" action={neoAction}>
      <input id="idx" name="idx" className="hidden" defaultValue={arenaIdx} />
      <img
        src={arena.image}
        alt="Arena Avatar"
        className="w-full h-56 object-cover rounded-lg shadow-lg"
      />
      <div className="flex flex-row-reverse w-full my-4">
        <SettingButton
          arenaId={arena.id}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>

      <ArenaForm
        state={state}
        arena={arena}
        setArena={setArena}
        isEditing={isEditing}
      />

      <IoTsDetails
        isEditing={isEditing}
        assignedIoTs={assignedIoTs}
        setAssignedIoTs={setAssignedIoTs}
        rejectedIoTs={rejectedIoTs}
        setRejectedIoTs={setRejectedIoTs}
      />

      {!isEditing && (
        <DataLinks arenaIdx={arenaIdx} arenaDataCount={arenaDataCount} />
      )}

      {isEditing && (
        <div className="mt-4 mb-10  flex justify-end w-full">
          <button
            type="button"
            onClick={handleFormCancel}
            disabled={isSubmitting}
            className="text-sm border dark:border-none dark:text-white hover:text-red-500 px-4 py-2 rounded-lg shadow-lg transition-colors"
          >
            Cancel
          </button>
          <SubmitButton />
        </div>
      )}
    </form>
  );
};

const SubmitButton: React.FC = () => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="ml-2 text-sm border hover:border-blue-400 hover:text-green-500 dark:text-white px-4 py-2 rounded-lg shadow-lg transition-colors"
    >
      {pending ? "Saving..." : "Save"}
    </button>
  );
};
