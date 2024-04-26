import * as Haptics from "expo-haptics";

export const HapticVibrate = (mode: "Light" | "Medium" | "Heavy") => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle[mode]);
};
