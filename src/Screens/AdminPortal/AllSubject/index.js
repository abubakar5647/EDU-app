import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  useDeleteSubjectMutation,
  useGetSchoolCareerQuery,
  useGetSubjectwithCareerIdQuery,
} from "../../../rtkQuery/slices/home";
import { getHeight, getWidth } from "../../../../utils/ResponsiveFun";
import { colors } from "../../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import Header from "../../../Components/Header";
import { Fonts } from "../../../assets/fonts";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { showToast } from "../../../Components/Toaster";
import { Empty } from "../../../assets/images";
import { normalizeSize } from "../../../../utils";
import CustomModal from "../../../Components/CustomModal";

const AllSubject = ({ navigation }) => {
  const { data: schoolCareer } = useGetSchoolCareerQuery();
  const [selectedCareerId, setSelectedCareerId] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  console.log("selectedItem", selectedItem);
  useEffect(() => {
    if (schoolCareer?.data?.length > 0) {
      setSelectedCareerId(schoolCareer.data[0]._id);
    }
  }, [schoolCareer]);

  const { data: allSubjects, isLoading: isLoadingAllSubjects } =
    useGetSubjectwithCareerIdQuery({ schoolCareer: selectedCareerId });

  const [deleteSubject, { isLoading }] = useDeleteSubjectMutation();

  const handleSubjectDeleted = async (subjectData) => {
    try {
      const response = await deleteSubject({ subjectId: subjectData?._id });
      console.log("SubjectCreate", response);
      if (response.error) {
        showToast("error", response.error.error);
      } else {
        showToast("success", response.data.message);
        setModalShow(false);
      }
    } catch (error) {
      console.error("Failed to delete the subject: ", error);
    }
  };

  const renderItem = ({ item }) => (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottomWidth: 1,
          padding: 5,
          borderBottomColor: "#EAEAEA",
          marginHorizontal: 10,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins_Bold",
            color: "#47424F",
          }}
        >
          {item?.title}
        </Text>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              setModalShow(true);
              setSelectedItem(item);
            }}
          >
            <MaterialIcons name="delete" size={18} color={colors.red} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AddSubject", { subjectData: item })
            }
            style={{ paddingRight: 3 }}
          >
            <MaterialIcons name="edit" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );

  return (
    <View>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        backgroundColor={colors.primary}
        RightIcon={<View />}
        title={"All Subject"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <Text
        style={{
          fontSize: 18,
          fontFamily: Fonts.PoppinsBold,
          color: "#47424F",
          margin: 10,
        }}
      >
        All Subject
      </Text>
      <View style={styles.subjectsContainer}>
        {schoolCareer?.data?.map((career) => (
          <TouchableOpacity
            key={career._id}
            style={[
              styles.subjectsbuttons,
              {
                backgroundColor:
                  selectedCareerId === career._id ? colors.primary : "white",
              },
            ]}
            onPress={() => setSelectedCareerId(career._id)}
          >
            <Text
              style={[
                styles.buttonText,
                {
                  color:
                    selectedCareerId === career._id ? "white" : colors.primary,
                },
              ]}
            >
              {career.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {isLoadingAllSubjects ? (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={allSubjects?.data}
          renderItem={renderItem}
          keyExtractor={(item) => item._id}
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
      )}
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"Are you sure you want to delete this subject?"}
        title={"Delete Subject"}
        onPress={() => handleSubjectDeleted(selectedItem)}
        loading={isLoading}
      />
    </View>
  );
};

export default AllSubject;

const styles = StyleSheet.create({
  subjectsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: normalizeSize(10),
  },
  subjectsbuttons: {
    width: "23%",
    borderWidth: 1,
    borderColor: colors.primary,
    padding: 3,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 3,
  },
  buttonText: {
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
  },
});
