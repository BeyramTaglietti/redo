import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";

import { RDText } from "@/lib/components";
import { useSettingsStore } from "@/lib/stores/settings";
import { SupportedLanguages, i18n, tailwindColors } from "@/lib/utils";

export const LanguagesList = () => {
  const setLanguage = useSettingsStore((state) => state.setLanguage);
  const currentLanguage = useSettingsStore((state) => state.language);
  const { t } = useTranslation();

  return (
    <View className="flex flex-col" style={{ gap: 8 }}>
      {Object.values(SupportedLanguages).map((language, idx) => (
        <TouchableOpacity
          key={`${language}-${idx}`}
          onPress={() => {
            i18n.changeLanguage(language);
            setLanguage(language);
          }}
          className="bg-primary rounded-lg h-12 flex flex-row px-4 justify-between items-center"
        >
          <RDText className="text-primary-foreground font-bold text-base">
            {t(`settings.languages.${language}`)}
          </RDText>
          {currentLanguage === language && (
            <Ionicons
              name="checkmark"
              size={24}
              color={tailwindColors.primary.foreground}
            />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};
