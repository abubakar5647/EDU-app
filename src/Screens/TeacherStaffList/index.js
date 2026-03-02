import { View, Text, SafeAreaView, Image, ScrollView } from "react-native";
import React from "react";
import { StyleSheet } from "react-native";
import { colors } from "../../constants/colors";

import Header from "../../Components/Header";
import { Fonts } from "../../assets/fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import NewHeader from "../../Components/NewHeader/NewHeader";
import { girl } from "../../assets/images";
import TeacherCard from "./molecules/TeacherCard";
const TeacherStaffList = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <NewHeader title={"Teacher/Staff List"} onPress={()=> navigation.goBack()}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <TeacherCard
          color={colors.primary}
          title={"Yasmine Baali  - 3th grade/3"}
          isArrow
          title2={"2024/2025"}
        />

        <TeacherCard
          title={"Mustapha Najim"}
          fontFamily={Fonts.PoppinsRegular}
          title2={"Mathematics"}
        />
        <TeacherCard
          title={"Samira Boujad"}
          fontFamily={Fonts.PoppinsRegular}
          title2={"Physics"}
        />
        <TeacherCard
          title={"Loubna Jaouadi"}
          fontFamily={Fonts.PoppinsRegular}
          title2={"French"}
        />
         <TeacherCard
          title={"Amine Sennoufi"}
          fontFamily={Fonts.PoppinsRegular}
          title2={"English"}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
});

export default TeacherStaffList;
