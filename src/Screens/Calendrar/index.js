import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import SelectDropdown from "react-native-select-dropdown";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import ReactNativeModal from "react-native-modal";
import { Switch, TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import { Fonts } from "../../assets/fonts";
import { Empty, girl } from "../../assets/images";

import { useSelector } from "react-redux";
import {
  useDeleteEventMutation,
  useEventMutation,
  useGetAllSubjectQuery,
  useGetEventsByRoomIdWithDateQuery,
  useUpdateEventMutation,
} from "../../rtkQuery/slices/home";
import moment from "moment";
import { normalizeSize } from "../../../utils";
import { showToast } from "../../Components/Toaster";
import { useMeQuery } from "../../rtkQuery/slices/auth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
const Calendrar = ({ navigation, route }) => {
  const role = useSelector((state) => state.gernal.follow);
  const { roleSpecific, selectedClassroom } = route.params || {};
  const [model, setModel] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(null);
  const [selectDay, setSelectDay] = useState("Every");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [openStartPicker, setOpenStartPicker] = useState(false);
  const [openEndPicker, setOpenEndPicker] = useState(false);
  const [getAllSubjects, setGetAllSubjects] = useState([]);
  // console.log("subject=======", subject?.value);
  const [errors, setErrors] = useState({
    title: "",
    subject: null,
  });
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
    const newDate = new Date(selectedDate);
    setDate(newDate);
  };
  const { data: myProfile } = useMeQuery();
  const validateInputs = () => {
    setErrors({
      title: "",
      subject: null,
    });
    if (!title) {
      setErrors((prev) => ({ ...prev, title: "Title is required." }));
    }
    if (!subject) {
      setErrors((prev) => ({
        ...prev,
        subject: "Please select a subject.",
      }));
    }
  };

  // Get All Subjects API
  const { data: subjects } = useGetAllSubjectQuery();
  useEffect(() => {
    if (subjects?.data) {
      const allSubjects = subjects.data.map((item) => ({
        label: item.title,
        value: item._id,
      }));
      setGetAllSubjects(allSubjects);
    }
  }, [subjects]);

  // GET Event by room id API
  const { data: events, isLoading } = useGetEventsByRoomIdWithDateQuery({
    roomId: selectedClassroom?.value,
    date: date,
  });
  // Add Event API

  const [addEvent, { isLoading: eventLoading }] = useEventMutation();

  const handleEvent = async () => {
    validateInputs();
    try {
      const payload = {
        title,
        subject: subject.value,
        startTime,
        endTime,
        date,
        description,
        day: selectDay,
        room: selectedClassroom.value,
        createdBy: myProfile?.data?._id,
      };
      console.log("payload===>>>>", payload);
      const response = await addEvent(payload);
      if (response.error) {
        Alert.alert(
          "Error",
          response?.error?.data?.message || "An error occurred.",
          [{ text: "OK" }]
        );
        console.log("Api error", response.error);
      } else {
        console.log("add event successfully", response);
        resetEvent();
        setModel(false);
        showToast("success", response?.data?.message);
      }
    } catch (error) {
      console.log("Unexpected Error===>>>>>>", error);
      const errorMessage = error?.message || "An unexpected error occurred.";

      Alert.alert("Unexpected Error", errorMessage, [{ text: "OK" }]);
      if (!selectedClassroom || !selectedClassroom.label) {
        Alert.alert("Attention", "Please select your classroom first.", [
          { text: "OK" },
        ]);
      }
    }
  };

  const resetEvent = () => {
    setTitle("");
    setSubject(null);
    setDate(new Date());
    setStartTime(new Date());
    setEndTime(new Date());
    setSelectedEventId(null);
    setDescription("");
  };

  const [isViewMode, setIsViewMode] = useState(false);

  const [deleteEvent, { isLoading: deleteEventLoading }] =
    useDeleteEventMutation();

  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await deleteEvent({ eventId });
      if (response.error) {
        showToast("error", response?.error?.error || "An error occurred.");
      } else {
        showToast("success", response?.data?.message);
        setModel(false);
        setIsViewMode(false);
        resetEvent();
      }
    } catch (error) {
      console.error("Delete event error:", error);
      showToast("error", "Failed to delete event");
    }
  };

  const [updateEvent, { isLoading: updateEventLoading }] =
    useUpdateEventMutation();

  const handleUpdateEvent = async (eventId) => {
    validateInputs();
    try {
      const payload = {
        title,
        subject: subject.value,
        startTime,
        endTime,
        date,
        room: selectedClassroom.value,
        createdBy: myProfile?.data?._id,
      };

      const response = await updateEvent({
        eventId: eventId,
        payload: payload, // Match the structure expected by your API
      });

      if (response.error) {
        showToast(
          "error",
          response.error.data?.message || response.error.data?.error
        );
      } else {
        showToast("success", response?.data?.message);
        setModel(false);
        setIsViewMode(false);
        resetEvent();
      }
    } catch (error) {
      console.error("Update event error:", error);
      showToast("error", error?.data?.message || error?.data?.error);
    }
  };

  // Add a state to store the selected event ID
  const [selectedEventId, setSelectedEventId] = useState(null);

  return (
    <>
      <View style={styles.contaner}>
        <ReactNativeModal
          backdropOpacity={0.3}
          isVisible={model}
          onBackdropPress={() => setModel(false)}
          onSwipeComplete={() => setModel(false)}
          swipeDirection={["down"]}
          style={styles.bottomView}
          onRequestClose={() => setModel(false)}
        >
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.content2}>
              <View style={styles.container}>
                <TouchableOpacity
                  hitSlop={{ top: 30, bottom: 30, right: 30, left: 30 }}
                  onPress={() => {
                    setModel(false);
                    setIsViewMode(false);
                    resetEvent();
                  }}
                  activeOpacity={0.5}
                >
                  <Image
                    style={{ alignSelf: "flex-end", height: 25, width: 25 }}
                    source={require("../../assets/images/closeIcon.png")}
                  />
                </TouchableOpacity>

                <Text
                  style={{
                    fontFamily: Fonts.PoppinsBold,
                    fontSize: 16,
                    fontWeight: "700",
                    color: "#47424F",
                    marginTop: getHeight(1),
                    marginBottom: getHeight(2.2),
                  }}
                >
                  {isViewMode ? "Event Details" : "Create new event"}
                </Text>
                <View>
                  <Text style={styles.txt2}>Title</Text>

                  <TextInput
                    mode="outlined"
                    editable={true}
                    theme={{ roundness: getFontSize(1) }}
                    outlineColor="#D8DADC"
                    cursorColor="#D8DADC"
                    textColor="#747988"
                    activeUnderlineColor="#D8DADC"
                    activeOutlineColor="#D8DADC"
                    placeholder="add title"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                    placeholderTextColor={colors.placeholderTextColor}
                    style={{
                      ...GernalStyle.input,
                      width: getWidth(82),
                      marginBottom: 5,
                      fontSize: 14,
                      borderRadius: 5,
                      fontFamily: Fonts.PoppinsRegular,
                      height: getHeight(5),
                    }}
                    returnKeyType={"next"}
                    keyboardType="default"
                    blurOnSubmit={false}
                  />
                  {errors.title ? (
                    <Text style={{ color: colors.red, marginBottom: 5 }}>
                      {errors.title}
                    </Text>
                  ) : null}
                  <SelectDropdown
                    defaultValue={subject ? subject.label : null}
                    data={
                      getAllSubjects.length > 0
                        ? getAllSubjects
                        : [{ label: "Subject is not found", value: null }]
                    }
                    defaultButtonText="Subject"
                    buttonStyle={{
                      width: "100%",
                      backgroundColor: "white",
                      borderWidth: 1,
                      borderColor: "#BCBCBC",
                      borderRadius: 5,
                      marginBottom: 5,
                      height: getHeight(5),
                    }}
                    buttonTextStyle={{
                      color: "#929292",
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: 14,
                      fontWeight: "400",
                      textAlign: "left",
                    }}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Entypo
                          name={
                            isOpened ? "chevron-thin-up" : "chevron-thin-down"
                          }
                          color={"#BCBCBC"}
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
                    onSelect={(selectedItem) => {
                      setSubject(selectedItem);
                    }}
                    renderCustomizedRowChild={(item) => (
                      <View>
                        <Text
                          style={{
                            color: "black",
                            fontSize: getFontSize(2),
                            textAlign: "left",
                            paddingLeft: 10,
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    )}
                    renderCustomizedButtonChild={(selectedItem) => {
                      return (
                        <View>
                          <Text>
                            {(selectedItem && selectedItem.label) || "Subject"}
                          </Text>
                        </View>
                      );
                    }}
                  />
                  {errors.subject ? (
                    <Text style={{ color: colors.red }}>{errors.subject}</Text>
                  ) : null}
                </View>

                <View style={{ marginTop: getHeight(1) }}>
                  <Text style={styles.txt2}>Date</Text>
                  <DatePicker
                    modal
                    open={open}
                    mode="date"
                    date={new Date(date)}
                    onConfirm={(selectedDate) => {
                      setOpen(false);
                      setDate(new Date(selectedDate));
                      console.log(
                        "Selected Date:",
                        selectedDate.toLocaleDateString()
                      );
                    }}
                    onCancel={() => {
                      setOpen(false);
                    }}
                  />
                  <TextInput
                    mode="outlined"
                    editable={!isViewMode}
                    value={new Date(date).toLocaleDateString()}
                    theme={{ roundness: getFontSize(0.5) }}
                    outlineColor="rgba(189, 189, 189, 1)"
                    cursorColor="rgba(189, 189, 189, 1)"
                    textColor="rgba(189, 189, 189, 1)"
                    activeUnderlineColor="rgba(189, 189, 189, 1)"
                    activeOutlineColor="rgba(189, 189, 189, 1)"
                    style={{
                      ...GernalStyle.input,
                      width: getWidth(82),
                      height: getHeight(5),
                      marginBottom: 5,
                    }}
                    onPressIn={() => setOpen(true)}
                    right={
                      <TextInput.Icon
                        icon={() => (
                          <AntDesign
                            name={"calendar"}
                            onPress={() => setOpen(true)}
                            size={getFontSize(2.5)}
                            color={"#929292"}
                          />
                        )}
                      />
                    }
                  />
                </View>

                <View>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: Fonts.PoppinsMedium,
                      alignSelf: "center",
                    }}
                  >
                    OR
                  </Text>

                  <SelectDropdown
                    defaultValue={selectDay}
                    data={[
                      "Sunday",
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ]}
                    defaultButtonText="Every"
                    buttonStyle={{
                      width: "40%",
                      backgroundColor: "white",
                      borderWidth: 1,
                      alignSelf: "center",
                      borderColor: "#BCBCBC",
                      borderRadius: 5,
                      marginBottom: 5,
                      height: getHeight(5),
                    }}
                    buttonTextStyle={{
                      color: "#929292",
                      fontFamily: Fonts.PoppinsRegular,
                      fontSize: 14,
                      fontWeight: "400",
                      textAlign: "left",
                    }}
                    renderDropdownIcon={(isOpened) => {
                      return (
                        <Entypo
                          name={
                            isOpened ? "chevron-thin-up" : "chevron-thin-down"
                          }
                          color={"#BCBCBC"}
                          size={getFontSize(2)}
                        />
                      );
                    }}
                    dropdownIconPosition={"right"}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={{
                      backgroundColor: "white",
                      borderRadius: 5,
                      height: getHeight(25),
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
                    onSelect={(selectedItem, index) => {
                      setSelectDay(selectedItem);
                    }}
                  />
                </View>

                <View style={{ marginTop: getHeight(1) }}>
                  <DatePicker
                    modal
                    open={openStartPicker}
                    mode="time"
                    date={startTime}
                    onConfirm={(date) => {
                      setOpenStartPicker(false);
                      setStartTime(date);
                      console.log(
                        "Selected Start Time:",
                        date.toLocaleTimeString()
                      ); // Log start time
                    }}
                    onCancel={() => {
                      setOpenStartPicker(false);
                    }}
                  />
                  {/* End Time (Fin) Picker */}
                  <DatePicker
                    modal
                    open={openEndPicker}
                    mode="time"
                    date={endTime}
                    onConfirm={(date) => {
                      setOpenEndPicker(false);
                      setEndTime(date);
                      console.log(
                        "Selected End Time:",
                        date.toLocaleTimeString()
                      ); // Log end time
                    }}
                    onCancel={() => {
                      setOpenEndPicker(false);
                    }}
                  />

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                    }}
                  >
                    <View>
                      <Text style={styles.txt2}>Start Time</Text>
                      <TextInput
                        mode="outlined"
                        editable={!isViewMode}
                        value={startTime.toLocaleTimeString()}
                        theme={{ roundness: getFontSize(0.5) }}
                        outlineColor="rgba(189, 189, 189, 1)"
                        cursorColor="rgba(189, 189, 189, 1)"
                        textColor="rgba(189, 189, 189, 1)"
                        activeUnderlineColor="rgba(189, 189, 189, 1)"
                        activeOutlineColor="rgba(189, 189, 189, 1)"
                        style={{
                          ...GernalStyle.input,
                          width: getWidth(38),
                          height: getHeight(5),
                        }}
                        onPressIn={() => setOpenStartPicker(true)}
                        returnKeyType={"send"}
                        accessibilityLabel="Select Start Time"
                        right={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name={"time-outline"}
                                onPress={() => setOpenStartPicker(true)}
                                size={getFontSize(2.5)}
                                color={"#929292"}
                                style={{ marginLeft: 10 }}
                              />
                            )}
                          />
                        }
                        blurOnSubmit={false}
                      />
                    </View>

                    <View>
                      <Text style={styles.txt2}>End Time</Text>
                      <TextInput
                        mode="outlined"
                        editable={!isViewMode}
                        value={endTime.toLocaleTimeString()} // Show selected end time
                        theme={{ roundness: getFontSize(0.5) }}
                        outlineColor="rgba(189, 189, 189, 1)"
                        cursorColor="rgba(189, 189, 189, 1)"
                        textColor="rgba(189, 189, 189, 1)"
                        activeUnderlineColor="rgba(189, 189, 189, 1)"
                        activeOutlineColor="rgba(189, 189, 189, 1)"
                        style={{
                          ...GernalStyle.input,
                          width: getWidth(38),
                          height: getHeight(5),
                        }}
                        onPressIn={() => setOpenEndPicker(true)}
                        returnKeyType={"send"}
                        accessibilityLabel="Select End Time"
                        right={
                          <TextInput.Icon
                            icon={() => (
                              <Ionicons
                                name={"time-outline"}
                                onPress={() => setOpenEndPicker(true)}
                                size={getFontSize(2.5)}
                                style={{ marginLeft: 10 }}
                                color={"#929292"}
                              />
                            )}
                          />
                        }
                        blurOnSubmit={false}
                      />
                    </View>
                  </View>
                </View>

                <View>
                  <Text style={styles.txt2}>Description (Optional)</Text>

                  <TextInput
                    mode="outlined"
                    theme={{ roundness: getFontSize(1) }}
                    multiline={true}
                    numberOfLines={4}
                    placeholder="Enter Description"
                    textAlignVertical="top"
                    outlineColor="#D8DADC"
                    cursorColor="#D8DADC"
                    textColor="#747988"
                    activeUnderlineColor="#D8DADC"
                    activeOutlineColor="#D8DADC"
                    value={description}
                    onChangeText={(text) => setDescription(text)}
                    style={{
                      ...GernalStyle.input,
                      width: getWidth(82),
                      height: getHeight(12),
                    }}
                    returnKeyType={"next"}
                    keyboardType="default"
                    blurOnSubmit={false}
                  />
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    paddingBottom: 20,
                  }}
                >
                  <Button
                    onPress={() => {
                      if (isViewMode) {
                        if (selectedEventId) {
                          handleDeleteEvent(selectedEventId);
                        }
                      } else {
                        setModel(false);
                        setIsViewMode(false);
                        resetEvent();
                        setSelectedEventId(null);
                      }
                    }}
                    btnStyle={{
                      ...GernalStyle.btn,
                      backgroundColor: isViewMode ? colors.red : "#EFEFEF",
                      flexDirection: "row",
                      width: getWidth(35),
                      height: getHeight(5),
                      marginTop: getHeight(3),
                    }}
                    btnTextStyle={{
                      ...GernalStyle.btnText,
                      fontSize: 14,
                      color: isViewMode ? "white" : "#A6A6A6",
                    }}
                    text={isViewMode ? "Delete" : "Close"}
                    Loading={deleteEventLoading}
                  />

                  <Button
                    onPress={() => {
                      if (isViewMode) {
                        if (selectedEventId) {
                          handleUpdateEvent(selectedEventId);
                        }
                      } else {
                        handleEvent();
                      }
                    }}
                    btnStyle={{
                      ...GernalStyle.btn,
                      backgroundColor: colors.primary,
                      flexDirection: "row",
                      width: getWidth(35),
                      height: getHeight(5),
                      marginTop: getHeight(3),
                    }}
                    btnTextStyle={{
                      ...GernalStyle.btnText,
                      fontSize: 14,
                    }}
                    text={isViewMode ? "Update" : "Add"}
                    Loading={isViewMode ? updateEventLoading : eventLoading}
                  />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </ReactNativeModal>
        <GeneralStatusBar
          barStyle="light-content"
          hidden={false}
          backgroundColor={colors.primary}
          translucent={true}
        />
        <Header
          backgroundColor={colors.primary}
          title={"Calendar"}
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

        <View style={{ marginTop: 20 }}>
          {(role == "Family" || roleSpecific == "Student") && (
            <View>
              <Image
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  alignSelf: "center",
                }}
                resizeMode="cover"
                modalImageResizeMode="contain"
                source={require("../../assets/images/Pimg.jpeg")}
              />
              <Text
                style={{
                  color: "black",
                  fontFamily: "Poppins-Bold",
                  fontSize: 20,
                  fontWeight: "600",
                  alignSelf: "center",
                }}
              >
                Adam Jebli
              </Text>
            </View>
          )}
          <View
            style={{
              height: 50,
              borderWidth: 1,
              width: 185,
              borderColor: colors.primary,
              borderRadius: 10,
              alignSelf: "center",
              marginTop: 20,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: Fonts.PoppinsSemiBold,
                color: colors.primary,
              }}
            >
              {selectedClassroom?.label}
            </Text>
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
            }}
            iconContainer={{ flex: 0.05 }}
          />

          <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
            {!isLoading ? (
              <FlatList
                data={events?.data}
                renderItem={({ item, index }) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 10,
                      alignItems: "center",
                      gap: 5,
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
                      onPress={() => {
                        setTitle(item.title);
                        setSubject({
                          label: item.subject?.title,
                          value: item.subject?._id,
                        });
                        setDate(new Date(item.date));
                        setStartTime(new Date(item.startTime));
                        setEndTime(new Date(item.endTime));
                        setSelectedEventId(item._id);
                        setIsViewMode(true);
                        setModel(true);
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
                          {events?.data[index]?.subject?.title}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                style={{ height: normalizeSize(500), overflow: "hidden" }}
                showsVerticalScrollIndicator={false}
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
      {role == "Family" ? null : (
        <Button
          onPress={() => setModel(true)}
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            flexDirection: "row",
            width: getWidth(35),
            height: getHeight(5),
            marginTop: getHeight(0),
            position: "absolute",
            bottom: 30,
          }}
          btnTextStyle={{ ...GernalStyle.btnText, fontSize: 14 }}
          text={"New event"}
          leftIcon={
            <AntDesign
              size={20}
              style={{ marginRight: 7 }}
              name={"plussquareo"}
              color="white"
            />
          }
        />
      )}
    </>
  );
};
export default Calendrar;
