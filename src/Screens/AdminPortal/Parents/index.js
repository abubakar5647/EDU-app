import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
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
import { Fonts } from "../../../assets/fonts";
import CustomText from "../../../Components/CustomText";
import SelectDropdown from "react-native-select-dropdown";
import {
  useGetLevelQuery,
  useGetRoomsQuery,
  useGetSchoolCareerQuery,
  useGetStudentsQuery,
} from "../../../rtkQuery/slices/home";
import { useGetParentQuery } from "../../../rtkQuery/slices/home";
import { retry } from "redux-saga/effects";
import { showToast } from "../../../Components/Toaster";

const Parents = ({ navigation, route }) => {
  const isFirstParentScreen = route?.params;
  const { data, isLoading } = useGetStudentsQuery();
  // console.log("datadatadata",data)
  const [text, setText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isFirstParent, setIsFirstParent] = useState(isFirstParentScreen);
  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [getClassroom, setGetClassroom] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [getSchoolCareer, setGetSchoolCareer] = useState([]);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [getAllLevel, setGetAllLevel] = useState([]);
  const { data: rooms, refetch: isClassroomFetch } = useGetRoomsQuery(
    selectedLevel?.value
  );
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const { data: levels } = useGetLevelQuery(selectedCareer?.value);
  const { data: parents, refetch: fetchParent } = useGetParentQuery();
  const [searchText, setSearchText] = useState("");
  const [filteredParents, setFilteredParents] = useState([]);

  const parent = parents?.data?.map((text) => text);

  useEffect(() => {
    fetchParent();
  }, []);
  // Filter parents based on search text
  useEffect(() => {
    if (parents?.data) {
      if (!searchText.trim()) {
        setFilteredParents(parents.data);
      } else {
        const filtered = parents.data.filter((parent) => {
          const fullName =
            `${parent?.userId?.firstName} ${parent?.userId?.lastName}`.toLowerCase();
          return fullName.includes(searchText.toLowerCase());
        });
        setFilteredParents(filtered);
      }
    }
  }, [searchText, parents]);

  const handleShowParents = ({ item }) => {
    return (
      <>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddParent", {
              item: item,
            })
          }
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            marginTop: getHeight(1.2),
            padding: 5,
            borderBottomColor: "#EAEAEA",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_Bold",
              color: "#47424F",
            }}
          >
            {`${item?.userId?.firstName || "No"} ${
              item?.userId?.lastName || "Name"
            }`}
          </Text>
          <View
            style={{
              backgroundColor: "#D7FFDB",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 30,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: "red",
              }}
            >
              {item?.userId?.role}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  // Get School Career API
  useEffect(() => {
    if (schoolCareer?.data) {
      const schoolCareerData = schoolCareer.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
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
      setGetAllLevel(schoolLevelData);
    }
  }, [levels]);

  useEffect(() => {
    if (selectedLevel) {
      setGetClassroom([]);
      isClassroomFetch();
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

  // Student Filter

  const filterData = (searchText) => {
    if (!searchText) {
      setFilteredData(data?.data || []);
    } else {
      const filtered = data?.data.filter((item) =>
        `${item.firstName} ${item.lastName}`
          .toLowerCase()
          .includes(searchText.toLowerCase())
      );
      setFilteredData(filtered);
    }
  };

  // Whenever data or text changes, apply the filter
  useEffect(() => {
    if (data?.data) {
      filterData(text);
    }
  }, [text, data?.data]);

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
        title={"Parents"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => {
              if (isFirstParent) {
                navigation.goBack();
              } else {
                setIsFirstParent(true);
              }
            }}
            name="arrowleft"
          />
        }
      />
      {isFirstParent ? (
        <View style={styles.centerView}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddParent", {
                seeParent: false,
              })
            }
            style={styles.btn}
          >
            <CustomText
              label={"Add a parent"}
              fontSize={14}
              fontFamily={Fonts.PoppinsMedium}
              color={colors.white}
            />
          </TouchableOpacity>
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
              marginTop: getHeight(7),
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
            defaultButtonText="Classrooms"
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
          <View style={styles.nextContainer}>
            <TouchableOpacity
              style={styles.nextBtn}
              onPress={() => {
                if (!selectedClassroom?.value) {
                  showToast(
                    "error",
                    "Please select a classroom before proceeding!"
                  );
                  return;
                }
                setIsFirstParent(false);
              }}
            >
              <CustomText
                label={"Next"}
                fontSize={14}
                fontFamily={Fonts.PoppinsMedium}
                color={colors.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={{ width: getWidth(90), alignSelf: "center" }}>
          <Button
            text={selectedClassroom?.label}
            btnTextStyle={{ color: "white", fontSize: 14 }}
            btnStyle={{
              ...GernalStyle.btn,
              alignSelf: "center",
              flexDirection: "row",
              backgroundColor: colors.primary,
              width: getWidth(40),
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
          />
          <TextInput
            style={[
              GernalStyle.newInputStyle,
              {
                borderWidth: 1,
                borderColor: colors.placeholderTextColor,
                borderRadius: 5,
                height: 38,
                paddingTop: 2,
                marginTop: 15,
              },
            ]}
            placeholder="Search Parent"
            returnKeyType="next"
            keyboardType="default"
            blurOnSubmit={false}
            value={searchText}
            onChangeText={setSearchText}
          />
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              fontWeight: "700",
              color: "#47424F",
              marginTop: getHeight(3),
              marginBottom: getHeight(1),
            }}
          >
            All Parents
          </Text>
          {parents && (
            <>
              <FlatList
                data={filteredParents}
                renderItem={handleShowParents}
                keyExtractor={(item) => item?._id}
                contentContainerStyle={{ paddingBottom: 400 }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text style={{ textAlign: "center", marginTop: 20 }}>
                    No parents found
                  </Text>
                )}
              />
            </>
          )}
          {!isLoading && filteredData?.length > 0 ? (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottomWidth: 1,
                    paddingVertical: 10,
                    borderBottomColor: "#EAEAEA",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: "Poppins_Bold",
                      fontWeight: "500",
                      color: "#47424F",
                    }}
                  >
                    {item.firstName} {item.lastName}
                  </Text>

                  {item._id === item.parentId ? (
                    <TouchableOpacity
                      style={{
                        backgroundColor: "#fff5d1",
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 80,
                        height: 30,
                      }}
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate("AddParent", {
                          seeParent: true,
                        })
                      }
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Fonts.PoppinsBold,
                          color: "#FFC700",
                        }}
                      >
                        See Parent
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={{
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                        justifyContent: "center",
                        alignItems: "center",
                        width: 113,
                        height: 30,
                      }}
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate("AddParent")}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: Fonts.PoppinsBold,
                          color: "#FFF5D1",
                        }}
                      >
                        Add Parent
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            />
          ) : (
            <Text>No students found</Text>
          )}
        </View>
      )}
    </View>
  );
};
export default Parents;
