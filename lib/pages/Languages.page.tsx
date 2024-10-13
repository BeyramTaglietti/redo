import { View } from "react-native";
import { LanguagesList } from "../features/settings";

export const LanguagesPage = () => {
  return (
    <>
      <View className="p-4">
        <LanguagesList />
      </View>
    </>
  );
};
