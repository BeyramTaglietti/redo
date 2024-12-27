import { millisecondsToSeconds } from "date-fns";
import * as Notifications from "expo-notifications";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { usePushNotification } from "@/lib/hooks";

export const useTimerNotifications = () => {
  const [schedulePushNotification] = usePushNotification();
  const { t } = useTranslation();

  const createTimerNotification = useCallback(
    async (timerTitle: string, timerDurationMs: number) => {
      const identifier = await schedulePushNotification({
        title: t("timers.notification.title"),
        body: t("timers.notification.description", { title: timerTitle }),
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: millisecondsToSeconds(timerDurationMs),
        },
      });

      return identifier;
    },
    [schedulePushNotification, t],
  );

  const removeTimerNotification = useCallback(
    async (notificationIdentifier: string) => {
      if (notificationIdentifier) {
        Notifications.cancelScheduledNotificationAsync(notificationIdentifier);
      }
    },
    [],
  );

  return { createTimerNotification, removeTimerNotification };
};
