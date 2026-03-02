import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomText from "../../../Components/CustomText";
import { Fonts } from "../../../assets/fonts";
import { colors } from "../../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";

const TableRow = ({ gradeBook, label, title, obs }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "transparent",
        borderBottomWidth: 1,
        borderBottomColor: colors?.borderlightColor,
        height: 48,
      }}
    >
      <View
        style={{
          width: "29%",
          height: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
          paddingLeft: 10,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderLeftColor: colors?.borderlightColor,
          borderRightColor: colors?.borderlightColor,
        }}
      >
        <CustomText
          label={label || "schooling certificate"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.blackTextColor}
        />
      </View>

      <View
        style={{
          width: "29%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          borderRightColor: colors?.borderlightColor,
          borderRightWidth: 1,
        }}
      >
        <CustomText
          label={title || "Amina kalim"}
          fontSize={14}
          fontFamily={Fonts?.PoppinsMedium}
          color={colors?.blackTextColor}
        />
      </View>
      {gradeBook ? (
        <View
          style={{
            width: "42%",
            height: "100%",
            borderRightColor: colors?.borderlightColor,
            borderRightWidth: 1,

            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CustomText
            label={obs || "Amina kalim"}
            fontSize={14}
            fontFamily={Fonts?.PoppinsMedium}
            color={colors?.blackTextColor}
          />
        </View>
      ) : (
        <View
          style={{
            width: "42%",
            height: "100%",
            borderRightColor: colors?.borderlightColor,
            borderRightWidth: 1,
            flexDirection: "row",
            alignContent: "center",
          }}
        >
          <View
            style={{
              borderRightColor: colors?.borderlightColor,
              borderRightWidth: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              width: "25%",
            }}
          >
            <AntDesign
              size={20}
              color={colors?.blackTextColor}
              name="download"
            />
          </View>
          <View
            style={{
              borderRightColor: colors?.borderlightColor,
              borderRightWidth: 1,
              height: "100%",
              alignItems: "center",
              justifyContent: "center",

              width: "25%",
            }}
          >
            <AntDesign size={20} color={colors?.blackTextColor} name="eye" />
          </View>
        </View>
      )}
    </View>
  );
};

export default TableRow;

const styles = StyleSheet.create({});
