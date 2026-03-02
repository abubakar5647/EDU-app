import React, { useState, useRef, useEffect } from "react";
import { Text, View, TouchableOpacity, Alert, Platform } from "react-native";
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
import { setFollow, setLoader } from "../../../Redux/actions/GernalActions";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { colors } from "../../../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
import { Fonts } from "../../../assets/fonts";
import { useLoginMutation } from "../../../rtkQuery/slices/auth";
import { showToast } from "../../../Components/Toaster";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  setFcmToken,
  setUserData,
} from "../../../rtkQuery/slices/user/user.slice";
import { useMeQuery } from "../../../rtkQuery/slices/home";
import notifee, {
  AndroidImportance,
  AndroidStyle,
  EventType,
} from "@notifee/react-native";
import messaging from "@react-native-firebase/messaging";
import { PermissionsAndroid } from "react-native";
const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.gernal.follow);
  const userData = useSelector((state) => state.user.userData);
  const { data, refetch } = useMeQuery();
  const [login, { isLoading }] = useLoginMutation();
  const inputRefs = {
    email: useRef(null),
    password: useRef(null),
  };
  const [state, setState] = useState({
    email: "",
    emailError: "",
    password: "",
    passwordError: "",
  });
  useFocusEffect(
    React.useCallback(() => {
      setState({
        email: "",
        emailError: "",
        password: "",
        passwordError: "",
      });
    }, [])
  );
  const [hidePass, setHidePass] = useState(true);

  const checkApplicationPermission = async () => {
    const settings = await notifee.requestPermission();
    if (settings.authorizationStatus) {
      console.log("User has notification permissions enabled");
    } else {
      console.log("User has notification permissions disabled");
    }
  };

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    console.log("Background event received:", type, detail);

    if (type === EventType.BLOCKED) {
      alert("Notification was blocked by system or user settings.");
      // Optionally, inform the user or log this for analysis
    } else if (
      type === EventType.ACTION_PRESS &&
      detail.pressAction.id === "default"
    ) {
      alert("Notification clicked in the background.");
      // Handle the notification click action here
    }
  });

  const getFcmToken = async () => {
    const fcmToken = await AsyncStorage.getItem("fcmToken");
    dispatch(setFcmToken(fcmToken));
    if (!fcmToken) {
      try {
        const newToken = await messaging().getToken();
        console.log("newToken=========......", newToken);
        if (newToken) {
          await AsyncStorage.setItem("fcmToken", newToken);
        }
      } catch (error) {
        console.error("Error getting FCM token:", error);
      }
    }
  };
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log("Authorization status:", authStatus);
      getFcmToken();
    }
  };

  const onMessageReceived = async (message) => {
    console.log("message========>>>>>>", message);
    const channelId = await notifee.createChannel({
      id: "order",
      name: "Important Notifications",
      importance: AndroidImportance.HIGH,
      badge: true,
    });
    const notificationText = message.notification?.body || message.body;
    const notificationTitle = message.notification?.title || message.title;
    notifee.displayNotification({
      title: notificationTitle,
      body: notificationText,
      ios: {
        foregroundPresentationOptions: {
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },

      android: {
        channelId: channelId,
        // smallIcon: "ic_stat_name",
        // Set color of icon (Optional, defaults to white)
        color: colors?.primary,
        importance: AndroidImportance.HIGH,
      },
    });
  };

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS === "ios") {
      checkApplicationPermission();
    }
    requestUserPermission();
  }, []);

  const handleLogin = async () => {
    const { email, password } = state;
    try {
      const emailError = await validator("email", email);
      const passwordError = await validator("password", password);
      const fcmToken = await AsyncStorage.getItem("fcmToken");
      if (!emailError && !passwordError) {
        await validator({ email, password });
        const res = await login({
          password,
          email: email.toLowerCase().trim(),
          fcmToken: fcmToken,
        });
        console.log("res========>>>", res);
        if (res?.data?.status === 200) {
          await AsyncStorage.setItem("isAuth", res?.data?.data?.token);
          await AsyncStorage.setItem(
            "isAuthRefresh",
            res?.data?.data?.refresh_token
          );
          refetch();
          dispatch(setUserData(res?.data?.data?.user));
          refetch();
          dispatch(
            setFollow(
              userData?.role === "parent"
                ? "Family"
                : userData?.role === "teacher"
                ? "Teacher"
                : "Admin"
            )
          );
          refetch();
        } else if (res?.data?.status === 209) {
          navigation.navigate("OTP", { email });
          showToast("error", "Please Enter OTP ");
        } else if (
          res?.error?.data?.message ===
          "Please add school code to access the resources"
        ) {
          navigation.navigate("OTPverify2", { email });
          showToast("error", "Please Enter School Code");
        } else {
          showToast("error", res?.error?.data?.message);
        }
      } else {
        dispatch(setLoader(false));
        setState({ ...state, emailError, passwordError });
      }
    } catch (err) {
      // showToast("error", error?.data?.errors);
      console.log("error========", err);
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
        <View style={styles.mainview}>
          <Text style={styles.txt}>Login</Text>

          <View>
            <Text style={styles.txt2}>E-mail adress</Text>

            <TextInput
              mode="outlined"
              label="Email"
              placeholder="Email"
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
              placeholderTextColor={"#969696"}
              keyboardType="email-address"
              onFocus={() => setState({ ...state, emailError: "" })}
              onBlur={() =>
                validateFields(state.email, "email", (error) =>
                  setState({ ...state, emailError: error })
                )
              }
              onSubmitEditing={() => inputRefs["password"].current.focus()}
              onChangeText={(email) => changeHandler("email", email.trim())}
              blurOnSubmit={false}
              autoCapitalize="none"
            />
            <Text style={GernalStyle.InputError}>{state.emailError}</Text>
          </View>
          <View>
            <Text style={styles.txt2}>Password</Text>

            <TextInput
              mode="outlined"
              label="Password"
              placeholder="********"
              theme={{ roundness: getFontSize(1) }}
              placeholderTextColor={"#969696"}
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
              onSubmitEditing={() => login()}
              onChangeText={(password) =>
                changeHandler("password", password.trim())
              }
              blurOnSubmit={false}
              autoCapitalize="none"
            />
            {state.passwordError && (
              <Text style={GernalStyle.InputError}>{state.passwordError}</Text>
            )}
          </View>

          <View style={styles.forgotView}>
            <TouchableOpacity
              onPress={() => navigation.navigate("ForgotPassword")}
            >
              <Text style={styles.forgottext}>Forgot your password?</Text>
            </TouchableOpacity>
          </View>

          <Button
            onPress={() => handleLogin()}
            text="Sign In"
            Loading={isLoading}
            btnStyle={{
              ...GernalStyle.btn,
              marginTop: getHeight(4),
              backgroundColor: colors.buttonColor,
            }}
            btnTextStyle={GernalStyle.btnText}
          />
          <View
            style={{
              flexDirection: "row",
              alignSelf: "center",
              marginTop: getHeight(4),
            }}
          >
            <Text
              style={{
                fontFamily: Fonts.PoppinsMedium,
                fontSize: 15,
                color: "gray",
              }}
            >
              Don’t have an account?{" "}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("WelcomeScreen")}
            >
              <Text style={styles.forgottext}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <Button
            onPress={() => navigation.navigate("InviteScreen")}
            text="Invite or reffer"
            btnStyle={{
              ...GernalStyle.btn,
              marginTop: getHeight(5),
              borderColor: colors.buttonColor,
              borderWidth: 1,
              backgroundColor: colors.buttonColor2,
            }}
            btnTextStyle={{ ...GernalStyle.btnText, color: colors.buttonColor }}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Login;
