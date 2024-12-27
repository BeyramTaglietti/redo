import {
  Fragment,
  ReactNode,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface CarouselProps {
  screens: ReactNode[];
  carouselWidth: number;
}

export interface CarouselRef {
  nextPage: () => number;
}

export const Carousel = forwardRef<CarouselRef, CarouselProps>(
  ({ screens, carouselWidth }, ref) => {
    const translateX = useSharedValue(0);
    const [currentScreen, setCurrentScreen] = useState(0);

    const nextPage = useCallback(() => {
      setCurrentScreen((prev) => prev + 1);
      translateX.value += -carouselWidth;

      return currentScreen + 1;
    }, [translateX, carouselWidth, currentScreen]);

    const translateXAnimation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateX: withSpring(translateX.value),
          },
        ],
      };
    });

    useImperativeHandle(ref, () => ({
      nextPage,
    }));

    return (
      <Fragment>
        <Animated.View
          className="w-full h-full flex flex-row"
          style={translateXAnimation}
        >
          {screens.map((screen, index) => {
            return <Fragment key={index}>{screen}</Fragment>;
          })}
        </Animated.View>
      </Fragment>
    );
  },
);

Carousel.displayName = "Carousel";
