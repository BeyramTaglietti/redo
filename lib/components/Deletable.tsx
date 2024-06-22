import { MaterialIcons } from "@expo/vector-icons";
import React, { memo, useCallback, useMemo, useRef } from "react";
import { Alert, useWindowDimensions } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import { HapticVibrate, animateOut } from "../utils";

type DeletableProps = {
  children: React.ReactNode;
  onDelete: () => void;
  deleteMessage?: string;
  onSlideAction?: (sliding: boolean) => void;
};

export const Deletable = memo(
  ({ children, onDelete, deleteMessage, onSlideAction }: DeletableProps) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const THRESHOLD = useMemo(() => SCREEN_WIDTH / 3, [SCREEN_WIDTH]);

    const offsetShareValue = useSharedValue(0);
    const positionSharedValue = useSharedValue(0);

    const scaledSharedValue = useDerivedValue(() => {
      return Math.sqrt(offsetShareValue.value * -6);
    });

    const hapticFeedbackDeleteTriggered = useRef(false);

    const triggerHapticFeedback = useCallback((mode: "Light" | "Medium") => {
      if (
        mode === "Medium" &&
        hapticFeedbackDeleteTriggered.current === false
      ) {
        hapticFeedbackDeleteTriggered.current = true;
        HapticVibrate(mode);
      } else if (
        mode === "Light" &&
        hapticFeedbackDeleteTriggered.current === true
      ) {
        hapticFeedbackDeleteTriggered.current = false;
        HapticVibrate(mode);
      }
    }, []);

    const removeItem = useCallback(() => {
      const duration = 500;

      positionSharedValue.value = withTiming(-SCREEN_WIDTH, {
        duration,
        easing: Easing.out(Easing.cubic),
      });

      setTimeout(() => {
        animateOut();
        onDelete();
      }, duration);
    }, [SCREEN_WIDTH, onDelete, positionSharedValue]);

    const getConfirm = useCallback(() => {
      Alert.alert("Warning", deleteMessage, [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {
            hapticFeedbackDeleteTriggered.current = false;
            offsetShareValue.value = withTiming(0, {
              duration: 400,
              easing: Easing.bezier(0.25, 0.1, 0, 1.05),
            });
          },
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: removeItem,
        },
      ]);
    }, [deleteMessage, removeItem, offsetShareValue]);

    const pan = Gesture.Pan()
      .activeOffsetX([-10, 10])
      .onChange((event) => {
        if (event.translationX > 0) return;

        if (onSlideAction) runOnJS(onSlideAction)(true);

        if (event.translationX < -THRESHOLD) {
          offsetShareValue.value = withSpring(-SCREEN_WIDTH + 50);
          runOnJS(triggerHapticFeedback)("Medium");
        } else {
          runOnJS(triggerHapticFeedback)("Light");
          offsetShareValue.value = event.translationX;
        }
      })
      .onFinalize((event) => {
        if (event.translationX < -THRESHOLD) return;
        if (onSlideAction) runOnJS(onSlideAction)(false);

        offsetShareValue.value = withTiming(0, {
          duration: 400,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
      })
      .onEnd((event) => {
        if (event.translationX < -THRESHOLD) {
          if (deleteMessage) {
            runOnJS(getConfirm)();
          } else runOnJS(removeItem)();
        }
      });

    const animatedSlider = useAnimatedStyle(() => ({
      transform: [{ translateX: offsetShareValue.value }],
      backgroundColor: "transparent",
      zIndex: 1,
    }));

    const animatedPosition = useAnimatedStyle(() => ({
      transform: [{ translateX: positionSharedValue.value }],
    }));

    const animatedTrashIcon = useAnimatedStyle(() => ({
      paddingHorizontal: scaledSharedValue.value,
    }));

    return (
      <GestureDetector gesture={pan}>
        <Animated.View
          className="relative overflow-hidden rounded-xl"
          style={animatedPosition}
        >
          <Animated.View style={animatedSlider}>{children}</Animated.View>
          <Animated.View
            className="absolute top-0 left-0 w-full h-full bg-destructive/80 justify-center items-end rounded-xl"
            style={animatedTrashIcon}
          >
            <MaterialIcons name="delete" color="white" size={30} />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    );
  },
);

Deletable.displayName = "Deletable";
