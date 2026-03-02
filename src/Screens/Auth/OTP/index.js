import React, { useState, useRef, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Alert,
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
import { useDispatch, useSelector } from "react-redux";
import { ApiCall } from "../../../Services/Apis";
import { SafeAreaView } from "react-native-safe-area-context";
import { setLoader } from "../../../Redux/actions/GernalActions";
import validator from "../../../../utils/validation/validator";
import {
  useResendOtpMutation,
  useVerifyOtpMutation,
} from "../../../rtkQuery/slices/auth";
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
import { Fonts } from "../../../assets/fonts";
import { showToast } from "../../../Components/Toaster";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAddChildWithCodeMutation } from "../../../rtkQuery/slices/home";
import Icons from "../../../Components/Icons";

const OTPverify = ({ route }) => {
  const { email, isSignUp } = route.params || {};
  const role = useSelector((state) => state.gernal.follow);
  console.log("myrole================", role);
  console.log("email=======", email);

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inputRefs = {
    code: useRef(null),
  };

  const [state, setState] = useState({
    code: "",
    codeError: "",
  });

  const [OtpVerify, { error }] = useVerifyOtpMutation();
  const [OtpResend, { isError }] = useResendOtpMutation();
  const [addChildWithCode, { isLoading }] = useAddChildWithCodeMutation();

  // const verify = async () => {
  //   const { code } = state;
  //   const codeError = await validator("code", code);

  //   if (!codeError) {
  //     // const params = {
  //     //   email: email,
  //     //   OTP: code,
  //     // };
  //     navigation.navigate("OTP2");
  //   } else {
  //     dispatch(setLoader(false));
  //     setState({
  //       ...state,
  //       codeError,
  //     });
  //     alert(
  //       res?.response?.message ? res?.response?.message : res?.response?.error
  //     );
  //   }
  // };

  //  const verify= async()=>{
  //   const { code } = state;
  //   const res = await OtpVerify({
  //     email,
  //     code
  //   })

  //  }
  const inputRef = useRef(null);

  const verify = async () => {
    const { code } = state;
    try {
      const res = await OtpVerify({
        email,
        otp: code,
      });
      console.log("res2222======", res);
      if (res?.data?.message) {
        if (role === "admin") {
          navigation.navigate("Login");
        } else {
          // navigation.navigate("ResetPassword", { email });
          if (isSignUp || res?.data?.data?.user?.isVerified) {
            navigation.navigate("OTPverify2", { email });
          } else {
            navigation.navigate("ResetPassword", { email });
          }
        }
        showToast("success", res?.data?.message);
        setState((prevState) => ({
          ...prevState,
          code: "",
        }));
      } else {
        showToast("error", res?.error?.data?.message);
      }
    } catch (err) {
      console.log("success", err);
    }
  };
  const resendOtp = async () => {
    const { code } = state;

    console.log("code====>>>", code);

    try {
      const res = await OtpResend({
        email,
      });
      showToast("success", res?.data?.message);
      setState((prevState) => ({
        ...prevState,
        code: "",
      }));
    } catch (err) {
      console.log("success", err);
    }
  };

  const handleChildByOtpCode = async () => {
    const { code } = state;

    try {
      const res = await addChildWithCode({ childCode: code });
      console.log("childCode==============", res);

      if (res?.data) {
        showToast("success", res?.data?.message);
        navigation.navigate("FamilyHome");
        setState((prevState) => ({
          ...prevState,
          code: "",
        }));
      } else if (res?.error?.status === 400) {
        showToast("error", res?.error?.data?.message);
        return;
      } else {
        showToast("error", res?.error?.data?.message);
        return;
      }
    } catch (error) {
      console.log("Error adding child by OTP code:", error);
    }
  };

  const otpInput = useRef(null);
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
        <TouchableOpacity
          activeOpacity={0.6}
          style={{ marginTop: 20, marginLeft: 20 }}
        >
          <Icons
            family={"AntDesign"}
            size={30}
            color={colors.black}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        </TouchableOpacity>
        <Text style={styles.txt}>Enter the verification code</Text>
        <Text style={styles.stxt}>
          We have sent a verification code to your e-mail address. Please enter
          the code below
        </Text>

        <OTPInputView
          ref={inputRef}
          title="code"
          keyboardAppearance="default"
          editable={true}
          style={{
            width: "90%",
            height: 90,
            justifyContent: "center",
            alignSelf: "center",
          }}
          pinCount={6}
          code={state.code}
          onCodeChanged={(code) => {
            setState({ code });
          }}
          autoFocusOnLoad={false}
          value={state.code}
          codeInputFieldStyle={styles.underlineStyleBase}
          codeInputHighlightStyle={styles.underlineStyleHighLighted}
          keyboardType={role === "Family" ? "email-address" : "phone-pad"}
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
        >
          <Text style={{ fontFamily: Fonts.PoppinsMedium, fontSize: 14 }}>
            Didn’t receive the code?
          </Text>
          <TouchableOpacity onPress={resendOtp}>
            <Text style={styles.forgottext}> Resend the code</Text>
          </TouchableOpacity>
        </View>

        <Button
          onPress={role === "Family" ? handleChildByOtpCode : verify}
          Loading={isLoading}
          text="Next"
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

    fontSize: 20,

    marginTop: getHeight(8),
    alignSelf: "center",
    fontFamily: "Poppins-Bold",
  },
  forgottext: {
    color: "#50C2C9",
    justifyContent: "flex-end",

    alignItems: "flex-end",
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 14,
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
    width: 49,
    height: 49,
    borderWidth: 1,
    borderRadius: 4,
    borderBottomWidth: 1,
    color: "black",
    borderColor: "#D8DADC",
  },

  underlineStyleHighLighted: {
    borderColor: "#50C2C9",
  },
});

export default OTPverify;
