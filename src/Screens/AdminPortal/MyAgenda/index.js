import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import NewHeader from "../../../Components/NewHeader/NewHeader";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { Fonts } from "../../../assets/fonts";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import { Empty, girl } from "../../../assets/images";
import moment from "moment";
import { useGetEventsQuery, useMeQuery } from "../../../rtkQuery/slices/home";
import { normalizeSize } from "../../../../utils";
import { API_ROUTES } from "../../../rtkQuery/routes";

const MyAgenda = ({ navigation }) => {
  const [date, setDate] = useState(new Date());
  const { data: MeData } = useMeQuery();

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
    setDate(new Date(selectedDate));
  };

  const { data, isLoading } = useGetEventsQuery({
    date: date,
  });

  return (
    <View>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <NewHeader title={"My agenda"} onPress={() => navigation.goBack()} />

      <View>
        <View
          style={{ alignSelf: "center", width: 90, width: 90, marginTop: 20 }}
        >
          <Image
            source={
              MeData?.data?.profile_image
                ? {
                    uri: `${API_ROUTES.BASE_URL}/${MeData?.data?.profile_image}`,
                  }
                : require("../../../assets/images/Pimg.jpeg")
            }
            style={{
              height: normalizeSize(60),
              width: normalizeSize(60),
              alignSelf: "center",
              borderRadius: 35,
            }}
          />
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              marginBottom: 20,
              fontSize: 14,
              color: colors.primary,
              fontFamily: Fonts.PoppinsSemiBold,
            }}
          >
            {MeData?.data?.firstName} {MeData?.data?.lastName}
          </Text>
        </View>
        <ReactNativeCalendarStrip
          showMonth={false}
          selectedDate={date}
          onDateSelected={handleDateChange}
          calendarAnimation={{ type: "sequence", duration: 30 }}
          customDatesStyles={customDatesStyles}
          // iconLeft={require("../../../assets/images/leftp.png")}
          // iconRight={require("../../../assets/images/rightp.png")}
          style={{
            height: getHeight(8),
            marginTop: getHeight(1),
            paddingHorizontal: 5,
          }}
          iconContainer={{ flex: 0.05 }}
        />
        <View style={{ paddingHorizontal: 20, paddingVertical: 15 }}>
          {!isLoading ? (
            <FlatList
              data={data?.data}
              renderItem={({ item }) => (
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
                  <View
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
                        {item?.subject?.title ||
                          item?.subject ||
                          "Unknown Subject"}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View
                  style={{
                    alignSelf: "center",
                    marginTop: normalizeSize(40),
                  }}
                >
                  <Image
                    source={Empty}
                    style={{
                      width: normalizeSize(300),
                      height: normalizeSize(300),
                    }}
                  />
                  <Text
                    style={{
                      alignSelf: "center",
                      marginTop: normalizeSize(20),
                      fontSize: normalizeSize(20),
                      color: colors.black,
                      fontWeight: "bold",
                    }}
                  >
                    No Data
                  </Text>
                </View>
              }
              style={{ height: normalizeSize(500), overflow: "hidden" }}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text>Loading...</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default MyAgenda;

const styles = StyleSheet.create({});
