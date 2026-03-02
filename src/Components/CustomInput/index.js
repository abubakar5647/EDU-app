import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { colors } from "../../constants/colors";
import Icons from "../Icons";
import { Fonts } from "../../assets/fonts";
import CustomText from "../CustomText";

const CustomInput = ({
  placeholder,
  onChangeText,
  value,
  IconName,
  marginVertical,
  keyboardType,
  withLabel,
  labelStyle,
  width,
  borderRadius,
  textAlign,
  textAlignVertical,
  height,
  paddingHorizontal,
  searchIcon,
  borderColor,
  marginBottom,
  alignSelf,
  borderWidth,
  backgroundColor,
  isLeftIcon,
  isRightIcon,
  marginTop,
  multiline,
  placeholderTextColor,
  fontSize,
  borderBottomWidth,
  paddingTop,
  fontWeight,
  inputColor,
  leftIconSource,
  inputWidth,
  readOnly,
  family,
  onPress,
  secureTextEntry,
  shadowProps,
  right,
  textInputMarginLeft,
  errorMessage,
  IconFamily,
  size,
  onBlur,
  borderBottomLeftRadius,
  borderTopLeftRadius,
  elevation,
  rightError,
}) => {
  return (
    <View
      style={{
        width: inputWidth || "100%",
        marginBottom: marginBottom || 10,
        alignSelf: alignSelf || "flex-start",
        marginTop: marginTop,
        paddingTop: paddingTop,
      }}
    >
      {withLabel && (
        <CustomText
          textStyle={labelStyle}
          fontSize={14}
          color={colors.black}
          label={withLabel}
          fontFamily={Fonts.PoppinsMedium}
        />
      )}
      <View
        style={{
          flexDirection: "row",
          backgroundColor: backgroundColor || "white",
          borderRadius: borderRadius || 10,
          borderBottomLeftRadius: borderBottomLeftRadius,
          borderTopLeftRadius: borderTopLeftRadius,
          height: height || 55,
          width: inputWidth,
          borderWidth: borderWidth || 0.5,
          alignSelf: "center",
          paddingHorizontal: 10,
          alignItems: "center",
          borderBottomWidth: borderBottomWidth,
          borderColor: borderColor || colors.lightGray,
          marginVertical: marginVertical || 8,
          shadowColor: shadowProps?.shadowColor || "#000",
          shadowOffset: shadowProps?.shadowOffset || { width: 0, height: 1 },
          shadowOpacity: shadowProps?.shadowOpacity || 0.3,
          shadowRadius: shadowProps?.shadowRadius || 2.5,
          elevation: elevation || 0,
        }}
      >
        {isRightIcon && (
          <TouchableOpacity
            onPress={onPress}
            style={{ marginLeft: normalizeSize(15) }}
          >
            <Icons
              name={IconName}
              family={IconFamily}
              color={colors.black}
              size={size || 30}
            />
          </TouchableOpacity>
        )}
        <TextInput
          style={{
            width: searchIcon || isLeftIcon ? "92%" : "100%",
            height: "100%",
            color: inputColor || "black",
            paddingHorizontal: 10,
            fontSize: fontSize || 14,
            fontWeight: fontWeight || "normal",
            right: right,
          }}
          secureTextEntry={secureTextEntry}
          placeholder={placeholder}
          onChangeText={onChangeText}
          keyboardType={keyboardType}
          textAlignVertical={textAlignVertical}
          placeholderTextColor={placeholderTextColor || colors.lightGray}
          value={value}
          multiline={multiline}
          textAlign={textAlign}
          editable={!readOnly}
          onBlur={onBlur}
        />
        {isLeftIcon && (
          <TouchableOpacity
            onPress={onPress}
            style={{ justifyContent: "center" }}
          >
            <Icons
              name={IconName}
              family={IconFamily}
              color={colors.lightGray}
              size={size || 20}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={{ right: rightError }}>
        {errorMessage && (
          <CustomText
            label={errorMessage}
            marginLeft={5}
            fontSize={10}
            color="red"
          />
        )}
      </View>
    </View>
  );
};

export default CustomInput;
