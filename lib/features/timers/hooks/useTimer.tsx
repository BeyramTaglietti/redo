import { Timer, useTimersStore } from "@/lib/stores/timers";
import { useCallback, useEffect, useState } from "react";
import { calculateSecondsLeft } from "../utils";
import { useTimerNotifications } from "./useTimerNotifications";

type useTimerType = (timer: Timer) => {
  postPone: () => Promise<void>;
  remove: () => void;
  edit: () => void;
  pause: () => void;
  resume: () => Promise<void>;
  timeLeft: number | null;
};
export const useTimer: useTimerType = (timer) => {
  const deleteTimer = useTimersStore((state) => state.deleteTimer);
  const postPoneTimer = useTimersStore((state) => state.postPoneTimer);
  const editTimer = useTimersStore((state) => state.editTimer);

  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (timer.is_paused) {
      setTimeLeft(
        calculateSecondsLeft({
          updated_at:
            new Date().valueOf() - timer.paused_at! + timer.updated_at,
          duration_ms: timer.duration_ms,
        }),
      );
      return;
    }

    setTimeLeft(
      calculateSecondsLeft({
        updated_at: timer.updated_at,
        duration_ms: timer.duration_ms,
      }),
    );

    const interval = setInterval(() => {
      const left = calculateSecondsLeft({
        updated_at: timer.updated_at,
        duration_ms: timer.duration_ms,
      });

      if (left <= 0) {
        clearInterval(interval);
      }

      setTimeLeft(left);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [
    timer.updated_at,
    timer.id,
    timer.is_paused,
    timer.duration_ms,
    timer.paused_at,
  ]);

  const { createTimerNotification, removeTimerNotification } =
    useTimerNotifications();

  const postPone = useCallback(async () => {
    removeTimerNotification(timer.notification_identifier);

    const identifier = await createTimerNotification(
      timer.title,
      timer.duration_ms,
    );

    if (!identifier) {
      return;
    }

    postPoneTimer(timer.id, identifier);
  }, [
    createTimerNotification,
    postPoneTimer,
    removeTimerNotification,
    timer.duration_ms,
    timer.id,
    timer.notification_identifier,
    timer.title,
  ]);

  const remove = useCallback(() => {
    removeTimerNotification(timer.notification_identifier);
    deleteTimer(timer.id);
  }, [deleteTimer, removeTimerNotification, timer]);

  const pause = useCallback(() => {
    removeTimerNotification(timer.notification_identifier);
    editTimer({ ...timer, is_paused: true, paused_at: new Date().valueOf() });
  }, [editTimer, removeTimerNotification, timer]);

  const resume = useCallback(async () => {
    if (!timer.paused_at) {
      return;
    }

    const newVals = {
      updated_at: new Date().valueOf() - timer.paused_at + timer.updated_at,
      created_at: new Date().valueOf() - timer.paused_at,
    };

    const newIdentifier = await createTimerNotification(
      timer.title,
      calculateSecondsLeft({
        updated_at: newVals.updated_at,
        duration_ms: timer.duration_ms,
      }) * 1000,
    );

    editTimer({
      ...timer,
      is_paused: false,
      paused_at: null,
      updated_at: newVals.updated_at,
      created_at: newVals.created_at,
      notification_identifier: newIdentifier ?? "",
    });
  }, [createTimerNotification, editTimer, timer]);

  const edit = () => {};

  return {
    postPone,
    remove,
    edit,
    pause,
    resume,
    timeLeft,
  };
};
