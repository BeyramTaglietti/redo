import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

import { useSettingsStore } from "../stores/settings";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

type SchedulePostNotification = {
  title?: string | null | undefined;
  body?: string | null | undefined;
  data?: Record<string, unknown> | undefined;
  trigger: Notifications.NotificationTriggerInput;
};

export const usePushNotification = (): [
  (args: SchedulePostNotification) => Promise<string | undefined>,
  string | undefined,
  Notifications.Notification | undefined,
] => {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
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
        const token = await registerForPushNotificationsAsync();
        setExpoPushToken(token);
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
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!,
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  const schedulePushNotification = useCallback(
    async ({ title, body, data, trigger }: SchedulePostNotification) => {
      if (!notificationsEnabled) {
        return;
      }
      return Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
        },
        trigger,
      });
    },
    [notificationsEnabled],
  );

  return [schedulePushNotification, expoPushToken, notification];
};

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (!Device.isDevice) {
    // alert("Must use physical device for Push Notifications");
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== "granted") {
    alert("Failed to get push token for push notification!");
    return;
  }
  // Learn more about projectId:
  // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
  const token = (
    await Notifications.getExpoPushTokenAsync({
      projectId: "your-project-id",
    })
  ).data;
  console.log(token);

  return token;
}
