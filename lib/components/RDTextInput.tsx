/* eslint-disable react/prop-types */
import React, { forwardRef, memo } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import { cn, tailwindColors } from "../utils";
import { RDText } from "./RDText";

interface RDTextInputProps extends TextInputProps {
  error?: boolean;
  label?: string;
  className?: string;
}

export const RDTextInput = memo(
  forwardRef<TextInput, RDTextInputProps>(
    ({ error, label, className, ...buttonProps }, ref) => {
      return (
        <View className="flex flex-col" style={{ gap: 8 }}>
          {label && <RDText className="text-xl">{label}</RDText>}
          <TextInput
            ref={ref}
            placeholderTextColor="gray"
            selectionColor={tailwindColors.primary.DEFAULT}
            cursorColor={tailwindColors.primary.DEFAULT}
            className={cn(
              "w-full h-12 text-black dark:text-white bg-sheet-card-dark/10 dark:bg-sheet-card-dark px-4 rounded-xl",
              error && "border-2 border-destructive",
              className,
            )}
            style={{
              fontSize: 18,
            }}
            {...buttonProps}
          />
        </View>
      );
    },
  ),
);
