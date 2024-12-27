import {
  AnalyticsEvents,
  PostPoneNotificationAction,
  PostPoneNotificationActions,
  useAnalytics,
} from "@/lib/hooks";
import { Timer, useTimersStore } from "@/lib/stores/timers";
import { minutesToMilliseconds } from "date-fns";
import { NotificationResponse } from "expo-notifications";
import { useCallback, useEffect, useState } from "react";
import { calculateSecondsLeft } from "../utils";
import { useTimerNotifications } from "./useTimerNotifications";

type useTimerType = (timer: Timer) => {
  postPone: (snooze_duration_ms?: number) => Promise<void>;
  remove: () => void;
  pause: () => void;
  resume: () => Promise<void>;
  timeLeft: number | null;
};
export const useTimer: useTimerType = (timer) => {
  const deleteTimer = useTimersStore((state) => state.deleteTimer);
  const postPoneTimer = useTimersStore((state) => state.postPoneTimer);
  const editTimer = useTimersStore((state) => state.editTimer);
  const analytics = useAnalytics();

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

  const handleNotificationResponse = (res: NotificationResponse) => {
    if (res.notification.request.identifier === timer.notification_identifier) {
      postPone(
        PostPoneNotificationActions[
          res.actionIdentifier as PostPoneNotificationAction
        ].duration_minutes,
      );
    }
  };
  const { createTimerNotification, removeTimerNotification } =
    useTimerNotifications(handleNotificationResponse);

  const postPone = useCallback(
    async (snooze_duration_ms?: number) => {
      analytics.track(AnalyticsEvents.REDO_POSTPONED);
      removeTimerNotification(timer.notification_identifier);

      let updatedAt: number = new Date().valueOf();

      if (snooze_duration_ms) {
        const timerIsOver =
          new Date().valueOf() - timer.duration_ms >= timer.updated_at;

        updatedAt =
          timerIsOver || !timer.updated_at
            ? new Date().valueOf() - timer.duration_ms
            : timer.updated_at;

        updatedAt = updatedAt + minutesToMilliseconds(snooze_duration_ms);
      }

      const identifier = await createTimerNotification(
        timer.title,
        calculateSecondsLeft({
          updated_at: updatedAt,
          duration_ms: timer.duration_ms,
        }) * 1000,
      );

      if (!identifier) {
        return;
      }

      postPoneTimer(timer.id, identifier, updatedAt);
    },
    [
      analytics,
      removeTimerNotification,
      timer.notification_identifier,
      timer.title,
      timer.duration_ms,
      timer.id,
      timer.updated_at,
      createTimerNotification,
      postPoneTimer,
    ],
  );

  const remove = useCallback(() => {
    analytics.track(AnalyticsEvents.REDO_DELETED);
    removeTimerNotification(timer.notification_identifier);
    deleteTimer(timer.id);
  }, [deleteTimer, removeTimerNotification, timer, analytics]);

  const pause = useCallback(() => {
    analytics.track(AnalyticsEvents.REDO_PAUSED);
    removeTimerNotification(timer.notification_identifier);
    editTimer({ ...timer, is_paused: true, paused_at: new Date().valueOf() });
  }, [editTimer, removeTimerNotification, timer, analytics]);

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

  return {
    postPone,
    remove,
    pause,
    resume,
    timeLeft,
  };
};
