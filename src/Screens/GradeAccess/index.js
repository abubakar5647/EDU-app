import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import SelectDropdown from "react-native-select-dropdown";
import AddGrade from "../Gradebook/moelcule/AddGrade";
import { useSelector } from "react-redux";
import { Empty, girl } from "../../assets/images";
import CustomText from "../../Components/CustomText";
import { Fonts } from "../../assets/fonts";
import {
  useSingleStudentGradesQuery,
  useStudentGradeQuery,
} from "../../rtkQuery/slices/home";
import { API_ROUTES } from "../../rtkQuery/routes";
import { normalizeSize } from "../../../utils";
import moment from "moment";

const GradeAcsess = ({ navigation, route }) => {
  const { studentId, image, first, last, isEditStudent } = route.params || {};
  const firstName = isEditStudent?.firstName || " No";
  const lastName = isEditStudent?.lastName || " Name";
  const studentIdForGrades = isEditStudent?._id;
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [studentGradeData, setStudentGradeData] = useState([]);
  const [parentGradeData, setParentGradeData] = useState([]);
  const {
    data: getSingeStudentGrades,
    isError: parentError,
    isLoading: GradeLoading,
    isFetching,
  } = useSingleStudentGradesQuery({
    studentId: studentIdForGrades,
    month: month,
    year: year,
  });
  console.log("parentGradeData", parentGradeData);
  useEffect(() => {
    if (getSingeStudentGrades?.data && !parentError) {
      setParentGradeData(getSingeStudentGrades.data);
    } else if (parentError) {
      setParentGradeData([]);
    }
  }, [getSingeStudentGrades?.data, parentError]);

  const {
    data: studentGrade,
    refetch,
    isError,
    isLoading,
    isFetching: gradeFetching,
  } = useStudentGradeQuery({
    studentId: studentId,
    month: month,
    year: year,
  });
  useEffect(() => {
    if (studentGrade?.data) {
      setStudentGradeData(studentGrade.data);
    }
    if (isError) {
      setStudentGradeData([]);
    }
  }, [studentGrade, isError]);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2000 + 1 }, (_, index) =>
    (2000 + index).toString()
  );
  console.log("studentGrade================", studentGradeData);
  const [gradeModel, setGradeModel] = useState(false);
  const role = useSelector((state) => state.gernal.follow);
  const monthToNumber = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    June: 6,
    July: 7,
    Aug: 8,
    Sept: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };

  const months = Object.keys(monthToNumber).map((key) => ({
    name: key,
    value: String(monthToNumber[key]).padStart(2, "0"),
  }));
  const renderItem = ({ item }) => {
    const student = item.subjectId;
    return (
      <TouchableOpacity
        style={{
          ...styles.tableRow,
          // borderBottomWidth: 1,
          borderWidth: 0.5,
          borderColor: colors.borderlightColor,
        }}
        activeOpacity={0.5}
      >
        {/* Student Name */}
        <View
          style={{
            ...styles.tableVerticalLine,
            width: "32%",
            borderLeftWidth: 1,
          }}
        >
          <Text style={styles.tableCell} numberOfLines={1}>
            {student?.title || "--"}
          </Text>
        </View>

        {/* Date */}
        <View style={{ ...styles.tableVerticalLine, width: "30%" }}>
          <Text style={styles.tableCell}>
            {moment(item.date).format("DD/MM/YYYY")}
          </Text>
        </View>

        {/* Grade */}
        <View style={{ ...styles.tableVerticalLine, width: "15%" }}>
          <Text style={styles.tableCell}>{item.grade}</Text>
        </View>

        {/* Observation */}
        <View style={{ ...styles.tableVerticalLine, width: "26%" }}>
          <Text style={styles.tableCell}>{item.observation}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderParentItem = ({ item }) => {
    const student = item.subjectId;
    return (
      <TouchableOpacity
        style={{
          ...styles.tableRow,
          // borderBottomWidth: 1,
          borderWidth: 0.5,
          borderColor: colors.borderlightColor,
        }}
        activeOpacity={0.5}
      >
        {/* Student Name */}
        <View
          style={{
            ...styles.tableVerticalLine,
            width: "32%",
            borderLeftWidth: 1,
          }}
        >
          <Text style={styles.tableCell} numberOfLines={1}>
            {student?.title || "--"}
          </Text>
        </View>

        {/* Date */}
        <View style={{ ...styles.tableVerticalLine, width: "30%" }}>
          <Text style={styles.tableCell}>
            {moment(item.date).format("DD/MM/YYYY")}
          </Text>
        </View>

        {/* Grade */}
        <View style={{ ...styles.tableVerticalLine, width: "15%" }}>
          <Text style={styles.tableCell}>{item.grade}</Text>
        </View>

        {/* Observation */}
        <View style={{ ...styles.tableVerticalLine, width: "26%" }}>
          <Text style={styles.tableCell}>{item.observation}</Text>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Grades"}
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
      <ScrollView>
        <View style={{ marginTop: getHeight(3) }}>
          <View
            style={{
              backgroundColor: "#B1B1B1",
              height: 100,
              width: 100,
              borderRadius: 50,
              alignSelf: "center",
            }}
          >
            <Image
              source={{
                uri: `${API_ROUTES.BASE_URL}/${image}`,
              }}
              style={{
                height: "100%",
                width: "100%",
                resizeMode: "contain",
                borderRadius: 50,
              }}
            />
          </View>
          {role === "Admin" || role === "Teacher" ? (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: "#47424F",
                fontFamily: "Poppins-Bold",
                marginTop: getHeight(0.5),
                color: colors.primary,
                alignSelf: "center",
                marginBottom: getHeight(2),
              }}
            >
              {`${first} ${last}`}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: "#47424F",
                fontFamily: "Poppins-Bold",
                marginTop: getHeight(0.5),
                color: colors.primary,
                alignSelf: "center",
                marginBottom: getHeight(2),
              }}
            >
              {`${firstName} ${lastName}`}
            </Text>
          )}

          <SelectDropdown
            defaultValue={"Year"}
            data={years}
            onSelect={(year) => {
              setYear(year);
            }}
            defaultButtonText="Year"
            buttonStyle={{
              width: getWidth(45),
              backgroundColor: "white",
              borderWidth: 1,
              borderRadius: 10,
              borderColor: colors?.primary,
              height: getHeight(5),
              marginVertical: 10,
              marginRight: 10,
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
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              paddingHorizontal: 10,
            }}
          >
            <AntDesign size={20} color={"black"} name="left" />
            <View
              style={{
                width: "87%",
                alignSelf: "center",
              }}
            >
              <FlatList
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => (
                  <View style={{ width: getWidth(1) }} />
                )}
                ListHeaderComponent={() => (
                  <View style={{ width: getWidth(3) }} />
                )}
                ListFooterComponent={() => (
                  <View style={{ width: getWidth(3) }} />
                )}
                horizontal={true}
                data={months}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => {
                      setMonth(item.value);
                      refetch();
                    }}
                    style={
                      month === item.value
                        ? {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: "#50C2C9",
                            borderRadius: 5,
                          }
                        : {
                            paddingHorizontal: 20,
                            paddingVertical: 10,
                            backgroundColor: "#F8F8F8",
                            borderRadius: 5,
                          }
                    }
                  >
                    <Text
                      style={
                        month === item.value
                          ? {
                              color: "white",
                              fontSize: 12,
                              fontWeight: "500",
                            }
                          : {
                              fontSize: 12,
                              color: "black",
                              fontWeight: "500",
                            }
                      }
                    >
                      {item.name}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
            <AntDesign size={20} color={"black"} name="right" />
          </View>
          <View style={styles.row}>
            <CustomText
              label={
                month && year ? `${month} / ${year}` : "Select Month and Year"
              }
              fontSize={18}
              fontFamily={Fonts.PoppinsBold}
            />
          </View>

          <View style={{ paddingHorizontal: 10, marginBottom: 20 }}>
            {isLoading || GradeLoading || isFetching || gradeFetching ? (
              <ActivityIndicator size={20} color={colors.primary} />
            ) : (
              <>
                <View style={styles.table}>
                  {(parentGradeData.length > 0 ||
                    studentGradeData.length > 0) && (
                    <View style={styles.tableHeader}>
                      <Text style={{ ...styles.tableHeaderText, width: "25%" }}>
                        Nom & Prénom
                      </Text>
                      <Text
                        style={{
                          ...styles.tableHeaderText,
                          width: "25%",
                          marginLeft: "3%",
                        }}
                      >
                        Date
                      </Text>
                      <Text style={{ ...styles.tableHeaderText, width: "22%" }}>
                        Grade
                      </Text>
                      <Text style={{ ...styles.tableHeaderText, width: "28%" }}>
                        Observation
                      </Text>
                    </View>
                  )}
                  {role === "Family" ? (
                    <FlatList
                      data={parentGradeData} // Extracting `data` array
                      renderItem={renderParentItem}
                      keyExtractor={(item) => item._id}
                      ListEmptyComponent={
                        <View>
                          <Image
                            source={Empty}
                            style={{
                              width: "80%",
                              height: normalizeSize(280),
                              alignSelf: "center",
                              marginTop: normalizeSize(20),
                            }}
                          />
                          <Text
                            style={{
                              fontSize: normalizeSize(25),
                              alignSelf: "center",
                              marginTop: normalizeSize(10),
                              color: "black",
                              fontWeight: "800",
                            }}
                          >
                            No Data
                          </Text>
                        </View>
                      }
                    />
                  ) : (
                    <FlatList
                      data={studentGradeData} // Extracting `data` array
                      renderItem={renderItem}
                      keyExtractor={(item) => item._id} // Ensure `_id` is used as `keyExtractor`
                      ListEmptyComponent={
                        <View>
                          <Image
                            source={Empty}
                            style={{
                              width: "80%",
                              height: normalizeSize(280),
                              alignSelf: "center",
                              marginTop: normalizeSize(20),
                            }}
                          />
                          <Text
                            style={{
                              fontSize: normalizeSize(25),
                              alignSelf: "center",
                              marginTop: normalizeSize(10),
                              color: "black",
                              fontWeight: "800",
                            }}
                          >
                            No Data
                          </Text>
                        </View>
                      }
                    />
                  )}
                </View>
              </>
            )}
          </View>
        </View>

        <AddGrade
          modalVisibility={gradeModel}
          iconPress={() => setGradeModel(false)}
        />
      </ScrollView>
    </View>
  );
};
export default GradeAcsess;
