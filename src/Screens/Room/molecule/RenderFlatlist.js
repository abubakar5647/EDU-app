import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import { getWidth, getHeight } from "../../../../utils/ResponsiveFun";
import React, { useEffect, useState } from "react";
import { Fonts } from "../../../assets/fonts";
import Button from "../../../Components/Button";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";
import Icons from "../../../Components/Icons";
import { normalizeSize } from "../../../../utils";
import { Empty } from "../../../assets/images";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedStudentsId,
  toggleStudentSelection,
} from "../../../rtkQuery/slices/user/user.slice";
import { useGetStudentsQuery } from "../../../rtkQuery/slices/home";
import moment from "moment";
import { API_ROUTES } from "../../../rtkQuery/routes";

const RenderFlatlist = ({
  isButton,
  height,
  onPress,
  selectedClassroom,
  selectAll,
}) => {
  const selectedId = useSelector((state) => state.user.selectedStudentsId);
  const dispatch = useDispatch();
  const handleStudentPress = (id) => {
    dispatch(setSelectedStudentsId(id));
  };
  const roomId = selectedClassroom?.value;
  const { data: allStudent, status } = useGetStudentsQuery({
    date: moment.utc(new Date()).format("YYYY/MM/DD"),
    roomId: roomId,
  });

  useEffect(() => {
    if (selectAll !== undefined) {
      const allStudentIds =
        allStudent?.data?.map((student) => student._id) || [];

      if (selectAll) {
        // Select all students
        allStudentIds.forEach((id) => {
          if (!selectedId.includes(id)) {
            dispatch(setSelectedStudentsId(id));
          }
        });
      } else {
        // Deselect all students
        allStudentIds.forEach((id) => {
          if (selectedId.includes(id)) {
            dispatch(setSelectedStudentsId(id));
          }
        });
      }
    }
  }, [selectAll, allStudent?.data]);
  const renderItem = ({ item, index }) => {
    const isSelected = selectedId.includes(item._id);

    return (
      <View style={[styles.Main, { height: height || 155 }]}>
        <View style={styles.itemContainer}>
          <TouchableOpacity
            onPress={() => (onPress ? onPress() : handleStudentPress(item._id))}
            activeOpacity={0.5}
          >
            <Image
              source={
                item?.url
                  ? {
                      uri: `${API_ROUTES.BASE_URL}/${item?.url}`,
                    }
                  : Empty
              }
              style={[
                styles.Photo,
                isSelected && { borderWidth: 2, borderColor: colors.primary },
              ]}
            />
            {isSelected && (
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
            {" "}
            {item.firstName} {item.lastName}
          </Text>
          {isButton ? (
            <Button
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor:
                  allStudent?.data[index]?.attendanceStatus === "absent"
                    ? colors.red
                    : allStudent?.data[index]?.attendanceStatus === "checkin"
                    ? colors.PresentButton
                    : allStudent?.data[index]?.attendanceStatus === "checkout"
                    ? colors.yellow
                    : colors.lightGray,
                width: getWidth(25),
                borderRadius: 20,
                height: normalizeSize(18),
              }}
              btnTextStyle={{
                ...GernalStyle.btnText,
                fontSize: 10,
                color: "white",
              }}
              // text={isAbsent ? "present" : "absent"}
              text={
                allStudent?.data[index]?.attendanceStatus === "absent"
                  ? "Absent"
                  : allStudent?.data[index]?.attendanceStatus === "checkin"
                  ? "checkIn"
                  : allStudent?.data[index]?.attendanceStatus === "checkout"
                  ? "CheckOut"
                  : "Not marked"
              }
            />
          ) : null}
        </View>
      </View>
    );
  };

  return (
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
  );
};

export default RenderFlatlist;
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
    marginTop: getHeight(0.7),
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
