import { Link } from "expo-router";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

import { TimerCard } from "./TimerCard";

import { RDButton } from "@/lib/components";
import { useTimersStore } from "@/lib/stores/timers";

export const TimersList = () => {
  const timers = useTimersStore((state) => state.timers);
  const reorderTimers = useTimersStore((state) => state.reorderTimers);

  const { t } = useTranslation();

  return (
    <View className="flex flex-col h-full w-full" style={{ gap: 16 }}>
      <Link href="/create_timer" asChild>
        <RDButton title={t("timers.create_timer")} />
      </Link>

      <DraggableFlatList
        containerStyle={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}
        data={timers}
        renderItem={({ item, drag, isActive }) => (
          <View className="my-2">
            <TimerCard timer={item} onLongPress={drag} isDragging={isActive} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => {
          reorderTimers(data);
        }}
      />
    </View>
  );
};
