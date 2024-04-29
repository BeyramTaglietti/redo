import uuid from "react-native-uuid";

export const createUUID = (): string => {
  return uuid.v4() as string;
};
