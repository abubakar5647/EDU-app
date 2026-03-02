import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Header from "../../Components/Header";
import SelectDropdown from "react-native-select-dropdown";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { Fonts } from "../../assets/fonts";
import Entypo from "react-native-vector-icons/Entypo";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import CustomText from "../../Components/CustomText";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import {
  useGetAllGradeQuery,
  useGetAllSubjectQuery,
  useGetCareerQuery,
  useGetLevelQuery,
  useGetRoomsQuery,
  useGetSubjectByRoomIdQuery,
} from "../../rtkQuery/slices/home";
import { showToast } from "../../Components/Toaster";

const AddGrade = ({ navigation, route }) => {
  const { seeGrade, isEdit } = route?.params || {};
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [getAllLevel, setGetAllLevel] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [getClassroom, setGetClassroom] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const { data: schoolCareer } = useGetCareerQuery();
  const { data: levelData } = useGetLevelQuery(selectedCareer?.value);
  const { data: rooms, refetch: isClassroomFetch } = useGetRoomsQuery(
    selectedLevel?.value
  );
  const { data: subjects } = useGetSubjectByRoomIdQuery(selectedCareer?.value);

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

  useEffect(() => {
    if (levelData?.data) {
      const schoolLevelData = levelData.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      // console.log("schoolLevels=========>>>", schoolLevelData);
      setGetAllLevel(schoolLevelData);
    }
  }, [levelData]);

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

  const handleDemo = (selectedItem) => {
    const selectedItemData = subjects?.data?.find(
      (item) => item.title === selectedItem
    );
    if (selectedItemData) {
      setSelectedSubject({
        id: selectedItemData._id,
        label: selectedItemData.title,
      });
    }
  };
  // console.log("selectedSubjectselectedSubject", selectedSubject);

  const currentYear = new Date().getFullYear();

  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) =>
    (2000 + index).toString()
  );

  const handleNavigate = () => {
    if (seeGrade) {
      if (!selectedClassroom || !selectedSubject || !selectedDate) {
        showToast("error", "Please Fill All Fields");
        return;
      }

      navigation.navigate("SeeGradesView", {
        classRoom: selectedClassroom,
        subject: selectedSubject,
        selectedDate: selectedDate,
      });
    } else {
      if (!selectedClassroom || !selectedSubject || !date) {
        showToast("error", "Please Fill All Fields");
        return;
      }

      navigation.navigate("AddGradesScreen", {
        subject: selectedSubject,
        Date: date,
        classRoom: selectedClassroom,
      });
    }
  };
  const { data: allGrades, refetch } = useGetAllGradeQuery();
  // console.log("allGrades", allGrades?.data[0]?.grades);

  const gradeMonthsMap = allGrades?.data[0]?.grades?.reduce((acc, item) => {
    const monthName = moment(item.date).format("MMMM");
    const monthDate = moment(item.date).format("YYYY-MM");
    acc[monthName] = monthDate;
    return acc;
  }, {});

  const uniqueMonths = [...new Set(Object.keys(gradeMonthsMap || {}))];

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <>
      <View style={styles?.parent}>
        <GeneralStatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={colors.primary}
          translucent={true}
        />
        <Header
          RightIcon={<View />}
          backgroundColor={colors.primary}
          title={"Grades"}
          LeftIcon={
            <AntDesign
              size={30}
              color={"white"}
              onPress={() => navigation.goBack()}
              name="arrowleft"
            />
          }
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
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: getHeight(5),
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
            marginTop: -30,
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
                    textAlign: "center",
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
            width: getWidth(48),
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
            marginTop: -30,
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
                    textAlign: "center",
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
            width: getWidth(48),
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
            marginTop: -30,
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
                    textAlign: "center",
                  }}
                >
                  {(selectedItem && selectedItem.label) || "Classrooms"}
                </Text>
              </View>
            );
          }}
        />
        <SelectDropdown
          defaultValue={"Subject"}
          data={
            subjects?.data && subjects?.data.length > 0
              ? subjects?.data?.map((item) => item.title)
              : ["No Data"]
          }
          onSelect={(selectedItem) => handleDemo(selectedItem)}
          defaultButtonText="Subject"
          buttonStyle={{
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            borderRadius: 5,
            marginTop: getHeight(3),
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <Entypo
                name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                color={colors?.primary}
                size={getFontSize(1.8)}
                style={{ marginRight: 12 }}
              />
            );
          }}
          dropdownIconPosition={"right"}
          showsVerticalScrollIndicator={false}
          dropdownStyle={{
            backgroundColor: "white",
            marginTop: -30,
            borderRadius: 5,
          }}
          rowStyle={{
            backgroundColor: "white",
            borderBottomColor: "rgba(0, 0, 0, 0.1)",
          }}
          rowTextStyle={{
            color: "black",
            fontSize: getFontSize(2),
            textAlign: "center",
            paddingLeft: getFontSize(1),
            fontFamily: "Poppins-Bold",
          }}
        />
        {seeGrade ? (
          <>
            <View>
              <SelectDropdown
                defaultValue={"Select Month"}
                data={uniqueMonths.length > 0 ? uniqueMonths : ["No Month"]}
                onSelect={(selectedItem) => {
                  const formattedDate = gradeMonthsMap[selectedItem]; // Get YYYY-MM
                  setSelectedDate(formattedDate);
                  console.log(
                    "Selected Month:",
                    selectedItem,
                    "Formatted Date:",
                    formattedDate
                  );
                }}
                defaultButtonText="Select Month"
                buttonStyle={{
                  width: getWidth(48),
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors?.primary,
                  height: getHeight(5),
                  borderRadius: 5,
                  alignSelf: "center",
                  marginTop: getHeight(3),
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
                  marginTop: -30,
                  borderRadius: 5,
                }}
                rowStyle={{
                  backgroundColor: "white",
                  borderBottomColor: "rgba(0, 0, 0, 0.1)",
                }}
                rowTextStyle={{
                  color: "black",
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Pooppins-bold",
                }}
              />
            </View>
          </>
        ) : (
          <TouchableOpacity
            style={styles.calendarContainer}
            onPress={() => setOpen(true)}
          >
            <CustomText
              label={moment(date).format("DD/MM/YYYY")}
              fontSize={14}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}

        <View style={{ marginTop: 50 }}>
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
            }}
            btnTextStyle={GernalStyle.btnText}
            text={
              seeGrade ? "See grades" : isEdit ? "Edit grades" : "Add grades"
            }
            onPress={handleNavigate}
          />
        </View>
      </View>
      {open && (
        <DatePicker
          modal
          open={open}
          mode="date"
          date={date}
          onConfirm={(date) => {
            setOpen(false);
            setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

export default AddGrade;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "white",
  },
  calendarContainer: {
    borderWidth: 1,
    width: "49%",
    height: getHeight(5),
    justifyContent: "center",
    borderColor: colors.primary,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
    borderRadius: 5,
  },
});
