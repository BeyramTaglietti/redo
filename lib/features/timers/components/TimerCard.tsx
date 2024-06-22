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
  Platform,
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

import { useTimerNotifications } from "../hooks";
import { TimerCardBackground } from "./TimerCardBackground";

import { Deletable } from "@/lib/components";
import { Timer, useTimersStore } from "@/lib/stores/timers";
import { HapticVibrate, cn, tailwindColors } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { calculateSecondsLeft, formatDurationFromMilliseconds } from "../utils";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

type TimerCardProps = {
  timer: Timer;
  onLongPress?: ((event: GestureResponderEvent) => void) | null | undefined;
  isDragging?: boolean;
};

export const TimerCard = ({
  timer,
  onLongPress,
  isDragging,
}: TimerCardProps) => {
  const deleteTimer = useTimersStore((state) => state.deleteTimer);
  const postPoneTimer = useTimersStore((state) => state.postPoneTimer);
  const editTimer = useTimersStore((state) => state.editTimer);

  const [isSliding, setIsSliding] = useState(false);

  const { createTimerNotification, removeTimerNotification } =
    useTimerNotifications();

  const [timeLeft, setTimeLeft] = useState<number>(
    calculateSecondsLeft({
      updated_at: timer.updated_at,
      duration_ms: timer.duration_ms,
    }),
  );

  useEffect(() => {
    if (timer.is_paused) {
      return;
    }

    setTimeLeft(
      calculateSecondsLeft({
        updated_at: timer.updated_at,
        duration_ms: timer.duration_ms,
      }),
    );

    const interval = setInterval(() => {
      const left = calculateSecondsLeft({
        updated_at: timer.updated_at,
        duration_ms: timer.duration_ms,
      });

      if (left <= 0) {
        clearInterval(interval);
      }

      setTimeLeft(left);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timer.updated_at, timer.id, timer.is_paused, timer.duration_ms]);

  const handleDelete = useCallback(() => {
    removeTimerNotification(timer.notification_identifier);
    deleteTimer(timer.id);
  }, [deleteTimer, removeTimerNotification, timer]);

  const handlePostPone = useCallback(async () => {
    removeTimerNotification(timer.notification_identifier);

    const identifier = await createTimerNotification(
      timer.title,
      timer.duration_ms,
    );

    if (!identifier) {
      return;
    }

    postPoneTimer(timer.id, identifier);
  }, [removeTimerNotification, timer, createTimerNotification, postPoneTimer]);

  const handlePause = useCallback(() => {
    removeTimerNotification(timer.notification_identifier);
    editTimer({ ...timer, is_paused: true, paused_at: new Date().valueOf() });
  }, [editTimer, removeTimerNotification, timer]);

  const handleResume = useCallback(async () => {
    if (!timer.paused_at) {
      return;
    }

    const newVals = {
      updated_at: new Date().valueOf() - timer.paused_at + timer.updated_at,
      created_at: new Date().valueOf() - timer.paused_at,
    };

    const newIdentifier = await createTimerNotification(
      timer.title,
      calculateSecondsLeft({
        updated_at: newVals.updated_at,
        duration_ms: timer.duration_ms,
      }) * 1000,
    );

    editTimer({
      ...timer,
      is_paused: false,
      paused_at: null,
      updated_at: newVals.updated_at,
      created_at: newVals.created_at,
      notification_identifier: newIdentifier ?? "",
    });
  }, [createTimerNotification, editTimer, timer]);

  const formattedTimeLeft = useMemo(() => {
    return formatDurationFromMilliseconds(timeLeft * 1000);
  }, [timeLeft]);

  const draggedItemState = useSharedValue({
    margin: 0,
  });
  const draggedItemStyle = useAnimatedStyle(() => {
    return {
      marginHorizontal: draggedItemState.value.margin,
    };
  });

  useEffect(() => {
    if (isDragging) {
      HapticVibrate("Medium");
      draggedItemState.value = {
        margin: withSpring(32),
      };
    } else {
      HapticVibrate("Light");
      draggedItemState.value = {
        margin: withClamp({ min: 0 }, withSpring(0)),
      };
    }
  }, [isDragging, draggedItemState]);

  return (
    <Animated.View
      className={cn(isDragging && "opacity-60")}
      style={draggedItemStyle}
    >
      <Deletable
        onDelete={handleDelete}
        onSlideAction={(sliding) => {
          setIsSliding(sliding);
        }}
      >
        <Pressable
          className="rounded-xl h-40 w-full relative overflow-hidden"
          onPress={() => {
            if (!isSliding) router.push(`/${timer.id}`);
          }}
          onLongPress={onLongPress}
        >
          <TimerCardBackground
            timeLeft={timeLeft}
            duration_ms={timer.duration_ms}
            isPaused={timer.is_paused}
          />
          <View className="p-4 z-20 w-full h-full">
            <Text className="text-white font-bold text-xl">{timer.title}</Text>
            <Text className="text-white font-bold text-xl">
              {timeLeft <= 0 ? 0 : formattedTimeLeft}
            </Text>
            <View
              className="flex flex-row flex-1 justify-end items-end"
              style={{ gap: 16 }}
            >
              {timeLeft > 0 && (
                <ActionButton
                  iconName={
                    timer.is_paused ? "controller-play" : "controller-paus"
                  }
                  onPress={timer.is_paused ? handleResume : handlePause}
                />
              )}
              {!timer.is_paused && (
                <ActionButton iconName="cycle" onPress={handlePostPone} />
              )}
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
    <BlurView
      className={cn(
        "rounded-full h-12 w-12 flex justify-center items-center overflow-hidden",
        Platform.OS === "android" && "bg-black/40",
      )}
      intensity={40}
    >
      <TouchableOpacity
        className="w-full h-full flex justify-center items-center"
        onPress={onPress}
      >
        <Entypo
          name={iconName}
          size={24}
          color={tailwindColors.primary.foreground}
        />
      </TouchableOpacity>
    </BlurView>
  );
};
