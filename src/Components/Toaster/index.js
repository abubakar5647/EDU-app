import { Platform } from "react-native";
import React from "react";
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from "react-native-toast-message";
import { colors } from "../../constants/colors";

export const toastConfig = {
  success: ({ text1Style, text2Style, ...props }) => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: colors.greenlight,
        borderLeftColor: colors.white,
        marginTop: 40,
        width: "90%",
      }}
      text1Style={{
        fontSize: 15,
        color: colors.white,
        ...text1Style,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.white,
        ...text2Style,
      }}
    />
  ),
  error: ({ text1Style, text2Style, ...props }) => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: colors.red,
        borderLeftColor: colors.red,
        marginTop: 40,
        width: "90%",
      }}
      text1Style={{
        fontSize: 15,
        color: colors.white,
        ...text1Style,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.white,
        ...text2Style,
      }}
    />
  ),
  info: ({ text1Style, text2Style, ...props }) => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: colors.graytext5,
        borderLeftColor: colors.graytext5,
        marginTop: 40,
        width: "90%",
      }}
      text1Style={{
        fontSize: 15,
        color: colors.white,
        ...text1Style,
      }}
      text2Style={{
        fontSize: 12,
        color: colors.white,
        ...text2Style,
      }}
    />
  ),
};

export const showToast = (type, heading, description) => {
  Toast.show({
    type: type,
    text1: heading,
    text2: description,
  });
};

const ToastComponent = () => {
  return null;
};

export default ToastComponent;
