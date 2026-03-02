import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  ActivityIndicator,
} from "react-native";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { GernalStyle } from "../../constants/GernalStyle";

import { styles } from "./styles";
import { colors } from "../../constants/colors";
import Video from "react-native-video";
import Button from "../../Components/Button";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import SelectDropdown from "react-native-select-dropdown";
import {
  Activity,
  Calendar,
  Camera,
  Drawer,
  Empty,
  Student,
  ImageType,
  VideoType,
  NapType,
  FoodType,
  PottyType,
  NoteType,
  KudosType,
  MedsType,
  IncidentType,
} from "../../assets/images";
import { Fonts } from "../../assets/fonts";
import CustomText from "../../Components/CustomText";
import Icons from "../../Components/Icons";
import GenericDropdown from "../../Components/AutoDropdown";
import { normalizeSize } from "../../../utils";
import {
  useCreateProfileMutation,
  useGetAllActivityByFilterQuery,
  useGetAllRoomsQuery,
  useMeQuery,
} from "../../rtkQuery/slices/home";
import moment from "moment";
import { useSelector } from "react-redux";
import UploadMedia from "../../Components/UploadMedia";
import { API_ROUTES } from "../../rtkQuery/routes";
import { showToast } from "../../Components/Toaster";
import { fonts } from "../../constants/fonts";

