import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import { Divider, TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker from "react-native-date-picker";
import moment from "moment";
import CustomInput from "../../Components/CustomInput";
import { useCreateActivityMutation } from "../../rtkQuery/slices/home";
import UploadMedia from "../../Components/UploadMedia";
import { showToast } from "../../Components/Toaster";
import { Empty } from "../../assets/images";
import { normalizeSize } from "../../../utils";
import Video from "react-native-video";
import { API_ROUTES } from "../../rtkQuery/routes";

const AddActivity = ({ navigation, route }) => {
  const {
    name: propName,
    selectedStudents = [],
    capturedImage,
    videoUri,
  } = route.params || {};
  const activityType =
    propName === "nap" ? (startTime ? "startNap" : "endNap") : propName;
  const [selectedItem, setSelectedItem] = useState(null);
  const [note, setNote] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeButton, setActiveButton] = useState(null);
  const [studentId, setStudentId] = useState([]);
  const [capturedImages, setCapturedImages] = useState(null);
  const [isPhotoVisible, setIsPhotoVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [createActivity, { isLoading }] = useCreateActivityMutation();
  const [isVideoVisible, setIsVideoVisible] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isStartPickerVisible, setIsStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setIsEndPickerVisible] = useState(false);
  const handleCrossClick = () => {
    setIsVideoVisible(false);
  };
  const handleStudentMapping = () => {
    const ids = selectedStudents.map((student) => student._id);
    setStudentId(ids);
  };
  useEffect(() => {
    handleStudentMapping();
  }, []);

  const handleStartTimeChange = (date) => {
    setStartTime(date);
    setIsStartPickerVisible(false);
  };

  const handleEndTimeChange = (date) => {
    setEndTime(date);
    setIsEndPickerVisible(false);
  };
  const HandleSelectImage = (ImageSrc) => {
    setSelectedImage(ImageSrc);
  };
  const handleConfirm = (selectedDateTime) => {
    setDate(selectedDateTime);
    setTime(selectedDateTime);
    setEndTime(selectedDateTime);
    setStartTime(selectedDateTime);
    setOpen(false);
  };

  const handleButtonPress = (button) => {
    setActiveButton(button);

    if (button === "start") {
      setStartTime("startNap");
      setEndTime("");
    } else if (button === "end") {
      setEndTime("endNap");
      setStartTime("");
    }
  };

  const handleActivity = async () => {
    try {
      const formData = new FormData();
      studentId.forEach((id) => formData.append("students[]", id));

      formData.append("type", activityType); // Use the updated value
      formData.append("date", moment(date).format("YYYY/MM/DD"));

      if (propName === "nap") {
        if (startTime) {
          formData.append("startNap", startTime);
        } else {
          formData.append("endNap", endTime);
        }
      }

      if (capturedImages || selectedImage) {
        formData.append("media", {
          uri: capturedImages || selectedImage,
          type: "image/jpeg",
          name: "image.jpg",
        });
      }
      if (selectedItem) {
        formData.append("pottyType", selectedItem);
      }
      formData.append("note", note);
      console.log("formDataformData", formData);
      const res = await createActivity(formData);
      console.log("res=============", res);
      if (res?.data?.message === "Activity created successfully!") {
        console.log("createActivity========", res);
        showToast("success", res?.data?.message);
        navigation.navigate("Home");
      } else {
        showToast("error", res?.error?.data?.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const dataRender = ["diaper", "potty", "toilet", "incident"];
  const handlePress = (item) => {
    setSelectedItem((prev) => (prev === item ? null : item));
  };

  const renderStudent = ({ item }) => (
    <View
      style={{
        marginRight: normalizeSize(15),
        marginVertical: 10,
        alignItems: "center",
      }}
    >
      <Image
        source={
          item.url ? { uri: `${API_ROUTES.BASE_URL}/${item.url}` } : Empty
        }
        style={{
          height: 70,
          width: 70,
          borderRadius: 40,
          backgroundColor: "red",
        }}
      />
      <Text style={{ width: 70, alignItems: "center" }} numberOfLines={1}>
        {item.firstName} {""} {item.lastName}
      </Text>
    </View>
  );

  useEffect(() => {
    setCapturedImages(capturedImage);
  }, []);

  const handleRemovePhoto = () => {
    setSelectedImage(null);
    setCapturedImages(null);
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
        title={propName}
        backgroundColor={colors.primary}
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
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={{ width: getWidth(90), alignSelf: "center" }}>
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 16,
              fontWeight: "bold",
              color: "#47424F",
              marginTop: getHeight(2),
              marginBottom: getHeight(2.2),
            }}
          >
            Students
          </Text>

          <View>
            <FlatList
              data={selectedStudents}
              keyExtractor={(item) => item.id}
              renderItem={renderStudent}
              numColumns={4}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No students selected.</Text>
              }
            />
          </View>
          <Divider style={{ marginVertical: getHeight(1.3) }} />
          <View
            style={{
              marginTop: getHeight(0.5),
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: "900",
                fontFamily: "Poppins-Bold",
                color: "#47424F",
              }}
            >
              Date and Time:
            </Text>
            <TouchableOpacity onPress={() => setOpen(true)}>
              <Text style={styles.dateTime}>
                {moment(date).format("DD/MM/YYYY")}{" "}
                {moment(time).format("hh:mm A")}
              </Text>
            </TouchableOpacity>

            <DatePicker
              modal
              open={open}
              date={date}
              onConfirm={handleConfirm}
              onCancel={() => setOpen(false)}
              mode="datetime"
            />
          </View>

          <Divider
            style={{ marginTop: getHeight(2), marginBottom: getHeight(0.5) }}
          />
          {isPhotoVisible && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
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
                  Photo {capturedImages ? "" : "(optional)"}
                </Text>

                <TouchableOpacity
                  onPress={
                    capturedImages || selectedImage
                      ? handleRemovePhoto
                      : () => setIsModalVisible(true)
                  }
                >
                  {capturedImages || selectedImage ? (
                    <Entypo name="cross" color="#757D8A" size={24} />
                  ) : (
                    <FontAwesome
                      name="camera"
                      color={colors.primary}
                      size={24}
                    />
                  )}
                </TouchableOpacity>
              </View>

              {capturedImages ? (
                <Image
                  source={{ uri: capturedImages }}
                  style={{
                    width: "100%",
                    height: capturedImages ? 200 : 0,
                    marginTop: normalizeSize(10),
                  }}
                />
              ) : (
                <Image
                  source={{ uri: selectedImage }}
                  style={{
                    width: "100%",
                    height: selectedImage ? 200 : 0,
                    marginTop: normalizeSize(10),
                  }}
                />
              )}
              <Divider
                style={{
                  marginTop: 10,
                  marginBottom: 10,
                }}
              />
            </View>
          )}
          {isVideoVisible && videoUri && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: normalizeSize(10),
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
                  Video
                </Text>

                <TouchableOpacity onPress={handleCrossClick}>
                  <Entypo name="cross" color="#757D8A" size={24} />
                </TouchableOpacity>
              </View>
              {videoUri ? (
                <TouchableOpacity
                  activeOpacity={0.6}
                  onPress={() => setModalVisible(true)}
                >
                  <Video
                    source={{ uri: videoUri }}
                    style={{
                      width: "100%",
                      height: 200,
                    }}
                    repeat={true}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
              ) : null}
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={{
                      alignSelf: "flex-end",
                      marginRight: normalizeSize(10),
                      padding: 10,
                    }}
                  >
                    <Entypo name="cross" color={colors.white} size={40} />
                  </TouchableOpacity>
                  <Video
                    source={{ uri: videoUri }}
                    style={styles.modalVideo}
                    repeat={true}
                    resizeMode="contain"
                  />
                </View>
              </Modal>
              <Divider
                style={{
                  marginTop: getHeight(2),
                  marginBottom: getHeight(0.5),
                }}
              />
            </View>
          )}
          {propName == "nap" && (
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: getHeight(1),
                  borderWidth: 1,
                  borderColor: colors.primary,
                  borderRadius: 10,
                }}
              >
                <Button
                  btnStyle={{
                    ...GernalStyle.btn,
                    width: getWidth(40),
                    height: 60,
                    backgroundColor:
                      activeButton === "start" ? colors.primary : "white",
                    marginBottom: 0,
                    borderRadius: 0,
                  }}
                  btnTextStyle={{
                    ...GernalStyle.btnText,
                    color: activeButton === "start" ? "white" : colors.primary,
                  }}
                  text={"Start nap"}
                  onPress={() => handleButtonPress("start")}
                />

                <Button
                  btnStyle={{
                    ...GernalStyle.btn,
                    marginBottom: 0,
                    height: 60,
                    borderRadius: 0,
                    width: getWidth(40),
                    backgroundColor:
                      activeButton === "end" ? colors.primary : "white",
                    borderColor: colors.primary,
                  }}
                  btnTextStyle={{
                    ...GernalStyle.btnText,
                    color: activeButton === "end" ? "white" : colors.primary,
                  }}
                  text={"End nap"}
                  onPress={() => handleButtonPress("end")}
                />
              </View>

              <Divider
                style={{
                  marginTop: getHeight(2),
                  marginBottom: getHeight(0.5),
                }}
              />
            </View>
          )}

          {propName == "potty" && (
            <View>
              <View style={styles.Wrapper}>
                {dataRender.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handlePress(item)}
                  >
                    <Text
                      style={[
                        styles.txt,
                        selectedItem === item && styles.selectedText,
                      ]}
                    >
                      {item}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Divider
                style={{
                  marginTop: getHeight(2),
                  marginBottom: getHeight(0.5),
                }}
              />
            </View>
          )}

          <View>
            {propName == "Note" ||
            propName == "Incident" ||
            propName == "Kudos" ||
            propName == "Meds" ? (
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#47424F",
                }}
              >
                Note{" "}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#47424F",
                }}
              >
                Note{" "}
                <Text style={{ fontSize: 16, fontWeight: "300" }}>
                  (Optional)
                </Text>
              </Text>
            )}
            <CustomInput
              placeholder={"Enter Note"}
              height={150}
              textAlignVertical={"top"}
              value={note}
              onChangeText={(text) => {
                setNote(text);
              }}
            />
          </View>
        </View>

        <View
          style={{
            height: getHeight(18),
            justifyContent: "flex-end",
          }}
        >
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
            }}
            btnTextStyle={{ ...GernalStyle.btnText, fontSize: 20 }}
            Loading={isLoading}
            onPress={handleActivity}
            text={"Send"}
          />
        </View>
        <UploadMedia
          modalVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectImage={HandleSelectImage}
        />
      </KeyboardAwareScrollView>
    </View>
  );
};
export default AddActivity;
