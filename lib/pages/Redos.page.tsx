import { View } from "react-native";
import { TimersList } from "../features/timers";

export const RedosPage = () => {
  return (
    <>
      <View className="flex px-4 pt-4 bg-background dark:bg-background-dark h-full w-full">
        <TimersList />
      </View>
    </>
  );
};
