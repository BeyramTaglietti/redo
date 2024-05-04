import { Entypo, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Linking, Pressable, Switch, View } from "react-native";

import { RDText } from "@/lib/components";
import { useSettingsStore } from "@/lib/stores/settings";
import { SUPPORT_MAIL, tailwindColors } from "@/lib/utils";

export const SettingsList = () => {
  const { notificationsEnabled, toggleNotifications } = useSettingsStore();

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
        title="Notifications"
        description="This change won't affect currently active Redos"
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
        title="Language"
      >
        <RDText>English</RDText>
      </SettingOption>
      <SettingOption
        icon={
          <Ionicons
            name="help-circle"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title="About Redo"
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
        title="Contact us"
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
      className="flex flex-row items-center justify-between w-full"
      style={{ gap: 16 }}
      onPress={onPress}
    >
      <View className="bg-primary rounded-full p-2">{icon}</View>
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
