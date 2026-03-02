import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
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
  useGetLevelQuery,
  useGetRoomsQuery,
  useGetSchoolCareerQuery,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";

const Student = ({ navigation, route }) => {
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [getClassroom, setGetClassroom] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [getAllLevel, setGetAllLevel] = useState([]);
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const { data: levels } = useGetLevelQuery(selectedCareer?.value);
  const { data: classrooms, refetch: isClassroomFetch } = useGetRoomsQuery(
    selectedLevel?.value
  );

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
    if (selectedLevel) {
      setGetClassroom([]); // Clear previous classroom data
      isClassroomFetch(); // Fetch new classrooms
    }
  }, [selectedLevel]);

  useEffect(() => {
    if (selectedLevel) {
      // Refetch classrooms for the selected level
      isClassroomFetch()
        .then((response) => {
          if (response.data?.data) {
            const classroomData = response.data.data.map((item) => ({
              label: item.name,
              value: item._id,
            }));
            setGetClassroom(classroomData);
          } else {
            setGetClassroom([]); // If no data, set an empty array
          }
        })
        .catch((error) => {
          console.log("Error fetching classrooms:", error);
          setGetClassroom([]); // Clear classrooms on error
        });
    } else {
      setGetClassroom([]); // Clear classrooms if no level is selected
    }
  }, [selectedLevel]);
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
        title={"Students"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <View style={{ width: getWidth(90), alignSelf: "center" }}>
        <Button
          text={"Add a Student"}
          onPress={() => navigation.navigate("StudentProfile")}
          btnTextStyle={{ color: "white", fontSize: 14 }}
          btnStyle={{
            ...GernalStyle.btn,
            alignSelf: "center",
            flexDirection: "row",
            backgroundColor: colors.primary,
            width: getWidth(40),
            height: getHeight(4),
            marginTop: getHeight(8),
          }}
        />

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
            isClassroomFetch();
          }}
          buttonStyle={{
            width: getWidth(43),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: getHeight(15),
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
            isClassroomFetch;
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
                  {(selectedItem && selectedItem.label) || "Classrooms"}
                </Text>
              </View>
            );
          }}
        />
        <Button
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            flexDirection: "row",
            width: getWidth(32),
            height: getHeight(5),
            marginTop: getHeight(15),
          }}
          btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
          text={"Next"}
          onPress={() => {
            if (!selectedClassroom || !selectedClassroom.label) {
              showToast("error", "Please Select Your Class First");
            } else {
              navigation.navigate("AllStudent", {
                isClass: true,
                classroomData: selectedClassroom,
              });
            }
          }}
        />
      </View>
    </View>
  );
};
export default Student;
