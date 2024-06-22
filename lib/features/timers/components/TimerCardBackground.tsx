import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { cn, tailwindColors } from "@/lib/utils";

const BACKDROP_COLOR = "#86EFAC";

export const TimerCardBackground = memo(
  ({
    timeLeft,
    duration_ms,
    isPaused,
  }: {
    timeLeft: number;
    duration_ms: number;
    isPaused: boolean;
  }) => {
    const slidingViewState = useSharedValue({
      width: (timeLeft / (duration_ms / 1000)) * 100,
      background: tailwindColors.primary.DEFAULT,
    });

    const backdropViewState = useSharedValue({
      background: BACKDROP_COLOR,
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
      };
    });

    useEffect(() => {
      slidingViewState.value = {
        width: (timeLeft / (duration_ms / 1000)) * 100,
        background: tailwindColors.primary.DEFAULT,
      };

      if (isPaused) {
        slidingViewState.value = {
          width: slidingViewState.value.width,
          background: "#828583",
        };
        backdropViewState.value = {
          background: "#D1D5DB",
        };
      } else {
        backdropViewState.value = {
          background: BACKDROP_COLOR,
        };
      }

      if (timeLeft <= 0) {
        slidingViewState.value = {
          width: 0,
          background: tailwindColors.destructive,
        };
        backdropViewState.value = {
          background: tailwindColors.destructive,
        };
      }
    }, [duration_ms, timeLeft, isPaused, slidingViewState, backdropViewState]);

    return (
      <>
        <Animated.View
          className={cn(
            "absolute bg-primary w-full h-full z-10 rounded-xl",
            isPaused ? "bg-gray-400" : "",
          )}
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
