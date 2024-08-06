import { Slot } from "expo-router";
import { PostHogProvider } from "posthog-react-native";

import React, { useEffect } from "react";

import { useSettingsStore } from "@/lib/stores/settings";
import { i18n, tailwindColors } from "@/lib/utils";
import * as SystemUI from "expo-system-ui";
import { useColorScheme } from "react-native";

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const currentLanguage = useSettingsStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);

    SystemUI.setBackgroundColorAsync(
      tailwindColors.background[colorScheme === "light" ? "DEFAULT" : "dark"],
    );
  }, [currentLanguage, colorScheme]);

  return (
    <PostHogProvider
      apiKey={process.env.EXPO_PUBLIC_POSTHOG_APIKEY}
      options={{
        host: "https://eu.i.posthog.com",
      }}
    >
      <Slot />
    </PostHogProvider>
  );
};

export default RootLayout;
