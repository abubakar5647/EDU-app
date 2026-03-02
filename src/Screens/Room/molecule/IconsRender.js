import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import Icons from "../../../Components/Icons";
import { colors } from "../../../constants/colors";

const IconsRender = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <Icons
            family={"FontAwesome6"}
            name={"list"}
            size={25}
            color={colors.primary}
          />
        </View>
        <View style={[styles.icon, { backgroundColor: colors.primary }]}>
          <Icons
            family={"Ionicons"}
            name={"grid"}
            size={22}
            color={colors.white}
          />
        </View>
      </View>
      <View style={[styles.iconContainer, { gap: 10 }]}>
        <TouchableOpacity style={styles.arrow}>
          <Icons
            family={"Octicons"}
            name={"arrow-left"}
            size={18}
            color={colors.gray3}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.arrow}>
          <Icons
            family={"Octicons"}
            name={"arrow-right"}
            size={18}
            color={colors.gray3}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default IconsRender;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconContainer: {
    flexDirection: "row",
  },
  icon: {
    backgroundColor: colors.white,
    elevation: 1,
    borderRadius: 5,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
  },
  arrow: {
    borderWidth: 0.5,
    borderColor: colors.primary,
    borderRadius: 40,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
    width: 30,
  },
});
