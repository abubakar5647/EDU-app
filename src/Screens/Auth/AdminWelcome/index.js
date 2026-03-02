import React, { useState, useRef } from "react";
import {
  ScrollView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
} from "react-native";
// import OtpInputs from 'react-native-otp-inputs';
import { TextInput } from "react-native-paper";
import Button from "../../../Components/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useNavigation } from "@react-navigation/native";
import { validateFields } from "../../../../utils/validation/validate-fields";
import { GernalStyle } from "../../../constants/GernalStyle";
import { useDispatch } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLoader } from "../../../Redux/actions/GernalActions";
import validator from "../../../../utils/validation/validator";
import { Forgot_Password } from "../../../Redux/actions/AuthActions";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import Header from "../../../Components/Header";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import HeaderBottom from "../../../Components/HeaderBottom";
import { colors } from "../../../constants/colors";

const AdminWelcome = ({ route }) => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
      />

      <Text style={styles.txt}>
        Thank you for your interest, we will contact you as soon as possible
      </Text>

      <Button
        onPress={() => navigation.navigate("Login")}
        text="OK"
        btnStyle={{
          ...GernalStyle.btn,
          marginTop: getHeight(50),
          backgroundColor: colors.buttonColor,
        }}
        btnTextStyle={GernalStyle.btnText}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  borderStyleBase: {
    width: 30,
    height: 45,
    backgroundColor: "red",
  },
  txt: {
    color: "#191C20",

    fontSize: 25,
    width: getWidth(80),
    textAlign: "center",
    marginTop: getHeight(18),
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
  },
  forgottext: {
    color: "#50C2C9",
    justifyContent: "flex-end",

    fontFamily: "Ubuntu-Bold",
    fontSize: 16,
    alignItems: "flex-end",
  },
  borderStyleHighLighted: {
    borderColor: "#182d4a",
  },
  stxt: {
    color: "#747988",
    marginTop: getHeight(2),
    alignSelf: "center",
    fontSize: getFontSize(1.8),
    textAlign: "center",
    lineHeight: 19,
    marginBottom: getHeight(1),
    fontFamily: "Poppins-Regular",
    width: getWidth(80),
  },
  stxtview: {
    width: getWidth(90),
    marginTop: getHeight(2.5),
    color: "#182d4a",
    alignSelf: "center",
  },
  underlineStyleBase: {
    width: 55,
    height: 55,
    borderWidth: 1,
    borderRadius: 10,
    borderBottomWidth: 1,
    color: "black",
    borderColor: "#D8DADC",
  },

  underlineStyleHighLighted: {
    borderColor: "#50C2C9",
  },
});

export default AdminWelcome;
