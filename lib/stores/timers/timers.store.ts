import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { Timer } from "./timers.model";

interface State {
  timers: Timer[];
}

interface Actions {
  createTimer: (timer: Timer) => void;
  deleteTimer: (id: string) => void;
  postPoneTimer: (id: string) => void;
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
      deleteTimer: (id) =>
        set((state) => ({
          timers: state.timers.filter((timer) => timer.id !== id),
        })),
      postPoneTimer: (id) =>
        set((state) => ({
          timers: state.timers.map((timer) =>
            timer.id === id
              ? {
                  ...timer,
                  updated_at: new Date().valueOf(),
                }
              : timer,
          ),
        })),
    }),
    {
      name: "app-storage", // name of the item in the storage (must be unique)

      storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
    },
  ),
);
