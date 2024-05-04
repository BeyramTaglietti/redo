import { Linking, View } from "react-native";

import { RDText } from "@/lib/components";
import { PORTFOLIO_URL, PRIVACY_POLICY_URL } from "@/lib/utils";

export default function AboutScreen() {
  return (
    <View className="p-4" style={{ gap: 16 }}>
      <RDText className="text-2xl">Hi there 👋</RDText>
      <RDText>
        Thanks for using Redo, I hope the app is being useful to you as much as
        it is to me. Make sure to not overplan your day to day life or you could
        fall into the trap of procrastination and have the opposite effect of
        what Redo&apos;s about. 🚀
      </RDText>

      <RDText>
        Redo was built with the idea of having a simple and easy to use task
        manager that helps you keep track of your daily habits while also acting
        as a remainder. 📅
      </RDText>
      <RDText>- Beyram</RDText>

      <View className="flex flex-col w-full items-end" style={{ gap: 16 }}>
        <RDText
          className="text-primary"
          onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
        >
          See our Privacy Policy
        </RDText>
        <RDText
          className="text-primary"
          onPress={() => Linking.openURL(PORTFOLIO_URL)}
        >
          Visit my website
        </RDText>
      </View>
    </View>
  );
}
