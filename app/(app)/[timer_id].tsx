import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";

import { TimerForm } from "@/lib/features/timers";

export default function CreateTimerScreen() {
  const { timer_id } = useLocalSearchParams<{ timer_id: string }>();

  return (
    <View className="p-4" style={{ gap: 16 }}>
      <TimerForm timerId={timer_id} />
    </View>
  );
}
