import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo";
import Header from "../../Components/Header";
import SelectDropdown from "react-native-select-dropdown";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { Fonts } from "../../assets/fonts";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import {
  useGetCareerQuery,
  useGetGroupsQuery,
  useGetLevelQuery,
  useGetRoomsQuery,
  useMoveRoomMutation,
} from "../../rtkQuery/slices/home";
import { showToast } from "../../Components/Toaster";

const Classes = ({ navigation, route }) => {
  const { studentId } = route.params;
  const studentIdArray = [studentId];
  const [careerId, setCareerId] = useState(null);
  const [levelId, setLevelId] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [groupId, SetGroupId] = useState(null);
  const { data: getCareer } = useGetCareerQuery();
  const { data: getLevel } = useGetLevelQuery(careerId);
  const { data: getRooms, error: rooError } = useGetRoomsQuery(levelId);
  const isButtonEnabled = careerId && levelId && roomId;
  const [moveRoom, { isLoading }] = useMoveRoomMutation();

  console.log("careerIdcareerIdcareerId", careerId);

  const handleRoom = async () => {
    if (!careerId || !levelId) {
      alert("Please Fill Fields");
      return;
    }
    try {
      const payload = {
        students: studentIdArray,
        roomId: roomId,
        // groupId: groupId,
      };
      const res = await moveRoom(payload);
      if (res?.data) {
        showToast("success", res?.data?.message);
        navigation.goBack();
      } else {
        showToast("error", res?.error?.data?.message);
      }
      console.log("res=============", res);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleSelect = (selectedItem) => {
    const selectedItemData = getCareer?.data?.find(
      (item) => item.name === selectedItem
    );
    if (selectedItemData) {
      setCareerId(selectedItemData._id);
    }
  };

  return (
    <View style={styles?.parent}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        RightIcon={<View />}
        title={"Classes"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <View style={{ paddingTop: getHeight(10), paddingHorizontal: 20 }}>
        <SelectDropdown
          defaultValue={"School career"}
          data={
            getCareer?.data?.length > 0
              ? getCareer.data.map((item) => item.name)
              : ["No Data"]
          }
          // onSelect={(selectedItem, index) => {
          //   const selectedItemId = getCareer?.data[index]._id;
          //   setCareerId(selectedItemId);
          // }}
          onSelect={(selectedItem) => handleSelect(selectedItem)}
          defaultButtonText="School career"
          buttonStyle={{
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <Entypo
                name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                color={colors?.primary}
                size={getFontSize(1.8)}
                style={{ marginRight: 12 }}
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
          defaultValue={"Level"}
          data={
            getLevel?.data?.length > 0
              ? getLevel.data.map((item) => item.name)
              : ["No Data"]
          }
          onSelect={(selectedItem, index) => {
            const selectedItemId = getLevel?.data[index]._id;
            setLevelId(selectedItemId);
          }}
          defaultButtonText="Level"
          buttonStyle={{
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: 20,
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <Entypo
                name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                color={colors?.primary}
                size={getFontSize(1.8)}
                style={{ marginRight: 12 }}
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
          defaultValue={"Rooms"}
          data={
            getRooms?.data?.length > 0
              ? getRooms.data.map((item) => item.name)
              : ["No Data"]
          }
          onSelect={(selectedItem, index) => {
            const selectedItemId = getRooms?.data[index]._id;
            setRoomId(selectedItemId);
          }}
          defaultButtonText="Rooms"
          buttonStyle={{
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginTop: 20,
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <Entypo
                name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                color={colors?.primary}
                size={getFontSize(1.8)}
                style={{ marginRight: 12 }}
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
            fontFamily: "Poppins-bold",
          }}
        />
        {/* <SelectDropdown
          defaultValue={"Groups"}
          data={
            getGroups?.data?.length > 0
              ? getGroups.data.map((item) => item.name)
              : ["No Data"]
          }
          onSelect={(selectedItem, index) => {
            const selectedItemId = getGroups?.data[index]._id;
            SetGroupId(selectedItemId);
          }}
          defaultButtonText="Groups"
          buttonStyle={{
            width: getWidth(48),
            backgroundColor: "white",
            borderWidth: 1,
            borderColor: colors?.primary,
            height: getHeight(5),
            alignSelf: "center",
            marginVertical: 20,
          }}
          buttonTextStyle={{
            color: colors?.primary,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          renderDropdownIcon={(isOpened) => {
            return (
              <Entypo
                name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                color={colors?.primary}
                size={getFontSize(1.8)}
                style={{ marginRight: 12 }}
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
        /> */}
        <Button
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,

            width: getWidth(42),
            height: getHeight(5),
            marginTop: getHeight(5),
          }}
          btnTextStyle={{
            ...GernalStyle.btnText,
            fontSize: 14,
            color: "white",
          }}
          onPress={handleRoom}
          Loading={isLoading}
          text={"Move to this room"}
        />
      </View>
    </View>
  );
};

export default Classes;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "white",
  },
  photo: {
    height: 270,
    width: 250,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: 20,
  },
});
