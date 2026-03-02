import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "../../../Components/CustomText";
import { Fonts } from "../../../assets/fonts";
import { colors } from "../../../constants/colors";

const TableHeader = ({ th1, th2, th3, th4 }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        height: 40,

        backgroundColor: colors?.primary,
      }}
    >
      <View
        style={{
          width: "29%",
          height: "100%",

          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 10,
        }}
      >
        <CustomText
          label={th1 || "Documents"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.white}
        />
      </View>

      <View
        style={{
          width: th2 ? "35%" : "25%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CustomText
          label={th2 || "Recipients"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.white}
        />
      </View>
      <View
        style={{
          width: th3 ? "35%" : "23%",
          height: "100%",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 10,
        }}
      >
        <CustomText
          label={th3 || "Actions"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.white}
        />
      </View>
      <View
        style={{
          width: "26%",
          height: "100%",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingRight: 20,
        }}
      >
        <CustomText
          label={th4 !== undefined || "Category"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.white}
        />
      </View>
    </View>
  );
};

export default TableHeader;

const styles = StyleSheet.create({});
