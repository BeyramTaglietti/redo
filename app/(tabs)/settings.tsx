import { View } from "react-native";

import { SettingsList } from "@/lib/features/settings";

export default function TabTwoScreen() {
  return (
    <View className="px-4 bg-background dark:bg-background-dark w-full h-full">
      <SettingsList />
    </View>
  );
}
