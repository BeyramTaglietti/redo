import { RDText } from "@/lib/components";
import { useSettingsStore } from "@/lib/stores/settings";
import { tailwindColors } from "@/lib/utils";
import { Ionicons } from "@expo/vector-icons";
import { Switch, View } from "react-native";

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
      >
        <Switch
          value={notificationsEnabled}
          trackColor={{
            true: tailwindColors.primary.DEFAULT,
          }}
          onValueChange={toggleNotifications}
          className="self-end"
        />
      </SettingOption>
      <SettingOption
        icon={
          <Ionicons
            name="moon"
            size={24}
            color={tailwindColors.primary.foreground}
          />
        }
        title="Dark Mode"
      >
        <Switch
          value={false}
          trackColor={{
            true: tailwindColors.primary.DEFAULT,
          }}
          onValueChange={(val) => {}}
          className="self-end"
        />
      </SettingOption>
    </View>
  );
};

const SettingOption = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center" style={{ gap: 16 }}>
        <View className="bg-primary rounded-full p-2">{icon}</View>
        <RDText className="font-bold text-base">{title}</RDText>
      </View>
      {children}
    </View>
  );
};
