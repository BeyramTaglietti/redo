import { Fragment } from "react";
import { View } from "react-native";
import { LanguagesList } from "../features/settings";

export const LanguagesPage = () => {
  return (
    <Fragment>
      <View className="p-4">
        <LanguagesList />
      </View>
    </Fragment>
  );
};
