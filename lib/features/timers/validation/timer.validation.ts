import { i18n } from "@/lib/utils";
import { z } from "zod";

export const TimerFormSchema = z.object({
  title: z
    .string()
    .min(1, { message: i18n.t("timers.validation.required_title") }),
  days: z.coerce
    .number({ message: "Value must be a number" })
    .max(120, { message: i18n.t("timers.validation.max_days", { days: 120 }) })
    .optional(),
  hours: z.coerce
    .number({ message: "Value must be a number" })
    .max(24, { message: i18n.t("timers.validation.max_hours", { hours: 24 }) })
    .optional(),
  minutes: z.coerce
    .number({ message: "Value must be a number" })
    .max(60, {
      message: i18n.t("timers.validation.max_minutes", { minutes: 60 }),
    })
    .optional(),
  backgroundColor: z.string(),
});

export type TimerFormValues = z.infer<typeof TimerFormSchema>;
