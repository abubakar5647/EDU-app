import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";

import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import { Fonts } from "../../../assets/fonts";
import CustomText from "../../../Components/CustomText";
import { useGetTeachersQuery, useMeQuery } from "../../../rtkQuery/slices/home";
import { useGetStaffQuery } from "../../../rtkQuery/slices/home";
import { useSearchTeacherAndStaffQuery } from "../../../rtkQuery/slices/home";
import { useAppSelector } from "../../../rtkQuery/store";
const Teachers = ({ navigation, route }) => {
  const { data: getTeachers, teacherDataLoading: isTeachersLoading } =
    useGetTeachersQuery();
  const { data: getStaff, staffDataLoading: isStaffLoading } =
    useGetStaffQuery();
  const role = useAppSelector((state) => state.gernal.follow);

  const [searchQuery, setSearchQuery] = useState(userNames);
  const { data: searchUsersResults } = useSearchTeacherAndStaffQuery({
    userNames: searchQuery,
  });
  const [combinedData, setCombinedData] = useState([]);

  const userNames = combinedData.flatMap((item) =>
    item?.userId ? `${item?.userId?.firstName} ${item?.userId?.lastName}` : []
  );
  useEffect(() => {
    Promise.all([getTeachers, getStaff])
      .then(([teachersData, staffData]) => {
        if (!searchQuery) {
          const mergedData = [
            ...teachersData?.data.map((item) => ({
              ...item,
              role: "Teacher",
            })),
            ...staffData?.data.map((item) => ({
              ...item,
              role: "Staff",
            })),
          ];
          setCombinedData(mergedData);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [getTeachers, getStaff, searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const teachersData = getTeachers?.data || [];
        const staffData = getStaff?.data || [];
        const mergedData = [
          ...teachersData.map((item) => ({ ...item, role: "Teacher" })),
          ...staffData.map((item) => ({ ...item, role: "Staff" })),
        ];
        const filteredData = searchQuery
          ? mergedData.filter((item) => {
              const fullName = `${item?.userId?.firstName} ${item?.userId?.lastName}`;
              return fullName.toLowerCase().includes(searchQuery.toLowerCase());
            })
          : mergedData;
        setCombinedData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [getTeachers, getStaff, searchQuery]);

  const renderItem = ({ item, index }) => {
    const isFirstTeacher = index === 0 && item.role === "Teacher";
    const isFirstStaff =
      index > 0 &&
      combinedData[index - 1].role === "Teacher" &&
      item.role === "Staff";

    return (
      <>
        {isFirstTeacher && (
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
        )}
        {isFirstStaff && (
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
        )}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("AddTeacher", {
              isEdit: true,
              item: item,
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
            {`${item?.userId?.firstName} ${item?.userId?.lastName}`}
          </Text>
          <View
            style={{
              backgroundColor: item.role === "Teacher" ? "#D7FFDB" : "#FFD7D7",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
              width: 60,
              height: 30,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "400",
                color: item.role === "Teacher" ? "#00FF1A" : "#FF0000",
              }}
            >
              {item.role}
            </Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (isStaffLoading || isTeachersLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  const { data: admin } = useMeQuery();

  return (
    <View style={[styles.contaner, { flex: 1 }]}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        RightIcon={<View />}
        title={"Teacher / Staff"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />

      <View style={{ flex: 1, width: getWidth(90), alignSelf: "center" }}>
        <Button
          text={"Add Staff"}
          onPress={() =>
            navigation.navigate("AddTeacher", {
              isEdit: false,
            })
          }
          btnTextStyle={{
            color: colors.white,
            fontSize: 14,
            fontFamily: Fonts.PoppinsMedium,
          }}
          btnStyle={{
            ...GernalStyle.btn,
            alignSelf: "flex-end",
            flexDirection: "row",
            backgroundColor: colors.primary,
            width: getWidth(41),
            height: getHeight(4),
            marginTop: getHeight(3),
          }}
          leftIcon={
            <AntDesign
              style={{ marginRight: getWidth(2) }}
              name={"plussquareo"}
              size={16}
              color={"white"}
            />
          }
        />
        <View style={{ ...styles.row, marginBottom: getHeight(2) }}>
          <CustomText
            label={"Filter by"}
            fontSize={14}
            fontFamily={Fonts.PoppinsMedium}
            color={colors.primary}
          />
          <AntDesign
            name="filter"
            color={colors.primary}
            size={15}
            style={{ marginLeft: 5 }}
          />
        </View>
        <TextInput
          style={GernalStyle.borderInputStyle}
          placeholder="Search teacher / Staff"
          value={searchQuery}
          onChangeText={(text) => {
            setSearchQuery(text);
          }}
        />

        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 18,
              color: "#47424F",
              marginTop: getHeight(2),
              marginBottom: getHeight(1),
            }}
          >
            Administrator
          </Text>
          <View
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
                ? `${admin?.data?.firstName || "No"} ${
                    admin?.data?.lastName || "Name"
                  }`
                : `${
                    admin?.data?.userId?.schoolId?.adminId?.firstName || "No"
                  } ${
                    admin?.data?.userId?.schoolId?.adminId?.lastName || "Name"
                  }`}

              {/* {admin?.data?.userId?.schoolId?.adminId?.firstName}{" "}
              {admin?.data?.userId?.schoolId?.adminId?.lastName} */}
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#FFD7D7",
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
                width: 60,
                height: 30,
              }}
              activeOpacity={1}
              // onPress={() => navigation.navigate("FamilyProfile")}
            >
              <Text
                style={{ fontSize: 12, fontWeight: "400", color: "#FF0000" }}
              >
                Admin
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
            data={combinedData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginVertical: 10,
          }}
        >
          <Button
            onPress={() => navigation.goBack()}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: "#EFEFEF",
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 15,
              color: "#A6A6A6",
            }}
            text={"Cancel"}
          />
          <Button
            // onPress={() => setModel(true)}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
            }}
            btnTextStyle={{ ...GernalStyle.btnText, fontSize: 15 }}
            text={"Next"}
          />
        </View>
      </View>
    </View>
  );
};
export default Teachers;
