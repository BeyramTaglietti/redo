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
                ? tailwindColors.background.DEFAULT
                : tailwindColors.background.dark,
          },
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
            headerShown: true,
            headerShadowVisible: false,
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
            title: "About Redo",
            headerStyle: {
              backgroundColor:
                colorScheme === "light"
                  ? tailwindColors.background.DEFAULT
                  : tailwindColors.background.dark,
            },
            headerShown: true,
            headerShadowVisible: false,
            headerTintColor: tailwindColors.primary.DEFAULT,
            headerBackTitle: "Settings",
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
