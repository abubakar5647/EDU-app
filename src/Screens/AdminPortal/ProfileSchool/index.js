import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ActivityIndicator } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";

import { Switch, TextInput } from "react-native-paper";
import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  useGetSchoolDashboardQuery,
  useMeQuery,
} from "../../../rtkQuery/slices/home";

const ProfileSchool = ({ navigation, route }) => {
  const [schoolName, setSchoolName] = useState("");
  const [schoolPhoneNo, setSchoolPhoneNo] = useState("");
  const [capacity, setCapacity] = useState("");
  const [address, setaAdress] = useState("");
  const [loading, setLoading] = useState(true);
  const { data: GetDashBoard, refetch } = useGetSchoolDashboardQuery();
  const { data, isLoading, refetch: isMeRefetch } = useMeQuery();

  useEffect(() => {
    refetch();
    isMeRefetch();
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  }, [refetch]);

  useEffect(() => {
    if (data?.data?.userId || GetDashBoard) {
      const { address, capacity, schoolName } = data?.data?.userId;
      setSchoolName(GetDashBoard?.data?.school?.schoolName);
      setaAdress(GetDashBoard?.data?.school?.address);
      setCapacity(GetDashBoard?.data?.school?.capacity);
      setSchoolPhoneNo(data?.data?.phoneNo);
    }
  }, [data, GetDashBoard]);

  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      ) : (
        <View style={styles.contaner}>
          <GeneralStatusBar
            barStyle="light-content"
            hidden={false}
            backgroundColor={colors.primary}
            translucent={true}
          />

          <Header
            backgroundColor={colors.primary}
            RightIcon={<View />}
            title={GetDashBoard?.data?.school?.schoolName}
            TitelStyle={{
              color: "white",
              fontSize: 24,
              fontWeight: "600",
            }}
            LeftIcon={
              <AntDesign
                size={30}
                color={"white"}
                onPress={() => navigation.goBack()}
                name="arrowleft"
              />
            }
          />
          <KeyboardAwareScrollView
            style={{ width: getWidth(90), alignSelf: "center" }}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: getHeight(2.5),
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate("Rooms")}
                style={{
                  backgroundColor: "#E2EDFF",
                  borderRadius: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: getHeight(16),
                  width: getWidth(43.5),
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "600",
                    fontSize: 16,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  Classrooms
                </Text>
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "900",
                    fontSize: 30,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  {GetDashBoard?.data?.rooms}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Student")}
                style={{
                  backgroundColor: "#ECD7FF",
                  borderRadius: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: getHeight(16),
                  width: getWidth(43.5),
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "600",
                    fontSize: 16,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  Students
                </Text>
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "900",
                    fontSize: 30,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  {GetDashBoard?.data?.students}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: getHeight(1.5),
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("Parents", {
                    isFirstParentScreen: true,
                  })
                }
                style={{
                  backgroundColor: "#FDDCF4",
                  borderRadius: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: getHeight(16),
                  width: getWidth(43.5),
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "600",
                    fontSize: 16,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  Parents
                </Text>
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "900",
                    fontSize: 30,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  {GetDashBoard?.data?.parents}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Teachers")}
                style={{
                  backgroundColor: "#E1E6FF",
                  borderRadius: 5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  height: getHeight(16),
                  width: getWidth(43.5),
                  padding: 20,
                }}
              >
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "600",
                    fontSize: 16,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  Teacher / Staff
                </Text>
                <Text
                  style={{
                    color: "#47424F",
                    fontWeight: "900",
                    fontSize: 30,
                    fontFamily: "Poppins_Bold",
                  }}
                >
                  {GetDashBoard?.data?.teachersStaffs}
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate("Permission")}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: getWidth(2),
                marginTop: getHeight(5),
              }}
            >
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#47424F",
                }}
              >
                Permissions
              </Text>
              <AntDesign name={"right"} color="black" size={20} />
            </TouchableOpacity>
            <View>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#47424F",
                  marginTop: getHeight(3),
                  marginBottom: getHeight(0.5),
                  marginLeft: getWidth(2),
                }}
              >
                School information
              </Text>
              <TextInput
                mode="flat"
                placeholder="School name"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#47424F"
                cursorColor="#47424F"
                textColor="#47424F"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#47424F"
                style={[GernalStyle.input, { marginLeft: -5 }]}
                returnKeyType={"next"}
                keyboardType="default"
                blurOnSubmit={false}
                value={schoolName}
                onChangeText={setSchoolName}
              />
              <TextInput
                mode="flat"
                placeholder="School phone number"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#47424F"
                cursorColor="#47424F"
                textColor="#47424F"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#47424F"
                style={[GernalStyle.input, { marginLeft: -5 }]}
                returnKeyType={"next"}
                keyboardType="default"
                blurOnSubmit={false}
                value={schoolPhoneNo}
                onChangeText={setSchoolPhoneNo}
              />
              <TextInput
                mode="flat"
                placeholder="Capacity of school"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#47424F"
                cursorColor="#47424F"
                textColor="#47424F"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#47424F"
                style={[GernalStyle.input, { marginLeft: -5 }]}
                returnKeyType={"next"}
                keyboardType="default"
                blurOnSubmit={false}
                value={capacity}
                onChangeText={setCapacity}
              />
              <TextInput
                mode="flat"
                placeholder="Address"
                theme={{ roundness: getFontSize(1) }}
                outlineColor="#47424F"
                cursorColor="#47424F"
                textColor="#47424F"
                activeUnderlineColor="#D8DADC"
                activeOutlineColor="#47424F"
                style={[GernalStyle.input, { marginLeft: -5 }]}
                returnKeyType={"next"}
                keyboardType="default"
                blurOnSubmit={false}
                value={address}
                onChangeText={setaAdress}
              />
            </View>
          </KeyboardAwareScrollView>
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              marginTop: getHeight(3),
              marginBottom: 30,
            }}
            btnTextStyle={GernalStyle.btnText}
            text={"Save"}
          />
        </View>
      )}
    </>
  );
};
export default ProfileSchool;