const HomeSc = ({ navigation, route }) => {
  const [range, setRange] = useState("");
  const [type, setType] = useState("");
  const [loading, setLoading] = useState(true);
  const [isChevron, setIsChevron] = useState(false);

  const role = useSelector((state) => state.gernal.follow);
  // console.log("role=====>>>>>>", role);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [getClassroom, setGetClassroom] = useState([]);
  const [imageVisibility, setImageVisibility] = useState(
    allActivity?.data?.map(() => true) || []
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const UserData = useSelector((state) => state.user.userData);
  const { data: allRooms, refetch: classRoomRefetch } = useGetAllRoomsQuery();

  const { data: getMeProfile, refetch: refetchProfile } = useMeQuery();

  // const roomId = selectedClassroom ? selectedClassroom?.value : "";
  const selectedType = type !== "all" ? type : "";
  const selectedRange = range !== "all" ? range : "";
  const { data: allActivity, refetch } = useGetAllActivityByFilterQuery({
    range: selectedRange,
    type: selectedType,
    roomId: selectedClassroom?.value,
  });
  // console.log("allActivity==>>>>>>", allActivity?.data[0]?.students);

  useEffect(() => {
    refetchProfile();
    classRoomRefetch();
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [refetchProfile, classRoomRefetch]);

  useEffect(() => {
    refetch();
  }, [range, type]);
  const [createProfile] = useCreateProfileMutation();

  const HandleCreateProfile = async (ImageSrc) => {
    const formData = new FormData();
    formData.append("image", {
      uri: ImageSrc,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await createProfile(formData);
      console.log("ressssssssss", res);
      refetchProfile();
    } catch (error) {
      console.log("Image error ", error);
    }
  };

  useEffect(() => {
    if (
      role === "Teacher" ||
      role === "Staff" ||
      getMeProfile?.data?.userId?.rooms
    ) {
      // Map rooms from Teacher's profile
      const rooms = getMeProfile?.data?.userId?.rooms?.map((room) => ({
        label: room?.name,
        value: room?._id,
      }));
      setGetClassroom(rooms);
    } else if (allRooms?.data) {
      // Map rooms from the getAllRooms API
      const rooms = allRooms.data.map((room) => ({
        label: room.name,
        value: room._id,
      }));
      setGetClassroom(rooms);
    }
  }, [role, getMeProfile, allRooms]);

  const toggleImageVisibility = (index) => {
    setImageVisibility((prevVisibility) => {
      const newVisibility = [...prevVisibility];
      newVisibility[index] = !newVisibility[index];
      return newVisibility;
    });
  };

  const HandleImageSelect = async (ImageSrc) => {
    setSelectedImage(ImageSrc);
    await HandleCreateProfile(ImageSrc);
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

  // console.log("allActivity?.data", allActivity?.data);

  const renderActivityItem = ({ item, index }) => {
    const studentNames =
      item?.students?.map(
        (student) => `${student.firstName} ${student.lastName}`
      ) || [];

    const isExpanded = expandedIndex === index;
    const visibleText = studentNames.slice(0, 2).join(", ");
    const remainingCount = studentNames.length - 2;
    return (
      <TouchableOpacity
        style={{
          borderBottomWidth: 0.5,
          borderColor: "#0000000D",
        }}
        activeOpacity={0.9}
      >
        <View style={styles.flatlistContainer}>
          <TouchableOpacity
            style={styles.rowContainer}
            onPress={() => toggleImageVisibility(index)}
            activeOpacity={0.9}
          >
            <View style={styles.rowItemContainer}>
              <View style={styles.flatlistCamera}>
                <Image
                  source={getImageByType(item.type)}
                  style={styles.iconImage}
                  resizeMode="contain"
                />
              </View>
              <View style={styles.textWrapper}>
                <Text style={styles.textTitle}>{item.type}</Text>
                <Text style={styles.textheading}>Added for:</Text>
                {studentNames.length > 0 ? (
                  <TouchableOpacity>
                    <Text style={styles.addedby}>
                      {isExpanded
                        ? studentNames.join(", ") // Full list show karein
                        : `${visibleText}${remainingCount > 0 ? ` ...` : ""}`}
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.addedby}>No students found</Text>
                )}
              </View>
              <TouchableOpacity
                onPress={() => {
                  setIsChevron(!isChevron);
                  toggleImageVisibility(index);
                  setExpandedIndex(isExpanded ? null : index);
                }}
                hitSlop={{ top: 30, bottom: 30, right: 30, left: 30 }}
              >
                <Icons
                  family="Entypo"
                  name={isChevron ? "chevron-small-up" : "chevron-small-down"}
                  fontFamily="Entypo"
                  size={25}
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
          {imageVisibility[index] && (
            <View style={styles.classRoomContainer}>
              <View style={styles.videoContainer}>
                {item.type === "video" ? (
                  <Video
                    source={{ uri: `${API_ROUTES.BASE_URL}/${item.url}` }}
                    style={[
                      styles.videoImage,
                      { width: normalizeSize(200), height: normalizeSize(170) },
                    ]}
                    controls={true}
                    resizeMode="contain"
                  />
                ) : (
                  <View>
                    <Image
                      source={{ uri: `${API_ROUTES.BASE_URL}/${item.url}` }}
                      style={styles.ImageToggle}
                      resizeMode="cover"
                    />
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          width: "50%",
                          justifyContent: "space-between",
                          marginTop: normalizeSize(10),
                          alignItems: "flex-end",
                          alignSelf: "flex-end",
                        }}
                      >
                        <Text style={styles.textSubtitle}>
                          {moment(item?.createdAt).format("hh:mm A")}
                        </Text>
                        <Text style={styles.textSubtitle}>
                          {moment(item?.date).format("DD-MM-YYYY")}
                        </Text>
                      </View>
                      {item?.note && (
                        <Text style={[styles.note, { fontWeight: "800" }]}>
                          Note:
                        </Text>
                      )}
                      {item?.note && (
                        <Text style={styles.note}>{item?.note}</Text>
                      )}
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
                            Start nap:
                          </Text>
                          <Text style={styles.noted}>
                            {item?.startNap
                              ? moment(item.startNap, "HH:mm:ss").format(
                                  "hh:mm A"
                                )
                              : "N/A"}
                          </Text>
                        </View>
                      )}
                      {item?.endNap && (
                        <View style={styles.viewStyle}>
                          <Text style={[styles.noted, { fontWeight: "800" }]}>
                            End nap:
                          </Text>
                          <Text style={styles.noted}>
                            {" "}
                            {item?.endNap
                              ? moment(item.endNap, "HH:mm:ss").format(
                                  "hh:mm A"
                                )
                              : "N/A"}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {loading ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      ) : (
        <View style={styles.container}>
          <GeneralStatusBar
            barStyle="dark-content"
            hidden={false}
            backgroundColor={"#50C2C9"}
            translucent={true}
          />
          <View
            style={[styles.headerContainer, { backgroundColor: "#50C2C9" }]}
          >
            <View>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.profileImage}
                  resizeMode="cover"
                  modalImageResizeMode="contain"
                  source={
                    getMeProfile?.data?.profile_image
                      ? {
                          uri: `${API_ROUTES?.BASE_URL}/${getMeProfile?.data?.profile_image}`,
                        }
                      : selectedImage
                      ? { uri: selectedImage }
                      : require("../../assets/images/Pimg.jpeg")
                  }
                />
              </View>
              <TouchableOpacity
                style={styles.camera}
                onPress={() => setIsModalVisible(true)}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                  }}
                  tintColor={colors.black}
                  resizeMode="cover"
                  modalImageResizeMode="contain"
                  source={Camera}
                />
              </TouchableOpacity>
            </View>
            <Text
              style={{
                color: colors.darkBlue,
                fontFamily: "Poppins-Bold",
                fontSize: 22,
                fontWeight: "600",
                alignSelf: "center",
                bottom: 25,
              }}
            >
              {getMeProfile?.data?.firstName} {getMeProfile?.data?.lastName}
            </Text>

            <GenericDropdown
              data={
                getClassroom?.length > 0
                  ? getClassroom
                  : [{ label: "Classroom is not found", value: null }]
              }
              defaultValue={selectedClassroom ? selectedClassroom?.label : null}
              onSelect={(selectedItem) => {
                setSelectedClassroom(selectedItem);
              }}
              defaultButtonText="Classroom"
              buttonStyle={{
                backgroundColor: "transparent",
                borderWidth: 1,
                borderColor: "#0000000D",
                marginBottom: normalizeSize(20),
              }}
              TextColor={colors.white}
              buttonTextStyle={{
                color: colors.black,
                fontFamily: Fonts.PoppinsBold,
              }}
              dropdownStyle={{
                borderRadius: 10,
                marginTop: normalizeSize(-30),
              }}
              rowStyle={{ borderBottomColor: "gray" }}
              rowTextStyle={{ fontSize: normalizeSize(16) }}
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
          </View>
          <View>
            <View style={styles.selectionContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (!selectedClassroom) {
                    showToast("error", "Please Select Room First");
                    return;
                  }

                  navigation.navigate("Room", {
                    title: "Students",
                    className: selectedClassroom?.label,
                    roomId: selectedClassroom?.value,
                  });
                }}
                style={styles.selection}
              >
                <Image source={Student} />
                <Text
                  style={{
                    color: colors.darkBlue,
                    fontSize: 12,
                    fontFamily: Fonts.PoppinsMedium,
                  }}
                >
                  Students
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Actvitys", {
                    selectedClassroom: selectedClassroom,
                  })
                }
                style={[styles.selection, { backgroundColor: colors.yellow }]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Image source={Activity} />
                  <Text
                    style={{
                      color: "white",
                      fontSize: 12,
                      fontFamily: Fonts.PoppinsMedium,
                      marginLeft: 5,
                    }}
                  >
                    Activities
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.selection}
                onPress={() => {
                  if (!selectedClassroom) {
                    showToast("error", "Please Select Room First");
                    return;
                  }
                  navigation.navigate("Calendrar", {
                    selectedClassroom: selectedClassroom,
                  });
                }}
              >
                <Image
                  source={Calendar}
                  style={{ height: 24, width: 24 }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: colors.darkBlue,
                    fontSize: 12,
                    fontFamily: Fonts.PoppinsMedium,
                    marginLeft: 5,
                    textAlign: "left",
                  }}
                >
                  Classroom Calendar
                </Text>
              </TouchableOpacity>
            </View>
            <CustomText
              label={"Journal"}
              color={colors.darkBlue}
              alignSelf={"center"}
              fontSize={20}
              fontFamily={Fonts?.PoppinsBold}
            />
            <View
              style={{
                justifyContent: "space-around",
                flexDirection: "row",
                marginTop: getHeight(1.5),
                marginBottom: getHeight(1.5),
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
                onSelect={(range) => {
                  setRange(range.replace(/[\s\u00A0]+/g, "").toLowerCase());
                }}
                defaultButtonText="Sort by date"
                buttonStyle={{
                  width: getWidth(40),
                  backgroundColor: colors.white,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: "#0000000D",
                  height: getHeight(5),
                }}
                buttonTextStyle={{
                  color: colors.darkBlue,
                  fontSize: 15,
                  fontWeight: "400",
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Icons
                      family="Entypo"
                      name={
                        isOpened ? "chevron-small-up" : "chevron-small-down"
                      }
                      fontFamily="Entypo"
                      size={25}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                showsVerticalScrollIndicator={false}
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
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Pooppins-bold",
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
                onSelect={(type) => {
                  setType(type.replace(/[\s\u00A0]+/g, "").toLowerCase());
                }}
                buttonStyle={{
                  width: getWidth(40),
                  backgroundColor: colors.white,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: "#0000000D",
                  height: getHeight(5),
                }}
                buttonTextStyle={{
                  color: "#47424F",
                  fontSize: 15,
                  fontWeight: "400",
                }}
                renderDropdownIcon={(isOpened) => {
                  return (
                    <Icons
                      family="Entypo"
                      name={
                        isOpened ? "chevron-small-up" : "chevron-small-down"
                      }
                      fontFamily="Entypo"
                      size={25}
                    />
                  );
                }}
                dropdownIconPosition={"right"}
                showsVerticalScrollIndicator={false}
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
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Pooppins-bold",
                }}
              />
            </View>
          </View>
          <FlatList
            data={allActivity?.data}
            renderItem={renderActivityItem}
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: colors.white }}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Image
                  source={Empty}
                  style={{ height: 200, width: 250, borderRadius: 15 }}
                />
              </View>
            }
          />
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              marginVertical: getHeight(1),
            }}
            onPress={() => {
              if (!selectedClassroom) {
                showToast("error", "Please Select Room First");
                return;
              }

              navigation.navigate("Students", {
                title: "Students",
                className: selectedClassroom?.label,
                selectedClassroom: selectedClassroom,
              });
            }}
            btnTextStyle={[
              GernalStyle.btnText,
              { fontSize: 16, fontFamily: Fonts.PoppinsMedium },
            ]}
            text={"Check-In / Check-Out"}
          />

          <View style={styles.headerTopImagesContainer}>
            <View style={styles.headerFlex}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Image
                  source={Drawer}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                />
              </TouchableOpacity>
              <Icons
                family="MaterialCommunityIcons"
                name={"bell-badge"}
                size={25}
                onPress={() => navigation.navigate("Notification")}
              />
            </View>
          </View>
          <UploadMedia
            modalVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            onSelectImage={HandleImageSelect}
          />
        </View>
      )}
    </>
  );
};
export default HomeSc;
