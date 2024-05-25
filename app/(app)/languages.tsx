import { View } from "react-native";

import { LanguagesList } from "@/lib/features/settings";

export default function LanguagesScreen() {
  return (
    <View className="p-4">
      <LanguagesList />
    </View>
  );
}
