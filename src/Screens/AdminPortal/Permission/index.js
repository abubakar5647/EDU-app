import React, { useEffect, useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import Header from "../../../Components/Header";
import {
  useGetStaffQuery,
  useGetTeachersQuery,
  useMeQuery,
} from "../../../rtkQuery/slices/home";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppSelector } from "../../../rtkQuery/store";

const Permission = ({ navigation }) => {
  const { data: getTeacher } = useGetTeachersQuery();
  const { data: getStaff } = useGetStaffQuery();
  const { data: getMe } = useMeQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const role = useAppSelector((state) => state.gernal.follow);

  const teacherNames = getTeacher?.data.flatMap((data) =>
    Array.isArray(data.userId)
      ? data.userId.map((user) => `${user.firstName} ${user.lastName}`)
      : data.userId
      ? [`${data.userId.firstName} ${data.userId.lastName}`]
      : []
  );

  const staffNames = getStaff?.data.flatMap((data) =>
    Array.isArray(data.userId)
      ? data.userId.map((user) => `${user.firstName} ${user.lastName}`)
      : data.userId
      ? [`${data.userId.firstName} ${data.userId.lastName}`]
      : []
  );

  const filteredTeacherNames = (teacherNames || []).filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStaffNames = (staffNames || []).filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        RightIcon={<View />}
        title={"Permissions"}
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
        <TextInput
          style={{
            borderWidth: 1,
            height: 35,
            borderRadius: 5,
            borderColor: colors.gray7,
            padding: 8,
            marginTop: getHeight(3),
          }}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search..."
        />

        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 18,
            color: "#47424F",
            marginTop: getHeight(3),
            marginBottom: getHeight(1),
          }}
        >
          Administrator
        </Text>

        <TouchableOpacity
          activeOpacity={1}
          // onPress={() => navigation.navigate("PermissonGrant")}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            padding: 5,
            borderBottomColor: "#EAEAEA",
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_Bold",
              color: "#47424F",
            }}
          >
            {role === "Admin"
              ? `${getMe?.data?.firstName || "No"} ${
                  getMe?.data?.lastName || "Name"
                }`
              : `${getMe?.data?.userId?.schoolId?.adminId?.firstName || "No"} ${
                  getMe?.data?.userId?.schoolId?.adminId?.lastName || "Name"
                }`}
          </Text>
          <View
            style={{
              backgroundColor: "#FFD7D7",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 30,
            }}
          >
            <Text style={{ fontSize: 12, color: "#FF0000" }}>{"Admin"}</Text>
          </View>
        </TouchableOpacity>

        {getTeacher?.data.length ? (
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              color: "#47424F",
              marginTop: getHeight(3),
              marginBottom: getHeight(1),
            }}
          >
            Teacher
          </Text>
        ) : null}

        {filteredTeacherNames.map((value, index) => {
          const teacher = getTeacher?.data[index];
          if (!teacher || !teacher.userId) return null;

          return (
            <TouchableOpacity
              key={teacher.userId._id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("PermissonGrant", {
                  userId: teacher.userId.userId,
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                marginTop: getHeight(1.2),
                padding: 5,
                borderBottomColor: "#EAEAEA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_Bold",
                  color: "#47424F",
                }}
              >
                {value}
              </Text>
              <View
                style={{
                  backgroundColor: "#D7FFDB",
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 60,
                  height: 30,
                }}
              >
                <Text style={{ fontSize: 12, color: "#00FF1A" }}>
                  {teacher.userId.role}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {getStaff?.data.length ? (
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              color: "#47424F",
              marginTop: getHeight(3),
              marginBottom: getHeight(1),
            }}
          >
            Staff
          </Text>
        ) : null}

        {filteredStaffNames.map((value, index) => {
          const staff = getStaff?.data[index];
          if (!staff || !staff.userId) return null;

          return (
            <TouchableOpacity
              key={staff.userId._id}
              activeOpacity={0.7}
              onPress={() =>
                navigation.navigate("PermissonGrant", {
                  userId: staff.userId.userId,
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottomWidth: 1,
                marginTop: getHeight(1.2),
                padding: 5,
                borderBottomColor: "#EAEAEA",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins_Bold",
                  color: "#47424F",
                }}
              >
                {value}
              </Text>
              <View
                style={{
                  backgroundColor: "#FFD7D7",
                  borderRadius: 5,
                  justifyContent: "center",
                  alignItems: "center",
                  width: 60,
                  height: 30,
                }}
              >
                <Text style={{ fontSize: 12, color: "red" }}>
                  {staff.userId.role}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </KeyboardAwareScrollView>
    </View>
  );
};

export default Permission;
