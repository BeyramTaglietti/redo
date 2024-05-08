import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";

import { tailwindColors } from "@/lib/utils";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tailwindColors.primary.DEFAULT,
        tabBarInactiveTintColor: tailwindColors.muted,
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor:
            colorScheme === "light"
              ? tailwindColors.background.DEFAULT
              : tailwindColors.background.dark,
        },
        headerStyle: {
          backgroundColor:
            colorScheme === "light"
              ? tailwindColors.background.DEFAULT
              : tailwindColors.background.dark,
        },
        headerShadowVisible: false,
        headerTitleStyle: {
          color:
            colorScheme === "light"
              ? tailwindColors.foreground.DEFAULT
              : tailwindColors.foreground.dark,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Redo",
          tabBarIcon: ({ color }) => <TabBarIcon name="check" color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t("app.settings"),
          tabBarIcon: ({ color }) => <TabBarIcon name="gear" color={color} />,
        }}
      />
    </Tabs>
  );
}
