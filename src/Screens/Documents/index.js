import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Linking,
  ImageBackground,
  TextInput,
  FlatList,
  ActivityIndicator,
  Alert,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { Fonts } from "../../assets/fonts";
import TableHeader from "./molecules/TableHeader";
import TableRow from "./molecules/TableRow";
import SelectDropdown from "react-native-select-dropdown";
import {
  useDeleteDocumentMutation,
  useGetDocumentQuery,
} from "../../rtkQuery/slices/home";
import { useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { API_ROUTES } from "../../rtkQuery/routes";
import RNFetchBlob from "rn-fetch-blob";
import { PermissionsAndroid, Platform } from "react-native";
import { showToast } from "../../Components/Toaster";
import Icons from "../../Components/Icons";

const Documents = ({ navigation, route }) => {
  const { studentId: routeStudentId } = route.params || {};
  const [storedStudentId, setStoredStudentId] = useState(routeStudentId || "");
  const role = useSelector((state) => state.gernal.follow);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [deleteDocument] = useDeleteDocumentMutation();
  console.log("selectedDocumentId============", selectedDocumentId);

  const {
    data: GetDocument,
    refetch,
    isLoading,
  } = useGetDocumentQuery({
    routeStudentId: storedStudentId,
    startDates,
    endDates,
    docsName: searchQuery,
  });
  console.log("GetDocument========================", GetDocument);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );
  useEffect(() => {
    const saveStudentId = async () => {
      if (routeStudentId) {
        await AsyncStorage.setItem("studentId", routeStudentId);
        setStoredStudentId(routeStudentId);
      } else {
        const savedId = await AsyncStorage.getItem("studentId");
        if (savedId) {
          setStoredStudentId(savedId);
        }
      }
    };
    saveStudentId();
  }, [routeStudentId]);

  const documents = GetDocument?.data || {};

  console.log("data====================", documents);

  const startDates =
    documents?.sentDocs?.map((doc) =>
      new Date(doc.createdAt).toLocaleDateString("en-CA")
    ) || [];

  const endDates =
    documents?.sentDocs?.map((doc) =>
      new Date(doc.updatedAt).toLocaleDateString("en-CA")
    ) || [];

  const receivedStartDates =
    documents?.receivedDocs?.map((doc) =>
      new Date(doc.createdAt).toLocaleDateString("en-CA")
    ) || [];

  const receivedendDates =
    documents?.receivedDocs?.map((doc) =>
      new Date(doc.updatedAt).toLocaleDateString("en-CA")
    ) || [];

  const docsName = documents?.sentDocs?.map((doc) => {
    return doc?.documentName;
  });
  const combinedSendDates = startDates.map((startDate, index) => ({
    startDate,
    endDate: endDates[index],
  }));

  const combinedReceivedDates = receivedStartDates.map(
    (receivedStartDates, index) => ({
      receivedStartDates,
      receivedendDate: receivedendDates[index],
    })
  );

  const formattedReceivedDates = combinedReceivedDates.map(
    (item) => `${item.receivedStartDates} - ${item.receivedendDate}`
  );

  const formattedDates = combinedSendDates.map(
    (item) => `${item.startDate} - ${item.endDate}`
  );

  const filteredSentDocs =
    documents.sentDocs
      ?.filter((doc) => {
        const matchesSearchQuery = doc.documentName.includes(searchQuery);
        const docDateRange = `${new Date(doc.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(doc.updatedAt).toLocaleDateString("en-CA")}`;
        const matchesCategory =
          selectedCategory === "" || docDateRange === selectedCategory;
        return matchesSearchQuery && matchesCategory;
      })
      .sort((a, b) => {
        const aDateRange = `${new Date(a.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(a.updatedAt).toLocaleDateString("en-CA")}`;
        const bDateRange = `${new Date(b.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(b.updatedAt).toLocaleDateString("en-CA")}`;

        const aMatchesCategory = aDateRange === selectedCategory;
        const bMatchesCategory = bDateRange === selectedCategory;

        if (aMatchesCategory && !bMatchesCategory) return -1;
        if (!aMatchesCategory && bMatchesCategory) return 1;

        const aExactMatch = a.documentName === searchQuery;
        const bExactMatch = b.documentName === searchQuery;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        const aPartialMatch = a.documentName.includes(searchQuery);
        const bPartialMatch = b.documentName.includes(searchQuery);

        return bPartialMatch - aPartialMatch;
      }) || [];

  const filteredReceivedDocs =
    documents.receivedDocs
      ?.filter((doc) => {
        const matchesSearchQuery = doc.documentName.includes(searchQuery);
        const docDateRange = `${new Date(doc.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(doc.updatedAt).toLocaleDateString("en-CA")}`;
        const matchesCategory =
          selectedCategory === "" || docDateRange === selectedCategory;
        return matchesSearchQuery && matchesCategory;
      })
      .sort((a, b) => {
        const aDateRange = `${new Date(a.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(a.updatedAt).toLocaleDateString("en-CA")}`;
        const bDateRange = `${new Date(b.createdAt).toLocaleDateString(
          "en-CA"
        )} - ${new Date(b.updatedAt).toLocaleDateString("en-CA")}`;

        const aMatchesCategory = aDateRange === selectedCategory;
        const bMatchesCategory = bDateRange === selectedCategory;

        if (aMatchesCategory && !bMatchesCategory) return -1;
        if (!aMatchesCategory && bMatchesCategory) return 1;

        const aExactMatch = a.documentName === searchQuery;
        const bExactMatch = b.documentName === searchQuery;
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;

        const aPartialMatch = a.documentName.includes(searchQuery);
        const bPartialMatch = b.documentName.includes(searchQuery);

        return bPartialMatch - aPartialMatch;
      }) || [];

  const [expandedItems, setExpandedItems] = useState([]);

  const handleItemPress = (itemId) => {
    setExpandedItems((prevItems) => {
      if (prevItems.includes(itemId)) {
        return prevItems.filter((id) => id !== itemId);
      } else {
        return [...prevItems, itemId];
      }
    });
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Storage Permission",
            message: "This app needs access to your storage to download files.",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const handleLongPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
    setSelectedDocumentId(item?._id);
  };

  const handleEdit = () => {
    if (selectedItem) {
      navigation.navigate("AddDocument", selectedItem);
      setModalVisible(false);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await deleteDocument(selectedDocumentId);
      console.log("Deleted document:", res);
      if (res.data.message.includes("successfully")) {
        setModalVisible(false);
        showToast("success", res?.data?.message);
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const downloadPDF = async (pdfUrl) => {
    const { config, fs } = RNFetchBlob;
    const date = new Date();
    const { dirs } = fs;

    const downloadDest =
      Platform.OS === "android"
        ? `${dirs.DownloadDir}/document_${Math.floor(date.getTime())}.pdf`
        : `${dirs.DocumentDir}/document_${Math.floor(date.getTime())}.pdf`;

    const encodedUrl = encodeURI(pdfUrl);

    try {
      const res = await config({
        fileCache: true,
        path: downloadDest,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: downloadDest,
          description: "Downloading PDF file",
        },
      }).fetch("GET", encodedUrl);

      Alert.alert("Success", "PDF successfully downloaded to " + res.path());
      console.log("File downloaded to:", res.path());
    } catch (error) {
      console.error("Download PDF error:", error);
      Alert.alert("Error", "Failed to download PDF.");
    }
  };

  const handleShowDocumentData = ({ item }) => {
    console.log("item===============", item);
    const isExpanded = expandedItems.includes(item._id);
    return (
      <>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "transparent",
            borderBottomWidth: 1,
            borderBottomColor: colors?.borderlightColor,
            height: isExpanded ? 30 : 48,
            justifyContent: "center",
          }}
          onPress={() => handleLongPress(item)}
        >
          <View
            style={{
              width: "29%",
              height: "100%",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 10,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderLeftColor: colors?.borderlightColor,
              borderRightColor: colors?.borderlightColor,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts?.PoppinsMedium,
                color: colors?.blackTextColor,
                marginTop: isExpanded && 8,
              }}
            >
              {isExpanded ? "*****" : item.documentName}
            </Text>
          </View>

          <View
            style={{
              width: "29%",
              height: "100%",
              alignItems: "center",
              justifyContent: "center",
              borderRightColor: colors?.borderlightColor,
              borderRightWidth: 1,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts?.PoppinsMedium,
                color: colors?.blackTextColor,
                marginTop: isExpanded && 8,
              }}
            >
              {!isExpanded
                ? item?.recipient?.firstName && item?.recipient?.lastName
                  ? `${item.recipient.firstName} ${item.recipient.lastName}`
                  : "No Recipient"
                : "*****"}
            </Text>
          </View>

          <View
            style={{
              width: "42%",
              height: "100%",
              flexDirection: "row",
              alignContent: "center",
              borderRightColor: colors?.borderlightColor,
              borderRightWidth: 1,
            }}
          >
            <View
              style={{
                width: "25%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRightColor: colors?.borderlightColor,
                borderRightWidth: 1,
              }}
            >
              {console.log(
                "${API_ROUTES.BASE_URL}/${item.url}",
                `${API_ROUTES.BASE_URL}/${item.url}`
              )}
              <AntDesign
                size={20}
                color={colors?.blackTextColor}
                name="download"
                onPress={() =>
                  downloadPDF(`${API_ROUTES.BASE_URL}/${item.url}`)
                }
              />
            </View>

            <View
              style={{
                width: "25%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRightColor: colors?.borderlightColor,
                borderRightWidth: 1,
              }}
            >
              <TouchableOpacity onPress={() => handleItemPress(item._id)}>
                <Ionicons
                  size={20}
                  color={colors?.blackTextColor}
                  name={isExpanded ? "eye-off" : "eye"}
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                width: "50%",
                height: "100%",
                alignItems: "center",
                justifyContent: "center",
                borderRightColor: colors?.borderlightColor,
                borderRightWidth: 1,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: Fonts?.PoppinsMedium,
                  color: colors?.blackTextColor,
                  marginTop: isExpanded && 8,
                }}
              >
                {!isExpanded
                  ? item.documentCategory || "No category"
                  : "******"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <TouchableOpacity
                    style={{ alignSelf: "flex-end", bottom: 10, left: 10 }}
                    onPress={() => setModalVisible(false)}
                  >
                    <Icons
                      family={"Entypo"}
                      name={"circle-with-cross"}
                      color={colors.primary}
                      size={30}
                    />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Confirm Action</Text>
                  <Text style={styles.modalText}>
                    Are you sure you want to delete this item?
                  </Text>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={handleDelete}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.editButton,
                        { backgroundColor: colors.primary },
                      ]}
                      onPress={handleEdit}
                    >
                      <Text style={styles.deleteButtonText}>Edit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </>
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Documents"}
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
      <ScrollView
        style={{ marginBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: getWidth(90), alignSelf: "center" }}>
          <Button
            text={"Add a document"}
            onPress={() => navigation.navigate("AddDocument")}
            btnTextStyle={{
              color: "white",
              fontSize: 14,
              fontFamily: Fonts.PoppinsMedium,
            }}
            btnStyle={{
              ...GernalStyle.btn,
              flexDirection: "row",
              backgroundColor: colors.primary,
              width: "55%",
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
            leftIcon={
              <AntDesign
                style={{ marginRight: getWidth(2) }}
                name={"plussquareo"}
                size={20}
                color={"white"}
              />
            }
          />

          <TouchableOpacity
            onPress={() => {
              if (
                formattedDates.length === 0 &&
                formattedReceivedDates.length === 0
              ) {
                Alert.alert(
                  "No Data",
                  "There is no data available. Please add documents first."
                );
              }
            }}
            activeOpacity={
              formattedDates.length === 0 && formattedReceivedDates.length === 0
                ? 1
                : 0.7
            }
          >
            <SelectDropdown
              defaultValue={"Filter by category"}
              data={
                formattedReceivedDates.length > 0
                  ? formattedReceivedDates
                  : formattedDates.length > 0
                  ? formattedDates
                  : []
              }
              defaultButtonText="Filter by category"
              onSelect={(selectedItem) => setSelectedCategory(selectedItem)}
              buttonStyle={{
                width: getWidth(50),
                backgroundColor: "white",
                borderRadius: 5,
                height: getHeight(5),
                borderWidth: 1,
                marginVertical: getHeight(2),
              }}
              buttonTextStyle={{
                color: "#47424F",
                fontFamily: "Poppins-Bold",
                fontSize: 15,
                fontWeight: "400",
              }}
              renderDropdownIcon={(isOpened) => (
                <Entypo
                  name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                  color={"#47424F"}
                  size={getFontSize(2)}
                />
              )}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: "white",
                borderRadius: 5,
                height: "30%",
              }}
              rowStyle={{
                backgroundColor: "white",
                borderBottomColor: "rgba(0, 0, 0, 0.1)",
              }}
              rowTextStyle={{
                color: "black",
                fontSize: getFontSize(2),
                textAlign: "left",
                fontFamily: "Poppins-Bold",
              }}
              disabled={
                formattedDates.length === 0 &&
                formattedReceivedDates.length === 0
              }
            />
          </TouchableOpacity>

          <TextInput
            style={{
              borderWidth: 1,
              height: 35,
              borderRadius: 5,
              borderColor: colors.gray7,
              paddingTop: 8,
            }}
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
            placeholder="Search Documents"
          />
          {/* Sent Documents */}

          {filteredSentDocs.length > 0 && (
            <>
              <View style={{ top: getFontSize(3) }}>
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#47424F",
                    marginBottom: getHeight(2),
                  }}
                >
                  Sent documents
                </Text>
                <TableHeader />
              </View>
              <FlatList
                data={filteredSentDocs}
                keyExtractor={(item) => item.id}
                renderItem={handleShowDocumentData}
                contentContainerStyle={{
                  paddingBottom: 10,
                }}
                style={{ marginTop: 20 }}
                ListFooterComponent={<View style={{ height: 100 }} />}
              />
            </>
          )}
          {/* Received Documents */}
          {filteredReceivedDocs.length > 0 && role !== "Admin" && (
            <>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{
                    fontFamily: "Poppins-Bold",
                    fontSize: 18,
                    fontWeight: "700",
                    color: "#47424F",
                    marginBottom: getHeight(2),
                  }}
                >
                  Received documents
                </Text>
                <TableHeader />
              </View>
              <FlatList
                data={filteredReceivedDocs}
                keyExtractor={(item) => item.id}
                renderItem={handleShowDocumentData}
                ListEmptyComponent={<Text>No received documents found.</Text>}
                contentContainerStyle={{
                  paddingBottom: 10,
                }}
                ListFooterComponent={<View style={{ height: 100 }} />}
              />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};
export default Documents;
