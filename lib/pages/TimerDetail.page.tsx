import { Fragment } from "react";
import { View } from "react-native";
import { TimerForm } from "../features/timers";

export const TimerDetailPage = ({ timer_id }: { timer_id?: string }) => {
  return (
    <Fragment>
      <View className="p-4" style={{ gap: 16 }}>
        <TimerForm timerId={timer_id} />
      </View>
    </Fragment>
  );
};
