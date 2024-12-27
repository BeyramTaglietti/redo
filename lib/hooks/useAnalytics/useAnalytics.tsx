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
      if (__DEV__) return; // disable analytics tracking during development

      posthog.capture(event, properties);
    },
    [posthog],
  );

  return { track };
};
