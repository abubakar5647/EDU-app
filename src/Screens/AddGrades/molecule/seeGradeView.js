import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import Header from "../../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import { colors } from "../../../constants/colors";
import { Fonts } from "../../../assets/fonts";
import {
  useDeleteGradeMutation,
  useGetAllGradeQuery,
  useGetDateGradesQuery,
  useGetGradeQuery,
} from "../../../rtkQuery/slices/home";
import { skipToken } from "@reduxjs/toolkit/query";
import moment from "moment";
import { Empty } from "../../../assets/images";
import { normalizeSize } from "../../../../utils";
import { useDispatch } from "react-redux";
import { setSelectedId } from "../../../rtkQuery/slices/user/user.slice";
import CustomModal from "../../../Components/CustomModal";
import { showToast } from "../../../Components/Toaster";

const SeeGradesView = ({ navigation, route }) => {
  const [keyword, setKeyword] = useState("");
  const dispatch = useDispatch();
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectDate, setSelectDate] = useState("");
  const { subject, classRoom, selectedDate } = route.params;
  // console.log("selectDate====>>>>>>>>>>>>>>>>>>", selectDate);

  // Extract month and year from selectedDate
  const selectedYear = moment(selectedDate).format("YYYY");
  const selectedMonth = moment(selectedDate).format("MM");

  const { data, refetch } = useGetGradeQuery({
    classRoom: classRoom?.value,
    subject: subject?.id,
    month: selectedMonth,
    year: selectedYear,
    searchKeyword: keyword,
    date: selectDate,
  });
  // console.log("data====>>>>>", data?.data[0]);
  const handlePress = (id) => {
    dispatch(setSelectedId(id));
    navigation.navigate("AddGrade", { isEdit: true });
  };

  const [deleteGrade, { isLoading: deleteLoading }] = useDeleteGradeMutation();
  const handleDelete = async (grade) => {
    try {
      const res = await deleteGrade(grade?.id);
      console.log("gradesDelete", res);
      if (res?.data) {
        showToast("success", "Grade deleted successfully");
        setModalShow(false);
      }
      refetch();
    } catch (error) {
      showToast("error", "Failed to delete grade");
    }
  };

  const processedData = data?.data.map((entry) => {
    return {
      id: entry?.student?._id,
      firstName: entry?.student?.firstName,
      lastName: entry?.student?.lastName,
      grades: entry?.grades.map((grade) => ({
        id: grade?._id,
        date: grade?.date,
        grade: grade?.grade,
        observation: grade?.observation,
      })),
    };
  });

  const { data: alldate } = useGetDateGradesQuery({
    classRoom: classRoom?.value,
    subject: subject?.id,
    month: selectedMonth,
    year: selectedYear,
    searchKeyword: keyword,
  });
  const uniqueDates = alldate?.data[0]?.grades?.reduce((acc, grade) => {
    const date = moment(grade.date).format("YYYY-MM-DD");
    if (!acc.includes(date)) {
      acc.push(date);
    }
    return acc;
  }, []);
  const renderItem = ({ item }) => {
    return (
      <View style={styles.tableMain}>
        <View>
          <Text style={styles.gradeName}>
            {item.firstName} {item.lastName}
          </Text>
        </View>
        <View style={styles.tableRow} activeOpacity={0.7}>
          {item.grades.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
              onPress={() => {
                setSelectedItem(item);
                setModalShow(true);
              }}
            >
              <Text style={styles.dataView}>
                {moment(item.date).format("DD/MM/YYYY")}
              </Text>
              <Text style={[styles.dataView, { width: 50 }]}>{item.grade}</Text>
              <Text style={[styles.dataView, { width: 90 }]}>
                {item.observation}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        RightIcon={<View />}
        title={"Grades"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <View style={styles.gradeInfo}>
        <View
          style={{
            height: 40,
            borderWidth: 1,
            width: 145,
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
            {classRoom?.label}
          </Text>
        </View>
        <Text style={styles.subjectText}>{subject?.label}</Text>
        <TouchableOpacity>
          <Text style={styles.showGradesText}>
            Show grades of : {moment(selectedDate, "YYYY-MM").format("MMMM")}
          </Text>
        </TouchableOpacity>
        {uniqueDates?.map((date, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectDate(date)}>
            <Text style={styles.dateText}>
              Show Dates of: {moment(date).format("DD/MM/YYYY")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by keyword"
        value={keyword}
        onChangeText={setKeyword}
      />
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={{ ...styles.tableHeaderText }} numberOfLines={1}>
            Nom & Prénom
          </Text>
          <Text
            style={{
              ...styles.tableHeaderText,
              marginLeft: 10,
            }}
          >
            Date
          </Text>
          <Text
            style={{ ...styles.tableHeaderText, marginLeft: normalizeSize(20) }}
          >
            Grade
          </Text>
          <Text style={{ ...styles.tableHeaderText }}>Observation</Text>
        </View>
        <FlatList
          data={processedData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View>
              <Image source={Empty} style={styles.emptyImage} />
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
      </View>
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"What would you like to do with this grade?"}
        title={"Delete/Edit Grade"}
        onPress={() => handleDelete(selectedItem)}
        loading={deleteLoading}
        isEdit={true}
        editPress={() => handlePress(selectedItem?.id)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  gradeInfo: {
    alignItems: "center",
    marginVertical: 15,
  },
  gradeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.black,
  },
  subjectText: {
    fontSize: 16,
    color: colors.primary,
    marginVertical: 10,
  },
  showGradesText: {
    fontSize: 16,
    color: colors.black,
    textDecorationLine: "underline",
    marginVertical: 5,
  },
  dateText: {
    fontSize: 15,
    color: colors.black,
    textDecorationLine: "underline",
    marginVertical: 5,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    margin: 20,
  },
  table: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    padding: 10,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: "space-between",
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
  },
  tableRow: {
    flexDirection: "column",
    backgroundColor: "white",
  },
  tableCell: {
    color: "#333",
    fontSize: 14,
    paddingVertical: 5,
  },
  gradeName: {
    flex: 1,
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    width: 90,
    borderRightWidth: 1,
    paddingVertical: 5,
    textAlign: "center",
    textAlignVertical: "center",
  },
  dataView: {
    color: "#555",
    fontSize: 14,
    textAlign: "center",
    width: 80,
    paddingVertical: 5,
  },
  tableMain: {
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 0.8,
  },
  emptyImage: {
    width: "80%",
    height: normalizeSize(280),
    alignSelf: "center",
    marginTop: normalizeSize(20),
  },
});

export default SeeGradesView;
