import { View } from "react-native";

import { TimerForm } from "@/lib/features/timers";

export default function CreateTimerScreen() {
  return (
    <View className="p-4" style={{ gap: 16 }}>
      <TimerForm />
    </View>
  );
}
