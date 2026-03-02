import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
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
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../../../Redux/actions/AuthActions";
import validator from "../../../../utils/validation/validator";
import { GernalStyle } from "../../../constants/GernalStyle";
import { setLoader } from "../../../Redux/actions/GernalActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../../constants/colors";
import { useFocusEffect, useRoute } from "@react-navigation/native";
const RefferSchool = ({ navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.gernal.follow);

  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
    cpassword: useRef(null),
  };
  const [state, setState] = useState({
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
    cpassword: "",
    cpasswordError: "",
  });
  useFocusEffect(
    React.useCallback(() => {
      setState({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
        cpassword: "",
        cpasswordError: "",
      });
    }, [])
  );
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  const Sing_upfn = async () => {
    const { email, password, cpassword } = state;
    const emailError = await validator("email", email);
    const passwordError = await validator("password", password);
    const cpasswordError = await validator("cpassword", cpassword);
    if (!emailError && !passwordError && !cpasswordError) {
      navigation.navigate("OTP", { way: "signup" });
    } else {
      dispatch(setLoader(false));
      setState({ ...state, emailError, passwordError, cpasswordError });
    }
  };
  const SingupAdmin = async () => {
    const { email } = state;
    const emailError = await validator("email", email);

    if (!emailError) {
      navigation.navigate("AdminSignup", { way: "Reffer" });
    } else {
      dispatch(setLoader(false));
      setState({ ...state, emailError });
    }
  };
  const changeHandler = (type, value) => setState({ ...state, [type]: value });
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
        translucent={true}
      />
      <KeyboardAwareScrollView
        // contentContainerStyle={{height: getHeight(40)}}

        showsVerticalScrollIndicator={false}
      >
        <View
          style={[styles.mainview, { marginTop: role != "admin" ? 50 : 0 }]}
        >
          <Text style={styles.txt}>
            Enter your e-mail adress to reffer your school
          </Text>

          <View>
            <Text style={styles.txt2}>E-mail adresssssssssss</Text>

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
            onPress={() => SingupAdmin()}
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
              marginTop: role != "admin" ? getHeight(10) : getHeight(25),
            }}
          >
            <Text style={{ fontFamily: "Poppins-Bold", fontSize: 16 }}>
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.forgottext}>Sign-In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default RefferSchool;
