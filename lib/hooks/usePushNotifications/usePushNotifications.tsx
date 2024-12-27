import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";

import { useSettingsStore } from "@/lib/stores/settings";
import { i18n } from "@/lib/utils";
import { registerForPushNotificationsAsync } from "./usePushNotifications.helpers";
import {
  NotificationCategory,
  PostPoneNotificationActions,
} from "./usePushNotifications.types";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

Notifications.setNotificationCategoryAsync(NotificationCategory.POSTPONE, [
  ...Object.entries(PostPoneNotificationActions).map(([key, value]) => ({
    buttonTitle: `${i18n.t("timers.snooze")} ${value.duration_minutes} ${i18n.t("app.minute", { count: value.duration_minutes })}`,
    identifier: key,
  })),
]);

type SchedulePostNotification = {
  title?: string | null | undefined;
  body?: string | null | undefined;
  data?: Record<string, unknown> | undefined;
  trigger: Notifications.NotificationTriggerInput;
  category?: NotificationCategory;
};

export const usePushNotifications = (
  handleNotificationResponse?: (
    res: Notifications.NotificationResponse,
  ) => unknown,
): [
  (args: SchedulePostNotification) => Promise<string | undefined>,
  Notifications.Notification | undefined,
] => {
  const [notification, setNotification] =
    useState<Notifications.Notification>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  const notificationsEnabled = useSettingsStore(
    (state) => state.notificationsEnabled,
  );

  useEffect(() => {
    (async () => {
      try {
        await registerForPushNotificationsAsync();
      } catch (e) {
        console.log(e);
      }
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationResponse?.(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!,
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, [handleNotificationResponse]);

  const schedulePushNotification = useCallback(
    async ({
      title,
      body,
      data,
      trigger,
      category,
    }: SchedulePostNotification) => {
      if (!notificationsEnabled) {
        return;
      }
      return Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          categoryIdentifier: category,
        },
        trigger,
      });
    },
    [notificationsEnabled],
  );

  return [schedulePushNotification, notification];
};
