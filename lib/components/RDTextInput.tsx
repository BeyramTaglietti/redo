/* eslint-disable react/prop-types */
import React, { forwardRef, memo } from "react";
import { TextInput, TextInputProps, View } from "react-native";

import { RDText } from "./RDText";
import { cn, tailwindColors } from "../utils";

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
              "w-full h-14 rounded-xl px-4 bg-sheet-card-dark/10 dark:bg-sheet-card-dark text-black dark:text-white leading-[0px] text-xl",
              error && "border-2 border-destructive",
              className,
            )}
            {...buttonProps}
          />
        </View>
      );
    },
  ),
);
