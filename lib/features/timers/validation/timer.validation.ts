import { z } from "zod";

export const TimerFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  days: z.coerce
    .number({ message: "Value must be a number" })
    .max(120, { message: "Only a max of 120 days is allowed" })
    .optional(),
  hours: z.coerce
    .number({ message: "Value must be a number" })
    .max(24, { message: "Only a max of 24 hours is allowed" })
    .optional(),
  minutes: z.coerce
    .number({ message: "Value must be a number" })
    .max(60, { message: "Only a max of 60 minutes is allowed" })
    .optional(),
  backgroundColor: z.string(),
});

export type TimerFormValues = z.infer<typeof TimerFormSchema>;
