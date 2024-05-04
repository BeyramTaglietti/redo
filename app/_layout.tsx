import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button, Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { useSettingsStore } from "@/lib/stores/settings";
import { i18n, tailwindColors } from "@/lib/utils";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const currentLanguage = useSettingsStore((state) => state.language);

  useEffect(() => {
    i18n.changeLanguage(currentLanguage);
  }, [currentLanguage]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          contentStyle: {
            backgroundColor:
              colorScheme === "light"
                ? tailwindColors.background.DEFAULT
                : tailwindColors.background.dark,
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="create_timer"
          options={{
            presentation: "modal",
            title: `${t("app.create")} Redo`,
            headerRight: () =>
              Platform.OS === "ios" && (
                <Button title={t("app.close")} onPress={() => router.back()} />
              ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.sheet.DEFAULT
                  : tailwindColors.sheet.dark,
            },
            contentStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.sheet.DEFAULT
                  : tailwindColors.sheet.dark,
            },
            headerTintColor:
              colorScheme === "light"
                ? tailwindColors.foreground.DEFAULT
                : tailwindColors.foreground.dark,
          }}
        />
        <Stack.Screen
          name="[timer_id]"
          options={{
            presentation: "modal",
            title: "Edit Redo",
            headerRight: () =>
              Platform.OS === "ios" && (
                <Button title="Close" onPress={() => router.back()} />
              ),
            headerStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.sheet.DEFAULT
                  : tailwindColors.sheet.dark,
            },
            headerTintColor: colorScheme === "light" ? "black" : "white",
            contentStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.sheet.DEFAULT
                  : tailwindColors.sheet.dark,
            },
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: t("settings.about_redo"),
            headerStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.background.DEFAULT
                  : tailwindColors.background.dark,
            },
            headerTintColor: tailwindColors.primary.DEFAULT,
            headerBackTitle: t("app.settings"),
            headerTitleStyle: {
              color:
                colorScheme === "light"
                  ? tailwindColors.foreground.DEFAULT
                  : tailwindColors.foreground.dark,
            },
          }}
        />
        <Stack.Screen
          name="languages"
          options={{
            title: t("app.languages"),
            headerStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.background.DEFAULT
                  : tailwindColors.background.dark,
            },
            headerTintColor: tailwindColors.primary.DEFAULT,
            headerBackTitle: t("app.settings"),
            headerTitleStyle: {
              color:
                colorScheme === "light"
                  ? tailwindColors.foreground.DEFAULT
                  : tailwindColors.foreground.dark,
            },
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
