import { tailwindColors } from "@/lib/utils";
import { memo, useEffect } from "react";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BACKDROP_COLOR = "#86EFAC";

export const TimerCardBackground = memo(
  ({ timeLeft, duration_ms }: { timeLeft: number; duration_ms: number }) => {
    const shared = useSharedValue({
      width: (timeLeft / (duration_ms / 1000)) * 100,
      background: BACKDROP_COLOR,
    });

    const slidingViewStyle = useAnimatedStyle(() => {
      return {
        width: withTiming(`${shared.value.width}%`, {
          duration: 500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        }),
      };
    });

    const backdropViewStyle = useAnimatedStyle(() => {
      return {
        backgroundColor: withTiming(shared.value.background),
      };
    });

    useEffect(() => {
      shared.value = {
        background: BACKDROP_COLOR,
        width: (timeLeft / (duration_ms / 1000)) * 100,
      };

      if (timeLeft <= 0) {
        shared.value = {
          width: 0,
          background: tailwindColors.destructive,
        };
      }
    }, [duration_ms, shared, timeLeft]);

    return (
      <>
        <Animated.View
          className="absolute bg-primary w-full h-full z-10 rounded-xl"
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
