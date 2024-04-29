import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Text, View } from "react-native";

import { RDButton, RDTextInput } from "@/lib/components";
import { useVirtualKeyboard } from "@/lib/hooks";
import { useTimersStore } from "@/lib/stores/timers";
import { createUUID, tailwindColors } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { TimerFormSchema, TimerFormValues } from "../validation";

export const TimerForm = () => {
  const createTimer = useTimersStore((state) => state.createTimer);

  const titleRef = useVirtualKeyboard();

  const {
    control,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm<TimerFormValues>({
    resolver: zodResolver(TimerFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const handleTimerCreate = useCallback<SubmitHandler<TimerFormValues>>(
    (data) => {
      const now = new Date().valueOf();

      if (!data.days && !data.hours && !data.minutes) {
        setError("days", { type: "manual", message: "Duration is required" });
        setError("hours", { type: "manual", message: "Duration is required" });
        setError("minutes", {
          type: "manual",
          message: "Duration is required",
        });
        return;
      }

      console.log(
        `timer with ${data.days} days, ${data.hours} hours, ${data.minutes} minutes`,
      );

      const days_ms = data.days ? data.days * 24 * 60 * 60 * 1000 : 0;
      const hours_ms = data.hours ? data.hours * 60 * 60 * 1000 : 0;
      const minutes_ms = data.minutes ? data.minutes * 60 * 1000 : 0;

      const duration = days_ms + hours_ms + minutes_ms;

      createTimer({
        id: createUUID(),
        title: data.title,
        created_at: now,
        updated_at: now,
        duration_ms: duration,
      });
      router.back();
    },
    [createTimer, setError],
  );

  return (
    <View className="flex flex-col h-full w-full relative" style={{ gap: 16 }}>
      <Controller
        control={control}
        name="title"
        render={({ field: { value, onChange } }) => (
          <RDTextInput
            placeholder="Redo's title"
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
              placeholder="Days"
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
              placeholder="Hours"
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
              placeholder="Minutes"
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
      <RDButton
        title="create"
        onPress={handleSubmit(handleTimerCreate)}
        className="absolute bottom-4 left-0"
      />
    </View>
  );
};
