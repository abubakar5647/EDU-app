import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import CustomInput from "../../../Components/CustomInput";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { Fonts } from "../../../assets/fonts";
import { colors } from "../../../constants/colors";
import CustomText from "../../../Components/CustomText";
import { normalizeSize } from "../../../../utils";
import Button from "../../../Components/Button";
import { GernalStyle } from "../../../constants/GernalStyle";
import { useResetPasswordMutation } from "../../../rtkQuery/slices/auth";
import { showToast } from "../../../Components/Toaster";
import { useNavigation } from "@react-navigation/native";

const ResetPassword = ({ route }) => {
  const { email } = route.params;
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [toggle, setToggle] = useState(false);
  const [verifyPassword, setVerifyPassword] = useState("");
  const [error, setError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigation = useNavigation();
  const handleIconPress = () => {
    setShowPassword(!showPassword);
  };
  const validateInputs = () => {
    setError("");
    setVerifyError("");

    if (password.trim() === "") {
      setError("Password cannot be empty.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== verifyPassword) {
      setVerifyError("Passwords do not match.");
      return false;
    }
    return true;
  };
  const handleResetPassword = async () => {
    if (!validateInputs()) return;
    try {
      const payload = {
        email: email,
        password: password,
      };
      const res = await resetPassword(payload);
      if (res?.data) {
        showToast("success", res?.data?.message);
        navigation.navigate("Login");
      } else {
        showToast("error", res?.error?.data?.message);
      }
      console.log("resetpasword========", res);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
      />
      <CustomText
        label={" Reset your password"}
        alignSelf={"center"}
        fontSize={26}
        fontFamily={Fonts.PoppinsBold}
        marginTop={normalizeSize(30)}
      />
      <CustomText
        label={"  Enter a strong new password to secure your account."}
        alignSelf={"center"}
        fontSize={15}
        width={"80%"}
        textAlign={"center"}
        marginTop={normalizeSize(20)}
        marginBottom={normalizeSize(20)}
      />
      <View style={styles.input}>
        <CustomInput
          placeholder={"Password"}
          isLeftIcon={true}
          IconFamily={"MaterialCommunityIcons"}
          IconName={toggle ? "eye" : "eye-off"}
          secureTextEntry={!toggle}
          onPress={() => setToggle(!toggle)}
          value={password}
          onChangeText={(t) => {
            setPassword(t);
            setError("");
          }}
          errorMessage={error}
        />
        <CustomInput
          placeholder={"Verify Password"}
          marginBottom={normalizeSize(30)}
          isLeftIcon={true}
          IconFamily={"MaterialCommunityIcons"}
          IconName={showPassword ? "eye" : "eye-off"}
          value={verifyPassword}
          onChangeText={(t) => {
            setVerifyPassword(t);
            setVerifyError("");
          }}
          secureTextEntry={!showPassword}
          onPress={handleIconPress}
          errorMessage={verifyError}
        />
        <Button
          onPress={handleResetPassword}
          Loading={isLoading}
          text="Next"
          btnStyle={{
            ...GernalStyle.btn,

            backgroundColor: colors.buttonColor,
          }}
          btnTextStyle={GernalStyle.btnText}
        />
      </View>
    </SafeAreaView>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  input: {
    paddingHorizontal: normalizeSize(20),
  },
});
