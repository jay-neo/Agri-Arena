import { EventStatus } from "@prisma/client";
import { z } from "zod";

export const EventFormSchema = z
  .strictObject({
    title: z
      .string()
      .min(2, { message: "Title must be at least 2 characters long." })
      .max(30, { message: "Title must be less than 30 characters." })
      .trim(),
    description: z
      .string()
      .max(100, { message: "Description must be less than 100 characters." })
      .trim()
      .optional()
      .or(z.literal("")),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Start date must be in YYYY-MM-DD format.",
      })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: "Start date must be a valid date." },
      ),
    startTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Start time must be in HH:mm format.",
      })
      .trim(),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "End date must be in YYYY-MM-DD format.",
      })
      .refine(
        (val) => {
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: "End date must be a valid date." },
      ),
    endTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "End time must be in HH:mm format.",
      })
      .trim(),
    alarmDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, {
        message: "Alarm date must be in YYYY-MM-DD format.",
      })
      .refine(
        (val) => {
          if (!val) return true; // Allow empty string
          const date = new Date(val);
          return !isNaN(date.getTime());
        },
        { message: "Alarm date must be a valid date." },
      )
      .optional()
      .or(z.literal("")),
    alarmTime: z
      .string()
      .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Alarm time must be in HH:mm format.",
      })
      .trim()
      .optional()
      .or(z.literal("")),
    location: z
      .string()
      .max(50, { message: "Location must be less than 50 characters." })
      .trim()
      .optional()
      .or(z.literal("")),
    arenaId: z.string().trim().optional(),
    status: z.nativeEnum(EventStatus),
    id: z.string().trim().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(`${data.startDate}T${data.startTime}:00`);
      const end = new Date(`${data.endDate}T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "End date and time must be after start date and time.",
      path: ["endTime"],
    },
  );

export type EventFormState = FormState & {
  errors?: {
    title?: string[];
    description?: string[];
    date?: string[];
    startDate?: string[];
    startTime?: string[];
    endDate?: string[];
    endTime?: string[];
    alarmDate?: string[];
    alarmTime?: string[];
    location?: string[];
    status?: string[];
    arenaId?: string[];
  };
};
