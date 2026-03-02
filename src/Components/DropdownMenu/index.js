import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

const DropdownMenu = ({ isVisible, children }) => {
  if (!isVisible) return null;

  return <View style={styles.dropdown}>{children}</View>;
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: colors.primary,
    height: 64,
    width: 108,
    position: "absolute",
    right: 20,
    top: 90,
    borderRadius: 5,
    zIndex: 2,
  },
});

export default DropdownMenu;
