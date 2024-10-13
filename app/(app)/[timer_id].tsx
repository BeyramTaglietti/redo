import { useLocalSearchParams } from "expo-router";

import { TimerDetailPage } from "@/lib/pages";

export default function CreateTimerRoute() {
  const { timer_id } = useLocalSearchParams<{ timer_id: string }>();

  return <TimerDetailPage timer_id={timer_id} />;
}
