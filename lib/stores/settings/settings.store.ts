import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface State {
  notificationsEnabled: boolean;
}

interface Actions {
  toggleNotifications: () => void;
}

const initialState: State = {
  notificationsEnabled: true,
};

export const useSettingsStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),
    }),
    {
      name: "settings-storage", // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
