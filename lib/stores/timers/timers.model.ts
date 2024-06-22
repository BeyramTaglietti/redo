export type Timer = {
  id: string;
  title: string;
  duration_ms: number;
  created_at: number;
  updated_at: number;
  notification_identifier: string;
  is_paused: boolean;
  paused_at: number | null;
};
