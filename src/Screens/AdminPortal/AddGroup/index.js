import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import SelectDropdown from "react-native-select-dropdown";
import { Fonts } from "../../../assets/fonts";
import Entypo from "react-native-vector-icons/Entypo";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import Button from "../../../Components/Button";
import { GernalStyle } from "../../../constants/GernalStyle";
import {
  useCreateGroupMutation,
  useGetLevelQuery,
  useGetRoomsQuery,
  useGetSchoolCareerQuery,
  useUpdateGroupMutation,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";
const AddGroup = ({ navigation, route }) => {
  const { title, isEdit, selectedGroup } = route.params || {};
  // console.log("selectedGroup=========>>>>", selectedGroup);

  const [name, setName] = useState("");
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [getClassroom, setGetClassroom] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [getAllLevel, setGetAllLevel] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    selectedClassroom: null,
  });
  const { data, refetch: isClassroomFetch } = useGetRoomsQuery(
    selectedLevel?.value
  );
  const { data: schoolCareer } = useGetSchoolCareerQuery();
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

  const validateInput = () => {
    const newErrors = {
      name: "",
      selectedClassroom: null,
    };

    if (!name.trim()) {
      newErrors.name = "Group Name is required.";
    }
    if (!selectedClassroom) {
      newErrors.selectedClassroom = "Classroom is Required.";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.selectedClassroom;
  };

  useEffect(() => {
    if (selectedGroup) {
      setName(selectedGroup?.name);
    }
  }, [selectedGroup]);
  // Create Group Api
  const [createGroup, { isLoading: isCreatingLoading }] =
    useCreateGroupMutation();

  const [updateGroup, { isLoading: isUpdateLoading }] =
    useUpdateGroupMutation();
  const handleGroupCreateOrUpdate = async () => {
    const isValid = validateInput();

    if (isValid) {
      const payload = {
        name,
        roomId: selectedClassroom?.value,
      };

      try {
        let response;
        if (selectedGroup?._id) {
          response = await updateGroup({
            groupId: selectedGroup?._id,
            payload,
          });
        } else {
          response = await createGroup(payload);
        }

        if (response.error) {
          showToast("error", response?.error?.data?.message);
        } else {
          showToast("success", response?.data?.message);
          navigation.goBack();
          setName("");
        }
      } catch (error) {
        console.log("Error creating or updating group", error);
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
        title={selectedGroup?._id ? "Update Group" : title}
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
            setSelectedClassroom(selectedItem); // Store selected item for Classroom
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
                  {(selectedItem && selectedItem.label) || "Classroom"}
                </Text>
              </View>
            );
          }}
        />
        {errors.selectedClassroom ? (
          <Text style={{ color: colors.red, alignSelf: "center" }}>
            {errors.selectedClassroom}
          </Text>
        ) : null}
        <View
          style={{
            height: getHeight(42),

            paddingHorizontal: 20,
            justifyContent: "flex-end",
          }}
        >
          <TextInput
            placeholder={selectedGroup?._id ? "Rename Group" : "Group Name"}
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
              onPress={handleGroupCreateOrUpdate}
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: colors.primary,
                flexDirection: "row",
                width: getWidth(42),
                height: getHeight(5),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
              text={selectedGroup?._id ? "Edit" : "Create"}
              Loading={selectedGroup?._id ? isUpdateLoading : isCreatingLoading}
            />
          </View>

          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: "100%",
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
            btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
            text={"View All Groups"}
            onPress={() => navigation.navigate("AllGroups")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddGroup;

const styles = StyleSheet.create({
  contaner: { flex: 1, backgroundColor: "white" },
});
