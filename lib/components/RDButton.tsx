/* eslint-disable react/prop-types */
import React, { ReactNode, Ref, forwardRef, memo } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { HapticVibrate, cn } from "../utils";

interface RDButtonProps extends TouchableOpacityProps {
  title: string | null;
  icon?: ReactNode;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  onPress?: () => void;
}

export const RDButton = memo(
  forwardRef(
    (
      {
        title,
        icon,
        disabled,
        loading,
        className,
        onPress,
        ...props
      }: RDButtonProps,
      ref: Ref<TouchableOpacity>,
    ) => {
      return (
        <TouchableOpacity
          className={cn(
            "h-14 w-full flex flex-row justify-center items-center bg-primary rounded-xl",
            (disabled || loading) && "opacity-40",
            className,
          )}
          style={{ gap: 16 }}
          disabled={disabled || loading}
          {...props}
          onPress={() => {
            HapticVibrate("Light");
            onPress && onPress();
          }}
          ref={ref}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <View className="flex flex-row items-center" style={{ gap: 16 }}>
              {title && (
                <Text className="text-xl text-primary-foreground font-bold">
                  {title}
                </Text>
              )}
              {icon}
            </View>
          )}
        </TouchableOpacity>
      );
    },
  ),
);
