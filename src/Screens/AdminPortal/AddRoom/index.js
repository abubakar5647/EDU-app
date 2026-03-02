import React, { useEffect, useRef, useState } from "react";
import { Text, View, ScrollView, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";

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
import { fonts } from "../../../constants/fonts";
import {
  useCreateRoomMutation,
  useGetLevelQuery,
  useGetSchoolCareerQuery,
  useUpdateRoomMutation,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";

const AddRoom = ({ navigation, route }) => {
  const { title, isEdit, classroomData } = route.params || {};
  // console.log("classroomData====>>>>>>>.", classroomData);
  const [name, setName] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [getAllLevel, setGetAllLevel] = useState([]);
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const [errors, setErrors] = useState({
    name: "",
    selectedCareer: null,
    selectedLevel: null,
  });
  const { data: levels } = useGetLevelQuery(selectedCareer?.value);
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

  useEffect(() => {
    if (isEdit && classroomData) {
      setName(classroomData?.label);
      setSelectedCareer({
        value: classroomData?.careerId,
        label: classroomData?.careerName,
      });
      setSelectedLevel({
        value: classroomData?.levelId,
        label: classroomData?.levelName,
      }); // Update level if available
    }
  }, [isEdit, classroomData]);

  const validation = () => {
    const newErrors = {
      name: "",
      selectedCareer: null,
      selectedLevel: null,
    };

    if (!name.trim()) {
      newErrors.name = "Classroom Name is required.";
    }
    if (!selectedCareer) {
      newErrors.selectedCareer = "Please select a Career.";
    }
    if (!selectedLevel) {
      newErrors.selectedLevel = "Please select a Level.";
    }

    setErrors(newErrors);
    // Return true if there are no errors
    return (
      !newErrors.name && !newErrors.selectedCareer && !newErrors.selectedLevel
    );
  };

  const [createRoom, { isLoading: creatingLoader }] = useCreateRoomMutation();
  const [updateRoom, { isLoading: updatingLoader }] = useUpdateRoomMutation();

  console.log("selectedCareer?.value", selectedCareer?.value);
  console.log("selectedLevel?.value", selectedLevel?.value);
  const handleRoomCreateOrUpdate = async () => {
    // First validate inputs
    const isValid = validation();

    // Only proceed with API call if validation passes
    if (isValid) {
      const payload = {
        name,
        schoolCareer: selectedCareer?.value,
        level: selectedLevel?.value,
      };

      try {
        let response;
        if (isEdit) {
          response = await updateRoom({
            roomId: classroomData?.value,
            payload,
          });
        } else {
          response = await createRoom(payload);
        }

        if (response.error) {
          showToast("error", response?.error?.data?.message);
        } else {
          showToast("success", response?.data?.message);
          navigation.goBack();
        }
      } catch (error) {
        console.log("Error creating or updating room", error);
        showToast("error", "Something went wrong");
      }
    }
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
        RightIcon={<View />}
        title={title}
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
            width: getWidth(43),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: getHeight(10),
            borderRadius: 5,
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => (
            <Entypo
              name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
              color={colors?.primary}
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
                    color: colors?.primary,
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
        {errors.schoolCareer ? (
          <Text style={{ color: colors.red }}>{errors.schoolCareer}</Text>
        ) : null}
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
            width: getWidth(43),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: getHeight(3),
            borderRadius: 5,
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => (
            <Entypo
              name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
              color={colors?.primary}
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
                    color: colors?.primary,
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
          <Text style={{ color: colors.red, textAlign: "center" }}>
            {errors.selectedLevel}
          </Text>
        ) : null}

        {/* <View
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
              Add a room
            </Text>
            <TextInput
              mode="flat"
              label="Room name"
              theme={{ roundness: getFontSize(1) }}
              outlineColor="#47424F"
              cursorColor="#47424F"
              textColor="#47424F"
              activeUnderlineColor="#D8DADC"
              activeOutlineColor="#47424F"
              style={GernalStyle.input}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
          </View>
        </View> */}
        <View
          style={{
            height: getHeight(50),

            paddingHorizontal: 20,
            justifyContent: "flex-end",
          }}
        >
          <TextInput
            placeholder={isEdit ? "Rename Classroom" : "Class Name"}
            theme={{ roundness: getFontSize(1) }}
            style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
            returnKeyType={"next"}
            keyboardType="default"
            blurOnSubmit={false}
            value={name}
            onChangeText={(text) => setName(text)}
          />
          {errors.name ? (
            <Text style={{ color: colors.red, marginBottom: 5 }}>
              {errors.name}
            </Text>
          ) : null}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Button
              onPress={() => navigation.goBack()}
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
              onPress={handleRoomCreateOrUpdate}
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: colors.primary,
                flexDirection: "row",
                width: getWidth(42),
                height: getHeight(5),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{ ...GernalStyle.btnText, fontSize: 14 }}
              text={isEdit ? "Save" : "Create"}
              Loading={isEdit ? updatingLoader : creatingLoader}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
export default AddRoom;
