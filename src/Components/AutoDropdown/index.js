import React from "react";
import { View, Image, Text } from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import Icons from "react-native-vector-icons/Entypo";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";

const GenericDropdown = ({
  data = [],
  defaultValue = "Select",
  onSelect,
  defaultButtonText = "Select Option",
  buttonStyle,
  buttonTextStyle,
  dropdownStyle,
  rowStyle,
  rowTextStyle,
  renderCustomizedRowChild,
  renderCustomizedButtonChild,
}) => {
  return (
    <SelectDropdown
      defaultValue={defaultValue}
      data={data}
      onSelect={onSelect}
      defaultButtonText={defaultButtonText}
      buttonStyle={{
        borderWidth: 0.5,
        height: 40,
        borderRadius: 2,
        borderColor: "#0000001A",
        ...buttonStyle,
      }}
      buttonTextStyle={{
        color: colors.darkBlue,
        fontSize: 14,
        fontFamily: Fonts.PoppinsMedium,
        ...buttonTextStyle,
      }}
      renderDropdownIcon={(isOpened) => (
        <Icons
          family="Entypo"
          name={isOpened ? "chevron-small-up" : "chevron-small-down"}
          size={25}
          color={colors.lightGray}
        />
      )}
      dropdownIconPosition="right"
      showsVerticalScrollIndicator={false}
      dropdownStyle={dropdownStyle}
      rowStyle={rowStyle}
      rowTextStyle={rowTextStyle}
      renderCustomizedRowChild={renderCustomizedRowChild}
      renderCustomizedButtonChild={renderCustomizedButtonChild}
    />
  );
};

export default GenericDropdown;
