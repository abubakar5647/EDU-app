import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import Button from "../../../Components/Button";
import { styles } from "./style";
import { useNavigation } from "@react-navigation/native";
import { validateFields } from "../../../../utils/validation/validate-fields";
import { GernalStyle } from "../../../constants/GernalStyle";
import { useDispatch } from "react-redux";
import { setLoader } from "../../../Redux/actions/GernalActions";
import validator from "../../../../utils/validation/validator";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Fonts } from "../../../assets/fonts";
import { showToast } from "../../../Components/Toaster";
import { useForgotPasswordMutation } from "../../../rtkQuery/slices/auth";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const inputRefs = {
    email: useRef(null),
  };

  const [state, setState] = useState({
    emailError: "",
  });

  const handleForgot = async () => {
    const { email } = state;
    const emailError = await validator("email", email);
    if (!emailError) {
      dispatch(setLoader(true));
      const params = {
        email: email,
      };
      try {
        const res = await forgotPassword({
          email,
        });
        if (res?.data) {
          console.log("ForgotPassword======", res);
          navigation.navigate("OTP", { email });
          showToast("success", res?.data?.message);
        } else {
          showToast("error", res?.error?.data?.message);
          console.log("api======", res?.error?.error);
        }
      } catch (err) {
        console.log("error=======", err);
      }
    } else {
      dispatch(setLoader(false));
      setState({
        ...state,
        emailError,
      });
    }
  };
  const changeHandler = (type, value) => setState({ ...state, [type]: value });

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
      />

      <KeyboardAwareScrollView
        // contentContainerStyle={{height: getHeight(40)}}

        showsVerticalScrollIndicator={false}
      >
        <Text
          style={{
            color: "#191C20",

            fontSize: 26,
            marginBottom: getHeight(0.5),
            marginTop: getHeight(6),
            alignSelf: "center",
            fontFamily: "Poppins-Bold",
          }}
        >
          Restore your password
        </Text>
        <Text style={styles.stxt}>
          Enter your e-mail address to restore your password
        </Text>

        <View
          style={{
            marginTop: getHeight(5),
            width: getWidth(90),
            alignSelf: "center",
          }}
        >
          <Text style={styles.txt2}>E-mail address</Text>

          <TextInput
            mode="outlined"
            label="Email address"
            //theme={{ roundness: 10 }}
            theme={{ roundness: getFontSize(1) }}
            outlineColor="#D8DADC"
            cursorColor="#D8DADC"
            textColor="#747988"
            activeUnderlineColor="#D8DADC"
            activeOutlineColor="#D8DADC"
            style={GernalStyle.input}
            ref={inputRefs.email}
            value={state.email}
            returnKeyType={"next"}
            keyboardType="email-address"
            onFocus={() => setState({ ...state, emailError: "" })}
            onBlur={() =>
              validateFields(state.email, "email", (error) =>
                setState({ ...state, emailError: error })
              )
            }
            onSubmitEditing={() => {
              role == "Admin"
                ? SingupAdmin()
                : inputRefs["password"].current.focus();
            }}
            onChangeText={(email) => changeHandler("email", email.trim())}
            blurOnSubmit={false}
          />
          <Text style={GernalStyle.InputError}>{state.emailError}</Text>
        </View>

        <Button
          onPress={handleForgot}
          Loading={isLoading}
          text="Next"
          btnStyle={{
            ...GernalStyle.btn,
            marginTop: getHeight(5.5),
            backgroundColor: colors.buttonColor,
          }}
          btnTextStyle={GernalStyle.btnText}
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
            marginTop: getHeight(4),
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: Fonts.PoppinsMedium, fontSize: 16 }}>
            Don’t have an account?{" "}
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("WelcomeScreen")}
          >
            <Text style={styles.forgottext}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ForgotPassword;
