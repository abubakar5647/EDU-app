import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
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
import { useDispatch, useSelector } from "react-redux";
import ImageModal from "react-native-image-modal";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  useAddChildrenMutation,
  useAddStudentMutation,
  useDeleteStudentMutation,
  useGetGroupsQuery,
  useGetLevelQuery,
  useGetParentQuery,
  useGetRoomsQuery,
  useGetSchoolCareerQuery,
  useUpdateStudentMutation,
} from "../../../rtkQuery/slices/home";
import SelectDropdown from "react-native-select-dropdown";
import { Fonts } from "../../../assets/fonts";
import { showToast } from "../../../Components/Toaster";
import DatePicker from "react-native-date-picker";
import Icons from "../../../Components/Icons";
import { API_ROUTES } from "../../../rtkQuery/routes";
import UploadMedia from "../../../Components/UploadMedia";
import CustomModal from "../../../Components/CustomModal";

const StudentProfile = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isEditStudent } = route?.params || {};
  // console.log("Student=====>>>>>>", isEditStudent);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [address, setAddress] = useState("");
  const [observation, setObservation] = useState("");
  const [allergy1, setAllergy1] = useState("");
  const [allergy2, setAllergy2] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedParent, setSelectedParent] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]); //school careers
  const [getAllLevel, setGetAllLevel] = useState([]); //levels
  const [getClassroom, setGetClassroom] = useState([]); //classrooms
  const [getAllGroups, setGetAllGroups] = useState([]); // groups
  const [getAllParents, setGetAllParents] = useState([]);
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    address: "",
    observation: "",
    allergy1: "",
    allergy2: "",
    selectedCareer: null,
    selectedLevel: null,
    selectedClassroom: null,
    selectedParent: null,
    dateOfBirth: "",
    // selectedImage: null,
  });

  const role = useSelector((state) => state.gernal.follow);

  const validations = () => {
    const initialErrors = {
      firstName: "",
      lastName: "",
      // observation: "",
      selectedCareer: null,
      selectedLevel: null,
      selectedClassroom: null,
      // selectedParent: null,
      // dateOfBirth: "",
    };

    let isValid = true;
    setErrors(initialErrors);
    const setError = (field, message) => {
      setErrors((prev) => ({ ...prev, [field]: message }));
      isValid = false;
    };

    if (!firstName) setError("firstName", "First Name is required.");
    if (!lastName) setError("lastName", "Last Name is required.");
    // if (!observation) setError("observation", "Observation is required.");
    if (!selectedCareer) setError("selectedCareer", "Career is required.");
    if (!selectedLevel) setError("selectedLevel", "Level is required.");
    if (!selectedClassroom)
      setError("selectedClassroom", "Classes are required.");
    // if (!dateOfBirth) setError("dateOfBirth", "Date of Birth is optional.");
    // if (!selectedParent) setError("selectedParent", "Parent is optional.");

    return isValid;
  };

  const HandleSelectImage = (imagePath) => {
    console.log("Selected Path:", imagePath);
    setSelectedImage(imagePath);
    setModalVisible(false);
  };

  // Edit Student Data
  useEffect(() => {
    if (isEditStudent) {
      setFirstName(isEditStudent?.firstName || "");
      setLastName(isEditStudent?.lastName || "");

      const dob = isEditStudent?.dateOfBirth
        ? new Date(isEditStudent?.dateOfBirth)
        : null;
      setDateOfBirth(dob);

      setObservation(isEditStudent?.observation || "");
      setAddress(isEditStudent?.address || "");
      setAllergy1(
        isEditStudent?.Allergies ? isEditStudent?.Allergies[0] || "" : ""
      );
      setAllergy2(
        isEditStudent?.Allergies ? isEditStudent?.Allergies[1] || "" : ""
      );
      setSelectedImage(isEditStudent.url || selectedImage);
    }
  }, []);

  const resetInputs = () => {
    setFirstName("");
    setLastName("");
    setDateOfBirth("");
    setObservation("");
    setAddress("");
    setAllergy1("");
    setAllergy2("");
    // setSchoolCareer("");
    // setClasses("");
    // setGroupName("");
  };

  const handleConfirm = (date) => {
    setDateOfBirth(date);
    setOpen(false);
  };

  // ADD students API
  const [addStudent, { isLoading: studentCreating }] = useAddStudentMutation();
  const handleStudentCreate = async () => {
    const isFormValid = validations();
    if (!isFormValid) {
      return;
    }
    const formData = new FormData();
    if (selectedImage) {
      const imageFile = {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpeg",
      };
      formData.append("media", imageFile);
    }
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    const formattedDate = new Date(dateOfBirth).toLocaleDateString("en-US");
    formData.append("dateOfBirth", formattedDate);
    formData.append("observation", observation);
    if (address) {
      formData.append("address", address);
    }
    if (allergy1 || allergy2) {
      formData.append("Allergies", [allergy1, allergy2]);
    }
    formData.append("schoolCareer", selectedCareer?.value);
    formData.append("level", selectedLevel?.value);
    formData.append("classes", selectedClassroom?.value);
    if (selectedParent?.value) {
      formData.append("parentId", selectedParent.value);
    }
    try {
      const response = await addStudent(formData);
      if (response.error) {
        showToast("error", response.error.data.message);
        console.log("API error in Add Student:", response.error);
      } else {
        console.log("Student Added Successfully:", response);
        navigation.goBack();
        showToast("success", response.data.message);
        resetInputs();
      }
    } catch (error) {
      console.log("Unexpected Error====>>>>", error);
    }
  };

  // ADD CHILDREN API
  const [addChildren, { isLoading: childCreating }] = useAddChildrenMutation();

  const handleChildCreate = async () => {
    const isFormValid = validations();
    if (!isFormValid) {
      return;
    }
    const formData = new FormData();

    if (selectedImage) {
      const imageFile = {
        uri: selectedImage,
        name: "image.jpg",
        type: "image/jpeg",
      };
      formData.append("media", imageFile);
    }

    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    if (dateOfBirth) {
      const formattedDate = dateOfBirth.toISOString().split("T")[0];
      formData.append("dateOfBirth", formattedDate);
    }
    formData.append("observation", observation);
    if (address) {
      formData.append("address", address);
    }
    if (allergy1 || allergy2) {
      formData.append("Allergies", [allergy1, allergy2]);
    }
    formData.append("schoolCareer", selectedCareer?.value);
    formData.append("level", selectedLevel?.value);
    formData.append("classes", selectedClassroom?.value);
    if (selectedParent) {
      formData.append("parentId", selectedParent?.value);
    }

    try {
      const response = await addChildren(formData);
      console.log("response==============", response);
      if (response.error) {
        showToast("error", response?.error?.error);
        console.log("API error in Child Create:", response.error);
      } else {
        console.log("Child Added Successfully:", response);
        navigation.goBack();
        showToast("success", response?.data?.message);
        resetInputs();
      }
    } catch (error) {
      console.log("Unexpected Error====", error);
    }
  };

  // Update Student API
  const [updateStudent, { isLoading: isUpdateLoading }] =
    useUpdateStudentMutation();

  const handleUpdateStudent = async () => {
    if (isEditStudent) {
      const isFormValid = validations();
      if (!isFormValid) {
        return;
      }
      const formData = new FormData();
      if (selectedImage && selectedImage.startsWith("file://")) {
        const imageFile = {
          uri: selectedImage,
          name: "image.jpg",
          type: "image/jpeg",
        };
        formData.append("image", imageFile);
      }
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (dateOfBirth) {
        const formattedDate = new Date(dateOfBirth).toISOString().split("T")[0];
        formData.append("dateOfBirth", formattedDate);
      }
      formData.append("observation", observation || "");
      formData.append("address", address || "");
      formData.append("Allergies", [allergy1, allergy2]);
      formData.append("schoolCareer", selectedCareer?.value || "");
      formData.append("level", selectedLevel?.value || "");
      formData.append("classes", selectedClassroom?.value || "");
      if (selectedParent) {
        formData.append("parentId", selectedParent?.value);
      }

      console.log("Edit payload=====>>>>>>>", formData);
      try {
        const response = await updateStudent({
          payload: formData,
          studentId: isEditStudent?._id,
        });
        if (response.error) {
          showToast("error", response.error.error);
          console.log("API error in Update Student:", response.error);
        } else {
          console.log("Student Updated Successfully:", response);
          navigation.goBack();
          showToast("success", response.data.message);
          resetInputs();
        }
      } catch (error) {
        console.error("Error updating student:", error);
      }
    }
  };

  const handleButtonPress = () => {
    if (role === "Admin") {
      handleStudentCreate();
    } else {
      handleChildCreate();
    }
  };

  const handleLoading = () => {
    if (role === "Admin") {
      return studentCreating;
    } else {
      return childCreating;
    }
  };

  const [deleteStudent, { isLoading }] = useDeleteStudentMutation();

  const handleDeleteStudent = async () => {
    try {
      const response = await deleteStudent({ studentId: isEditStudent?._id });
      if (response.error) {
        showToast("error", response.error.error);
        console.log("API error in Delete Student:", response.error);
      } else {
        console.log("Student Deleted Successfully:", response);
        navigation.goBack();
        showToast("success", response.data.message);
      }
    } catch (error) {
      console.error("Failed to delete the student: ", error);
      showToast("error", "Failed to delete student");
    }
  };

  // Dropdown APIs
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const { data: levels } = useGetLevelQuery(selectedCareer?.value);
  const { data: rooms } = useGetRoomsQuery(selectedLevel?.value);
  const { data } = useGetParentQuery();

  // Get School Career API
  useEffect(() => {
    if (schoolCareer?.data) {
      const schoolCareerData = schoolCareer.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      // console.log("SchoolCareer=========>>>", schoolCareerData);
      setGetSchoolCareer(schoolCareerData);
    }
  }, [schoolCareer]);

  // Get Levels API
  useEffect(() => {
    if (levels?.data) {
      const schoolLevelData = levels.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      // console.log("schoolLevels=========>>>", schoolLevelData);
      setGetAllLevel(schoolLevelData);
    }
  }, [levels]);

  // Get Classroom API

  useEffect(() => {
    if (rooms?.data) {
      const classroomData = rooms.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      // console.log("class=========>>>", classroomData);
      setGetClassroom(classroomData);
    }
  }, [rooms]);

  // Get Parents API
  useEffect(() => {
    if (data?.data) {
      const parentData = data.data.map((item) => ({
        label: `${item?.userId?.firstName} ${item?.userId?.lastName}`,
        value: item._id,
      }));
      // console.log("parentData=====", parentData);
      setGetAllParents(parentData);
    }
  }, [data]);

  const source = selectedImage
    ? { uri: selectedImage }
    : isEditStudent?.url
    ? { uri: `${API_ROUTES.BASE_URL}/${isEditStudent.url}` }
    : require("../../../assets/images/Pimg.jpeg");

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <UploadMedia
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectImage={HandleSelectImage}
      />

      <View style={styles.headerview}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <AntDesign size={30} color="white" name="arrowleft" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}></Text>
        {isEditStudent ? (
          <TouchableOpacity onPress={() => setModalShow(true)}>
            <Icons
              name={"delete"}
              family={"MaterialIcons"}
              size={25}
              color={colors.red}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {isEditStudent ? (
        <View
          style={{ backgroundColor: colors.primary, alignItems: "flex-end" }}
        >
          <Modal
            transparent={true}
            animationType="fade"
            visible={isModalVisible}
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableOpacity
              style={styles.modalBackground}
              onPress={() => setIsModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.modalButton}>
                  <Text style={styles.modalText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </Modal>
        </View>
      ) : null}
      <View
        style={{
          backgroundColor: colors.buttonColor,
          width: getWidth(100),
          height: getHeight(15),
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
        }}
      >
        <View style={{ alignSelf: "center" }}>
          <ImageModal
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              alignSelf: "center",
            }}
            resizeMode={"cover"}
            modalImageResizeMode="contain"
            source={source}
          />
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            position: "absolute",
            justifyContent: "flex-end",
            alignItems: "flex-end",
            bottom: 50,
            height: 20,
            width: 20,
            right: 160,
            backgroundColor: "white",
            borderBottomRightRadius: 40,
          }}
        >
          <MaterialIcons name={"edit"} size={20} color={"#182d4a"} />
        </TouchableOpacity>
      </View>
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
              placeholder="First Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={firstName}
              onChangeText={(text) => setFirstName(text)}
            />
            {errors.firstName ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.firstName}
              </Text>
            ) : null}
            <TextInput
              placeholder="Last Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={lastName}
              onChangeText={(text) => setLastName(text)}
            />
            {errors.lastName ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.lastName}
              </Text>
            ) : null}
            <View style={styles.passInput}>
              <DatePicker
                modal
                open={open}
                mode="date"
                date={dateOfBirth ? new Date(dateOfBirth) : new Date()}
                onConfirm={handleConfirm}
                onCancel={() => setOpen(false)}
              />
              <TextInput
                mode="outlined"
                placeholder="Date of Birth"
                editable={false}
                value={
                  dateOfBirth
                    ? dateOfBirth.toLocaleDateString()
                    : "Date of Birth"
                }
                theme={{ roundness: 5 }}
                onPressIn={() => setOpen(true)}
              />
              <TouchableOpacity>
                <Icons
                  family="AntDesign"
                  name={"calendar"}
                  fontFamily={"AntDesign"}
                  size={25}
                  color="#929292"
                  onPress={() => setOpen(true)}
                />
              </TouchableOpacity>
            </View>
            {errors.dateOfBirth ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.dateOfBirth}
              </Text>
            ) : null}
            <TextInput
              placeholder="Observations"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={observation}
              onChangeText={(text) => setObservation(text)}
            />
            {errors.observation ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.observation}
              </Text>
            ) : null}
            <TextInput
              placeholder="Adress"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
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
              Allergies
            </Text>
            <TextInput
              placeholder="Allergy 1"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={allergy1}
              onChangeText={(text) => setAllergy1(text)}
            />
            <TextInput
              placeholder="Allergy 2"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={allergy2}
              onChangeText={(text) => setAllergy2(text)}
            />
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
              Child code
            </Text>
            <TextInput
              value={isEditStudent?.studentCode}
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              editable={false}
            />
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
              School career
            </Text>
            <SelectDropdown
              defaultValue={selectedCareer ? selectedCareer.label : null}
              data={
                getSchoolCareer.length > 0
                  ? getSchoolCareer
                  : [{ label: "Career is not found", value: null }]
              }
              defaultButtonText="School Career"
              onSelect={(selectedItem) => {
                setSelectedCareer(selectedItem);
              }}
              buttonStyle={{
                width: "100%",
                backgroundColor: "white",
                borderWidth: 0.2,
                borderColor: colors?.black,
                height: getHeight(5),
                alignSelf: "center",
                marginTop: getHeight(2),
                borderRadius: 5,
              }}
              buttonTextStyle={{
                color: colors?.black,
                fontSize: 14,
                fontFamily: Fonts.PoppinsMedium,
              }}
              renderDropdownIcon={(isOpened) => (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={colors?.black}
                  size={getFontSize(1.8)}
                  style={{ marginRight: 12 }}
                />
              )}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: "white",
                borderRadius: 5,
                marginTop: -40,
              }}
              rowStyle={{
                backgroundColor: "white",
                borderBottomColor: colors?.primary,
              }}
              rowTextStyle={{
                color: "black",
                fontSize: getFontSize(2),
                textAlign: "left",
              }}
              renderCustomizedRowChild={(item) => (
                <View>
                  <Text
                    style={{
                      color: "black",
                      fontSize: getFontSize(2),
                      textAlign: "left",
                      paddingLeft: getFontSize(1),
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              )}
              renderCustomizedButtonChild={(selectedItem) => {
                return (
                  <View>
                    <Text
                      style={{
                        color: colors?.black,
                        fontSize: 14,
                        fontFamily: Fonts.PoppinsMedium,
                      }}
                    >
                      {(selectedItem && selectedItem.label) || "School Career"}
                    </Text>
                  </View>
                );
              }}
            />
            {errors.selectedCareer ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.selectedCareer}
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
              Level
            </Text>

            <SelectDropdown
              defaultValue={selectedLevel ? selectedLevel.label : null}
              data={
                getAllLevel.length > 0
                  ? getAllLevel
                  : [{ label: "Level is not found", value: null }]
              }
              defaultButtonText="Level"
              onSelect={(selectedItem) => {
                setSelectedLevel(selectedItem);
              }}
              buttonStyle={{
                width: "100%",
                backgroundColor: "white",
                borderWidth: 0.2,
                borderColor: colors?.black,
                height: getHeight(5),
                alignSelf: "center",
                marginTop: getHeight(2),
                borderRadius: 5,
              }}
              buttonTextStyle={{
                color: colors?.black,
                fontSize: 14,
                fontFamily: Fonts.PoppinsMedium,
              }}
              renderDropdownIcon={(isOpened) => (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={colors?.black}
                  size={getFontSize(1.8)}
                  style={{ marginRight: 12 }}
                />
              )}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: "white",
                borderRadius: 5,
                marginTop: -40,
              }}
              rowStyle={{
                backgroundColor: "white",
                borderBottomColor: colors?.primary,
              }}
              rowTextStyle={{
                color: "black",
                fontSize: getFontSize(2),
                textAlign: "left",
              }}
              renderCustomizedRowChild={(item) => (
                <View>
                  <Text
                    style={{
                      color: "black",
                      fontSize: getFontSize(2),
                      textAlign: "left",
                      paddingLeft: getFontSize(1),
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              )}
              renderCustomizedButtonChild={(selectedItem) => {
                return (
                  <View>
                    <Text
                      style={{
                        color: colors?.black,
                        fontSize: 14,
                        fontFamily: Fonts.PoppinsMedium,
                      }}
                    >
                      {(selectedItem && selectedItem.label) || "Level"}
                    </Text>
                  </View>
                );
              }}
            />
            {errors.selectedLevel ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.selectedLevel}
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
              Classes
            </Text>

            <SelectDropdown
              defaultValue={selectedClassroom ? selectedClassroom.label : null}
              data={
                getClassroom.length > 0
                  ? getClassroom
                  : [{ label: "Classroom is not found", value: null }]
              }
              defaultButtonText="Classroom"
              onSelect={(selectedItem) => {
                setSelectedClassroom(selectedItem);
              }}
              buttonStyle={{
                width: "100%",
                backgroundColor: "white",
                borderWidth: 0.2,
                borderColor: colors?.black,
                height: getHeight(5),
                alignSelf: "center",
                marginTop: getHeight(2),
                borderRadius: 5,
              }}
              buttonTextStyle={{
                color: colors?.black,
                fontSize: 14,
                fontFamily: Fonts.PoppinsMedium,
              }}
              renderDropdownIcon={(isOpened) => (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={colors?.black}
                  size={getFontSize(1.8)}
                  style={{ marginRight: 12 }}
                />
              )}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: "white",
                borderRadius: 5,
                marginTop: -40,
              }}
              rowStyle={{
                backgroundColor: "white",
                borderBottomColor: colors?.primary,
              }}
              rowTextStyle={{
                color: "black",
                fontSize: getFontSize(2),
                textAlign: "left",
              }}
              renderCustomizedRowChild={(item) => (
                <View>
                  <Text
                    style={{
                      color: "black",
                      fontSize: getFontSize(2),
                      textAlign: "left",
                      paddingLeft: getFontSize(1),
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              )}
              renderCustomizedButtonChild={(selectedItem) => {
                return (
                  <View>
                    <Text
                      style={{
                        color: colors?.black,
                        fontSize: 14,
                        fontFamily: Fonts.PoppinsMedium,
                      }}
                    >
                      {(selectedItem && selectedItem.label) || "Classroom"}
                    </Text>
                  </View>
                );
              }}
            />
            {errors.selectedClassroom ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.selectedClassroom}
              </Text>
            ) : null}
          </View>
          <View>
            {errors.selectedGroup ? (
              <Text style={{ color: colors.red, paddingTop: 5 }}>
                {errors.selectedGroup}
              </Text>
            ) : null}
          </View>
          {role === "Admin" ? (
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
                Parents
              </Text>

              <SelectDropdown
                defaultValue={selectedParent ? selectedParent.label : null}
                data={
                  getAllParents.length > 0
                    ? getAllParents
                    : [{ label: "Parent is not found", value: null }]
                }
                defaultButtonText="Parent"
                onSelect={(selectedItem) => {
                  setSelectedParent(selectedItem);
                }}
                buttonStyle={{
                  width: "100%",
                  backgroundColor: "white",
                  borderWidth: 0.2,
                  borderColor: colors?.black,
                  height: getHeight(5),
                  alignSelf: "center",
                  marginTop: getHeight(2),
                  borderRadius: 5,
                }}
                buttonTextStyle={{
                  color: colors?.black,
                  fontSize: 14,
                  fontFamily: Fonts.PoppinsMedium,
                }}
                renderDropdownIcon={(isOpened) => (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={colors?.black}
                    size={getFontSize(1.8)}
                    style={{ marginRight: 12 }}
                  />
                )}
                dropdownIconPosition={"right"}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{
                  backgroundColor: "white",
                  borderRadius: 5,
                  marginTop: -40,
                }}
                rowStyle={{
                  backgroundColor: "white",
                  borderBottomColor: colors?.primary,
                }}
                rowTextStyle={{
                  color: "black",
                  fontSize: getFontSize(2),
                  textAlign: "left",
                }}
                renderCustomizedRowChild={(item) => (
                  <View>
                    <Text
                      style={{
                        color: "black",
                        fontSize: getFontSize(2),
                        textAlign: "left",
                        paddingLeft: getFontSize(1),
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                )}
                renderCustomizedButtonChild={(selectedItem) => {
                  return (
                    <View>
                      <Text
                        style={{
                          color: colors?.black,
                          fontSize: 14,
                          fontFamily: Fonts.PoppinsMedium,
                        }}
                      >
                        {(selectedItem && selectedItem.label) || "Parent"}
                      </Text>
                    </View>
                  );
                }}
              />
              {errors.selectedParent ? (
                <Text style={{ color: colors.red, paddingTop: 5 }}>
                  {errors.selectedParent}
                </Text>
              ) : null}
            </View>
          ) : null}
        </View>
        <Button
          onPress={isEditStudent ? handleUpdateStudent : handleButtonPress}
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            marginTop: getHeight(3),
          }}
          btnTextStyle={GernalStyle.btnText}
          text={isEditStudent ? "Edit Student" : "Save"}
          Loading={isEditStudent ? isUpdateLoading : handleLoading()}
        />

        <View style={{ height: getHeight(10) }} />
      </ScrollView>
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"Are you sure you want to delete this student?"}
        title={"Delete Student"}
        onPress={handleDeleteStudent}
        loading={isLoading}
      />
    </View>
  );
};
export default StudentProfile;
