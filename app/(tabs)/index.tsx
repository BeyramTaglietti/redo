import { View } from "react-native";

import { RDButton } from "@/lib/components";

export default function TabOneScreen() {
  return (
    <View className="flex flex-col justify-center items-center w-full h-full bg-background dark:bg-background-dark">
      <RDButton className="w-60" title="my custom button" />
    </View>
  );
}
