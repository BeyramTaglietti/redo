import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Linking, Pressable, Switch, View } from "react-native";

import { RDText } from "@/lib/components";
import { useSettingsStore } from "@/lib/stores/settings";
import { SUPPORT_MAIL, tailwindColors } from "@/lib/utils";

export const SettingsList = () => {
  const notificationsEnabled = useSettingsStore(
    (state) => state.notificationsEnabled,
  );

  const toggleNotifications = useSettingsStore(
    (state) => state.toggleNotifications,
  );

  const language = useSettingsStore((state) => state.language);

  const { t } = useTranslation();

  return (
    <View className="flex flex-col" style={{ gap: 32 }}>
      <SettingOption
        icon={
          <Ionicons
            name="notifications"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title={t("app.notifications")}
        description={t("settings.notifications_description")}
      >
        <Switch
          value={notificationsEnabled}
          trackColor={{
            true: tailwindColors.primary.DEFAULT,
          }}
          onValueChange={toggleNotifications}
        />
      </SettingOption>
      <SettingOption
        icon={
          <Ionicons
            name="language"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title={t("settings.language")}
        onPress={() => router.push("/languages")}
      >
        <RDText>{t(`settings.languages.${language}`)}</RDText>
      </SettingOption>
      <SettingOption
        icon={
          <Ionicons
            name="help-circle"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title={t("settings.about_redo")}
        onPress={() => router.push("/about")}
      >
        <Entypo
          name="chevron-right"
          size={24}
          color={tailwindColors.primary.DEFAULT}
        />
      </SettingOption>
      <SettingOption
        icon={
          <Ionicons
            name="chatbox"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title={t("settings.contact_us")}
        onPress={() =>
          Linking.openURL(`mailto:${SUPPORT_MAIL}?subject=Request`)
        }
      >
        <Entypo
          name="forward"
          size={24}
          color={tailwindColors.primary.DEFAULT}
        />
      </SettingOption>
    </View>
  );
};

const SettingOption = ({
  icon,
  title,
  description,
  children,
  onPress,
}: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children?: React.ReactNode;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      className="flex flex-row items-center justify-between w-full "
      style={{ gap: 16 }}
      onPress={onPress}
    >
      <View className="bg-primary rounded-full h-10 w-10 flex justify-center items-center overflow-hidden">
        {icon}
      </View>
      <View className="flex flex-col flex-1">
        <RDText className="font-bold text-base">{title}</RDText>
        {description && (
          <RDText className="text-gray-500">{description}</RDText>
        )}
      </View>
      <View>{children}</View>
    </Pressable>
  );
};
