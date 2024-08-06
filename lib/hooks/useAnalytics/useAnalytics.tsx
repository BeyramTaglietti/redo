import { usePostHog } from "posthog-react-native";
import { useCallback } from "react";
import { AnalyticsEvents } from "./events.enum";

export const useAnalytics = () => {
  const posthog = usePostHog();

  const track = useCallback(
    (
      event: AnalyticsEvents,
      properties?: {
        [key: string]: any;
      },
    ) => {
      posthog.capture(event, properties);
    },
    [posthog],
  );

  return { track };
};
