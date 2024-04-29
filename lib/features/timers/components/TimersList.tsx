import { Link } from "expo-router";
import { FlatList, View } from "react-native";

import { TimerCard } from "./TimerCard";

import { RDButton } from "@/lib/components";
import { useTimersStore } from "@/lib/stores/timers";

export const TimersList = () => {
  const timers = useTimersStore((state) => state.timers);

  return (
    <View className="flex flex-col w-full h-full" style={{ gap: 16 }}>
      <Link href="/create_timer" asChild>
        <RDButton title="Create" />
      </Link>

      <FlatList
        data={timers}
        renderItem={({ item }) => <TimerCard timer={item} />}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View className="h-2" />}
      />
    </View>
  );
};
