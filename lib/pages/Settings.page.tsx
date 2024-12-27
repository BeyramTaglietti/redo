import { Fragment } from "react";
import { View } from "react-native";
import { SettingsList } from "../features/settings";

export const SettingsPage = () => {
  return (
    <Fragment>
      <View className="px-4 bg-background dark:bg-background-dark w-full h-full">
        <SettingsList />
      </View>
    </Fragment>
  );
};
