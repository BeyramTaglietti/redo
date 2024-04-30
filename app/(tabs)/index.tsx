import { View } from "react-native";

import { TimersList } from "@/lib/features/timers";

export default function TabOneScreen() {
  return (
    <View className="flex px-4 pt-4 bg-background dark:bg-background-dark h-full w-full">
      <TimersList />
    </View>
  );
}
