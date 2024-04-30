import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Timer } from "./timers.model";

interface State {
  timers: Timer[];
}

interface Actions {
  createTimer: (timer: Timer) => void;
  editTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
  postPoneTimer: (id: string, notificationIdentifier: string) => void;
  reorderTimers: (timers: Timer[]) => void;
}

const initialState: State = {
  timers: [],
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
      postPoneTimer: (id, notificationIdentifier) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id
              ? {
                  ...timer,
                  updated_at: new Date().valueOf(),
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
