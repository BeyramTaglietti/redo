import { Entypo } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { ComponentProps, Fragment, useEffect, useMemo, useState } from "react";
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

import { Deletable, RDText } from "@/lib/components";
import * as DropdownMenu from "zeego/dropdown-menu";

import { Timer } from "@/lib/stores/timers";
import { HapticVibrate, cn, tailwindColors } from "@/lib/utils";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

  const currentTimer = useTimer(timer);

  const [isSliding, setIsSliding] = useState(false);

  const formattedTimeLeft = useMemo(() => {
    if (!currentTimer.timeLeft) {
      return;
    }

    return formatDurationFromMilliseconds(currentTimer.timeLeft * 1000);
  }, [currentTimer.timeLeft]);

  const draggedItemMargin = useSharedValue(0);

  const draggedItemStyle = useAnimatedStyle(() => {
    return {
      marginHorizontal: draggedItemMargin.value,
      opacity: isDragging && Platform.OS === "ios" ? 0.8 : 1,
    };
  });

  useEffect(() => {
    if (isDragging) {
      HapticVibrate("Medium");
      draggedItemMargin.value = withSpring(32);
    } else {
      HapticVibrate("Light");
      draggedItemMargin.value = withClamp({ min: 0 }, withSpring(0));
    }
  }, [isDragging, draggedItemMargin]);

  if (currentTimer.timeLeft === null) {
    return <Fragment></Fragment>;
  }

  return (
    <Animated.View style={draggedItemStyle}>
      <Deletable
        onDelete={currentTimer.remove}
        onSlideAction={(sliding) => {
          setIsSliding(sliding);
        }}
      >
        <Pressable
          className="rounded-xl h-40 w-full relative overflow-hidden bg-white"
          onPress={() => {
            if (!isSliding) router.push(`/${timer.id}`);
          }}
          onLongPress={onLongPress}
        >
          <TimerCardBackground
            timeLeft={currentTimer.timeLeft}
            duration_ms={timer.duration_ms}
            isPaused={timer.is_paused}
            timerBackgroundColor={timer.background_color}
          />
          <View className="p-4 z-20 w-full h-full">
            <Text className="text-white font-bold text-xl">{timer.title}</Text>
            <Text className="text-white font-bold text-xl">
              {currentTimer.timeLeft <= 0 ? 0 : formattedTimeLeft}
            </Text>
            <View
              className="flex flex-row flex-1 justify-end items-end"
              style={{ gap: 16 }}
              onStartShouldSetResponder={() => true}
              onTouchEnd={(e) => {
                e.stopPropagation();
              }}
            >
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <View>
                    {currentTimer.timeLeft <= 0 && (
                      <ActionButton label={t("timers.snooze")} />
                    )}
                  </View>
                </DropdownMenu.Trigger>
                <DropdownMenu.Content>
                  {[5, 15, 30, 60].map((minutes, idx) => (
                    <Fragment key={idx}>
                      <DropdownMenu.Item
                        key={`minutes_${idx}`}
                        textValue={`${minutes} ${t("app.minute", { count: minutes })}`}
                        onSelect={() => {
                          currentTimer.postPone(minutes);
                        }}
                      >
                        <DropdownMenu.ItemTitle>
                          {minutes} {t("app.minute", { count: minutes })}
                        </DropdownMenu.ItemTitle>
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                    </Fragment>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>

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
  label,
}: {
  iconName?: ComponentProps<typeof Entypo>["name"];
  onPress?: () => void;
  label?: string;
}) => {
  return (
    <BlurView
      className={cn(
        "rounded-full h-12 w-12 overflow-hidden flex justify-center items-center",
        Platform.OS === "android" && "bg-black/40",
        label && "w-28",
      )}
      intensity={40}
    >
      <TouchableOpacity
        className="w-full h-full flex flex-row justify-center items-center"
        activeOpacity={1}
        onPress={() => {
          HapticVibrate("Light");
          onPress?.();
        }}
      >
        {iconName && (
          <Entypo
            name={iconName}
            size={24}
            color={tailwindColors.primary.foreground}
          />
        )}
        {label && <RDText className="text-base">{label}</RDText>}
      </TouchableOpacity>
    </BlurView>
  );
};
