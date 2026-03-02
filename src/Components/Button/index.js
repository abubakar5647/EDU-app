import React from "react";
import { Text, TouchableOpacity, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { colors } from "../../constants/colors";

const Button = ({
  text,
  leftIcon,
  RightIcon,
  btnTextStyle,
  btnStyle,
  onPress,
  Loading,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={btnStyle}
      onPress={() => (onPress ? onPress() : console.log("null"))}
      disabled={Loading}
    >
      {leftIcon}
      {Loading ? (
        <ActivityIndicator size="small" color={colors.white} /> // Show loader if loading
      ) : (
        <Text style={[btnTextStyle]}>{text}</Text>
      )}
      {RightIcon}
    </TouchableOpacity>
  );
};
export default Button;
