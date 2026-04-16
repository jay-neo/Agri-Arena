"use client";

import { toast } from "sonner";
import { useFormState } from "react-dom";
import { redirect } from "next/navigation";
import { useState, useEffect, Dispatch, SetStateAction } from "react";

type FormState =
  | {
      error?: string;
      message?: string;
      success?: string;
      next?: string;
    }
  | undefined;

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function neoFormAction<T extends FormState>(
  formAction: (state: T, formData: FormData) => Promise<T>,
  editMode?: Dispatch<SetStateAction<boolean>>,
  isRedirect: boolean = true,
): [state: Awaited<T>, dispatch: () => void, next: string, isPending: boolean] {
  const [state, action, isPending] = useFormState(
    formAction as (state: Awaited<T>) => T | Promise<T>,
    undefined,
  );

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      state.success = null;
      if (isRedirect && state?.next) {
        redirect(state.next);
      }
      if (editMode) {
        editMode(false);
      }
    } else if (state?.message) {
      toast.info(state.message);
      state.message = null;
    } else if (state?.error) {
      toast.error(state.error);
      if (editMode) {
        editMode(false);
      }
      state.error = null;
    }
  }, [state]);

  return [state, action, state?.next, isPending];
}
