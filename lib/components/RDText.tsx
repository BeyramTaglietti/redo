import { forwardRef, memo } from "react";
import { Text, TextProps } from "react-native";

import { cn } from "../utils";

interface RDTextProps extends TextProps {
  className?: string;
}

export const RDText = memo(
  forwardRef<Text, RDTextProps>(({ className, ...textProps }, ref) => {
    return (
      <Text
        className={cn("text-foreground dark:text-foreground-dark", className)}
        {...textProps}
        ref={ref}
      />
    );
  }),
);
