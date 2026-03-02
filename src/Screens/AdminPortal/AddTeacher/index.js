import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
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
import SelectDropdown from "react-native-select-dropdown";
import { Fonts } from "../../../assets/fonts";
import {
  useAddStaffTeacherMutation,
  useDeleteStaffAndTeacherMutation,
  useGetAllSubjectQuery,
  useGetRoomsHomeworkQuery,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";
import validator from "../../../../utils/validation/validator";
import { useDispatch, useSelector } from "react-redux";
import { useMeQuery } from "../../../rtkQuery/slices/auth";
import { useGetAllClassRoomQuery } from "../../../rtkQuery/slices/home";
import { useEditStaffAndTeacherMutation } from "../../../rtkQuery/slices/home";
import Icons from "../../../Components/Icons";
import { NewPermissionData } from "../../../../utils";
import { togglePermission } from "../../../rtkQuery/slices/user/user.slice";
import CustomModal from "../../../Components/CustomModal";
const AddTeacher = ({ navigation, route }) => {
  const isEdit = route?.params?.isEdit;
  const { item } = route.params || {};
  const deleteBasedOnTeacherAndStaffId = item?.userId?._id;
  const selectId = item?.userId?._id;
  const [EditStaffAndTeacher, { isLoading: isErrorLoading }] =
    useEditStaffAndTeacherMutation();
  const userData = useSelector((state) => state.user.userData);
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [hidePass, setHidePass] = useState(false);
  const [role, setRole] = useState("");
  const [selectedClassIds, setSelectedClassIds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const permissionData = useSelector((state) => state.user.permissions);
  const { data } = useMeQuery();
  const schoolName = userData?.userId?.schoolName;
  const { data: getAllClassRoom } = useGetAllClassRoomQuery();

  const { data: getSubjectByRoomId } = useGetAllSubjectQuery();
  const subjectTitles =
    getSubjectByRoomId?.data?.map((item) => ({
      id: item?._id,
      title: item?.title,
    })) || [];
  const [selectedSubjectIds, setSelectedSubjectIds] = useState([]);
  const dispatch = useDispatch();

  const classNames = getAllClassRoom?.data?.map((classRoom) => ({
    name: classRoom.name,
    id: classRoom._id,
  }));
  const className = classNames?.map((classRoom) => classRoom?.name);
  const [deleteStaffAndTeacher, { isLoading: delateLoading }] =
    useDeleteStaffAndTeacherMutation();

  const handleClassSelection = (selectedClassName) => {
    const selectedClass = classNames.find(
      (classRoom) => classRoom.name === selectedClassName
    );

    // Toggle selection
    setSelectedClassIds((prev) => {
      const isAlreadySelected = prev.includes(selectedClass.id);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== selectedClass.id);
      } else {
        return [...prev, selectedClass.id];
      }
    });
  };

  const toggleSubjectSelection = (selectedSubjectTitle) => {
    const selectedSubject = subjectTitles.find(
      (subject) => subject.title === selectedSubjectTitle
    );

    setSelectedSubjectIds((prev) => {
      const isAlreadySelected = prev.includes(selectedSubject.id);
      if (isAlreadySelected) {
        return prev.filter((id) => id !== selectedSubject.id);
      } else {
        return [...prev, selectedSubject.id];
      }
    });
  };

  const handleDeleteStaffAndTeacher = async () => {
    try {
      const res = await deleteStaffAndTeacher(deleteBasedOnTeacherAndStaffId);
      console.log("res================", res);
      if (res.data.message.includes("successfully")) {
        navigation.navigate("Teachers");
        showToast("success", res?.data?.message);
        setModalShow(false);
      }
    } catch (error) {
      console.log("error============", error);
    }
  };

  const [addStaffTeacher, { error, isLoading }] = useAddStaffTeacherMutation();

  useEffect(() => {
    if (
      isEdit &&
      item &&
      !firstname &&
      !lastname &&
      !email &&
      !phoneNumber &&
      !password &&
      !role
    ) {
      setFirstName(item?.userId?.firstName || "");
      setLastName(item?.userId?.lastName || "");
      setEmail(item?.userId?.email || "");
      setPhoneNumber(item?.userId?.phoneNo || "");
      setRole(item?.userId?.role || "");
      setSelectedClassIds(item?.rooms?.map((room) => room._id) || []);
      dispatch(togglePermission(item?.userId?.permissions?.permissions));
      setSelectedSubjectIds(
        item?.subjects?.map((subject) => subject._id) || []
      );
      setPassword(item?.userId?.password || "");
    }
  }, [isEdit, item]);
  const TeacherStaffId = item?._id;
  const handleEditStaffAndTeacher = async () => {
    console.log({ selectedSubjectIds });
    const AllPermissionData = permissionData?.map((item) => ({
      ...item,
      permissionHandler: item.title.toLowerCase().replace(/\s+/g, ""),
    }));
    const payload = {
      firstName: firstname,
      lastName: lastname,
      phoneNo: phoneNumber,
      permissions: AllPermissionData,
      email: email,
      role: role,
      rooms: selectedClassIds,
      subjects: selectedSubjectIds,
    };
    try {
      const res = await EditStaffAndTeacher({ selectId, payload });

      if (res.data.message.includes("successfully")) {
        navigation.navigate("Teachers");
        showToast("success", res?.data?.message);

        dispatch(togglePermission(NewPermissionData));
      }
    } catch (isError) {
      console.log("error===============>>>>>>>>>>>", isError);
    }
  };
  const handleaddStaffTeacher = async () => {
    if (!firstname || !lastname || !email || !role || !password) {
      showToast("error", "Please fill in all required fields");
      return;
    }
    const emailError = await validator("email", email);
    if (emailError) {
      showToast("error", "Please enter a valid email address");
      return;
    }
    if (!email.endsWith("@gmail.com")) {
      showToast("error", "Please enter a valid email format");
      return;
    }
    const AllPermissionData = permissionData.map((item) => ({
      ...item,
      permissionHandler: item.title.toLowerCase().replace(/\s+/g, ""),
    }));
    const payload = {
      firstName: firstname,
      lastName: lastname,
      email: email,
      password: password,
      role: role,
      phoneNo: phoneNumber,
      permissions: AllPermissionData,
      rooms: selectedClassIds,
      subjects: selectedSubjectIds,
    };

    try {
      const res = await addStaffTeacher(payload).unwrap();
      console.log("first===========", res);
      if (res?.message.includes("successfully")) {
        navigation.goBack();
        showToast("success", res?.message);
        dispatch(togglePermission(NewPermissionData));
      }
      if (res?.data?.status === 400) {
        showToast("error", res?.data?.message);
        return;
      }
    } catch (err) {
      showToast("error", err?.data?.message || "Something went wrong");
      console.log(err);
      console.log("Error details:", err?.data?.errors);
    }
  };

  const toggleShowPassword = () => {
    setHidePass(!hidePass);
  };
  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };
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
          <View style={styles.modalBackground}>
            {isEdit && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={() => setModalShow(true)}
              >
                <Icons
                  name={"delete"}
                  family={"MaterialIcons"}
                  size={25}
                  color={colors.red}
                />
              </TouchableOpacity>
            )}
          </View>
        }
        title={isEdit ? "Edit Teacher / Staff" : "Add Teacher / Staff"}
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
              Personal informations
            </Text>
            <TextInput
              placeholder="First Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="email-address"
              autoCapitalize="none"
              blurOnSubmit={false}
              value={firstname}
              onChangeText={(text) => setFirstName(text.trim())}
              editable={true}
            />
            <TextInput
              placeholder="Last Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={lastname}
              onChangeText={(text) => setLastName(text)}
              editable={true}
            />
            <TextInput
              placeholder="Email"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            {!isEdit && (
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
            <TextInput
              placeholder="Phone number"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={phoneNumber}
              onChangeText={(text) => setPhoneNumber(text)}
            />
          </View>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("PermissonGrant", {
                userId: TeacherStaffId,
                // userId: id,
              })
            }
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginVertical: getHeight(2),
              marginTop: getHeight(3),
            }}
          >
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
              }}
            >
              Permissions
            </Text>
            <AntDesign name={"right"} color="black" size={20} />
          </TouchableOpacity>

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
              School
            </Text>
            <TextInput
              placeholder="School"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: 16 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={schoolName}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => {
                if (className?.length === 0) {
                  Alert.alert("No Data", "There is no data available");
                }
              }}
              activeOpacity={className?.length === 0 ? 1 : 0.7}
            >
              <SelectDropdown
                data={className}
                defaultValue={selectedClassIds}
                disabled={isEdit || !!item?.rooms[0]}
                onSelect={(selectedClassName) =>
                  handleClassSelection(selectedClassName)
                }
                defaultButtonText={
                  selectedClassIds.length > 0
                    ? classNames
                        ?.filter((c) => selectedClassIds.includes(c.id))
                        .map((c) => c.name)
                        .join(", ")
                    : "Select Classes"
                }
                renderCustomizedRowChild={(className) => {
                  const classObj = classNames.find((c) => c.name === className);
                  return (
                    <TouchableOpacity
                      onPress={() => handleClassSelection(className)}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: 10,
                      }}
                    >
                      <Text style={{ fontSize: 16, color: "black" }}>
                        {className}
                      </Text>
                      {selectedClassIds.includes(classObj?.id) && (
                        <Entypo name="check" size={16} color="green" />
                      )}
                    </TouchableOpacity>
                  );
                }}
                buttonStyle={{
                  width: "100%",
                  backgroundColor: "white",
                  borderBottomWidth: 1,
                  borderColor: "#eaeaea",
                  borderRadius: 5,
                  height: 50,
                }}
                buttonTextStyle={{
                  color: "black",
                  fontSize: 18,
                  textAlign: "left",
                  fontWeight: "400",
                }}
                renderDropdownIcon={(isOpened) => (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={colors.black}
                    size={getFontSize(2)}
                  />
                )}
                dropdownStyle={{
                  backgroundColor: "white",
                  borderRadius: 5,
                }}
                rowStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "rgba(0, 0, 0, 0.1)",
                }}
                rowTextStyle={{
                  color: "black",
                  fontSize: 18,
                  paddingLeft: 10,
                }}
                disabled={className?.length === 0}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (subjectTitles.length === 0) {
                  Alert.alert("No Data", "There is no data available");
                }
              }}
              activeOpacity={subjectTitles?.length === 0 ? 1 : 0.7}
            >
              <View style={{ width: "100%", flexWrap: "wrap" }}>
                {/* Dropdown */}
                <SelectDropdown
                  data={subjectTitles.map((subject) => subject.title)}
                  defaultValue={selectedSubjectIds}
                  defaultButtonText={
                    selectedSubjectIds.length > 0
                      ? subjectTitles
                          .filter((s) => selectedSubjectIds.includes(s.id))
                          .map((s) => s.title)
                          .join(", ")
                      : "Select Subjects"
                  }
                  onSelect={(selectedTitle) =>
                    toggleSubjectSelection(selectedTitle)
                  }
                  buttonStyle={{
                    width: "100%",
                    backgroundColor: "white",
                    borderBottomWidth: 1,
                    borderColor: "#eaeaea",
                    borderRadius: 5,
                    padding: 10,
                  }}
                  buttonTextStyle={{
                    color: "#000",
                    fontSize: 16,
                    textAlign: "left",
                  }}
                  renderDropdownIcon={(isOpened) => (
                    <Entypo
                      name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                      color={"black"}
                      size={16}
                    />
                  )}
                  dropdownStyle={{
                    backgroundColor: "white",
                    borderRadius: 5,
                  }}
                  rowStyle={{
                    backgroundColor: "white",
                    borderBottomColor: "rgba(0, 0, 0, 0.1)",
                  }}
                  rowTextStyle={{
                    color: "black",
                    fontSize: 16,
                  }}
                  renderCustomizedRowChild={(subjectTitle) => {
                    const subject = subjectTitles.find(
                      (s) => s.title === subjectTitle
                    );
                    return (
                      <TouchableOpacity
                        onPress={() => toggleSubjectSelection(subjectTitle)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: 10,
                        }}
                      >
                        <Text style={{ fontSize: 16, color: "black" }}>
                          {subjectTitle}
                        </Text>
                        {selectedSubjectIds.includes(subject?.id) && (
                          <Entypo name="check" size={16} color="green" />
                        )}
                      </TouchableOpacity>
                    );
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

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
            Role
          </Text>

          <SelectDropdown
            defaultValue={role}
            data={["staff", "teacher"]}
            // disabled={isEdit || !!item?.userId?.role}
            onSelect={(selectedItem) => setRole(selectedItem)}
            defaultButtonText="Select"
            buttonStyle={{
              width: "100%",
              backgroundColor: "white",
              borderBottomWidth: 1,
              borderColor: "#eaeaea",
              borderRadius: 5,
              height: getHeight(4),
            }}
            buttonTextStyle={{
              color: colors.black,
              fontSize: 18,
              textAlign: "left",
              fontWeight: "400",
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={colors.black}
                  size={getFontSize(2)}
                />
              );
            }}
            dropdownStyle={{
              backgroundColor: "white",
              borderRadius: 5,
            }}
            rowStyle={{
              backgroundColor: "white",
              borderBottomColor: "rgba(0, 0, 0, 0.1)",
            }}
            rowTextStyle={{
              color: "black",
              fontSize: getFontSize(2),
              paddingLeft: getFontSize(1),
            }}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button
            onPress={() => navigation.navigate("Teachers")}
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
              fontSize: 14,
              color: "#A6A6A6",
            }}
            text={"Cancel"}
          />

          <Button
            // onPress={() => setModel(true)}
            onPress={item ? handleEditStaffAndTeacher : handleaddStaffTeacher}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
            }}
            Loading={isLoading || isErrorLoading}
            text={isEdit ? "Edit" : "Save"}
          />
        </View>
      </ScrollView>
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"Are you sure you want to delete this teacher/Staff?"}
        title={"Delete teacher/Staff"}
        onPress={handleDeleteStaffAndTeacher}
        loading={delateLoading}
      />
    </View>
  );
};
export default AddTeacher;
