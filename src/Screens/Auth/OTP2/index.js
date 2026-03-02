import React, { useState, useRef } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "../../../Components/Button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useNavigation } from "@react-navigation/native";
import { validateFields } from "../../../../utils/validation/validate-fields";
import { GernalStyle } from "../../../constants/GernalStyle";
import validator from "../../../../utils/validation/validator";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../assets/fonts";
import { useSchoolVerificationMutation } from "../../../rtkQuery/slices/auth";
import { showToast } from "../../../Components/Toaster";

const OTPverify2 = ({ route }) => {
  const { email } = route.params;
  const [schoolVerification, { isLoading }] = useSchoolVerificationMutation();
  const navigation = useNavigation();
  const inputRefs = {
    code: useRef(null),
  };

  const [state, setState] = useState({
    codeError: "",
  });
  const handleSchoolCode = async () => {
    const { code } = state;
    const codeError = await validator("code", code);
    if (codeError) {
      showToast("error", codeError);
      return;
    }
    try {
      const payload = {
        schoolCode: code,
        email: email,
      };
      const res = await schoolVerification(payload);
      if (res?.data) {
        showToast("success", res?.data?.message);
        navigation.navigate("Login");
      } else {
        showToast("error", res?.error?.data?.message);
      }
      console.log("Schoolverification==============", res);
    } catch (error) {
      console.log("object===========", error);
    }
  };
  const inputRef = useRef(null);
  const changeHandler = (type, value) => setState({ ...state, [type]: value });

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ height: getHeight(70) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.backArrow}>
          <AntDesign
            size={30}
            color={colors.primary}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        </View>

        <Text style={styles.txt}>
          Enter the code you received from your SCHOOL by e-mail, text message
          or on paper
        </Text>

        <OTPInputView
          ref={inputRef}
          title="code"
          keyboardAppearance="light"
          editable={true}
          style={{
            width: "90%",
            height: 90,
            marginTop: getHeight(3),
            justifyContent: "center",
            alignSelf: "center",
          }}
          pinCount={7}
          code={state.code}
          onCodeChanged={(code) => {
            setState({ code });
          }}
          autoFocusOnLoad={false}
          value={state.code}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          keyboardType={"email-address"}
          onBlur={() =>
            validateFields(state.code, "code", (error) =>
              setState({ ...state, codeError: error })
            )
          }
          onChangeText={(code) => changeHandler("code", code.trim())}
          onCodeFilled={(code) => {
            console.log(`Code is ${code}, you are good to go!`);
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginBottom: getHeight(4),
            marginTop: getHeight(0.5),
          }}
        ></View>
        <Button
          onPress={() => handleSchoolCode()}
          Loading={isLoading}
          text="Verify"
          btnStyle={{
            ...GernalStyle.btn,

            backgroundColor: colors.buttonColor,
          }}
          btnTextStyle={GernalStyle.btnText}
        />
      </KeyboardAwareScrollView>
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
    width: getWidth(65),
    textAlign: "center",
    marginTop: getHeight(7),
    fontFamily: Fonts.PoppinsBold,
    alignSelf: "center",
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
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    borderBottomWidth: 1,
    color: "black",
    borderColor: "#D8DADC",
  },

  underlineStyleHighLighted: {
    borderColor: "#50C2C9",
  },
  backArrow: { paddingHorizontal: 20, paddingTop: 10 },
});

export default OTPverify2;
