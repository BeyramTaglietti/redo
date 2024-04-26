import { Text, View } from "react-native";

import { RDButton } from "@/lib/components";

export default function TabOneScreen() {
  return (
    <View className="flex flex-col justify-center items-center w-full h-full bg-background dark:bg-background-dark">
      <Text>Tab One</Text>
      <Text className="text-primary">Tab One</Text>
      <RDButton className="w-20" />
    </View>
  );
}
