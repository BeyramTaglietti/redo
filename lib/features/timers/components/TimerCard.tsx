import { Entypo } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  GestureResponderEvent,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withClamp,
  withSpring,
} from "react-native-reanimated";

import { TimerCardBackground } from "./TimerCardBackground";

import { Deletable } from "@/lib/components";
import { usePushNotification } from "@/lib/hooks";
import { Timer, useTimersStore } from "@/lib/stores/timers";
import { HapticVibrate, cn, tailwindColors } from "@/lib/utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const TimerCard = ({
  timer,
  onLongPress,
  isActive,
}: {
  timer: Timer;
  onLongPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  isActive?: boolean;
}) => {
  const deleteTimer = useTimersStore((state) => state.deleteTimer);
  const postPoneTimer = useTimersStore((state) => state.postPoneTimer);

  const [schedulePushNotification] = usePushNotification();

  const calculateSecondsLeft = useCallback(() => {
    return Math.round(
      (timer.updated_at + timer.duration_ms - new Date().valueOf()) / 1000,
    );
  }, [timer.duration_ms, timer.updated_at]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateSecondsLeft());

  useEffect(() => {
    setTimeLeft(calculateSecondsLeft());

    const interval = setInterval(() => {
      const left = calculateSecondsLeft();

      if (left <= 0) {
        clearInterval(interval);
      }

      setTimeLeft(left);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    calculateSecondsLeft,
    timer.updated_at,
    timer.id,
    schedulePushNotification,
  ]);

  const cleanNotification = useCallback(async () => {
    if (timer.notification_identifier) {
      Notifications.cancelScheduledNotificationAsync(
        timer.notification_identifier,
      );
    }
  }, [timer.notification_identifier]);

  const handleDelete = useCallback(() => {
    cleanNotification();
    deleteTimer(timer.id);
  }, [cleanNotification, deleteTimer, timer.id]);

  const handlePostPone = useCallback(async () => {
    cleanNotification();

    const identifier = await schedulePushNotification({
      title: "Oh no! 🚨",
      body: `${timer.title} has expired!`,
      trigger: { seconds: timer.duration_ms / 1000 },
    });

    if (!identifier) {
      return;
    }

    postPoneTimer(timer.id, identifier);
  }, [
    cleanNotification,
    postPoneTimer,
    schedulePushNotification,
    timer.duration_ms,
    timer.id,
    timer.title,
  ]);

  const formattedTimeLeft = useMemo(() => {
    return formatDurationFromMilliseconds(timeLeft * 1000);
  }, [timeLeft]);

  const marginX = useSharedValue(0);

  const viewStyle = useAnimatedStyle(() => {
    return {
      marginHorizontal: marginX.value,
    };
  });

  useEffect(() => {
    if (isActive) {
      HapticVibrate("Medium");
      marginX.value = withSpring(32);
    } else {
      HapticVibrate("Light");
      marginX.value = withClamp({ min: 0 }, withSpring(0));
    }
  }, [isActive, marginX]);

  if (timeLeft === null) {
    return null;
  }

  return (
    <Animated.View className={cn(isActive && "opacity-60")} style={viewStyle}>
      <Deletable onDelete={handleDelete}>
        <Pressable
          className="rounded-xl h-40 w-full relative overflow-hidden"
          onPress={() => {
            router.push(`/${timer.id}`);
          }}
          onLongPress={onLongPress}
        >
          <TimerCardBackground
            timeLeft={timeLeft}
            duration_ms={timer.duration_ms}
          />
          <View className="p-4 z-20 w-full h-full">
            <Text className="text-white font-bold text-xl">{timer.title}</Text>
            <Text className="text-white font-bold text-xl">
              {timeLeft <= 0 ? 0 : formattedTimeLeft}
            </Text>
            <View
              className="flex flex-row flex-1 justify-end items-end"
              style={{ gap: 32 }}
            >
              <ActionButton iconName="cycle" onPress={handlePostPone} />
            </View>
          </View>
        </Pressable>
      </Deletable>
    </Animated.View>
  );
};

const ActionButton = ({
  iconName,
  onPress,
}: {
  iconName: ComponentProps<typeof Entypo>["name"];
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="rounded-full h-12 w-12 flex justify-center items-center bg-transparent/20"
      onPress={onPress}
    >
      <Entypo
        name={iconName}
        size={24}
        color={tailwindColors.primary.foreground}
      />
    </TouchableOpacity>
  );
};

function formatDurationFromMilliseconds(ms: number) {
  let seconds = Math.floor(ms / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  seconds = seconds % 60;
  minutes = minutes % 60;
  hours = hours % 24;

  const parts = [];
  if (days) parts.push(`${days} days`);
  if (hours) parts.push(`${hours} hours`);
  if (minutes) parts.push(`${minutes} minutes`);
  if (seconds) parts.push(`${seconds} seconds`);

  return parts.splice(0, 2).join(" ");
}
