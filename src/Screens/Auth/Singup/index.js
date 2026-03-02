import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  useAdminSignUpMutation,
  useSignUpMutation,
} from "../../../rtkQuery/slices/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../../Components/Toaster";
import { err } from "react-native-svg/lib/typescript/xml";
import { Fonts } from "../../../assets/fonts";
const Signup = ({ navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.gernal.follow);
  console.log("adminrole=====================", role);
  console.log("role==========", role);

  const [SignUp, { error, isLoading }] = useSignUpMutation();
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
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setState({
  //       email: "",
  //       emailError: "",
  //       password: "",
  //       passwordError: "",
  //       cpassword: "",
  //       cpasswordError: "",
  //     });
  //   }, [])
  // );
  const [hidePass, setHidePass] = useState(true);
  const [hidePass2, setHidePass2] = useState(true);
  // const Sing_upfn = async () => {
  //   const { email, password, cpassword } = state;
  //   const emailError = await validator("email", email);
  //   const passwordError = await validator("password", password);
  //   const cpasswordError = await validator("cpassword", cpassword);
  //   if (!emailError && !passwordError && !cpasswordError) {
  //     navigation.navigate("OTP", { way: "signup" });
  //   } else {
  //     dispatch(setLoader(false));
  //     setState({ ...state, emailError, passwordError, cpasswordError });
  //   }
  // };
  // const SingupAdmin = async () => {
  //   const { email } = state;
  //   const emailError = await validator("email", email);
  //   if (!emailError) {
  //     navigation.navigate("AdminSignup", { way: "signup" });
  //   } else {
  //     dispatch(setLoader(false));
  //     setState({ ...state, emailError });
  //   }
  // };

  const AdminSignup = async () => {
    const { email, password, cpassword } = state;

    if (!email || !password || !cpassword) {
      Alert.alert("Please fill in all fields!");
      return;
    }
    const emailError = await validator("email", email);
    const passwordError = await validator("password", password);
    const confirmPasswordError =
      password !== cpassword ? "Passwords do not match." : "";

    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|devsoul\.net)$/;

    setState((prevState) => ({
      ...prevState,
      emailError,
      passwordError,
      cpasswordError: confirmPasswordError,
    }));
    if (password !== cpassword) {
      Alert.alert("Passwords do not match.");
      return;
    }
    // if (!emailRegex.test(email)) {
    //   Alert.alert("Please enter a valid Email address.");
    //   return;
    // }
    navigation.navigate("AdminSignup", {
      email: email,
      password: password,
    });
  };

  const GenericSignUp = async () => {
    const { email, password, cpassword } = state;
    try {
      const emailError = await validator("email", email);
      const passwordError = await validator("password", password);
      const cpasswordError = await validator("cpassword", cpassword);

      const isPasswordEqual = password !== cpassword;

      if (
        !emailError &&
        !passwordError &&
        !cpasswordError &&
        !isPasswordEqual
      ) {
        const res = await SignUp({
          firstName: "First",
          lastName: "Last",
          password,
          email: email.toLowerCase().trim(),
          role: role,
        });
        setState({
          email: "",
          emailError: "",
          password: "",
          passwordError: "",
          cpassword: "",
          cpasswordError: "",
        });

        if (res?.error?.status === "FETCH_ERROR") {
          showToast("error", res?.error?.error);
          return;
        }
        if (error?.data?.errors?.length >= 0) {
          showToast("error", error?.data?.errors[0]);
          return;
        }
        if (res?.error?.status === 400) {
          showToast("error", res?.error?.data?.message);
          return;
        }
        console.log(
          "dasdsadasdasd",
          res?.data?.message.includes("successfully")
        );
        console.log("!res.data.data.isVerified", res?.data?.data?.isVerified);
        if (
          res?.data?.message.includes("successfully") &&
          !res?.data?.data?.isVerified
        ) {
          navigation.navigate("OTP", {
            email: email,
            isSignUp: true,
          });
        }

        // if (role === "Teacher") {
        //   navigation.navigate("OTP", { way: "signup", email });
        //   showToast("success", res?.data?.message);
        // } else if (role === "Admin") {
        //   navigation.navigate("AdminSignup", { way: "signup", email });
        //   showToast("success", res?.data?.message);
        // }
      } else {
        console.log("password", password, "password", cpassword);
        if (password !== cpassword) {
          setState({
            ...state,
            emailError,
            passwordError: "Password not match",
            cpasswordError: "Password not match",
          });
          return;
        }
        dispatch(setLoader(false));
        setState({ ...state, emailError, passwordError, cpasswordError });
      }
    } catch (err) {
      showToast("error", error?.data?.errors[0]);
      console.log(err);
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
          <Text style={styles.txt}>Create your account</Text>
          <View>
            <Text style={styles.txt2}>E-mail adress</Text>
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
              autoCapitalize="none"
              onFocus={() => setState({ ...state, emailError: "" })}
              onBlur={() =>
                validateFields(state.email, "email", (error) =>
                  setState({ ...state, emailError: error })
                )
              }
              onSubmitEditing={() => {
                role == "Admin"
                  ? GenericSignUp()
                  : inputRefs["password"].current.focus();
              }}
              onChangeText={(email) => changeHandler("email", email.trim())}
              blurOnSubmit={false}
            />
            <Text style={GernalStyle.InputError}>{state.emailError}</Text>
          </View>
          {role != "Admin" ? (
            <View>
              <Text style={styles.txt2}>Password</Text>
              <TextInput
                mode="outlined"
                label="Password"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#D8DADC"
                cursorColor="#D8DADC"
                textColor="#747988"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#D8DADC"
                style={GernalStyle.input}
                ref={inputRefs.password}
                value={state.password}
                returnKeyType={"send"}
                secureTextEntry={hidePass ? true : false}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name={hidePass ? "eye-off-outline" : "eye-outline"}
                        size={getFontSize(2)}
                        color={"#747988"}
                        style={styles.icon}
                        onPress={() => setHidePass(!hidePass)}
                      />
                    )}
                  />
                }
                onFocus={() => setState({ ...state, passwordError: "" })}
                onBlur={() =>
                  validateFields(state.password, "password", (error) =>
                    setState({ ...state, passwordError: error })
                  )
                }
                onSubmitEditing={() => inputRefs["cpassword"].current.focus()}
                onChangeText={(password) =>
                  changeHandler("password", password.trim())
                }
                blurOnSubmit={false}
              />
              <Text style={GernalStyle.InputError}>{state.passwordError}</Text>
            </View>
          ) : null}
          {role != "Admin" ? (
            <View>
              <Text style={styles.txt2}>Confirm password</Text>
              <TextInput
                mode="outlined"
                label="Confirm password"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#D8DADC"
                cursorColor="#D8DADC"
                textColor="#747988"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#D8DADC"
                style={GernalStyle.input}
                ref={inputRefs.cpassword}
                value={state.cpassword}
                returnKeyType={"send"}
                secureTextEntry={hidePass2 ? true : false}
                right={
                  <TextInput.Icon
                    icon={() => (
                      <MaterialCommunityIcons
                        name={hidePass2 ? "eye-off-outline" : "eye-outline"}
                        size={getFontSize(2)}
                        color={"#747988"}
                        style={styles.icon}
                        onPress={() => setHidePass2(!hidePass2)}
                      />
                    )}
                  />
                }
                onFocus={() => setState({ ...state, cpasswordError: "" })}
                onBlur={() =>
                  validateFields(state.cpassword, "cpassword", (error) =>
                    setState({ ...state, cpasswordError: error })
                  )
                }
                onSubmitEditing={() => GenericSignUp()}
                onChangeText={(cpassword) =>
                  changeHandler("cpassword", cpassword.trim())
                }
                blurOnSubmit={false}
              />
              {state.cpasswordError && (
                <Text style={GernalStyle.InputError}>
                  {state.cpasswordError}
                </Text>
              )}
            </View>
          ) : null}
          <Button
            onPress={() => (role === "admin" ? AdminSignup() : GenericSignUp())}
            text="Sign Up"
            Loading={isLoading}
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
              marginTop: role != "admin" ? getHeight(10) : getHeight(20),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.PoppinsMedium,
                fontSize: 15,
                color: "gray",
              }}
            >
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
export default Signup;
