import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../constants/colors";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import { file } from "../../assets/images";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import SelectDropdown from "react-native-select-dropdown";
import Entypo from "react-native-vector-icons/Entypo";
import { Fonts } from "../../assets/fonts";
import { TextInput } from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import DocumentPicker from "react-native-document-picker";
import {
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
} from "../../rtkQuery/slices/home";
import { useGetTeachersQuery } from "../../rtkQuery/slices/home";
import { useGetParentQuery } from "../../rtkQuery/slices/home";
import { useMeQuery } from "../../rtkQuery/slices/auth";
import { showToast } from "../../Components/Toaster";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRoute } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const AddDocument = ({ navigation }) => {
  const role = useSelector((state) => state.gernal.follow);
  const route = useRoute();
  const item = route.params;
  const [selectedParent, setSelectedParent] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isTeacherData, setTeacherData] = useState(null);
  const [isParentChild, setParentChild] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [selectedParentName, setSelectedParentName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [recipientName, setRecipientName] = useState("");
  const [media, setMedia] = useState(null);
  const { data: GetParent } = useGetParentQuery();
  const [createDocument, { isLoading }] = useCreateDocumentMutation();
  const [updateDocument] = useUpdateDocumentMutation();
  const { data: GetTeacherQuery } = useGetTeachersQuery();
  const { data: GetMe } = useMeQuery();
  const parentNames = GetParent?.data?.map(
    (parent) => `${parent?.userId?.firstName} ${parent?.userId?.lastName}`
  );
  const childNames = GetParent?.data?.flatMap((parent) =>
    parent?.children.map((child) => `${child?.firstName} ${child?.lastName}`)
  );
  const parentIds = GetParent?.data?.map((parent) => parent?.userId?._id);
  const childIds = GetParent?.data?.flatMap((parent) =>
    parent?.children?.map((child) => child?._id)
  );
  const teacherNames = GetTeacherQuery?.data.map(
    (data) => `${data?.userId?.firstName} ${data?.userId?.lastName}`
  );

  const activeParentChild = GetMe?.data?.userId?.children
    ? GetMe.data.userId.children.map(
        (data) => `${data.firstName} ${data.lastName}`
      )
    : [];
  const parentChildId = Array.isArray(GetMe?.data?.userId?.children)
    ? GetMe.data.userId.children.map((data) => data?._id)
    : [];
  const teacherIds = GetTeacherQuery?.data.map((data) => data?._id);
  const documentId = item?._id;
  const imageUrl = item?.url;
  const receiptName = `${item?.recipient?.firstName || ""} ${
    item?.recipient?.lastName || ""
  }`;
  const Concernedchild = `${item?.sender?.firstName || ""} ${
    item?.sender?.lastName || ""
  }`;
  useEffect(() => {
    if (item) {
      setRecipientName(receiptName);
      setDocumentName(item?.documentName);
      setSelectedCategory(item?.documentCategory);
      setSelectedChild(Concernedchild);
      setMedia(item?.url);
    }
  }, [item]);

  const HandleCreateDocument = async () => {
    if (
      !parentIds.length ||
      !documentName ||
      !selectedCategory ||
      !selectedDocument
    ) {
      Alert.alert("Error", "All fields are required!");
      return;
    }
    const formData = new FormData();
    if (role === "Family") {
      formData.append("studentId", isParentChild);
      formData.append("recepientId", isTeacherData);
    } else {
      formData.append("studentId", selectedChild);
      formData.append("recepientId", selectedParent);
    }

    formData.append("documentName", documentName);
    formData.append("documentCategory", selectedCategory);
    formData.append("media", {
      uri: selectedDocument.uri,
      type: selectedDocument.type,
      name: selectedDocument.name,
    });
    try {
      const response = await createDocument(formData);
      const studentId = response?.data?.data?.studentId;
      const documentName = response?.data?.data?.documentName;
      if (response.data?.error?.status === 400) {
        showToast("error", response?.error?.data?.message);
      }
      if (response?.data?.message.includes("successfully")) {
        await AsyncStorage.setItem("studentId", studentId);
        navigation.navigate("Documents", {
          studentId,
          parentName: selectedParentName,
        });
        showToast("success", response?.data?.message);
      }
      if (response?.error?.status === 400) {
        Alert.alert(response?.error?.data?.message);
      }
      if (res?.error?.status === "FETCH_ERROR") {
        showToast("error", res?.error?.error);
        return;
      }
    } catch (error) {
      console.log("invalid================", error);
    }
  };
  const handleCancel = () => {
    navigation.navigate("Documents");
  };
  const handleDocumentPicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      const document = {
        uri: res[0].uri,
        name: res[0].name,
        type: res[0].type,
      };
      setSelectedDocument(document);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // console.log("User cancelled document picker");
      } else {
        // console.log("DocumentPicker Error: ", err);
      }
    }
  };

  //Update Document
  const HandleUpdateDocument = async () => {
    const payload = {
      documentName: documentName,
      documentCategory: selectedCategory,
      media: media,
    };

    try {
      const res = await updateDocument({ documentId, payload });
      if (res?.data?.message?.includes("successfully")) {
        navigation.goBack();
        showToast("success", res?.data?.message);
      } else {
        showToast("error", "Unexpected error occurred. Please try again.");
      }
    } catch (error) {
      console.error("Error updating document: ", error);
      showToast(
        "error",
        "Failed to update document. Please check your input and try again."
      );
    }
  };

  const [allTypes, setAllTypes] = useState([
    "Last 7 Days",
    "This Month",
    "Last 3 Months",
    "Last 6 Months",
    "All Time",
  ]);
  const [allTypes2, setAllTypes2] = useState([
    "Exams",
    "Report cards",
    "Absences",
    "Administrative documents",
    "Events",
    "Invoices",
    "Other",
  ]);
  const [allTypes3, setAllTypes3] = useState(["Empty Data"]);
  return (
    <View style={styles?.parent}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Add Document"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        RightIcon={<View />}
        backgroundColor={colors.primary}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
              color: "#191C20",
              marginBottom: 8,
            }}
          >
            Attach Document
          </Text>
          <View style={styles?.dashView}>
            {selectedDocument ? (
              <Text>{selectedDocument.name}</Text>
            ) : (
              <Image
                source={imageUrl ? { uri: media } : file}
                style={{ height: 45, width: 45, resizeMode: "contain" }}
              />
            )}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <TouchableOpacity onPress={handleDocumentPicker}>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: Fonts.PoppinsRegular,
                    color: "#191C20",
                    textDecorationLine: "underline",
                    marginBottom: 3,
                  }}
                >
                  Click to upload document
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: Fonts.PoppinsRegular,
                color: "#6089b5",
                marginTop: 5,
              }}
            >
              Maximum file size 50MB
            </Text>
          </View>
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
              color: "#47424F",
              marginBottom: 8,
            }}
          >
            Choose Receivers
          </Text>
          {role === "Family" ? (
            <TouchableOpacity
              onPress={() => {
                if (
                  !teacherNames ||
                  teacherNames === "undefined" ||
                  teacherNames === ""
                ) {
                  Alert.alert(
                    "No Data",
                    "There is no data available. Please add teachersNames firstly."
                  );
                }
              }}
              activeOpacity={
                !teacherNames ||
                teacherNames === "undefined" ||
                teacherNames === ""
                  ? 1
                  : 0.7
              }
            >
              <SelectDropdown
                defaultValue={item ? recipientName : "Select Parent"}
                data={teacherNames}
                onSelect={(selectedItem, index) => {
                  const selectedTeacherId = teacherIds[index];
                  setTeacherData(selectedTeacherId);
                }}
                buttonTextAfterSelection={(selectedItem) => (
                  <Text
                    style={{
                      color: colors?.gray1,
                      fontSize: getFontSize(2),
                      textAlign: "left",
                    }}
                  >
                    {selectedItem}
                  </Text>
                )}
                buttonStyle={{
                  width: "100%",
                  height: getHeight(7),
                  marginVertical: getHeight(1),
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors?.gray1,
                  borderRadius: 8,
                }}
                rowTextStyle={{
                  color: colors?.graytext4,
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Ubuntu-bold",
                }}
                disabled={
                  !teacherNames ||
                  teacherNames === "undefined" ||
                  teacherNames === ""
                }
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (
                  !parentNames ||
                  parentNames === "undefined" ||
                  parentNames === ""
                ) {
                  Alert.alert(
                    "No Data",
                    "There is no data available. Please add parentsNames firstly."
                  );
                }
              }}
              activeOpacity={
                !parentNames ||
                parentNames === "undefined" ||
                parentNames === ""
                  ? 1
                  : 0.7
              }
            >
              <SelectDropdown
                defaultButtonText={item ? recipientName : "Select Parent"}
                data={parentNames}
                onSelect={(selectedItem, index) => {
                  const selectedParentId = parentIds[index];
                  setSelectedParent(selectedParentId);
                }}
                buttonTextAfterSelection={(selectedItem) => (
                  <Text
                    style={{
                      color: colors?.gray1,
                      fontSize: getFontSize(2),
                      textAlign: "left",
                    }}
                  >
                    {selectedItem}
                  </Text>
                )}
                buttonStyle={{
                  width: "100%",
                  height: getHeight(7),
                  marginVertical: getHeight(1),
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors?.gray1,
                  borderRadius: 8,
                }}
                rowTextStyle={{
                  color: colors?.graytext4,
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Ubuntu-bold",
                }}
                disabled={
                  !!item ||
                  !parentNames ||
                  parentNames === "undefined" ||
                  parentNames === ""
                }
              />
            </TouchableOpacity>
          )}

          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
              color: "#47424F",
              marginBottom: 8,
            }}
          >
            Document Name
          </Text>
          <TextInput
            mode="outlined"
            label="Document Name"
            placeholder="Document Name"
            //theme={{ roundness: 10 }}
            theme={{ roundness: getFontSize(1) }}
            outlineColor="#D8DADC"
            cursorColor="#D8DADC"
            textColor="#747988"
            activeUnderlineColor="#D8DADC"
            activeOutlineColor="#D8DADC"
            style={GernalStyle.input}
            returnKeyType={"next"}
            placeholderTextColor={"#969696"}
            blurOnSubmit={false}
            value={documentName}
            onChangeText={(text) => setDocumentName(text)}
          />
          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
              color: "#47424F",
              marginTop: 10,
            }}
          >
            Category
          </Text>
          <SelectDropdown
            data={allTypes2}
            defaultButtonText={item ? selectedCategory : "Category"}
            onSelect={(selectedItem, index) => {
              setSelectedCategory(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem) => {
              return selectedItem;
            }}
            buttonStyle={{
              width: "100%",
              height: getHeight(7),
              marginVertical: getHeight(1),
              backgroundColor: "white",
              borderWidth: 1,
              borderColor: colors?.gray1,
              borderRadius: 8,
            }}
            buttonTextStyle={{
              color: "gray",
              fontSize: getFontSize(2.5),
              fontFamily: "Ubuntu-bold",
              textAlign: "center",
            }}
            renderDropdownIcon={(isOpened) => {
              return (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={colors?.gray1}
                  size={getFontSize(2)}
                />
              );
            }}
            dropdownIconPosition={"right"}
            showsVerticalScrollIndicator={false}
            dropdownStyle={{
              backgroundColor: colors?.gray1,
              height: getHeight(27),
            }}
            rowStyle={{
              backgroundColor: "white",
            }}
            selectedRowTextStyle={{
              color: colors.buttonColor,
            }}
            rowTextStyle={{
              color: colors?.graytext4,
              fontSize: getFontSize(2),
              textAlign: "left",
              paddingLeft: getFontSize(1),
              fontFamily: "Ubuntu-bold",
            }}
          />

          <Text
            style={{
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
              color: "#47424F",
              marginTop: 10,
            }}
          >
            Concerned child - (optional)
          </Text>
          {role === "Family" ? (
            <TouchableOpacity
              onPress={() => {
                if (activeParentChild.length === 0) {
                  Alert.alert(
                    "No Data",
                    "There is no data available. Please add parentChild firstly."
                  );
                }
              }}
              activeOpacity={activeParentChild.length === 0 ? 1 : 0.7}
            >
              <SelectDropdown
                data={activeParentChild}
                onSelect={(selectedItem, index) => {
                  const selectedParentChildId = parentChildId[index];
                  setParentChild(selectedParentChildId);
                }}
                buttonTextAfterSelection={(selectedItem) => (
                  <Text
                    style={{
                      color: colors?.gray1,
                      fontSize: getFontSize(2),
                      textAlign: "left",
                    }}
                  >
                    {selectedItem}
                  </Text>
                )}
                buttonStyle={{
                  width: "100%",
                  height: getHeight(7),
                  marginVertical: getHeight(1),
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors?.gray1,
                  borderRadius: 8,
                }}
                rowTextStyle={{
                  color: colors?.graytext4,
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Ubuntu-bold",
                }}
                disabled={activeParentChild.length === 0}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                if (
                  !childNames ||
                  childNames === "undefined" ||
                  childNames === ""
                ) {
                  Alert.alert(
                    "No Data",
                    "There is no data available. Please add child firstly."
                  );
                }
              }}
              activeOpacity={
                !childNames || childNames === "undefined" || childNames === ""
                  ? 1
                  : 0.7
              }
            >
              <SelectDropdown
                defaultButtonText={item ? selectedChild : "Select an child"}
                data={childNames}
                onSelect={(selectedItem, index) => {
                  const selectedChildId = childIds[index];
                  setSelectedChild(selectedChildId);
                }}
                buttonTextAfterSelection={(selectedItem) => (
                  <Text
                    style={{
                      color: colors?.gray1,
                      fontSize: getFontSize(2),
                      textAlign: "left",
                    }}
                  >
                    {selectedItem}
                  </Text>
                )}
                buttonStyle={{
                  width: "100%",
                  height: getHeight(7),
                  marginVertical: getHeight(1),
                  backgroundColor: "white",
                  borderWidth: 1,
                  borderColor: colors?.gray1,
                  borderRadius: 8,
                }}
                rowTextStyle={{
                  color: colors?.graytext4,
                  fontSize: getFontSize(2),
                  textAlign: "left",
                  paddingLeft: getFontSize(1),
                  fontFamily: "Ubuntu-bold",
                }}
                disabled={
                  !!item ||
                  !childNames ||
                  childNames === "undefined" ||
                  childNames === ""
                }
              />
            </TouchableOpacity>
          )}

          {item ? (
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  width: getWidth(50),
                  backgroundColor: colors?.primary,
                  borderRadius: 5,
                  marginTop: 15,
                }}
                btnTextStyle={{ ...GernalStyle.btnText, color: "white" }}
                onPress={HandleUpdateDocument}
                text={"Update Document"}
                Loading={isLoading}
              />
            </View>
          ) : (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: getHeight(5),
              }}
            >
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  width: getWidth(43),
                  backgroundColor: "#EFEFEF",
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderRadius: 0,
                }}
                btnTextStyle={{
                  color: "#A6A6A6",
                  fontSize: 14,
                  fontFamily: Fonts.PoppinsMedium,
                }}
                onPress={handleCancel}
                text={"Cancel"}
              />
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  width: getWidth(43),
                  backgroundColor: colors?.primary,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5,
                  borderRadius: 0,
                }}
                btnTextStyle={{ ...GernalStyle.btnText, color: "white" }}
                text={"Add Document"}
                Loading={isLoading}
                onPress={HandleCreateDocument}
              />
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default AddDocument;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors?.white,
  },
  dashView: {
    width: "100%",
    height: 115,
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
    borderColor: "#D8DADC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
});
