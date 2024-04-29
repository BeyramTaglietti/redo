import { View } from "react-native";

import { TimersList } from "@/lib/features/timers";

export default function TabOneScreen() {
  return (
    <View className="flex p-4 bg-background dark:bg-background-dark">
      <TimersList />
    </View>
  );
}
