export enum NotificationCategory {
  POSTPONE = "postpone",
}

export enum PostPoneNotificationAction {
  POSTPONE_10 = "POSTPONE_10",
  POSTPONE_30 = "POSTPONE_30",
  POSTPONE_60 = "POSTPONE_60",
}

export const PostPoneNotificationActions: Record<
  PostPoneNotificationAction,
  { duration_minutes: number }
> = {
  [PostPoneNotificationAction.POSTPONE_10]: {
    duration_minutes: 10,
  },
  [PostPoneNotificationAction.POSTPONE_30]: {
    duration_minutes: 30,
  },
  [PostPoneNotificationAction.POSTPONE_60]: {
    duration_minutes: 60,
  },
};
