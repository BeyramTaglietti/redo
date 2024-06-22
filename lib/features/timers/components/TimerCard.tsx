import { Entypo } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import { ComponentProps, useEffect, useMemo, useState } from "react";
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

import { TimerCardBackground } from "./TimerCardBackground";

import { Deletable } from "@/lib/components";
import { Timer } from "@/lib/stores/timers";
import { HapticVibrate, cn, tailwindColors } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { useTimer } from "../hooks";
import { formatDurationFromMilliseconds } from "../utils";

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
  const currentTimer = useTimer(timer);

  const [isSliding, setIsSliding] = useState(false);

  const formattedTimeLeft = useMemo(() => {
    if (!currentTimer.timeLeft) {
      return;
    }

    return formatDurationFromMilliseconds(currentTimer.timeLeft * 1000);
  }, [currentTimer.timeLeft]);

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

  if (!currentTimer.timeLeft) {
    return;
  }

  return (
    <Animated.View
      className={cn(isDragging && "opacity-60")}
      style={draggedItemStyle}
    >
      <Deletable
        onDelete={currentTimer.remove}
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
            timeLeft={currentTimer.timeLeft}
            duration_ms={timer.duration_ms}
            isPaused={timer.is_paused}
          />
          <View className="p-4 z-20 w-full h-full">
            <Text className="text-white font-bold text-xl">{timer.title}</Text>
            <Text className="text-white font-bold text-xl">
              {currentTimer.timeLeft <= 0 ? 0 : formattedTimeLeft}
            </Text>
            <View
              className="flex flex-row flex-1 justify-end items-end"
              style={{ gap: 16 }}
            >
              {currentTimer.timeLeft > 0 && (
                <ActionButton
                  iconName={
                    timer.is_paused ? "controller-play" : "controller-paus"
                  }
                  onPress={
                    timer.is_paused ? currentTimer.resume : currentTimer.pause
                  }
                />
              )}
              {!timer.is_paused && (
                <ActionButton
                  iconName="cycle"
                  onPress={currentTimer.postPone}
                />
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
