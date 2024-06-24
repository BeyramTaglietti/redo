import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, Text, View } from "react-native";

import { useTimerNotifications } from "../hooks";
import { TimerFormSchema, TimerFormValues } from "../validation";

import { RDButton, RDTextInput } from "@/lib/components";
import { useVirtualKeyboard } from "@/lib/hooks";
import { Timer, useTimersStore } from "@/lib/stores/timers";
import { createUUID, tailwindColors } from "@/lib/utils";

const AVAILABLE_COLORS = {
  green: tailwindColors.primary.DEFAULT,
  blue: "#3498db",
  orange: "#e67230",
  pink: "#f518c5",
  purple: "#b511d6",
};

export const TimerForm = ({ timerId }: { timerId?: string }) => {
  const createTimer = useTimersStore((state) => state.createTimer);
  const editTimer = useTimersStore((state) => state.editTimer);
  const currentTimer = useTimersStore((state) =>
    state.timers.find((t) => t.id === timerId),
  );

  const { t } = useTranslation();

  const { createTimerNotification, removeTimerNotification } =
    useTimerNotifications();

  const titleRef = useVirtualKeyboard();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<TimerFormValues>({
    resolver: zodResolver(TimerFormSchema),
    defaultValues: {
      title: currentTimer?.title || "",
      backgroundColor: currentTimer?.background_color || AVAILABLE_COLORS.green,
    },
  });

  const handleTimerCreate = useCallback<SubmitHandler<TimerFormValues>>(
    async (data) => {
      const now = new Date().valueOf();

      if (!data.days && !data.hours && !data.minutes) {
        setError("days", {
          type: "manual",
          message: t("timers.duration_required"),
        });
        setError("hours", {
          type: "manual",
          message: t("timers.duration_required"),
        });
        setError("minutes", {
          type: "manual",
          message: t("timers.duration_required"),
        });
        return;
      }

      const days_ms = data.days ? data.days * 24 * 60 * 60 * 1000 : 0;
      const hours_ms = data.hours ? data.hours * 60 * 60 * 1000 : 0;
      const minutes_ms = data.minutes ? data.minutes * 60 * 1000 : 0;

      const duration = days_ms + hours_ms + minutes_ms;

      if (timerId)
        removeTimerNotification(currentTimer!.notification_identifier!);
      const identifier = await createTimerNotification(data.title, duration);

      if (!identifier) {
        return;
      }

      const timer: Timer = {
        id: timerId ?? createUUID(),
        title: data.title,
        created_at: now,
        updated_at: now,
        duration_ms: duration,
        notification_identifier: identifier,
        is_paused: false,
        paused_at: null,
        background_color: data.backgroundColor,
      };

      if (timerId) {
        editTimer(timer);
      } else {
        createTimer(timer);
      }

      router.back();
    },
    [
      timerId,
      removeTimerNotification,
      currentTimer,
      createTimerNotification,
      setError,
      t,
      editTimer,
      createTimer,
    ],
  );

  return (
    <ScrollView className="h-full">
      <View className="flex flex-col h-full w-full" style={{ gap: 16 }}>
        <Controller
          control={control}
          name="title"
          render={({ field: { value, onChange } }) => (
            <RDTextInput
              placeholder={t("timers.redo_title")}
              value={value}
              onChangeText={onChange}
              ref={titleRef}
            />
          )}
        />
        <View className="flex flex-row" style={{ gap: 8 }}>
          <Controller
            control={control}
            name="days"
            render={({ field: { value, onChange } }) => (
              <RDTextInput
                placeholder={t("app.day", { count: 2 })}
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="hours"
            render={({ field: { value, onChange } }) => (
              <RDTextInput
                placeholder={t("app.hour", { count: 2 })}
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
          <Controller
            control={control}
            name="minutes"
            render={({ field: { value, onChange } }) => (
              <RDTextInput
                placeholder={t("app.minute", { count: 2 })}
                value={value?.toString()}
                onChangeText={onChange}
                keyboardType="numeric"
              />
            )}
          />
        </View>

        {Object.values(errors).length > 0 && (
          <View
            className="flex flex-row items-center justify-start"
            style={{ gap: 8 }}
          >
            <Feather name="info" size={18} color={tailwindColors.destructive} />
            <Text className="text-destructive">
              {Object.values(errors)[0].message}
            </Text>
          </View>
        )}

        <Controller
          control={control}
          name="backgroundColor"
          render={({ field: { value, onChange } }) => (
            <View className="flex flex-row justify-between">
              {Object.entries(AVAILABLE_COLORS).map(([color, hex]) => (
                <View
                  className="flex flex-col justify-center items-center"
                  style={{ gap: 6 }}
                  key={color}
                >
                  <Pressable
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: hex }}
                    onPress={() => onChange(hex)}
                  />
                  <View
                    className="h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: value === hex ? hex : "transparent",
                    }}
                  />
                </View>
              ))}
            </View>
          )}
        />

        <RDButton
          title={t("app.create")}
          onPress={handleSubmit(handleTimerCreate)}
        />
      </View>
    </ScrollView>
  );
};
