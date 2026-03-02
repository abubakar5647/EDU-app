import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import { useSelector } from "react-redux";
import { Fonts } from "../../assets/fonts";
import { Camera, Empty, girl } from "../../assets/images";
import Icons from "../../Components/Icons";
import { captureImage } from "../../../utils/ImageAndCamera";
import AntDesign from "react-native-vector-icons/AntDesign";
import moment from "moment";
import CustomText from "../../Components/CustomText";
import { API_ROUTES } from "../../rtkQuery/routes";
import CalendarPicker from "react-native-calendar-picker";
import Button from "../../Components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
const TextbookView = ({ navigation, route }) => {
  const { studentId, image, first, last, isEditStudent } = route.params || {};
  // console.log("isEditStudent=============", isEditStudent);
  const singleStudentIdForHomework = isEditStudent?._id;
  const role = useSelector((state) => state.gernal.follow);
  const [homeWorkData, setHomeWorkData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllHomework = async () => {
    const formattedStartDate = moment(startDate || new Date()).format(
      "YYYY/MM/DD"
    );
    const formattedEndDate = moment(endDate || new Date())
      .add(7, "days")
      .format("YYYY/MM/DD");
    const studentIdToUse =
      role === "Admin" || role === "Teacher"
        ? studentId
        : singleStudentIdForHomework;

    const url = `${API_ROUTES.BASE_URL}${API_ROUTES.GET_SINGLE_STUDENT_HOMEWORK}?studentId=${studentIdToUse}&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;

    const token = await AsyncStorage.getItem("isAuth");
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching homework:", error);
      throw error;
    }
  };
  const fetchData = async () => {
    try {
      const data = await fetchAllHomework();
      setHomeWorkData(data?.data || {});
    } catch (error) {
      console.error("Fetch failed:", error);
      setHomeWorkData([]);
    }
  };
  console.log("homeWorkData=============", homeWorkData);
  useEffect(() => {
    setIsLoading(false);
  }, []);
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, studentId]);
  const onDateChange = (date, type) => {
    if (type === "START_DATE") {
      setStartDate(date);
    } else {
      setEndDate(date);
    }
  };
  const handleNextWeek = () => {
    setStartDate(moment(startDate).add(7, "days").toDate());
    setEndDate(moment(endDate).add(7, "days").toDate());
  };

  const handlePreviousWeek = () => {
    setStartDate(moment(startDate).subtract(7, "days").toDate());
    setEndDate(moment(endDate).subtract(7, "days").toDate());
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.containerHome}>
      <View />
      <View style={styles.specificDay}>
        <CustomText
          label={moment(item.createdAt).format("ddd")}
          fontSize={10}
          color={colors.lightGray}
        />
      </View>
      <View>
        <CustomText
          label={item.subject?.title}
          fontSize={14}
          color={colors.HeaderTextColor}
          fontFamily={Fonts.PoppinsMedium}
        />
        <CustomText
          label={moment(item.createdAt).format("DD MMM YYYY")}
          fontSize={12}
          fontFamily={Fonts.PoppinsRegular}
          color={colors.lightGray}
        />
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("TextbookDetail", { homeworkId: item._id })
        }
        style={styles.sideArrow}
      >
        <Icons
          family={"Entypo"}
          name="chevron-right"
          size={15}
          color={colors.white}
        />
      </TouchableOpacity>
    </View>
  );
  return (
    <View style={styles.container}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={studentId ? colors.PrimaryLight : colors.primary}
        translucent={true}
      />

      {studentId ? (
        <View style={styles.headerContainer}>
          <View>
            <View style={styles.imageContainer}>
              <Image
                style={styles.profileImage}
                resizeMode="cover"
                modalImageResizeMode="contain"
                source={{
                  uri: `${API_ROUTES.BASE_URL}/${image}`,
                }}
              />
            </View>
            <TouchableOpacity onPress={captureImage} style={styles.camera}>
              <Image
                style={styles.headerImage}
                resizeMode="cover"
                modalImageResizeMode="contain"
                source={Camera}
                tintColor={colors.black}
              />
            </TouchableOpacity>
          </View>
          <View style={{ bottom: 25 }}>
            <Text style={styles.mainHeaderTitle}>{first + " " + last}</Text>
            <Text style={styles.mainHeaderTitle2}>
              Here is a list of Schedule You neet to check...
            </Text>
          </View>
        </View>
      ) : (
        <View>
          <Header
            TitelStyle={{
              color: "white",
              fontSize: 22,
              fontFamily: Fonts.PoppinsBold,
            }}
            backgroundColor={colors.primary}
            title={"Homework"}
            LeftIcon={
              <AntDesign
                size={30}
                color={"white"}
                onPress={() => navigation.goBack()}
                name="arrowleft"
              />
            }
            RightIcon={<View />}
          />
        </View>
      )}

      <View style={styles.headingContainer}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={styles.container}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <CustomText
                label={
                  startDate && endDate
                    ? `${moment(startDate).format("DD")}  to  ${moment(
                        endDate
                      ).format("DD  MMMM,YYYY ")}`
                    : "Select Date Range"
                }
                fontSize={16}
                fontFamily={"PoppinsBold"}
                borderBottomWidth={0.5}
              />
            </TouchableOpacity>

            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => {
                setModalVisible(false);
                setStartDate("");
                setEndDate("");
              }}
            >
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View style={styles.modalContainer}>
                  <View style={styles.calendarContainer}>
                    <CalendarPicker
                      allowRangeSelection={true}
                      onDateChange={onDateChange}
                      selectedStartDate={startDate}
                      selectedEndDate={endDate}
                      startFromMonday={true}
                      todayBackgroundColor={colors.primary}
                      selectedDayColor={colors.primary}
                      selectedDayTextColor={colors.white}
                    />
                    <Button
                      text={"Close"}
                      onPress={() => {
                        setModalVisible(false);
                      }}
                      btnTextStyle={{ color: "white", fontSize: 18 }}
                      btnStyle={{
                        ...GernalStyle.btn,
                        flexDirection: "row",
                        backgroundColor: colors.primary,
                        width: "90%",
                        height: 40,
                        marginVertical: 20,
                      }}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>

          <View style={{ flexDirection: "row", gap: 5, marginLeft: 20 }}>
            <TouchableOpacity
              style={styles.arrows}
              onPress={handlePreviousWeek}
            >
              <Icons
                family="AntDesign"
                name={"arrowleft"}
                fontFamily={"AntDesign"}
                size={15}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.arrows} onPress={handleNextWeek}>
              <Icons
                family="AntDesign"
                name={"arrowright"}
                fontFamily={"AntDesign"}
                size={15}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator size={25} color={colors.primary} />
        ) : (
          <FlatList
            data={homeWorkData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            ListEmptyComponent={
              <View>
                <Image
                  source={Empty}
                  style={{
                    height: 300,
                    width: 250,
                    borderRadius: 10,
                    alignSelf: "center",
                  }}
                />
              </View>
            }
          />
        )}
      </View>

      {studentId && (
        <View style={styles.headerTopImagesContainer}>
          <View style={styles.headerFlex}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Icons
                family="Entypo"
                name={"chevron-small-left"}
                fontFamily={"Entypo"}
                size={25}
              />
            </TouchableOpacity>
            <Icons
              family="MaterialCommunityIcons"
              name={"bell-badge"}
              fontFamily={"MaterialCommunityIcons"}
              size={25}
            />
          </View>
        </View>
      )}
    </View>
  );
};
export default TextbookView;
