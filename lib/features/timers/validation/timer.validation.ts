import { z } from "zod";

export const TimerFormSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  days: z.coerce
    .number()
    .max(60, { message: "Only a max of 60 days is allowed" })
    .optional(),
  hours: z.coerce.number().optional(),
  minutes: z.coerce.number().optional(),
});

export type TimerFormValues = z.infer<typeof TimerFormSchema>;
