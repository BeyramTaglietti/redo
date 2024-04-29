import { Stack, router } from "expo-router";
import { Button, Platform, useColorScheme } from "react-native";

import { tailwindColors } from "@/lib/utils";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor:
            colorScheme === "light"
              ? tailwindColors.sheet.DEFAULT
              : tailwindColors.sheet.dark,
        },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="create_timer"
        options={{
          presentation: "modal",
          title: "Create Timer",
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
          headerShown: true,
          headerShadowVisible: false,
          headerTintColor: colorScheme === "light" ? "black" : "white",
        }}
      />
    </Stack>
  );
}
