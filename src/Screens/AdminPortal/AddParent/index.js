import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";
import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import {
  useAddParentMutation,
  useDeleteParentMutation,
  useUpdateParentMutation,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";
import Icons from "../../../Components/Icons";
import { Fonts } from "../../../assets/fonts";
import CustomModal from "../../../Components/CustomModal";

const AddParent = ({ navigation, route }) => {
  const seeParent = route?.params?.seeParent;
  const { item } = route.params;
  // console.log("params==============", item);
  const parentId = item?._id;
  // console.log("parentId===========", parentId);
  const [updateParent, { isLoading }] = useUpdateParentMutation();
  const [deleteParent, { isLoading: deleteLoading }] =
    useDeleteParentMutation(parentId);
  const [modalShow, setModalShow] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [contact1, setContact1] = useState("");
  const [contact2, setContact2] = useState("");
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    contact1: "",
    contact2: "",
    child1: "",
    child2: "",
    password: "",
  });
  console.log("firstName=============", firstName);
  useEffect(() => {
    setFirstName(item?.userId?.firstName);
    setLastName(item?.userId?.lastName);
    setEmail(item?.userId?.email);
    // setPassword(item?.userId?.password);
    setPhoneNo(item?.userId?.phoneNo);
  }, [item]);

  const handleUpdateParent = async () => {
    try {
      const payload = {
        email: email,
        firstName: firstName,
        lastName: lastName,
        phoneNo: phoneNo,
        contact1: contact1,
        contact2: contact2,
      };
      const res = await updateParent({ parentId, payload });
      console.log("resresresresresres", res);
      if (res?.data?.message?.includes("successfully")) {
        navigation.goBack();
        showToast("success", res?.data?.message);
      } else {
        showToast("error", "Update failed. Please try again.");
      }
    } catch (error) {
      console.log("Error updating parent:", error);
      showToast("error", "An error occurred. Please try again.");
    }
  };
  const toggleShowPassword = () => {
    setHidePass(!hidePass);
  };
  const validations = () => {
    const initialErrors = {
      firstName: "",
      lastName: "",
      email: "",
      phoneNo: "",
      password: "",
    };
    setErrors(initialErrors);

    let isValid = true;

    const setError = (field, message) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!firstName) setError("firstName", "First Name is required.");
    if (!lastName) setError("lastName", "Last Name is required.");
    if (!email) setError("email", "Email is required.");
    if (!phoneNo) setError("phoneNo", "Phone No is required.");

    if (!password) {
      setError("password", "Password is required.");
    } else if (password.length < 6) {
      setError("password", "Password must have at least 6 characters.");
    }

    return isValid;
  };

  const handleDelete = async () => {
    const res = await deleteParent(parentId);
    try {
      if (res.data.message.includes("successfully")) {
        navigation.goBack();
        showToast("success", res?.data?.message);
      }
    } catch (error) {
      console.log("error==========", error);
    }
    console.log("res================", res);
    console.log("Deleted item:", item);
    setModalShow(false);
  };

  const [addParent, { isLoading: parentLoading }] = useAddParentMutation();
  const handleAddParent = async () => {
    const isFormValid = validations();
    if (!isFormValid) {
      return;
    }
    try {
      const payload = {
        firstName,
        lastName,
        email,
        phoneNo,
        password,
        contact1: contact1,
        contact2: contact2,
      };
      const response = await addParent(payload);
      console.log("response==============", response);
      if (response.error) {
        showToast("error", response?.error?.data?.message);
        console.log("api error", response.error);
      } else {
        console.log("add successful", response);
        navigation.goBack();
        resetInputs();
        showToast("success", response?.data?.message);
      }
    } catch (error) {
      console.log("error====", error);
    }
  };
  const resetInputs = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhoneNo("");
    setContact1("");
    setContact2("");
  };

  const dropdownData = item?.children?.map((child) => ({
    label: `${child?.firstName} ${child?.lastName}`,
    value: child?._id,
  }));

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        backgroundColor={colors.primary}
        RightIcon={
          item ? (
            <MaterialIcons
              name="delete"
              size={25}
              color={colors.red}
              onPress={() => setModalShow(true)}
            />
          ) : (
            <View />
          )
        }
        title={item ? "Edit Parent" : seeParent ? "Parent" : "Add parent"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <ScrollView>
        <View
          style={{
            width: getWidth(90),
            alignSelf: "center",
            marginBottom: getHeight(2),
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Personal information
            </Text>

            <TextInput
              placeholder="First name"
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            {errors.firstName ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.firstName}
              </Text>
            ) : null}
            <TextInput
              placeholder="Last name"
              value={lastName}
              onChangeText={(text) => setLastName(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            {errors.lastName ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.lastName}
              </Text>
            ) : null}
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={(text) => setEmail(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            {errors.email ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.email}
              </Text>
            ) : null}
            {!item && (
              <View style={styles.passInput}>
                <TextInput
                  placeholder="Password "
                  secureTextEntry={!hidePass}
                  value={password}
                  onChangeText={(text) => setPassword(text)}
                  returnKeyType={"next"}
                  theme={{ roundness: getFontSize(1) }}
                  style={[
                    GernalStyle.newInputStyle,
                    { paddingLeft: -4, flex: 1 },
                  ]}
                  blurOnSubmit={false}
                />
                <TouchableOpacity
                  style={{
                    paddingRight: 10,
                  }}
                  onPress={toggleShowPassword}
                >
                  <Icons
                    family="Entypo"
                    name={hidePass ? "eye" : "eye-with-line"}
                    fontFamily={"Entypo"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            )}
            {errors.password ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.password}
              </Text>
            ) : null}
            <TextInput
              placeholder="Phone No"
              value={phoneNo}
              onChangeText={(text) => setPhoneNo(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="number-pad"
              blurOnSubmit={false}
            />
            {errors.phoneNo ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.phoneNo}
              </Text>
            ) : null}
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Contact
            </Text>
            <TextInput
              placeholder="Contact 1"
              value={contact1}
              onChangeText={(text) => setContact1(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            {errors.contact1 ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.contact1}
              </Text>
            ) : null}
            <TextInput
              placeholder="Contact 2"
              value={contact2}
              onChangeText={(text) => setContact2(text)}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            {errors.contact2 ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.contact2}
              </Text>
            ) : null}
          </View>
        </View>
        {!!item?.children && (
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              fontWeight: "700",
              color: "#47424F",
              marginTop: getHeight(2),
              marginBottom: getHeight(0.5),
              paddingHorizontal: 20,
            }}
          >
            Children
          </Text>
        )}
        {!!item?.children && (
          <View
            style={{
              width: "90%",
              backgroundColor: "white",
              height: getHeight(5),
              alignSelf: "center",
              marginTop: getHeight(2),
              position: "relative",
            }}
          >
            {item?.children?.map((child, index) => (
              <Text
                key={index}
                style={{
                  color: colors?.black10,
                  fontSize: 14,
                  fontFamily: Fonts.PoppinsMedium,
                  marginBottom: 5,
                }}
              >
                {child.firstName} {child.lastName}
              </Text>
            ))}
          </View>
        )}

        {item ? (
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Button
              btnStyle={{
                ...GernalStyle.btn,
                width: getWidth(50),
                backgroundColor: colors?.primary,
                borderRadius: 5,
                marginTop: getHeight(15),
              }}
              onPress={handleUpdateParent}
              btnTextStyle={{ ...GernalStyle.btnText, color: "white" }}
              text={"Update Parent"}
              Loading={isLoading}
            />
          </View>
        ) : (
          <View
            style={{ flexDirection: "row", justifyContent: "space-evenly" }}
          >
            <Button
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: "#EFEFEF",
                flexDirection: "row",
                width: getWidth(42),
                height: getHeight(5),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{
                ...GernalStyle.btnText,
                fontSize: 18,
                color: "#A6A6A6",
              }}
              text={"Cancel"}
              onPress={() => navigation.goBack()}
            />
            <Button
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: colors.primary,
                flexDirection: "row",
                width: getWidth(42),
                height: getHeight(5),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
              text={seeParent ? "Save" : "Next"}
              onPress={handleAddParent}
              Loading={parentLoading}
            />
          </View>
        )}
      </ScrollView>
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"Are you sure you want to delete this parent?"}
        title={"Delete Parent"}
        onPress={handleDelete}
        loading={deleteLoading}
      />
    </View>
  );
};

export default AddParent;
