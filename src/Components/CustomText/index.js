import React from "react";
import { Text, TouchableOpacity, StyleProp, TextStyle } from "react-native";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";

const CustomText = ({
  textStyle,
  fontSize,
  marginTop,
  marginBottom,
  marginRight,
  marginLeft,
  alignSelf,
  fontFamily,
  fontStyle,
  textTransform,
  textAlign,
  label,
  color,
  fontWeight,
  bottom,
  width,
  borderColor,
  borderBottomWidth,
  onPress,
  marginVertical,
  paddingBottom,
  opacity,
  borderRightWidth,
  paddingRight,
  numberOfLines,
  paddingLeft,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={!onPress}>
      <Text
        numberOfLines={numberOfLines}
        style={[
          {
            fontSize: fontSize || 12,
            color: color || colors.blackTextColor,
            marginTop: marginTop || 0,
            marginBottom: marginBottom || 0,
            marginLeft: marginLeft || 0,
            marginRight: marginRight || 0,
            alignSelf: alignSelf || "flex-start",
            fontFamily: fontFamily || Fonts.PoppinsRegular,
            fontStyle: fontStyle,
            textAlign: textAlign,
            textTransform: textTransform,
            fontWeight: fontWeight,
            bottom: bottom,
            borderBottomWidth: borderBottomWidth,
            borderColor: borderColor,
            width: width,
            marginVertical: marginVertical,
            paddingBottom: paddingBottom,
            opacity: opacity,
            borderRightWidth: borderRightWidth,
            paddingRight: paddingRight,
            paddingLeft: paddingLeft,
          },
          textStyle,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomText;
