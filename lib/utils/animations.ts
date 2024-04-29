import { LayoutAnimation } from "react-native";

const layoutAnimConfig = {
  duration: 200,
  update: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

export const animateOut = () => LayoutAnimation.configureNext(layoutAnimConfig);
