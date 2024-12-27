import { millisecondsToSeconds } from "date-fns";
import * as Notifications from "expo-notifications";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { NotificationCategory, usePushNotifications } from "@/lib/hooks";
export const useTimerNotifications = (
  handleNotificationResponse?: (
    res: Notifications.NotificationResponse,
  ) => unknown,
) => {
  const [schedulePushNotification] = usePushNotifications(
    handleNotificationResponse,
  );
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
        category: NotificationCategory.POSTPONE,
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
