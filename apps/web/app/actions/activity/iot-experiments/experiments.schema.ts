import { z } from "zod";

export const ExperimentFormSchema = z.array(z.string());

export type ExperimentFormState =
  | {
      redirect?: boolean;
      error?: string;
      message?: string;
      success?: string;
    }
  | undefined;
