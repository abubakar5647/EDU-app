import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import Header from "../../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import { colors } from "../../../constants/colors";
import Entypo from "react-native-vector-icons/Entypo";
import { Fonts } from "../../../assets/fonts";
import { getWidth } from "../../../../utils/ResponsiveFun";
import {
  useCreateGradesMutation,
  useEditGradeMutation,
  useGetStudentByGradesRoomIdQuery,
  useGetStudentsQuery,
} from "../../../rtkQuery/slices/home";
import { useSelector } from "react-redux";
import { normalizeSize } from "../../../../utils";
import { useRoute } from "@react-navigation/native";
import { showToast } from "../../../Components/Toaster";
import { useMeQuery } from "../../../rtkQuery/slices/auth";
import moment from "moment";
import { API_ROUTES } from "../../../rtkQuery/routes";
import { Empty } from "../../../assets/images";

const AddGradesScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState();
  const userData = useSelector((state) => state.user.userData);
  const route = useRoute();
  const { subject, Date, classRoom } = route.params;
  const { data, isLoading } = useGetStudentByGradesRoomIdQuery({
    roomId: classRoom?.value,
    subjectId: subject?.id,
    date: Date,
  });
  // console.log("dattsyudent========", data?.data);
  const [createGrades] = useCreateGradesMutation();
  const [editCreate] = useEditGradeMutation();
  const { data: getMeData } = useMeQuery();
  const GradeId = useSelector((state) => state.user.selectedId);
  const [grade, setGrade] = useState(GradeId?.grade || "");
  const [observation, setObservation] = useState(GradeId?.observation || "");
  const HandleCreateGrade = async () => {
    try {
      const payload = {
        studentId: selectedStudentId,
        roomId: classRoom?.value,
        subject: subject?.id,
        schoolId: selectedSchoolId,
        grade: grade,
        observation: observation,
        date: Date,
      };
      if (GradeId) {
        const res = await editCreate({ id: GradeId, ...payload });
        console.log("resssssssssEdit", res);
        showToast("success", res?.data?.message);
      } else {
        const res = await createGrades(payload);
        if (res.error) {
          console.log("resssss", res);
          showToast("error", res?.error?.data?.message);
        } else {
          console.log("resssss", res);
          showToast("success", res?.data?.message);
          closeModal();
          setGrade("");
          setObservation("");
        }
      }

      // navigation.goBack();
    } catch (error) {
      console.log(error);
      showToast("error", error?.data?.message);
    }
  };

  const openModal = (student) => {
    setSelectedStudent(student);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStudent(null);
  };

  const renderStudent = ({ item, index }) => (
    <>
      <View style={styles.studentImageContainer}>
        <Image
          source={
            item.url ? { uri: `${API_ROUTES.BASE_URL}/${item.url}` } : Empty
          }
          style={styles.studentImage}
        />
        <TouchableOpacity
          style={[
            styles.gradeBadge,
            {
              backgroundColor: data?.data[index]?.grade
                ? colors.greentick
                : colors.primary,
            },
          ]}
          onPress={() => {
            setSelectedStudentId(item._id);
            setSelectedSchoolId(item.schoolId);
            openModal(item);
          }}
        >
          {data?.data[index]?.grade ? (
            <Text style={{ color: "white", textAlign: "center" }}>
              {data.data[index]?.grade}
            </Text>
          ) : (
            <AntDesign
              style={{ marginRight: 0 }}
              name={"plus"}
              size={20}
              color={"white"}
            />
          )}
        </TouchableOpacity>

        <Text style={styles.studentName} numberOfLines={1}>
          {item.firstName} {item.lastName}
        </Text>
      </View>
    </>
  );
  return (
    <ScrollView style={styles.container}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        RightIcon={<View />}
        title={"Add Grades"}
        LeftIcon={
          <AntDesign
            size={30}
            color={colors.white}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        backgroundColor={colors.primary}
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
        <Text style={styles.subjectText}>
          {subject?.label} - {moment(Date).format("DD MMMM YYYY")}
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "flex-end",
          marginTop: 1,
          marginBottom: 5,
          marginRight: 25,
        }}
      >
        <Text style={{ color: colors.black, fontFamily: Fonts.PoppinsMedium }}>
          1/2
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 10,
          }}
        >
          <Entypo name="chevron-left" size={18} />
          <Entypo name="chevron-right" size={18} />
        </View>
      </View>
      {!isLoading ? (
        <FlatList
          data={data?.data}
          renderItem={renderStudent}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.studentsContainer}
          numColumns={4}
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
      {selectedStudent && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {selectedStudent && (
                <>
                  <Text
                    style={{
                      ...styles.gradeText,
                      color: colors.black,
                      textAlign: "center",
                    }}
                  >
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </Text>
                  <TouchableOpacity
                    style={styles.modalCloseButton}
                    onPress={closeModal}
                  >
                    <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Grade</Text>
                  <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={grade}
                    onChangeText={setGrade}
                  />
                  <Text style={{ ...styles.modalTitle, marginTop: 5 }}>
                    Observation
                  </Text>
                  <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={4}
                    value={observation}
                    onChangeText={setObservation}
                  />
                  <View style={styles.modalButtons}>
                    <TouchableOpacity
                      style={styles.cancelButton}
                      onPress={closeModal}
                    >
                      <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.addButton}
                      onPress={HandleCreateGrade}
                    >
                      <Text style={styles.buttonText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
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
    color: colors.primary,
  },
  subjectText: {
    fontSize: 16,
    color: colors.primary,
    borderWidth: 1,
    padding: 5,
    marginTop: 10,
    borderColor: colors.primary,
  },
  studentsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  studentWrapper: {
    width: "25%",
    alignItems: "center",
    marginVertical: 10,
  },
  studentImageContainer: {
    position: "relative",
    marginBottom: 5,
    marginHorizontal: normalizeSize(10),
    // width: normalizeSize(72),
  },
  studentImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "cover",
  },
  gradeBadge: {
    position: "absolute",
    bottom: normalizeSize(20),
    left: 0,
    color: "white",
    borderRadius: 12,
    padding: 2,
    fontSize: 12,
    fontWeight: "bold",
    width: 24,
    height: 24,
    textAlign: "center",
    lineHeight: 20,
  },
  studentName: {
    width: 65,
    fontSize: 12,
    color: colors.black10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    //alignItems: "center",
  },
  modalCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 16,
    marginTop: 20,
    marginBottom: 5,
    textAlign: "left",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#79c9da",
    borderRadius: 5,
    padding: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    width: getWidth(25),
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default AddGradesScreen;
