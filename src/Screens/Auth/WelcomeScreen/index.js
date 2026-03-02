import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Platform } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Button from "../../../Components/Button";
import { validateFields } from "../../../../utils/validation/validate-fields";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { styles } from "./style";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../../Redux/actions/AuthActions";
import validator from "../../../../utils/validation/validator";
import { GernalStyle } from "../../../constants/GernalStyle";
import { setFollow, setLoader } from "../../../Redux/actions/GernalActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../../constants/colors";

const WelcomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
        translucent={true}
      />
      <Text style={styles.txt}>YOU ARE</Text>
      <Button
        onPress={() => {
          dispatch(setFollow("parent"));
          navigation.navigate("Signup");
        }}
        text="FAMILY"
        btnStyle={{
          ...GernalStyle.btn,
          marginTop: getHeight(5),
          borderColor: colors.buttonColor,
          borderWidth: 1,
          backgroundColor: colors.buttonColor2,
        }}
        btnTextStyle={{
          ...GernalStyle.btnText,
          color: "#000000",
          fontSize: 18,
        }}
      />
      <Button
        onPress={() => {
          dispatch(setFollow("teacher"));
          navigation.navigate("Signup");
        }}
        text="TEACHER OR STAFF"
        btnStyle={{
          ...GernalStyle.btn,
          marginTop: getHeight(5),
          borderColor: colors.buttonColor,
          borderWidth: 1,
          backgroundColor: colors.buttonColor2,
        }}
        btnTextStyle={{
          ...GernalStyle.btnText,
          color: "#000000",
          fontSize: 18,
        }}
      />
      <Button
        onPress={() => {
          dispatch(setFollow("admin"));
          navigation.navigate("Signup");
        }}
        text="ADMINISTRATOR"
        btnStyle={{
          ...GernalStyle.btn,
          marginTop: getHeight(5),

          backgroundColor: colors.buttonColor,
        }}
        btnTextStyle={{
          ...GernalStyle.btnText,
          color: "#000000",
          fontSize: 18,
        }}
      />
      <View style={styles.forgotView}>
        <Text style={{ fontFamily: "Poppins-Bold", fontSize: 16 }}>
          Already have an account?
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.forgottext}> Sign- In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default WelcomeScreen;
