import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import SelectDropdown from "react-native-select-dropdown";
import { useSelector } from "react-redux";
import { Fonts } from "../../assets/fonts";
import AddHomeWorkModal from "./molecules/AddHomeworkModal";
import CustomText from "../../Components/CustomText";
import HomeWorkFlatlist from "./molecules/HomeWorkFlatlist";
import { useMeQuery } from "../../rtkQuery/slices/auth";
import { useGetRoomsHomeworkQuery } from "../../rtkQuery/slices/home";
import moment from "moment";
import { API_ROUTES } from "../../rtkQuery/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CalendarPicker from "react-native-calendar-picker";
import Icons from "../../Components/Icons";

const Textbook = ({ navigation, route }) => {
  const [meRoomId, setMERoomId] = useState("");
  const [meSchoolId, setMESchoolId] = useState("");
  const [date, setDate] = useState(new Date());
  const role = useSelector((state) => state.gernal.follow);
  const [isHomeWorkModal, setIsHomeWorkModal] = useState(false);
  const [homeWorkData, setHomeworkData] = useState([]);
  const [editingHomeworkId, setEditingHomeworkId] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const { data: homeId, refetch } =
    role === "Admin" ? useGetRoomsHomeworkQuery() : useMeQuery();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const fetchAllHomework = async () => {
    let url = `${API_ROUTES.BASE_URL}${API_ROUTES.GET_ALL_HOMEWORK}?roomId=${meRoomId}`;

    // Add startDate and endDate to the URL only if they are provided
    if (startDate && endDate) {
      const formattedStartDate = moment(startDate).format("YYYY/MM/DD");
      const formattedEndDate = moment(endDate).format("YYYY/MM/DD");
      url += `&startDate=${formattedStartDate}&endDate=${formattedEndDate}`;
    }

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
        const errorMessage = `Error: ${response.status} ${response.statusText}`;
        console.error("HTTP Error:", errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log("Fetched Homework Data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching homework:", error);
      throw error;
    }
  };

  const fetchData = async () => {
    try {
      const data = await fetchAllHomework();
      setHomeworkData(data?.data || []);
      console.log("Homework Data:", data);
    } catch (error) {
      console.error("Fetch failed:", error);
      setHomeworkData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, [startDate, endDate, meRoomId]);

  // console.log("multiDataHomework============", homeId?.data);
  let roomNames = [];

  if (role === "Admin" && homeId?.data) {
    roomNames = homeId?.data?.map((item) => item.name);
  } else if (role === "Teacher" && homeId?.data) {
    roomNames = homeId?.data?.userId?.rooms?.map((item) => item.name) || [];
  }

  const onHomeWorkModalClose = () => {
    setIsHomeWorkModal(false);
  };
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
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setStartDate(null);
      setEndDate(null);
    });
    return unsubscribe;
  }, [navigation]);
  return (
    <>
      <ScrollView style={styles.contaner}>
        <GeneralStatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={colors.primary}
          translucent={true}
        />
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
        <View style={{ width: getWidth(90), alignSelf: "center" }}>
          <View
            style={{
              marginBottom: getHeight(3),
              justifyContent: "space-around",
              flexDirection: "row",
              marginTop: getHeight(3),
              width: getWidth(80),
              alignSelf: "center",
            }}
          >
            <SelectDropdown
              defaultValue={"Classes"}
              data={roomNames.length > 0 ? roomNames : ["No Classes"]}
              onSelect={(selectedItem, index) => {
                const selectedRoomId =
                  homeId?.data[index]?._id ||
                  homeId?.data?.userId?.rooms[index]?._id;
                console.log("selectedRoomId===============", selectedRoomId);
                const selectedSchoolId =
                  homeId?.data[index]?.schoolId ||
                  homeId?.data?.userId?.rooms[index]?.schoolId;
                setMERoomId(selectedRoomId);
                setMESchoolId(selectedSchoolId);
                // storeSelectedRoomId(selectedRoomId);
              }}
              defaultButtonText="Classes"
              buttonStyle={{
                width: getWidth(35),
                backgroundColor: "white",
                borderWidth: 1,
                borderColor: colors.primary,
                borderRadius: 5,
                height: getHeight(4),
              }}
              buttonTextStyle={{
                color: colors.primary,
                fontFamily: Fonts.PoppinsMedium,
                fontSize: 14,
                fontWeight: "400",
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={colors.primary}
                    size={getFontSize(2)}
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
            <Button
              text={"Homework"}
              btnTextStyle={{ color: "white", fontSize: 14 }}
              btnStyle={{
                ...GernalStyle.btn,
                flexDirection: "row",
                backgroundColor: colors.primary,
                width: getWidth(35),
                height: getHeight(4),
              }}
              onPress={() => setIsHomeWorkModal(true)}
              leftIcon={
                <AntDesign
                  style={{ marginRight: getWidth(2) }}
                  name={"plussquareo"}
                  size={17}
                  color={"white"}
                />
              }
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
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
                <View style={styles.modalContainer}>
                  <TouchableWithoutFeedback>
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
                  </TouchableWithoutFeedback>
                </View>
              </Modal>
            </View>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity onPress={handlePreviousWeek}>
                <Icons
                  family={"MaterialIcons"}
                  name={"keyboard-arrow-left"}
                  size={20}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleNextWeek}>
                <Icons
                  family={"MaterialIcons"}
                  name={"keyboard-arrow-right"}
                  size={20}
                />
              </TouchableOpacity>
            </View>
          </View>
          <HomeWorkFlatlist
            meRoomId={meRoomId}
            isHomeWorkModal={isHomeWorkModal}
            setIsHomeWorkModal={setIsHomeWorkModal}
            setEditingHomeworkId={setEditingHomeworkId}
            homeWorkData={homeWorkData}
            setHomeworkData={setHomeworkData}
            fetchData={fetchData}
          />
        </View>
      </ScrollView>
      <AddHomeWorkModal
        modalVisibility={isHomeWorkModal}
        onDismiss={onHomeWorkModalClose}
        meRoomId={meRoomId}
        meSchoolId={meSchoolId}
        date={date}
        setDate={setDate}
        fetchData={fetchData}
      />
    </>
  );
};
export default Textbook;
