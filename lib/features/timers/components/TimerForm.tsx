import { router } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, View } from "react-native";

import { RDButton, RDTextInput } from "@/lib/components";
import { useTimersStore } from "@/lib/stores/timers";
import { createUUID } from "@/lib/utils";

export const TimerForm = () => {
  const createTimer = useTimersStore((state) => state.createTimer);

  const [title, setTitle] = useState("");

  const handleTimerCreate = useCallback(() => {
    const now = new Date().valueOf();
    createTimer({
      id: createUUID(),
      title,
      created_at: now,
      updated_at: now,
      duration_ms: 5000,
    });
    router.back();
  }, [title, createTimer]);

  return (
    <ScrollView>
      <View className="flex flex-col" style={{ gap: 16 }}>
        <RDTextInput
          placeholder="Redo's title"
          value={title}
          onChangeText={setTitle}
        />
        <RDButton title="create new" onPress={handleTimerCreate} />
      </View>
    </ScrollView>
  );
};
