import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { createUUID, i18n, tailwindColors } from "@/lib/utils";
import { Timer } from "./timers.model";

interface State {
  timers: Timer[];
}

interface Actions {
  createTimer: (timer: Timer) => void;
  editTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
  postPoneTimer: (
    id: string,
    notificationIdentifier: string,
    updateAt: number,
  ) => void;
  reorderTimers: (timers: Timer[]) => void;
}

const initialState: State = {
  timers: [
    {
      id: createUUID(),
      title: i18n.t("onboarding.slide_to_close"),
      duration_ms: 1000 * 60 * 5, // 5 minutes
      created_at: new Date().valueOf(),
      updated_at: new Date().valueOf(),
      notification_identifier: "",
      is_paused: false,
      paused_at: 0,
      background_color: tailwindColors.primary.DEFAULT,
    },
  ],
};

export const useTimersStore = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      createTimer: (newTimer) =>
        set((state) => ({ timers: [...state.timers, newTimer] })),
      editTimer: (editedTimer) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === editedTimer.id ? editedTimer : timer,
          ),
        })),
      deleteTimer: (id) =>
        set((state) => ({
          timers: state.timers.filter((timer) => timer.id !== id),
        })),
      postPoneTimer: (id, notificationIdentifier, updateAt) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id
              ? {
                  ...timer,
                  updated_at: updateAt,
                  notification_identifier: notificationIdentifier,
                }
              : timer,
          ),
        })),
      reorderTimers: (timers) => set({ timers }),
    }),
    {
      name: "timers-storage", // name of the item in the storage (must be unique)

      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
