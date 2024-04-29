import { Feather } from "@expo/vector-icons";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";

import { RDText } from "@/lib/components";
import { Timer, useTimersStore } from "@/lib/stores/timers";
import { cn, tailwindColors } from "@/lib/utils";

export const TimerCard = ({ timer }: { timer: Timer }) => {
  const deleteTimer = useTimersStore((state) => state.deleteTimer);
  const postPoneTimer = useTimersStore((state) => state.postPoneTimer);

  const calculateSecondsLeft = useCallback(() => {
    return Math.round(
      (timer.updated_at + timer.duration_ms - new Date().valueOf()) / 1000,
    );
  }, [timer.duration_ms, timer.updated_at]);

  const [timeLeft, setTimeLeft] = useState<number>(calculateSecondsLeft());

  useEffect(() => {
    setTimeLeft(calculateSecondsLeft());

    const interval = setInterval(() => {
      const left = calculateSecondsLeft();

      if (left <= 0) {
        clearInterval(interval);
      }

      setTimeLeft(left);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [calculateSecondsLeft, timer.updated_at]);

  const handlePostPone = useCallback(() => {
    postPoneTimer(timer.id);
  }, [postPoneTimer, timer.id]);

  if (timeLeft === null) {
    return null;
  }

  return (
    <View
      className={cn(
        "rounded-xl h-40 w-full p-4",
        timeLeft > 0 ? "bg-primary" : "bg-muted",
      )}
    >
      <RDText className="text-white font-bold text-xl">{timer.title}</RDText>
      <RDText className="text-white font-bold text-xl">
        {timeLeft <= 0 ? 0 : timeLeft}
      </RDText>
      <View
        className="flex flex-row flex-1 justify-end items-end"
        style={{ gap: 32 }}
      >
        <ActionButton iconName="x" onPress={() => deleteTimer(timer.id)} />
        <ActionButton iconName="check" onPress={handlePostPone} />
      </View>
    </View>
  );
};

const ActionButton = ({
  iconName,
  onPress,
}: {
  iconName: ComponentProps<typeof Feather>["name"];
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="rounded-full h-12 w-12 flex justify-center items-center bg-transparent/20"
      onPress={onPress}
    >
      <Feather
        name={iconName}
        size={24}
        color={tailwindColors.primary.foreground}
      />
    </TouchableOpacity>
  );
};
