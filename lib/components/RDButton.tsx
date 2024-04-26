import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";

import { cn } from "../utils";

type RDButtonProps = {
  className?: string;
} & TouchableOpacityProps;

export const RDButton = ({ className, ...buttonProps }: RDButtonProps) => {
  return (
    <TouchableOpacity
      className={cn(
        "bg-primary w-full h-12 flex justify-center items-center rounded-lg",
        className,
      )}
      {...buttonProps}
    >
      <Text className="text-primary-foreground text-lg font-bold">Hello</Text>
    </TouchableOpacity>
  );
};
