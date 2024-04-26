import { useEffect, useRef } from "react";
import { TextInput } from "react-native";

export const useVirtualKeyboard = () => {
  const keyboardRef = useRef<TextInput>(null);

  useEffect(() => {
    setTimeout(() => {
      keyboardRef.current?.focus();
    }, 600);
  }, [keyboardRef]);

  return keyboardRef;
};
