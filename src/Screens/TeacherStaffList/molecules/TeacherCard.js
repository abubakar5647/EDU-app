import { View, Text, Image, StyleSheet } from "react-native";
import React from "react";
import { girl, chevronDown } from "../../../assets/images";
import { Fonts } from "../../../assets/fonts";
import { colors } from "../../../constants/colors";

const TeacherCard = ({ color, title, title2, isArrow,fontFamily }) => {
  return (
    <View style={styles.teacherProfileCard}>
      <View style={styles.imgCard}>
        <Image source={girl} style={styles.img} />
        <Text style={[styles.title, { color: color ? color : colors.black }]}>
          {title}
        </Text>
        <View style={styles.row}>
          <Text
            style={[
              styles.title,
              { fontFamily: fontFamily ? fontFamily : Fonts.PoppinsMedium },
            ]}
          >
            {title2}
          </Text>
          {isArrow && <Image source={chevronDown} style={styles.icon} />}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  teacherProfileCard: {
    marginTop: 40,
  },
  imgCard: {
    alignSelf: "center",
  },
  img: {
    height: 60,
    width: 60,
    resizeMode: "contain",
    alignSelf: "center",
  },
  title: {
    fontSize: 14,
    color: "#47424F",
    alignSelf: "center",
    fontFamily: Fonts.PoppinsMedium,
    marginTop: 5,
  },
  icon: {
    width: 12,
    height: 6,
    marginLeft: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default TeacherCard;
