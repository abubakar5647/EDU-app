import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Text,
  Alert,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useDeleteHomeWorkMutation } from "../../../rtkQuery/slices/home";
import CustomText from "../../../Components/CustomText";
import { colors } from "../../../constants/colors";
import Icons from "../../../Components/Icons";
import { Fonts } from "../../../assets/fonts";
import { normalizeSize } from "../../../../utils";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import { Bell, Empty } from "../../../assets/images";
import { showToast } from "../../../Components/Toaster";
import { useDispatch } from "react-redux";
import { setHomeworkItem } from "../../../rtkQuery/slices/user/user.slice";
const HomeWorkFlatlist = ({
  meRoomId,
  isHomeWorkModal,
  setIsHomeWorkModal,
  setEditingHomeworkId,
  getAllHomework,
  isLoading,
  homeWorkData,
  setHomeworkData,
  fetchData,
}) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [deleteHomeWork] = useDeleteHomeWorkMutation();
  const handleDeleteHomeWork = async (homeWorkId) => {
    if (typeof homeWorkId === "string") {
      try {
        const res = await deleteHomeWork(homeWorkId);
        console.log("Response:==========", res);
        showToast("success", res?.data?.message);
        fetchData();
      } catch (error) {
        console.error("Error Deleting Homework:", error);
        showToast("error", res?.error?.data?.message);
      }
    } else {
      console.error("Invalid Homework ID:", homeWorkId);
      showToast("error", res?.error?.data?.message);
    }
  };

  const handleLongPress = (homeWorkId) => {
    Alert.alert(
      "Manage Homework",
      "Would you like to edit or delete this homework?",
      [
        {
          text: "cancel",
          style: "cancel",
        },
        {
          text: "Edit",
          onPress: () => {
            setIsHomeWorkModal(true);
            dispatch(setHomeworkItem(homeWorkId));
          },
        },
        {
          text: "Delete",
          onPress: () => handleDeleteHomeWork(homeWorkId?._id),
        },
      ],
      { cancelable: true }
    );
  };

  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  console.log("fetchDatafetchDatafetchData", homeWorkData[0]?.subject?.title);

  const renderItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={styles.containerHome}
        activeOpacity={0.6}
        onPress={() => handleLongPress(item)}
      >
        <View
          style={[
            styles.homeworkSideBackground,
            {
              backgroundColor: getRandomColor(),
            },
          ]}
        />
        <View style={styles.specificDay}>
          <CustomText
            label={moment(item?.createdAt).format("ddd")}
            fontSize={10}
            color={colors.lightGray}
          />
        </View>
        <View>
          <CustomText
            label={item?.subject?.title}
            fontSize={14}
            color={colors.HeaderTextColor}
            fontFamily={Fonts.PoppinsMedium}
          />
          <CustomText
            label={moment(item?.date).format("DD MMM YYYY")}
            fontSize={12}
            fontFamily={Fonts.PoppinsRegular}
            color={colors.lightGray}
          />
        </View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("TextbookDetail", { homeworkId: item?._id })
          }
          style={styles.sideArrow}
        >
          <Icons
            family={"Entypo"}
            name="chevron-right"
            size={15}
            color={colors.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    []
  );
  return (
    <>
      {isLoading ? (
        <View
          style={{
            justifyContent: "center",
            flex: 1,
          }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={homeWorkData}
          renderItem={renderItem}
          keyExtractor={(item, index) => item._id}
          showsVerticalScrollIndicator={false}
          key="homework"
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={Empty}
                style={{ height: 200, width: 200, borderRadius: 15 }}
              />
              <Text
                style={{ fontSize: 20, color: colors.black, marginTop: 10 }}
              >
                No Data
              </Text>
            </View>
          }
        />
      )}
    </>
  );
};

export default HomeWorkFlatlist;

const styles = StyleSheet.create({
  containerHome: {
    flexDirection: "row",
    backgroundColor: colors.white,
    elevation: 2,
    width: "100%",
    borderRadius: normalizeSize(8),
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  specificDay: {
    height: 45,
    width: 45,
    alignSelf: "center",
    backgroundColor: "#F1F6FF",
    marginHorizontal: 10,
    marginVertical: normalizeSize(10),
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  homeworkSideBackground: {
    width: 5,
    height: "100%",
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
  },

  sideArrow: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: 45,
    position: "absolute",
    right: 0,
    backgroundColor: colors.primary,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: normalizeSize(40),
  },
});
