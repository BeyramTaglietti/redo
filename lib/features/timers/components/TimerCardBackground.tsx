import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { tailwindColors } from "@/lib/utils";

const DISABLED_COLOR = "#828583";
const DESTRUCTIVE_COLOR = tailwindColors.destructive;

type TimerCardBackgroundProps = {
  timeLeft: number;
  duration_ms: number;
  isPaused: boolean;
  timerBackgroundColor: string;
};

export const TimerCardBackground = memo(
  ({
    timeLeft,
    duration_ms,
    isPaused,
    timerBackgroundColor,
  }: TimerCardBackgroundProps) => {
    const slidingViewState = useSharedValue({
      width: (timeLeft / (duration_ms / 1000)) * 100,
      background: timerBackgroundColor,
    });

    const backdropViewState = useSharedValue({
      background: timerBackgroundColor,
    });

    const slidingViewStyle = useAnimatedStyle(() => {
      return {
        width: withTiming(`${slidingViewState.value.width}%`, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
        backgroundColor: withTiming(slidingViewState.value.background),
      };
    });

    const backdropViewStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(backdropViewState.value.background),
        opacity: withTiming(0.6),
      };
    });

    useEffect(() => {
      slidingViewState.value = {
        width: (timeLeft / (duration_ms / 1000)) * 100,
        background: timerBackgroundColor,
      };

      if (isPaused) {
        slidingViewState.value = {
          width: slidingViewState.value.width,
          background: DISABLED_COLOR,
        };
        backdropViewState.value = {
          background: DISABLED_COLOR,
        };
      } else {
        backdropViewState.value = {
          background: timerBackgroundColor,
        };
      }

      if (timeLeft <= 0) {
        slidingViewState.value = {
          width: 0,
          background: DESTRUCTIVE_COLOR,
        };
        backdropViewState.value = {
          background: DESTRUCTIVE_COLOR,
        };
      }
    }, [
      duration_ms,
      timeLeft,
      isPaused,
      slidingViewState,
      backdropViewState,
      timerBackgroundColor,
    ]);

    return (
      <>
        <Animated.View
          className="absolute w-full h-full z-10 rounded-xl"
          style={slidingViewStyle}
        />
        <Animated.View
          className="absolute w-full h-full"
          style={backdropViewStyle}
        />
      </>
    );
  },
);

TimerCardBackground.displayName = "TimerCardBackground";
