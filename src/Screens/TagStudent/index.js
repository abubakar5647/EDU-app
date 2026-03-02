import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import { Switch } from "react-native-paper";
import { normalizeSize } from "../../../utils";
import {
  useGetAllStudentsQuery,
  useGetRoomStudentQuery,
  useGetStudentsQuery,
} from "../../rtkQuery/slices/home";
import { Empty } from "../../assets/images";
import { showToast } from "../../Components/Toaster";
import { API_ROUTES } from "../../rtkQuery/routes";

const TagStudent = ({ navigation, route }) => {
  const { name, capturedImage, videoUri, selectedClassroom } =
    route.params || {};
  const {
    data: allStudent,
    isLoading,
    status,
  } = useGetRoomStudentQuery({ id: selectedClassroom?.value });

  const CapturedImage = capturedImage?.uri;

  const [selectAll, setSelectAll] = useState(false);
  const [selected, setSelected] = useState([]);

  const toggleSelection = (index) => {
    if (selected.includes(index)) {
      setSelected(selected.filter((item) => item !== index));
    } else {
      setSelected([...selected, index]);
    }
  };

  const handleSelectAll = (value) => {
    setSelectAll(value);
    if (value) {
      setSelected(allStudent?.data.map((student, index) => index));
    } else {
      setSelected([]);
    }
  };

  const handleNext = () => {
    if (selected?.length === 0) {
      showToast("error", "Please select at least One Student");
      return;
    }
    const selectedStudents = selected?.map((index) => allStudent?.data[index]);
    navigation.navigate("AddActivity", {
      name,
      selectedStudents,
      capturedImage: CapturedImage,
      videoUri: videoUri,
    });
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
        title={name}
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
      <View
        style={{
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: normalizeSize(20),
          paddingTop: 20,
        }}
      >
        {isLoading ? (
          <View style={{ marginTop: normalizeSize(25) }}>
            <ActivityIndicator size={"large"} color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={allStudent?.data}
            ItemSeparatorComponent={() => (
              <View style={{ height: getHeight(2.5) }} />
            )}
            numColumns={4}
            ListEmptyComponent={
              <View>
                <Image
                  source={Empty}
                  style={{
                    height: 250,
                    width: 300,
                    borderRadius: 10,
                    alignSelf: "center",
                  }}
                />
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => toggleSelection(index)}
                style={{
                  marginRight: normalizeSize(16),
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {selected.includes(index) ? (
                  <View
                    style={{
                      backgroundColor: "#47424F",
                      justifyContent: "center",
                      alignItems: "center",
                      height: normalizeSize(75),
                      width: normalizeSize(75),
                      borderRadius: 40,
                    }}
                  >
                    <AntDesign name="check" color="white" size={30} />
                  </View>
                ) : (
                  <View>
                    <Image
                      source={
                        item.url
                          ? { uri: `${API_ROUTES.BASE_URL}/${item.url}` }
                          : Empty
                      }
                      style={{
                        height: normalizeSize(75),
                        width: normalizeSize(75),
                        borderRadius: 40,
                      }}
                    />
                  </View>
                )}
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: "#47424F",
                    marginTop: getHeight(0.5),
                    width: 70,
                    textAlign: "center",
                  }}
                  numberOfLines={1}
                >
                  {item.firstName}
                  {""}
                  {item.lastName}
                </Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          marginTop: getHeight(4),
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            fontSize: 16,
            fontWeight: "500",
            fontFamily: "Poppins-Medium",
            color: "#47424F",
            marginRight: getWidth(2),
          }}
        >
          Select All
        </Text>
        <Switch
          value={selectAll}
          color={"#50C2C9"}
          style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
          onValueChange={handleSelectAll}
        />
      </View>
      <View
        style={{
          position: "absolute",
          bottom: getHeight(3),
          width: getWidth(100),
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: "#EFEFEF",
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
              marginTop: getHeight(1),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 18,
              color: "#A6A6A6",
            }}
            text={"Cancel"}
            onPress={() => navigation.goBack()}
          />
          <Button
            onPress={handleNext}
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
              marginTop: getHeight(1),
            }}
            btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
            text={"Next"}
          />
        </View>
      </View>
    </View>
  );
};

export default TagStudent;
