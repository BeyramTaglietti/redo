import { i18n } from "@/lib/utils";

type calculateSecondsLeftType = ({
  updated_at,
  duration_ms,
}: {
  updated_at: number;
  duration_ms: number;
}) => number;

const calculateSecondsLeft: calculateSecondsLeftType = ({
  updated_at,
  duration_ms,
}) => {
  return Math.round((updated_at + duration_ms - new Date().valueOf()) / 1000);
};

type formatDurationFromMillisecondsType = (ms: number) => string;

const formatDurationFromMilliseconds: formatDurationFromMillisecondsType = (
  ms,
) => {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  const parts = [];
  if (days) parts.push(`${days} ${i18n.t("app.day", { count: days })}`);
  if (hours) parts.push(`${hours} ${i18n.t("app.hour", { count: hours })}`);
  if (minutes)
    parts.push(`${minutes} ${i18n.t("app.minute", { count: minutes })}`);
  if (seconds)
    parts.push(`${seconds} ${i18n.t("app.second", { count: seconds })}`);

  return parts.splice(0, 2).join(" ");
};

export { calculateSecondsLeft, formatDurationFromMilliseconds };
