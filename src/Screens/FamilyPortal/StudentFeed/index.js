import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import { colors } from "../../../constants/colors";
import Button from "../../../Components/Button";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import SelectDropdown from "react-native-select-dropdown";
import {
  Calendar,
  CameraPicker,
  Empty,
  FoodType,
  Grade,
  Homework,
  ImageType,
  IncidentType,
  KudosType,
  MedsType,
  NapType,
  NoteType,
  PottyType,
  VideoType,
} from "../../../assets/images";
import CustomText from "../../../Components/CustomText";
import { Fonts } from "../../../assets/fonts";
import { useSelector } from "react-redux";
import { journalData, normalizeSize } from "../../../../utils";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { captureImage } from "../../../../utils/ImageAndCamera";
import {
  useGetAllStudentsActivityQuery,
  useGetChildernActivityQuery,
  useSingleStudentQuery,
} from "../../../rtkQuery/slices/home";
import { API_ROUTES } from "../../../rtkQuery/routes";
import moment from "moment";
import UploadMedia from "../../../Components/UploadMedia";
import Icons from "../../../Components/Icons";

const StudentFeed = ({ navigation, route }) => {
  const { studentId, isEditStudent } = route.params || {};
  const singleChildId = isEditStudent?._id;
  // console.log("singleChildId=============", singleChildId);
  const [range, setRange] = useState("");
  const [type, setType] = useState("");
  const selectedType = type !== "all" ? type : "";
  const selectedRange = range !== "all" ? range : "";
  const { data: singleStudent, isLoading: singleStudentLoading } =
    useSingleStudentQuery({
      studentId: studentId,
    });
  // console.log("singleStudent=================", singleStudent);
  const {
    data: singleChildernActivity,
    isError,
    isLoading: singleChildLoading,
  } = useGetChildernActivityQuery({
    studentId: studentId || singleChildId,
    range: selectedRange,
    type: selectedType,
  });
  const { data: getAllStudentActivity, error } = useGetAllStudentsActivityQuery(
    {
      studentId: studentId,
      range: selectedRange,
      type: selectedType,
    }
  );
  // console.log("studentActivity===========", getAllStudentActivity);
  const user = useSelector((state) => state.user.userData);
  // console.log("user============", user);
  const parentRole = user?.role;
  // console.log("parentRole=============", parentRole);
  let activityData;
  if (studentId) {
    activityData = singleChildernActivity?.data;
  } else if (parentRole === "parent" && singleChildId) {
    activityData = singleChildernActivity?.data;
  } else {
    activityData = getAllStudentActivity?.data;
  }
  const [selectedImage, setSelectedImage] = useState(
    `${API_ROUTES.BASE_URL}/${singleStudent?.data?.url}` || ""
  );
  // console.log("selectedImage===================", selectedImage);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFilterBtn, setIsFilterBtn] = useState(false);
  const role = useSelector((state) => state.gernal.follow);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [image, setImage] = useState(null);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  useEffect(() => {
    setImage(singleStudent?.data?.url);
    setFirst(singleStudent?.data?.firstName);
    setLast(singleStudent?.data?.lastName);
  });
  const HandleImageSelect = (newImage) => {
    if (typeof newImage === "string") {
      setSelectedImage(newImage);
    }
    setIsModalVisible(false);
  };
  const getImageByType = (type) => {
    switch (type) {
      case "image":
        return ImageType;
      case "video":
        return VideoType;
      case "nap":
        return NapType;
      case "food":
        return FoodType;
      case "potty":
        return PottyType;
      case "note":
        return NoteType;
      case "kudos":
        return KudosType;
      case "meds":
        return MedsType;
      case "incident":
        return IncidentType;
      default:
        return null;
    }
  };
  const RenderItem = ({ item, index }) => {
    // console.log("item=======", item);
    const height = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      height: expandedIndex === index ? withTiming(250) : withTiming(0),
    }));

    const isImageVisible = expandedIndex === index;
    const hasImage = item?.url !== undefined && item?.url !== "";

    const toggleImageVisibility = (index) => {
      if (hasImage) {
        setExpandedIndex(expandedIndex === index ? null : index);
      }
    };

    return (
      singleStudent?.data?.length > 0 ||
      (singleChildernActivity?.data?.length > 0 && (
        <View
          style={{
            backgroundColor: colors.white,
            elevation: 7,
            paddingVertical: normalizeSize(10),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: normalizeSize(20),
              backgroundColor: colors.white,
            }}
          >
            <View
              style={{
                backgroundColor: colors.white,
                width: normalizeSize(38),
                height: normalizeSize(38),
                alignItems: "center",
                justifyContent: "center",
                borderRadius: normalizeSize(50),
                elevation: 3,
              }}
            >
              {hasImage && (
                <Image
                  source={getImageByType(item.type)}
                  style={{
                    height: normalizeSize(25),
                    width: normalizeSize(25),
                    borderRadius: 20,
                  }}
                  resizeMode="contain"
                />
              )}
            </View>

            <View>
              <CustomText
                label={item?.type}
                fontSize={normalizeSize(15)}
                marginTop={normalizeSize(15)}
                fontFamily={Fonts.PoppinsMedium}
                width={normalizeSize(250)}
              />
              <CustomText
                label={moment(item?.createdAt).format(
                  "h:mm:ss a / DD MMMM YYYY"
                )}
                fontSize={normalizeSize(12)}
                color={colors.lightGray}
              />
            </View>

            <TouchableOpacity onPress={() => toggleImageVisibility(index)}>
              <MaterialIcons
                name={
                  isImageVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"
                }
                size={24}
                color={colors.black10}
                style={{ bottom: 5 }}
              />
            </TouchableOpacity>
          </View>

          <Animated.View style={[{ overflow: "hidden" }, animatedStyle]}>
            {hasImage && (
              <View
                style={{
                  alignItems: "center",
                  width: "100%",
                  paddingHorizontal: normalizeSize(20),
                  marginTop: normalizeSize(20),
                }}
              >
                <Image
                  source={{ uri: `${API_ROUTES.BASE_URL}/${item?.url}` }}
                  style={{
                    width: "80%",
                    height: 160,
                    borderRadius: 12,
                  }}
                />
                <View>
                  <View>
                    <Text style={[styles.noted, { fontWeight: "800" }]}>
                      Note:
                    </Text>
                    <Text style={styles.note}>{item.note}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    {item?.startNap && (
                      <View style={styles.viewStyle}>
                        <Text style={[styles.noted, { fontWeight: "800" }]}>
                          StartNap:
                        </Text>
                        <Text style={styles.noted}> {item?.startNap}</Text>
                      </View>
                    )}
                    {item?.endNap && (
                      <View style={styles.viewStyle}>
                        <Text style={[styles.noted, { fontWeight: "800" }]}>
                          EndNap:
                        </Text>
                        <Text style={styles.noted}> {item?.endNap}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}
          </Animated.View>
        </View>
      ))
    );
  };

  return (
    <>
      <View style={styles.contaner}>
        <View
          style={{ backgroundColor: colors.white }}
          onPress={() => (isFilterBtn ? setIsFilterBtn(false) : null)}
        >
          <GeneralStatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor={colors.PrimaryLight}
            translucent={true}
          />
          <View
            style={{
              backgroundColor: colors.PrimaryLight,
              width: "100%",
              // height: getHeight(30),
              borderBottomLeftRadius: 40,
              borderBottomRightRadius: 40,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.profileImage}
                  resizeMode="cover"
                  modalImageResizeMode="contain"
                  source={{ uri: selectedImage }}
                />
              </View>
              <TouchableOpacity
                style={styles.camera}
                activeOpacity={0.8}
                onPress={() => setIsModalVisible(true)}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  resizeMode="cover"
                  modalImageResizeMode="contain"
                  source={CameraPicker}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            ></View>

            <View>
              <View />

              <CustomText
                label={
                  parentRole === "parent"
                    ? isEditStudent?.firstName + "" + isEditStudent?.lastName
                    : singleStudent?.data?.firstName +
                      " " +
                      singleStudent?.data?.lastName
                }
                fontSize={22}
                fontFamily={Fonts.PoppinsBold}
                bottom={normalizeSize(20)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                marginHorizontal: 2,
                bottom: normalizeSize(15),
                marginBottom: 5,
                paddingHorizontal: normalizeSize(20),
                justifyContent: "space-around",
              }}
            >
              <Button
                text={"Grades"}
                onPress={() =>
                  navigation.navigate("GradeAcsess", {
                    studentId: studentId,
                    image: image,
                    first: first,
                    last: last,
                    isEditStudent: isEditStudent,
                  })
                }
                btnTextStyle={{
                  color: colors.black10,
                  fontSize: 14,
                  marginLeft: normalizeSize(8),
                }}
                btnStyle={{
                  // ...GernalStyle.btn,
                  borderWidth: 1,
                  flexDirection: "row",
                  borderColor: colors.white,
                  width: normalizeSize(100),
                  marginTop: getHeight(1),
                  marginRight: getWidth(4),
                  backgroundColor: colors.white,
                  borderRadius: normalizeSize(5),
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#0000001A",
                }}
                leftIcon={
                  <Image source={Grade} style={{ width: 20, height: 20 }} />
                }
              />
              <Button
                text={"Homework"}
                onPress={() =>
                  navigation.navigate("TextbookView", {
                    roleSpecific: "Student",
                    studentId: studentId,
                    image: image,
                    first: first,
                    last: last,
                    isEditStudent: isEditStudent,
                  })
                }
                btnTextStyle={{
                  color: colors.black10,
                  fontSize: 14,
                  marginLeft: normalizeSize(8),
                }}
                btnStyle={{
                  // ...GernalStyle.btn,
                  borderWidth: 1,
                  flexDirection: "row",
                  borderColor: colors.white,
                  width: normalizeSize(110),
                  marginTop: getHeight(1),
                  marginRight: getWidth(4),
                  backgroundColor: colors.white,
                  borderRadius: normalizeSize(5),
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#0000001A",
                }}
                leftIcon={
                  <Image source={Homework} style={{ width: 20, height: 20 }} />
                }
              />
              <Button
                text={"Calendar"}
                onPress={() =>
                  navigation.navigate("StudentCalendar", {
                    roleSpecific: "Student",
                    className: "3th grade / 3",
                    studentId: studentId,
                    image: image,
                    first: first,
                    last: last,
                    isEditStudent: isEditStudent,
                    firstName: isEditStudent?.firstName,
                    lastName: isEditStudent?.lastName,
                    image1: isEditStudent?.url,
                  })
                }
                btnTextStyle={{
                  color: colors.black10,
                  fontSize: 14,
                  marginLeft: normalizeSize(8),
                }}
                btnStyle={{
                  // ...GernalStyle.btn,
                  borderWidth: 1,
                  flexDirection: "row",
                  borderColor: colors.white,
                  width: normalizeSize(100),
                  height: 30,
                  marginTop: getHeight(1),
                  marginRight: getWidth(4),
                  backgroundColor: colors.white,
                  borderRadius: normalizeSize(5),
                  alignItems: "center",
                  justifyContent: "center",
                  borderColor: "#0000001A",
                }}
                leftIcon={
                  <Image source={Calendar} style={{ width: 20, height: 20 }} />
                }
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: getHeight(1.5),
              // marginBottom: getHeight(1.5),
              width: getWidth(94),
              alignSelf: "center",
            }}
          >
            <SelectDropdown
              defaultValue={"Sort by date"}
              data={[
                "All",
                "Today",
                "This Week",
                "This Month",
                "Personalized date",
              ]}
              defaultButtonText="Sort by date"
              buttonStyle={{
                width: getWidth(43),
                backgroundColor: colors.white,
                borderRadius: 5,
                height: getHeight(5),
                borderWidth: 1,
                borderColor: colors.gray10,
              }}
              buttonTextStyle={{
                color: colors.black10,
                fontFamily: Fonts.PoppinsMedium,
                fontSize: normalizeSize(15),
                fontWeight: "400",
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={"#47424F"}
                    size={getFontSize(2)}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: colors.white,
                borderRadius: 5,
              }}
              rowStyle={{
                backgroundColor: colors.white,
                borderBottomColor: "rgba(0, 0, 0, 0.1)",
              }}
              rowTextStyle={{
                color: colors.black,
                fontSize: getFontSize(2),
                textAlign: "left",
                paddingLeft: getFontSize(1),
              }}
              onSelect={(range) => {
                setRange(range.replace(/[\s\u00A0]+/g, "").toLowerCase());
                // handleActivity(range);
              }}
            />
            <SelectDropdown
              defaultValue={"Filter by activity"}
              data={[
                "All",
                "Image",
                "Video",
                "Nap",
                "Food",
                "Toilet",
                "Note",
                "Kudos",
                "Meds",
                "Incident",
              ]}
              defaultButtonText="Filter by activity"
              buttonStyle={{
                width: getWidth(43),
                backgroundColor: colors.white,
                borderRadius: 5,
                height: getHeight(5),
                borderWidth: 1,
                borderColor: colors.gray10,
              }}
              buttonTextStyle={{
                color: colors.black10,
                fontFamily: Fonts.PoppinsMedium,
                fontSize: normalizeSize(15),
                fontWeight: "400",
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={"#47424F"}
                    size={getFontSize(2)}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: colors.white,
                borderRadius: 5,
              }}
              rowStyle={{
                backgroundColor: colors.white,
                borderBottomColor: "rgba(0, 0, 0, 0.1)",
              }}
              rowTextStyle={{
                color: colors.black,
                fontSize: getFontSize(2),
                textAlign: "left",
                paddingLeft: getFontSize(1),
                fontFamily: "Pooppins-bold",
              }}
              onSelect={(type) => {
                setType(type.replace(/[\s\u00A0]+/g, "").toLowerCase());
                // handleActivity(type);
              }}
            />
          </View>

          <View style={{ backgroundColor: colors.white }}></View>
          <View
            style={{
              position: "absolute",
              top: getFontSize(7),
              left: getWidth(4),
            }}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Icons
                name={"keyboard-arrow-left"}
                family={"MaterialIcons"}
                size={30}
                color={colors.HeaderTextColor}
              />
            </TouchableOpacity>
          </View>
        </View>
        <CustomText
          label={"Journal"}
          fontSize={22}
          fontFamily={Fonts.PoppinsSemiBold}
          alignSelf={"center"}
          marginTop={normalizeSize(30)}
        />
        {singleStudentLoading || singleChildLoading ? (
          <ActivityIndicator size={"large"} color={colors.primary} />
        ) : (
          <View style={{ flex: 1 }}>
            <FlatList
              data={
                Array.isArray(activityData)
                  ? activityData
                  : [activityData] || singleStudent?.data
              }
              renderItem={({ item, index }) => (
                <RenderItem item={item} index={index} />
              )}
              nestedScrollEnabled
              keyExtractor={(item) => item?.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Image
                    source={Empty}
                    style={{ height: 200, width: 250, borderRadius: 15 }}
                  />
                </View>
              }
            />
          </View>
        )}
      </View>
      <UploadMedia
        modalVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectImage={HandleImageSelect}
      />
    </>
  );
};
export default StudentFeed;
