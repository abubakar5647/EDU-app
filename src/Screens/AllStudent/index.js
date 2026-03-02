import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import NewHeader from "../../Components/NewHeader/NewHeader";
import SelectDropdown from "react-native-select-dropdown";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import Entypo from "react-native-vector-icons/Entypo";
import { Empty, classRoom, girl } from "../../assets/images";
import { Fonts } from "../../assets/fonts";
import RenderFlatlist from "../Room/molecule/RenderFlatlist";
import IconsRender from "../Room/molecule/IconsRender";
import { normalizeSize } from "../../../utils";
import {
  useDeleteClassroomMutation,
  useDeleteGroupMutation,
  useGetAllStudentsQuery,
  useGetGroupsQuery,
  useGetLevelQuery,
  useGetRoomsQuery,
  useGetRoomStudentQuery,
  useGetStudentByRoomIdQuery,
  useGetStudentsQuery,
  useUpdateRoomMutation,
} from "../../rtkQuery/slices/home";
import { ActivityIndicator } from "react-native-paper";
import { API_ROUTES } from "../../rtkQuery/routes";
import { showToast } from "../../Components/Toaster";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const AllStudent = ({ navigation, route }) => {
  const { classroomData } = route.params || {};
  console.log("classroomData", classroomData?.value);
  const [isFilterBtn, setIsFilterBtn] = useState(false);
  const [group, setGroup] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [getAllGroups, setGetAllGroups] = useState([]);
  const { data: groups } = useGetGroupsQuery(classroomData?.value);
  const { data, isLoading, refetch } = useGetStudentByRoomIdQuery({
    roomId: classroomData?.value,
    groupId: selectedGroup?.value,
  });

  // Delete Classroom

  const [deleteClassroom, { isLoading: roomLoading }] =
    useDeleteClassroomMutation();

  const handleClassroomDeleted = async () => {
    try {
      const response = await deleteClassroom({ roomId: classroomData?.value });
      console.log("response", response);
      if (response.error) {
        showToast("error", response.error.error);
        console.log("API error in Delete classroom:", response.error);
      } else {
        console.log("Classroom Deleted Successfully:", response);
        navigation.goBack();
        refetchRooms();
        refetchLevels();
        showToast("success", response.data.message);
      }
    } catch (error) {
      console.error("Failed to delete the student: ", error);
    }
  };

  useEffect(() => {
    if (groups?.data) {
      const groupData = groups.data.map((item) => ({
        label: item.name,
        value: item._id,
      }));
      setGetAllGroups(groupData);
    }
  }, [groups]);

  // console.log("studentdata==========>>>>",data)
  console.log("classroomData", classroomData?.value);
  const { data: allStudents, refetch: fetchStudent } = useGetRoomStudentQuery({
    id: classroomData?.value,
  });

  useEffect(() => {
    fetchStudent(); // Only fetch if classroomData.value is defined
  }, [allStudents]); // Dependency array ensures it runs only when classroomData changes

  console.log("allStudents====>>>>>>>>", allStudents);

  return (
    <View style={styles.container}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.PrimaryLight}
        translucent={true}
      />
      <NewHeader
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        title={
          group ? "Group" : route?.params?.isClass ? "Students" : "Classes"
        }
        isRightIcon={!route?.params?.isClass}
        setIsFilterBtn={setIsFilterBtn}
        isFilterBtn={isFilterBtn}
        group={group}
        onPress={() => navigation.goBack()}
        onDeletePress={handleClassroomDeleted}
        classroomData={classroomData}
        roomLoading={roomLoading}
      />
      <View style={{ paddingHorizontal: 25 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <View style={styles.subHeader}>
            <Text
              style={[
                styles.gradeText,
                selectedGroup,
                // { marginTop: selectedGroup ? normalizeSize(30) : 0 },
              ]}
            >
              {classroomData?.label}
            </Text>
            {/* {selectedGroup && (
              <View style={styles.subHeader}>
                <Text
                  style={[
                    styles.gradeText,
                    {
                      borderWidth: 0.5,
                      paddingHorizontal: normalizeSize(16),
                      paddingVertical: normalizeSize(6),
                      borderColor: colors.PrimaryLight,
                      borderWidth: 0.7,
                      borderRadius: 30,
                    },
                  ]}
                >
                  {selectedGroup}
                </Text>
              </View>
            )} */}
          </View>
          <View>
            {/* {!route?.params?.isClass && ( */}
            <View
              style={{
                alignSelf: "center",
                // marginTop: selectedGroup ? 0 : 10,
              }}
            >
              <SelectDropdown
                defaultValue={selectedGroup ? selectedGroup.label : null}
                data={
                  getAllGroups.length > 0
                    ? getAllGroups
                    : [{ label: "Not found", value: null }]
                }
                defaultButtonText="Groups"
                onSelect={(selectedItem) => {
                  setSelectedGroup(selectedItem);
                  refetch();
                }}
                buttonStyle={{
                  width: 120,
                  height: 40,
                  marginVertical: getHeight(1),
                  backgroundColor: "white",
                  elevation: 2,
                  borderRadius: 20,
                }}
                buttonTextStyle={{
                  color: "#000",
                  fontSize: getFontSize(2),
                }}
                renderDropdownIcon={(isOpened) => (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color="#000"
                    size={getFontSize(2)}
                  />
                )}
                dropdownIconPosition={"right"}
                showsVerticalScrollIndicator={false}
                dropdownStyle={{
                  backgroundColor: "#f0f0f0",
                  marginTop: -40,
                  width: 130,
                }}
                rowStyle={{
                  backgroundColor: "white",
                }}
                selectedRowTextStyle={{
                  color: "#000",
                }}
                rowTextStyle={{
                  color: "#000",
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                }}
                renderCustomizedRowChild={(item) => (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: "#000",
                        fontSize: getFontSize(2),
                        textAlign: "left",
                        paddingLeft: getFontSize(0.5),
                      }}
                    >
                      {item.label}
                    </Text>
                  </View>
                )}
                renderCustomizedButtonChild={(selectedItem) => (
                  <View>
                    <Text
                      style={{
                        color: "#000",
                        fontSize: 14,
                        fontFamily: "PoppinsMedium",
                      }}
                    >
                      {(selectedItem && selectedItem.label) || "Group"}
                    </Text>
                  </View>
                )}
              />
            </View>
            {/* )} */}
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: getHeight(2),
          }}
        >
          <Text
            style={[
              styles.allStudentsText,
              { marginTop: !route?.params?.isClass ? 0 : 50 },
            ]}
          >
            All students
          </Text>
        </View>
        <IconsRender />
      </View>

      <View style={{ flex: 1, paddingHorizontal: normalizeSize(20) }}>
        {/* <RenderFlatlist
          selectedId={selectedId}
          setSelectedId={setSelectedId}
          height={normalizeSize(135)}
          onPress={() => navigation.navigate("StudentProfile")}
        /> */}
        {isLoading ? (
          <View style={{ alignItems: "center" }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text>Loading...</Text>
          </View>
        ) : (
          <FlatList
            data={selectedGroup ? data?.data : allStudents?.data}
            renderItem={({ item }) => (
              <View style={styles.Main}>
                <View style={styles.itemContainer}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("StudentProfile", {
                        isEditStudent: item,
                      })
                    }
                    activeOpacity={0.5}
                  >
                    <Image
                      source={
                        item.url
                          ? { uri: `${API_ROUTES.BASE_URL}/${item.url}` }
                          : Empty
                      }
                      style={styles.Photo}
                    />
                  </TouchableOpacity>
                  <Text style={styles.itemText} numberOfLines={1}>
                    {item.firstName} {item.lastName}
                  </Text>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={{ alignItems: "center", marginTop: 20 }}>
                <Image
                  source={Empty}
                  style={{ height: 200, width: 250, borderRadius: 15 }}
                />
              </View>
            }
            numColumns={3}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: normalizeSize(10),
            }}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.primary,
  },
  backButton: {
    fontSize: 24,
    color: "#FFFFFF",
  },
  title: {
    fontSize: 20,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  subHeader: {
    paddingVertical: 10,
    width: 140,
    alignItems: "center",
    marginTop: 10,
  },
  gradeText: {
    fontSize: 18,
    color: colors.HeaderTextColor,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  groupsButton: {
    borderWidth: 1,
    borderColor: "#00BFC4",
    borderRadius: 5,
    // paddingHorizontal: 10,
    paddingVertical: 5,
  },
  groupsButtonText: {
    fontSize: 16,
    color: "#00BFC4",
  },
  allStudentsText: {
    fontSize: 21,
    fontFamily: Fonts.PoppinsSemiBold,
    color: colors.HeaderTextColor,
    marginBottom: 20,
    marginTop: 10,
  },
  studentList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  student: {
    alignItems: "center",
    margin: 10,
  },
  studentImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 5,
  },
  studentName: {
    fontSize: 14,
    color: colors.black,
    fontFamily: Fonts.PoppinsBold,
  },
  pagination: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-end",
    // paddingRight: 15,
  },
  paginationButton: {
    fontSize: 12,
    color: colors.black,
    paddingLeft: 10,
  },
  pageNumber: {
    fontSize: 12,
    color: colors.black,
    marginBottom: 5,
  },
  Main: {
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: 10,
    marginBottom: 15,
    marginRight: normalizeSize(12),
    borderWidth: 0.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "31%",
  },
  itemContainer: {
    alignItems: "center",
    alignSelf: "center",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#47424F",
    fontFamily: Fonts?.PoppinsRegular,
    marginTop: getHeight(0.7),
    marginBottom: 7,
    paddingHorizontal: 2,
  },
  Photo: {
    height: 80,
    width: 80,
    borderRadius: 50,
    marginTop: 10,
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
});

export default AllStudent;
