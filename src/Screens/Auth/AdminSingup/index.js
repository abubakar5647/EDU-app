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
import { useFocusEffect } from "@react-navigation/native";
import { useAdminSignUpMutation } from "../../../rtkQuery/slices/auth";
import { showToast } from "../../../Components/Toaster";
import axios from "axios";
const AdminSignup = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [AdminSignUp, { error, isLoading }] = useAdminSignUpMutation();
  const role = useSelector((state) => state.gernal.follow);

  const { email, password } = route.params;
  console.log("password=======", password);
  console.log("email======", email);

  const { way } = route.params;
  const inputRefs = {
    email: useRef(null),
    fullName: useRef(null),
    lastName: useRef(null),
    schoolName: useRef(null),
    phoneNo: useRef(null),
    adress: useRef(null),
    capacity: useRef(null),
  };
  const [state, setState] = useState({
    email: "",
    emailError: "",
    fullName: "",
    fullNameError: "",
    phoneNo: "",
    phoneNoError: "",
    schoolName: "",
    schoolNameError: "",
    adress: "",
    adressError: "",
    capacityError: "",
  });
  // useFocusEffect(
  //   React.useCallback(() => {
  //     setState({
  //       email: "",
  //       emailError: "",
  //       fullName: "",
  //       fullNameError: "",
  //       phoneNo: "",
  //       phoneNoError: "",
  //       schoolName: "",
  //       schoolNameError: "",
  //       adress: "",
  //       adressError: "",
  //       capacity: "",
  //       capacityError: "",
  //     });
  //   }, [])
  // );

  const Sing_upfn = async () => {
    const {
      email: signupSchoolEmail,
      // fullName,
      schoolName,
      phoneNo,
      adress,
      capacity,
    } = state;
    const { email, password } = route.params;
    if (!schoolName || !phoneNo || !adress || !capacity) {
      Alert.alert("Please fill in all fields!");
      return;
    }
    try {
      const emailError = await validator("email", email);
      const schoolNameError = await validator("schoolName", schoolName);
      const phoneNoError = await validator("phoneNo", phoneNo);
      const adressError = await validator("adress", adress);
      const CapacityError = await validator("CapacityError", CapacityError);

      const payload = {
        password: password,
        email: email,
        role: role,
        schoolName: state.schoolName,
        schoolEmail: signupSchoolEmail,
        phoneNo: state.phoneNo,
        address: state.adress,
        capacity: state.capacity,
      };
      if (
        !emailError &&
        !schoolNameError &&
        !phoneNoError &&
        !adressError &&
        !CapacityError
      ) {
        const res = await AdminSignUp(payload);
        console.log("adminsignup==================", res);
        console.log("otp===============", res?.data?.data?.user);
        console.log("scholotp================", res?.data?.data?.school);
        if (res?.data?.message && res?.data?.message.includes("Successfully")) {
          showToast("success", res?.data?.message);
        }
        if (res?.message && res?.message.includes("already")) {
          showToast("error", res?.message);
        }
        if (res?.error?.status === "FETCH_ERROR") {
          showToast("error", res?.error?.error);
          return;
        }
        if (error?.data?.errors?.length >= 0) {
          showToast("error", error?.data?.errors[0]);
          return;
        }
        console.log("error=====", res?.error?.data?.error);
        if (res?.error?.status === 400) {
          showToast("error", res?.error?.data?.message);
          return;
        }
        if (res?.data?.message && res.data.message.includes("Successfully")) {
          if (phoneNo) {
            navigation.navigate("OTP", { email: email });
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email) {
              Alert.alert("Please enter a valid email format");
            }
            if (!phoneRegex.test(phoneNo)) {
              Alert.alert("Please enter a valid phone number format");
            }
          }
        }
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
        <View style={styles.mainview}>
          <Text style={styles.txt}>
            {way == "signup"
              ? "Create your account"
              : "Enter school information"}
          </Text>

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
              // onFocus={() => setState({ ...state, emailError: "" })}
              // onBlur={() =>
              //   validateFields(state.email, "email", (error) =>
              //     setState({ ...state, emailError: error })
              //   )
              // }
              // onSubmitEditing={() => inputRefs["fullName"].current.focus()}
              // onChangeText={(email) => changeHandler("email", email.trim())}
              blurOnSubmit={false}
            />
            {/* <Text style={GernalStyle.InputError}>{state.emailError}</Text> */}
          </View>
          {/* <View>
            <Text style={styles.txt2}>Full Name</Text>

            <TextInput
              mode="outlined"
              label="name"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#D8DADC"
              cursorColor="#D8DADC"
              textColor="#747988"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#D8DADC"
              style={GernalStyle.input}
              ref={inputRefs.fullName}
              value={state.fullName}
              returnKeyType={"send"}
              onFocus={() => setState({ ...state, fullNameError: "" })}
              onBlur={() =>
                validateFields(state.fullName, "fullName", (error) =>
                  setState({ ...state, fullNameError: error })
                )
              }
              onSubmitEditing={() => inputRefs["schoolName"].current.focus()}
              onChangeText={(fullName) =>
                changeHandler("fullName", fullName.trim())
              }
              blurOnSubmit={false}
            />

            <Text style={GernalStyle.InputError}>{state.fullNameError}</Text>
          </View> */}

          <View>
            <Text style={styles.txt2}>School Name</Text>

            <TextInput
              mode="outlined"
              label="School Name"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#D8DADC"
              cursorColor="#D8DADC"
              textColor="#747988"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#D8DADC"
              style={GernalStyle.input}
              ref={inputRefs.schoolName}
              value={state.schoolName}
              returnKeyType={"send"}
              onFocus={() => setState({ ...state, schoolNameError: "" })}
              onBlur={() =>
                validateFields(state.schoolName.trim(), "schoolName", (error) =>
                  setState({
                    ...state,
                    schoolName: state.schoolName.trim(),
                    schoolNameError: error,
                  })
                )
              }
              onSubmitEditing={() => inputRefs["phoneNo"].current.focus()}
              onChangeText={(schoolName) =>
                changeHandler("schoolName", schoolName)
              }
              blurOnSubmit={false}
            />

            <Text style={GernalStyle.InputError}>{state.schoolNameError}</Text>
          </View>

          <View>
            <Text style={styles.txt2}>Phone No</Text>

            <TextInput
              mode="outlined"
              label="Phone No"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#D8DADC"
              cursorColor="#D8DADC"
              textColor="#747988"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#D8DADC"
              style={GernalStyle.input}
              ref={inputRefs.phoneNo}
              value={state.phoneNo}
              returnKeyType={"send"}
              onFocus={() => setState({ ...state, phoneNoError: "" })}
              onBlur={() =>
                validateFields(state.phoneNo.trim(), "phoneNo", (error) =>
                  setState({
                    ...state,
                    phoneNo: state.phoneNo.trim(),
                    phoneNoError: error,
                  })
                )
              }
              onSubmitEditing={() => inputRefs["adress"].current.focus()}
              onChangeText={(phoneNo) => changeHandler("phoneNo", phoneNo)}
              blurOnSubmit={false}
            />

            <Text style={GernalStyle.InputError}>{state.phoneNoError}</Text>
          </View>

          <View>
            <Text style={styles.txt2}>Address</Text>

            <TextInput
              mode="outlined"
              label="Address"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#D8DADC"
              cursorColor="#D8DADC"
              textColor="#747988"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#D8DADC"
              style={GernalStyle.input}
              ref={inputRefs.adress}
              value={state.adress}
              returnKeyType={"send"}
              onFocus={() => setState({ ...state, adressError: "" })}
              onBlur={() =>
                validateFields(state.adress.trim(), "adress", (error) =>
                  setState({
                    ...state,
                    adress: state.adress.trim(),
                    adressError: error,
                  })
                )
              }
              onSubmitEditing={() => Sing_upfn()}
              onChangeText={(adress) => changeHandler("adress", adress)}
              blurOnSubmit={false}
            />

            <Text style={GernalStyle.InputError}>{state.adressError}</Text>
          </View>

          <View>
            <Text style={styles.txt2}>School Capacity</Text>
            <TextInput
              mode="outlined"
              label="School Capacity"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#D8DADC"
              cursorColor="#D8DADC"
              textColor="#747988"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#D8DADC"
              style={GernalStyle.input}
              ref={inputRefs.capacity}
              value={state.capacity}
              returnKeyType={"send"}
              keyboardType="numeric"
              onFocus={() => setState({ ...state, capacityError: "" })}
              onBlur={() =>
                validateFields(state.capacity.trim(), "capacity", (error) =>
                  setState({
                    ...state,
                    capacity: state.capacity.trim(),
                    capacityError: error,
                  })
                )
              }
              onSubmitEditing={() => Sing_upfn()}
              onChangeText={(capacity) => changeHandler("capacity", capacity)}
              blurOnSubmit={false}
            />
            <Text style={GernalStyle.InputError}>{state.capacityError}</Text>
          </View>
          <Button
            onPress={() => Sing_upfn()}
            text="Next"
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.buttonColor,
            }}
            btnTextStyle={GernalStyle.btnText}
            // isLoading={isLoading}
          />
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AdminSignup;
