import { Carousel, CarouselRef, RDButton, RDText } from "@/lib/components";
import { useSettingsStore } from "@/lib/stores/settings";
import LottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";

import { ComponentProps, useCallback, useRef, useState } from "react";
import { DimensionValue, View, useWindowDimensions } from "react-native";

import done_animation from "@/assets/lottie/done_animation.json";
import notification_animation from "@/assets/lottie/notification_animation.json";
import timer_animation from "@/assets/lottie/timer_animation.json";

import { Redirect, router } from "expo-router";

import * as Notifications from "expo-notifications";

export const OnBoardingPage = () => {
  const { t } = useTranslation();

  const { width } = useWindowDimensions();

  const carouselRef = useRef<CarouselRef | null>(null);
  const [screen, setScreen] = useState(0);

  const goToNextPage = useCallback(() => {
    const page = carouselRef.current?.nextPage() ?? 0;
    setScreen(page);
  }, []);

  const onBoardingCompleted = useSettingsStore(
    (state) => state.onboardingCompleted,
  );

  const setOnBoardingCompleted = useSettingsStore(
    (state) => state.completeOnboarding,
  );

  const enableNotifications = useCallback(async () => {
    await Notifications.requestPermissionsAsync();
    goToNextPage();
  }, [goToNextPage]);

  if (onBoardingCompleted) {
    return <Redirect href="redos" />;
  }

  return (
    <View className="flex py-6 h-full flex-col" style={{ gap: 32 }}>
      <View className="w-full px-6 flex justify-center items-center">
        <RDText className="text-3xl font-bold">
          {t("onboarding.welcome")}
        </RDText>
      </View>

      <View className="flex-1">
        <Carousel
          ref={carouselRef}
          screens={[
            <ScrollScreen
              animation={timer_animation}
              label={t("onboarding.screen_first")}
              lottieWidthPercentage={"100%"}
            />,
            <ScrollScreen
              animation={notification_animation}
              label={t("onboarding.screen_second")}
              lottieWidthPercentage={"50%"}
            />,
            <ScrollScreen
              animation={done_animation}
              label={t("onboarding.screen_third")}
              lottieWidthPercentage={"100%"}
            />,
          ]}
          carouselWidth={width}
        />
      </View>

      <View className="w-full flex justify-end px-6">
        {screen === 0 ? (
          <RDButton title={t("onboarding.continue")} onPress={goToNextPage} />
        ) : null}
        {screen === 1 ? (
          <RDButton
            title={t("onboarding.enable_notifications")}
            onPress={enableNotifications}
          />
        ) : null}
        {screen === 2 ? (
          <RDButton
            title={t("onboarding.complete")}
            onPress={() => {
              setOnBoardingCompleted();
              router.replace("redos");
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

const ScrollScreen = ({
  animation,
  label,
  lottieWidthPercentage,
}: {
  animation: ComponentProps<typeof LottieView>["source"];
  label: string;
  lottieWidthPercentage: DimensionValue;
}) => {
  return (
    <View className="w-full h-full flex justify-center items-center px-6">
      <LottieView
        source={animation}
        style={{ flex: 1, width: lottieWidthPercentage }}
        autoPlay
        loop
      />
      <RDText className="text-2xl text-center h-1/3">{label}</RDText>
    </View>
  );
};
