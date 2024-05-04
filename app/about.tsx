import { useTranslation } from "react-i18next";
import { Linking, View } from "react-native";

import { RDText } from "@/lib/components";
import { PORTFOLIO_URL, PRIVACY_POLICY_URL } from "@/lib/utils";

export default function AboutScreen() {
  const { t } = useTranslation();

  return (
    <View className="p-4" style={{ gap: 16 }}>
      <RDText className="text-2xl">{t("settings.about.title")}</RDText>
      <RDText>{t("settings.about.description")}</RDText>

      <RDText>{t("settings.about.description_2")}</RDText>
      <RDText>- Beyram</RDText>

      <View className="flex flex-col w-full items-end" style={{ gap: 16 }}>
        <RDText
          className="text-primary"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
        >
          {t("settings.about.see_privacy_policy")}
        </RDText>
        <RDText
          className="text-primary"
          onPress={() => Linking.openURL(PORTFOLIO_URL)}
        >
          {t("settings.about.visit_website")}
        </RDText>
      </View>
    </View>
  );
}
