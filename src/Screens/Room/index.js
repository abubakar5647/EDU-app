import React, { useState, useMemo, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import SwitchComponent from "../../Components/Switch";
import IconsRender from "./molecule/IconsRender";
import { showToast } from "../../Components/Toaster";
import { Empty } from "../../assets/images";
import Icons from "../../Components/Icons";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import { Fonts } from "../../assets/fonts";
import { getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { normalizeSize } from "../../../utils";
import { API_ROUTES } from "../../rtkQuery/routes";
import { useAllStudentByRoomIdQuery } from "../../rtkQuery/slices/home";

const Room = ({ navigation, route }) => {
  const { title, className, roomId } = route.params || {};
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const {
    data: allStudent,
    isLoading,
    error,
    refetch,
  } = useAllStudentByRoomIdQuery(roomId);
  useEffect(() => {
    refetch();
  }, [roomId]);
  console.log("allStudent=========", allStudent);
  const handleMove = () => {
    if (!selectedStudentId) {
      showToast("error", "Please select a student.");
      return;
    }
    navigation.navigate("Classes", { studentId: selectedStudentId });
  };
  const handleViewJournal = () => {
    if (!selectedStudentId) {
      showToast("error", "Please select a student.");
      return;
    }
    navigation.navigate("StudentFeed", {
      studentId: selectedStudentId,
    });
  };

  const handleSelectStudent = (id) => {
    setSelectedStudentId(id === selectedStudentId ? null : id);
  };

  const renderItem = useMemo(() => {
    return ({ item, index }) => (
      <View style={[styles.Main, { height: 155 }]}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={() => handleSelectStudent(item._id)}
          >
            <Image
              source={
                item.url ? { uri: `${API_ROUTES.BASE_URL}/${item.url}` } : Empty
              }
              style={styles.Photo}
            />
            {selectedStudentId === item._id && (
              <View style={styles.icon}>
                <Icons
                  family={"FontAwesome"}
                  name="check"
                  size={15}
                  color={colors.white}
                />
              </View>
            )}
          </TouchableOpacity>
          <Text style={styles.itemText} numberOfLines={1}>
            {item.firstName} {item.lastName}
          </Text>
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor:
                item.attendanceStatus === "not marked"
                  ? colors.lightGray
                  : item.attendanceStatus === "absent"
                  ? colors.red
                  : item.attendanceStatus === "checkout"
                  ? colors.yellow
                  : item.attendanceStatus === "checkin"
                  ? colors.PresentButton
                  : "defaultColor",
              width: getWidth(25),
              borderRadius: 20,
              height: normalizeSize(18),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 10,
              color: "white",
            }}
            text={item.attendanceStatus}
          />
        </View>
      </View>
    );
  }, [selectedStudentId, allStudent?.data]);

  return (
    <ScrollView style={{ backgroundColor: colors.white, flex: 1 }}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.PrimaryLight}
        translucent={true}
      />
      <Header
        title={className}
        color={colors.HeaderTextColor}
        backgroundColor={colors.PrimaryLight}
        LeftIcon={
          <MaterialIcons
            size={30}
            color={colors.black}
            onPress={() => navigation.goBack()}
            name="keyboard-arrow-left"
          />
        }
        RightIcon={
          <Fontisto size={25} color={colors.HeaderTextColor} name="bell-alt" />
        }
      />
      <View style={{ width: getWidth(90), alignSelf: "center" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: getHeight(2),
          }}
        >
          <Text
            style={{
              fontFamily: "Poppins-Bold",
              fontSize: 20,
              fontWeight: "700",
              color: "#47424F",
              marginTop: getHeight(1),
              marginBottom: getHeight(2.2),
            }}
          >
            All students
          </Text>
        </View>
        <IconsRender />
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size={"large"} />
        ) : (
          <FlatList
            data={allStudent?.data}
            keyExtractor={(item) => item._id}
            numColumns={3}
            contentContainerStyle={styles.flatListContainer}
            renderItem={renderItem}
            ListEmptyComponent={
              <View>
                <Image source={Empty} style={styles.emptyImage} />
              </View>
            }
          />
        )}
      </View>
      <View style={{ height: 200, paddingTop: 30 }}>
        <Button
          onPress={handleViewJournal}
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            flexDirection: "row",
            height: getHeight(5),
            marginBottom: 20,
          }}
          btnTextStyle={{
            ...GernalStyle.btnText,
            fontSize: 17,
            color: "white",
          }}
          text={"View journal"}
        />
        <Button
          onPress={handleMove}
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            flexDirection: "row",
            width: getWidth(42),
            height: getHeight(5),
          }}
          btnTextStyle={{
            ...GernalStyle.btnText,
            fontSize: 14,
            color: "white",
          }}
          text={"Move to"}
        />
      </View>
    </ScrollView>
  );
};

export default Room;

const styles = StyleSheet.create({
  Main: {
    borderTopLeftRadius: 55,
    borderTopRightRadius: 55,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 10,
    marginRight: normalizeSize(12),
    borderWidth: 0.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "flex-end",
    width: "31%",
  },
  itemContainer: {
    alignItems: "center",
    alignSelf: "center",
  },
  itemText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#47424F",
    fontFamily: Fonts?.PoppinsRegular,
    marginTop: 7,
    marginBottom: 7,
    textAlign: "center",
  },
  Photo: {
    height: 80,
    width: 80,
    borderRadius: 50,
  },
  icon: {
    height: 25,
    width: 25,
    justifyContent: "center",
    backgroundColor: colors.primary,
    borderRadius: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    right: 5,
  },
  emptyImage: {
    height: 300,
    width: 300,
    borderRadius: 10,
    alignSelf: "center",
    marginVertical: normalizeSize(25),
  },
});
