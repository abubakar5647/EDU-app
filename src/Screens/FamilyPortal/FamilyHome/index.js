import React, { useEffect, useRef, useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getWidth } from "../../../../utils/ResponsiveFun";
import { GernalStyle } from "../../../constants/GernalStyle";
import { styles } from "./styles";
import { colors } from "../../../constants/colors";
import Button from "../../../Components/Button";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import SelectDropdown from "react-native-select-dropdown";
import Header from "../../../Components/Header";
import { Empty, girl } from "../../../assets/images";
import { Fonts } from "../../../assets/fonts";
import Icons from "../../../Components/Icons";
import CustomText from "../../../Components/CustomText";
import { normalizeSize } from "../../../../utils";
import { API_ROUTES } from "../../../rtkQuery/routes";

import moment from "moment";
import { useMeQuery } from "../../../rtkQuery/slices/home";

const FamilyHome = ({ navigation, route }) => {
  const { data: children, isLoading } = useMeQuery();

  console.log("childrenchildren", children?.data?.userId);

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StudentFeed", {
              isEditStudent: item,
            })
          }
          activeOpacity={0.6}
          style={styles.touchView}
        >
          <Image
            source={{
              uri: `${API_ROUTES.BASE_URL}/${item.url}`,
            }}
            style={styles.Photo}
          />
        </TouchableOpacity>
        <CustomText
          label={`${item.firstName} ${item.lastName}`}
          fontSize={16}
          fontFamily={Fonts.PoppinsMedium}
          numberOfLines={1}
          width={normalizeSize(120)}
        />

        <Button
          text={
            item.attendanceStatus === "absent"
              ? "Absent"
              : item.attendanceStatus === "checkin"
              ? "checkIn"
              : item.attendanceStatus === "checkout"
              ? "CheckOut"
              : "Not marked"
          }
          btnTextStyle={{ color: "white", fontSize: 10 }}
          btnStyle={{
            ...GernalStyle.btn,
            borderWidth: 1,
            borderColor: item.buttonColor,
            width: normalizeSize(70),
            height: normalizeSize(22),
            backgroundColor:
              item.attendanceStatus === "absent"
                ? colors.red
                : item.attendanceStatus === "checkin"
                ? colors.PresentButton
                : item.attendanceStatus === "checkout"
                ? colors.yellow
                : colors.lightGray,
          }}
        />
      </View>
      <View style={styles.itemView}>
        <View>
          <CustomText
            label={"Class Number"}
            fontSize={12}
            fontFamily={Fonts.PoppinsRegular}
            color={colors.borderColor}
          />
          {item?.userId?.children?.map((child) => (
            <View key={child._id}>
              {child.rooms?.length > 0 ? (
                child?.rooms?.map((room, roomIndex) => (
                  <CustomText
                    key={roomIndex}
                    label={room}
                    fontSize={12}
                    fontFamily={Fonts.PoppinsMedium}
                  />
                ))
              ) : (
                <CustomText
                  label={"No rooms assigned"}
                  fontSize={12}
                  fontFamily={Fonts.PoppinsMedium}
                  color={colors.lightGray}
                />
              )}
            </View>
          ))}
        </View>

        <View>
          <CustomText
            label={"Academic Year"}
            fontSize={12}
            fontFamily={Fonts.PoppinsRegular}
            color={colors.borderColor}
          />

          <CustomText
            label={moment(item?.updatedAt).format("YYYY")}
            fontSize={12}
            fontFamily={Fonts.PoppinsMedium}
          />
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.PrimaryLight}
        translucent={true}
      />
      <Header
        title={"Home"}
        color={colors.HeaderTextColor}
        backgroundColor={colors.PrimaryLight}
        LeftIcon={
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.6}
          >
            <Image
              source={require("../../../assets/images/menu.png")}
              style={{ height: 30, width: 30 }}
            />
          </TouchableOpacity>
        }
        RightIcon={
          <Icons
            size={25}
            family={"Fontisto"}
            color={colors.HeaderTextColor}
            name="bell-alt"
            onPress={() => navigation.navigate("Notification")}
          />
        }
      />
      <View style={styles.titleView}>
        <Text
          style={{
            fontSize: 21,
            fontFamily: Fonts.PoppinsMedium,
            color: colors.HeaderTextColor,
            marginLeft: 20,
          }}
        >
          My children
        </Text>
        <Image
          source={require("../../../assets/images/children.png")}
          style={{ height: 30, width: 30 }}
        />
      </View>
      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={children?.data?.children}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Image
                source={Empty}
                style={{ height: 200, width: 250, borderRadius: 15 }}
              />
            </View>
          }
        />
      )}

      <Button
        onPress={() => navigation.navigate("OTP")}
        leftIcon={
          <Icons
            family={"Feather"}
            style={{ marginRight: getWidth(2) }}
            name={"user-plus"}
            color="white"
            size={20}
          />
        }
        btnStyle={{
          ...GernalStyle.btn,
          backgroundColor: colors.primary,
          flexDirection: "row",
          borderRadius: 50,
        }}
        btnTextStyle={{ ...GernalStyle.btnText }}
        text={"Add a Child"}
      />
    </View>
  );
};
export default FamilyHome;
