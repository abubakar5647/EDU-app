import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState, useEffect } from "react";
import Header from "../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import SelectDropdown from "react-native-select-dropdown";
import { Fonts } from "../../assets/fonts";
import Entypo from "react-native-vector-icons/Entypo";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
// import {
//   useCreateGroupMutation,
//   useGetLevelQuery,
//   useGetRoomsQuery,
//   useGetSchoolCareerQuery,
// } from "../../../rtkQuery/slices/home";
import { showToast } from "../../Components/Toaster";
import {
  useGetSchoolCareerQuery,
  useCreateGroupMutation,
  useGetLevelQuery,
  useGetRoomsQuery,
  useCreateSubjectMutation,
  useUpdateSubjectMutation,
} from "../../rtkQuery/slices/home";
const AddSubject = ({ navigation, route }) => {
  const { title, isEdit, subjectData } = route.params || {};
  console.log("itemitemitem", subjectData);
  const [name, setName] = useState("");
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [errors, setErrors] = useState({
    name: "",
    selectedCareer: "",
  });
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const [createSubject, { isLoading: createLoading }] =
    useCreateSubjectMutation();
  const [updateSubject, { isLoading: updateLoading }] =
    useUpdateSubjectMutation();

  const HandleCreateSubject = async () => {
    const payload = {
      title: name,
      schoolCareer: selectedCareer?.value,
    };
    try {
      const res = await createSubject(payload);
      if (res?.data?.message === "Subject created successfully") {
        showToast("success", res?.data?.message);
        setName("");
        navigation.goBack();
      } else {
        showToast("error", res?.error?.data?.message);
      }
    } catch (error) {
      console.log("subject error", error);
    }
  };

  useEffect(() => {
    if (schoolCareer?.data) {
      const schoolCareerData = schoolCareer.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      setGetSchoolCareer(schoolCareerData);
    }
  }, [schoolCareer]);

  const validateInput = () => {
    const newErrors = {
      name: "",
      selectedCareer: "",
    };

    if (!name.trim()) {
      newErrors.name = "Subject Name is required.";
    }
    if (!selectedCareer?.value) {
      newErrors.selectedCareer = "Please select a Career.";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((error) => error === "");
  };

  useEffect(() => {
    if (subjectData) {
      setName(subjectData.title);
    }
  }, [subjectData]);

  const handleSubmit = async () => {
    if (validateInput()) {
      const payload = {
        title: name,
        schoolCareer: selectedCareer?.value,
      };

      try {
        let response;
        if (subjectData?._id) {
          response = await updateSubject({
            subjectId: subjectData?._id,
            payload,
          });
        } else {
          response = await createSubject(payload);
        }

        if (response.error) {
          showToast("error", response?.error?.data?.message);
        } else {
          showToast("success", response?.data?.message);
          navigation.goBack();
        }
      } catch (error) {
        console.log("Error:", error);
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
        title={subjectData?._id ? "Update Subject" : title}
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
        {errors.selectedCareer ? (
          <Text
            style={{
              color: colors.red,
              alignSelf: "center",
              marginTop: 5,
              fontFamily: Fonts.PoppinsRegular,
            }}
          >
            {errors.selectedCareer}
          </Text>
        ) : null}

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
            placeholder={subjectData?._id ? "Rename Subject" : "Add Subject"}
            theme={{ roundness: getFontSize(1) }}
            style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
            returnKeyType={"next"}
            keyboardType="default"
            blurOnSubmit={false}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors((prev) => ({ ...prev, name: "" }));
              }
            }}
          />
          {errors.name ? (
            <Text
              style={{
                color: colors.red,
                marginBottom: 5,
                fontFamily: Fonts.PoppinsRegular,
              }}
            >
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
                fontSize: 18,
                color: "#A6A6A6",
              }}
              text={"Cancel"}
            />
            <Button
              onPress={handleSubmit}
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: colors.primary,
                flexDirection: "row",
                width: getWidth(42),
                height: getHeight(5),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
              text={subjectData?._id ? "Update" : "Create"}
              Loading={createLoading || updateLoading}
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
            text={"View All Subjects"}
            onPress={() => navigation.navigate("AllSubject")}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default AddSubject;

const styles = StyleSheet.create({
  contaner: { flex: 1, backgroundColor: "white" },
});
