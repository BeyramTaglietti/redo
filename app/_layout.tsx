import { Stack, router } from "expo-router";
import { Button, Platform, useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { tailwindColors } from "@/lib/utils";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            title: "Create Redo",
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
    </GestureHandlerRootView>
  );
}
