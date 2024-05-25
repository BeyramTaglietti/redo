import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { SupportedLanguages } from "@/lib/utils";

interface State {
  onboardingCompleted: boolean;
  notificationsEnabled: boolean;
  language: string;
}

interface Actions {
  toggleNotifications: () => void;
  setLanguage: (language: SupportedLanguages) => void;
  completeOnboarding: () => void;
}

const initialState: State = {
  onboardingCompleted: false,
  notificationsEnabled: true,
  language: Localization.getLocales()[0].languageCode ?? "en",
};

export const useSettingsStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      toggleNotifications: () =>
        set((state) => ({
          ...state,
          notificationsEnabled: !state.notificationsEnabled,
        })),
      setLanguage: (language) => {
        set((state) => ({
          ...state,
          language,
        }));
      },
      completeOnboarding: () =>
        set((state) => ({
          ...state,
          onboardingCompleted: true,
        })),
    }),
    {
      name: "settings-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
