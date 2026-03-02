import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Empty, girl } from "../../assets/images";
import { normalizeSize } from "../../../utils";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import {
  useSingleStudentCalenderQuery,
  useStudentEventQuery,
} from "../../rtkQuery/slices/home";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { API_ROUTES } from "../../rtkQuery/routes";
import { useSelector } from "react-redux";

const StudentCalendar = ({ route }) => {
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const {
    studentId,
    image,
    first,
    last,
    isEditStudent,
    firstName,
    lastName,
    image1,
  } = route?.params || {};
  const singleStudentIdforCalender = isEditStudent?._id;
  const { data: studentEvent, isLoading } = useStudentEventQuery({
    studentId,
    date,
  });
  console.log("adminCalender", studentEvent?.data);

  const userData = useSelector((state) => state.user.userData);
  const role = userData?.role;

  const { data: singleStudentCalender } = useSingleStudentCalenderQuery({
    studentId: singleStudentIdforCalender,
    date: date,
  });
  console.log("singleStudentCalender", singleStudentCalender?.data);

  let customDatesStyles = [];
  const startDate = new Date(date);
  const endDate = new Date(date);
  if (startDate.getDay() === 0) {
    startDate.setDate(startDate.getDate() - 6);
  } else {
    const diff = startDate.getDay() - 1;
    startDate.setDate(startDate.getDate() - diff);
  }
  endDate.setDate(startDate.getDate() + 6);

  const dayOfWeekMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const selectedDayOfWeek = new Date(date).getDay();
  const selectedDayName = dayOfWeekMap[selectedDayOfWeek];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dayOfWeek = currentDate.getDay();
    const dayName = dayOfWeekMap[dayOfWeek];

    if (dayName == selectedDayName) {
      customDatesStyles.push({
        startDate: currentDate,
        dateNameStyle: { color: "white" },
        dateNumberStyle: { color: "white" },
        dateContainerStyle: {
          height: getHeight(8),
          backgroundColor: "#50C2C9",
          borderWidth: 0,
          width: getWidth(11),
          borderRadius: getFontSize(0.5),
        },
      });
    } else {
      customDatesStyles.push({
        startDate: currentDate,

        dateContainerStyle: {
          height: getHeight(8),
          backgroundColor: "#F8F8F8",
          borderWidth: 0,
          width: getWidth(11),
          borderRadius: getFontSize(0.5),
        },
      });
    }
  }
  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleSingleStudentEevnts = ({ item }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 12,
              color: "#757D8A",
              marginBottom: 5,
            }}
          >
            {moment(item.startTime).format("hh:mm ")}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#757D8A",
            }}
          >
            {moment(item.endTime).format("hh:mm ")}
          </Text>
        </View>
        <TouchableOpacity
          style={{
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "#E1E3E6",
            width: normalizeSize(288),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#C8F2F8",
              borderTopLeftRadius: 10,
              borderBottomLeftRadius: 10,
              height: 40,
              marginVertical: 5,
              borderTopRightRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <View
              style={{
                height: "100%",
                backgroundColor: "#22CCE2",
                width: "3%",
                borderTopLeftRadius: 10,
                borderBottomLeftRadius: 10,
              }}
            />
            <Text
              style={{
                fontSize: 14,
                color: "#22CCE2",
                marginLeft: getWidth(3),
                alignSelf: "center",
              }}
            >
              {item?.subject?.title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEventItem = ({ item }) => (
    <View style={styles.renderMain}>
      <View>
        <Text
          style={{
            fontSize: 12,
            color: "#757D8A",
            marginBottom: 5,
          }}
        >
          {moment(item.startTime).format("hh:mm ")}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color: "#757D8A",
          }}
        >
          {moment(item.endTime).format("hh:mm ")}
        </Text>
      </View>
      <View style={styles.container}>
        <View style={styles.cont}>
          <View style={styles.dataView} />
          <Text style={styles.title}> {item?.subject?.title}</Text>
        </View>
      </View>
    </View>
  );
  return (
    <SafeAreaView>
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
        title={"Calender"}
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
      <View style={styles.main}>
        <Image
          source={{
            uri: `${API_ROUTES.BASE_URL}/${image1 || image}`,
          }}
          style={styles.image}
        />
        <Text style={styles.name}>{`${firstName || first} ${
          lastName || last
        }`}</Text>
      </View>
      <ReactNativeCalendarStrip
        showMonth={false}
        selectedDate={date}
        onDateSelected={handleDateChange}
        calendarAnimation={{ type: "sequence", duration: 30 }}
        customDatesStyles={customDatesStyles}
        style={{
          height: getHeight(8),
          marginTop: getHeight(1),
          paddingHorizontal: 5,
          marginBottom: normalizeSize(20),
        }}
        iconContainer={{ flex: 0.05 }}
      />
      <View
        style={{
          marginHorizontal: normalizeSize(20),
        }}
      >
        {role === "parent" ? (
          isEditStudent ? (
            <View>
              <FlatList
                data={singleStudentCalender?.data}
                renderItem={handleSingleStudentEevnts}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View>
                    <Image source={Empty} style={styles.emptyImage} />
                  </View>
                }
                style={{
                  height: "auto",
                }}
              />
            </View>
          ) : (
            isLoading && (
              <ActivityIndicator size={"large"} color={colors.primary} />
            )
          )
        ) : (
          <FlatList
            data={studentEvent?.data}
            renderItem={renderEventItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View>
                <Image source={Empty} style={styles.emptyImage} />
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default StudentCalendar;

const styles = StyleSheet.create({
  renderMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    gap: 5,
  },
  time: {
    fontSize: 12,
    color: colors.graytext4,
  },
  container: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#E1E3E6",
    width: normalizeSize(288),
  },
  cont: {
    flexDirection: "row",
    backgroundColor: "#C8F2F8",
    borderRadius: 10,
    height: 40,
    marginVertical: 5,
  },
  dataView: {
    height: "100%",
    backgroundColor: "#22CCE2",
    width: "3%",
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  title: {
    fontSize: 14,
    color: "#22CCE2",
    marginLeft: getWidth(3),
    alignSelf: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.primary,
    fontFamily: Fonts.PoppinsBold,
    color: colors.primary,
    marginTop: normalizeSize(15),
  },
  image: { height: 100, width: 100, resizeMode: "contain", borderRadius: 50 },
  main: {
    alignItems: "center",
    marginTop: normalizeSize(30),
    marginBottom: normalizeSize(10),
  },
  emptyImage: {
    height: 320,
    width: 270,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: normalizeSize(25),
  },
});
