import React, { useState, useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Message from "../Message";
import SelectDropdown from "react-native-select-dropdown";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import Icons from "../../Components/Icons";
import SwitchComponent from "../../Components/Switch";
import IconsRender from "../Room/molecule/IconsRender";
import RenderFlatlist from "../Room/molecule/RenderFlatlist";
import {
  useAbsentStudentMutation,
  useCheckInStudentMutation,
  useCheckOutStudentMutation,
  useGetStudentsQuery,
} from "../../rtkQuery/slices/home";
import { showToast } from "../../Components/Toaster";
import { useSelector, useDispatch } from "react-redux";
import {
  setAttendanceID,
  toggleStudentSelection,
} from "../../rtkQuery/slices/user/user.slice";
import moment from "moment";
const Students = ({ navigation, route }) => {
  const [checkIn, { isLoading }] = useCheckInStudentMutation();
  const [checkOut, { isLoading: checkOutLoading }] =
    useCheckOutStudentMutation();
  const [absentStudent, { isLoading: absentLoading }] =
    useAbsentStudentMutation();
  const { title, selectedClassroom } = route.params || {};
  const dispatch = useDispatch();
  const studentId = useSelector((state) => state.user.selectedStudentsId);
  const attendanceID = useSelector((state) => state.user.attendanceID);
  // console.log('attendanceID================',attendanceID);
  // console.log('selectAll=============',selectAll);
  const { data: allStudent, refetch } = useGetStudentsQuery(
    moment.utc(new Date()).format("YYYY/MM/DD")
  );
  const [selectAll, setSelectAll] = useState();

  const handleSelectAll = (value) => {
    setSelectAll(value);
    if (value) {
      const allStudentIds = allStudent?.data?.map((student) => student._id);
      allStudentIds?.forEach((id) => {
        dispatch(toggleStudentSelection(id));
      });
    } else {
      const allStudentIds = allStudent?.data?.map((student) => student._id);
      allStudentIds?.forEach((id) => {
        dispatch(toggleStudentSelection(id));
      });
    }
  };

  const handleCheckInStudent = async () => {
    if (!studentId) {
      showToast("error", "Please select a student before check in.");
      return;
    }
    try {
      const payload = {
        studentId: studentId,
        checkInTime: moment.utc(new Date()),
      };
      console.log("payload,payloadpayloadpayload", payload);
      const res = await checkIn(payload);
      console.log("res================", res?.data?.data);
      if (res?.data) {
        refetch();
        showToast("success", res?.data?.message);
        const attendanceID = res?.data?.data.map((text) => text._id);

        dispatch(setAttendanceID(attendanceID));
      } else {
        showToast("error", res?.error?.data?.message);
      }
    } catch (error) {
      console.log("error==========", error);
      showToast("error", error.message || "An error occurred");
    }
  };

  const handleCheckOutStudent = async () => {
    if (!studentId) {
      showToast("error", "Please select a student before check in.");
      return;
    }
    try {
      const payload = {
        checkOutTime: new Date(),
        studentId: studentId,
      };
      console.log("payload====>>>", payload);
      const res = await checkOut(payload);
      if (res?.data) {
        showToast("success", res?.data?.message);
        refetch();
      } else {
        showToast("error", res?.error?.data?.message);
      }
      console.log("CheckOut============", res);
    } catch (error) {
      console.log("error==========", error);
    }
  };

  const handleAbsent = async () => {
    if (!studentId) {
      showToast("error", "Please select a student before marking as absent.");
      return;
    }
    try {
      const payload = {
        studentId: studentId,
      };
      const res = await absentStudent(payload);
      if (res?.data) {
        showToast("success", res?.data?.message);
        refetch();
      } else {
        showToast("error", res?.error?.data?.message);
      }
      console.log("Absent============", res);
    } catch (error) {
      console.log("error==========", error);
    }
  };

  return (
    <ScrollView style={styles.contaner}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.PrimaryLight}
        translucent={true}
      />
      <Header
        color={colors.HeaderTextColor}
        title={selectedClassroom?.label}
        backgroundColor={colors.PrimaryLight}
        LeftIcon={
          <Icons
            family={"MaterialIcons"}
            size={30}
            color={colors.black}
            onPress={() => navigation.goBack()}
            name="keyboard-arrow-left"
          />
        }
        RightIcon={
          <Icons
            family={"Fontisto"}
            size={25}
            color={colors.HeaderTextColor}
            name="bell-alt"
          />
        }
      />

      <View style={{ width: getWidth(90), alignSelf: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: getHeight(2),
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 20,
                  fontWeight: "700",
                  color: "#47424F",
                  marginTop: getHeight(1),
                  marginBottom: getHeight(2.2),
                }}
              >
                All students
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "Poppins-Medium",
                  color: "#47424F",
                  marginRight: getWidth(2),
                }}
              >
                Select All
              </Text>
              <SwitchComponent
                value={selectAll}
                onValueChange={handleSelectAll}
              />
            </View>
          </View>
        </View>
        <IconsRender />
        <RenderFlatlist
          isButton={true}
          selectedClassroom={selectedClassroom}
          selectAll={selectAll}
        />
      </View>

      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginVertical: 20,
          }}
        >
          <Button
            Loading={isLoading}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 17,
              color: "white",
            }}
            onPress={handleCheckInStudent}
            text={"Check in"}
          />
          <Button
            onPress={handleCheckOutStudent}
            Loading={checkOutLoading}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 17,
              color: "white",
            }}
            text={"Check Out"}
          />
        </View>
        <Button
          onPress={handleAbsent}
          Loading={absentLoading}
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.red,
            flexDirection: "row",
            width: getWidth(42),
            height: getHeight(5),
            marginBottom: 10,
          }}
          btnTextStyle={{
            ...GernalStyle.btnText,
            fontSize: 17,
            color: "white",
          }}
          text={"Absent"}
        />
      </View>
    </ScrollView>
  );
};
export default Students;
