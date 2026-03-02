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
  FlatList,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";

import { Switch, TextInput } from "react-native-paper";
import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import { Arrow, Bell, girl } from "../../../assets/images";
import { HistoryData, normalizeSize } from "../../../../utils";
import CustomText from "../../../Components/CustomText";
import { Fonts } from "../../../assets/fonts";

const Payment = ({ navigation, route }) => {
  const [isTeacherSelected, setIsTeacherSelected] = useState(false);

  const renderItem = ({ item, index }) => {
    return (
      <View
        style={[styles.CardContainer, { marginVertical: normalizeSize(10) }]}
      >
        <View style={{ flexDirection: "row", gap: 10 }}>
          <CustomText
            label={item.date}
            fontSize={normalizeSize(14)}
            color={colors.black10}
            fontFamily={Fonts.PoppinsMedium}
          />
          <View
            style={[
              styles.Payment,
              {
                backgroundColor:
                  item.payment === "paid" ? colors.green : colors.red,
              },
            ]}
          >
            <CustomText
              label={item.payment}
              color={colors.white}
              marginTop={normalizeSize(5)}
              fontSize={normalizeSize(12)}
            />
          </View>
        </View>

        <View>
          <View style={styles.IconParent}>
            <View style={styles.IconView}>
              <AntDesign
                name={"eyeo"}
                color="#50C2C9"
                size={normalizeSize(14)}
              />
            </View>
            <View style={styles.IconView}>
              <AntDesign
                name={"download"}
                color="#50C2C9"
                size={normalizeSize(14)}
              />
            </View>
          </View>
          <CustomText
            label={item.label}
            fontSize={normalizeSize(15)}
            fontFamily={Fonts.PoppinsMedium}
            color={colors.black10}
            textAlign={"right"}
            alignSelf={"right"}
            bottom={normalizeSize(5)}
          />
          <CustomText
            label={item.text}
            fontSize={normalizeSize(10)}
            fontFamily={Fonts.PoppinsRegular}
            color={item.payment === "paid" ? "#C5C5C5" : colors.red}
            bottom={normalizeSize(10)}
          />
        </View>
      </View>
    );
  };
  return (
    <>
      <View style={[styles.contaner, { backgroundColor: "#F1F4FA" }]}>
        <GeneralStatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor={colors.white}
          translucent={true}
        />

        <Header
          RightIcon={<Image source={Bell} style={{ width: 24, height: 24 }} />}
          title={"Invoices"}
          color={colors.black10}
          TitelStyle={{
            fontFamily: Fonts.PoppinsSemiBold,
            fontSize: 20,
            color: colors.black10,
            marginTop: normalizeSize(5),
          }}
          backgroundColor={colors.white}
          LeftIcon={
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              activeOpacity={0.8}
            >
              <Image
                source={Arrow}
                style={{ width: normalizeSize(16), height: normalizeSize(16) }}
              />
            </TouchableOpacity>
          }
        />
        <View style={styles.ImgHeader}>
          <TouchableOpacity
            style={{
              width: "35%",
              height: normalizeSize(118),
              backgroundColor: colors.white,
              borderRadius: normalizeSize(70),
              elevation: isTeacherSelected ? 0 : 5,
            }}
            onPress={() => setIsTeacherSelected(true)}
            activeOpacity={0.7}
          >
            <View
              style={{
                backgroundColor: isTeacherSelected ? "#F1F4FA" : null,
                opacity: isTeacherSelected ? 0.3 : null,
                height: normalizeSize(120),
                borderRadius: 80,
              }}
            >
              <Image source={girl} style={styles.ImgFirst} />
            </View>
            <CustomText
              label={"Yasmine Baali"}
              fontSize={15}
              fontFamily={Fonts.PoppinsSemiBold}
              marginTop={normalizeSize(20)}
              color={isTeacherSelected ? colors.gray10 : colors.black10}
              opacity={isTeacherSelected ? 0.9 : null}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: "35%",
              height: normalizeSize(118),
              backgroundColor: colors.white,
              borderRadius: normalizeSize(70),
              elevation: isTeacherSelected ? 5 : 0,
            }}
            onPress={() => setIsTeacherSelected(false)}
            activeOpacity={0.7}
          >
            <View
              style={{
                backgroundColor: !isTeacherSelected ? "#F1F4FA" : null,
                opacity: !isTeacherSelected ? 0.3 : null,
                height: normalizeSize(120),
                borderRadius: 80,
              }}
            >
              <Image source={girl} style={styles.ImgFirst} />
            </View>
            <CustomText
              label={"Yasmine Baali"}
              fontSize={15}
              fontFamily={Fonts.PoppinsSemiBold}
              marginTop={normalizeSize(20)}
              color={!isTeacherSelected ? colors.gray10 : colors.black10}
              opacity={!isTeacherSelected ? 0.9 : null}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.RecentHeader}>
          <CustomText
            label={"Recent"}
            fontSize={18}
            fontFamily={Fonts.PoppinsMedium}
            marginTop={normalizeSize(20)}
            color={colors.black10}
          />
          <View style={styles.CardContainer}>
            <View style={{ flexDirection: "row", gap: normalizeSize(10) }}>
              <CustomText
                label={"05-January-2023"}
                fontSize={normalizeSize(14)}
                color={colors.black10}
                fontFamily={Fonts.PoppinsMedium}
              />
              <View style={styles.Payment}>
                <CustomText
                  label={"UnPaid"}
                  color={colors.white}
                  marginTop={normalizeSize(5)}
                  fontSize={normalizeSize(12)}
                />
              </View>
            </View>

            <View>
              <View style={styles.IconParent}>
                <View style={styles.IconView}>
                  <AntDesign
                    name={"eyeo"}
                    color="#50C2C9"
                    size={normalizeSize(14)}
                  />
                </View>
                <View style={styles.IconView}>
                  <AntDesign
                    name={"download"}
                    color="#50C2C9"
                    size={normalizeSize(14)}
                  />
                </View>
              </View>
              <CustomText
                label={"1800 DHS"}
                fontSize={normalizeSize(15)}
                fontFamily={Fonts.PoppinsMedium}
                color={colors.black10}
                textAlign={"right"}
                alignSelf={"right"}
                bottom={normalizeSize(5)}
              />
              <CustomText
                label={"Monthly Payment Due"}
                fontSize={normalizeSize(10)}
                fontFamily={Fonts.PoppinsRegular}
                color={colors.red}
                bottom={normalizeSize(10)}
              />
            </View>
          </View>

          <CustomText
            label={"History"}
            fontSize={18}
            marginTop={normalizeSize(25)}
            fontFamily={Fonts.PoppinsMedium}
            marginBottom={normalizeSize(8)}
          />
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: "#F1F4FA",
          paddingHorizontal: normalizeSize(20),
        }}
      >
        <FlatList
          data={HistoryData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: normalizeSize(20) }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </>
  );
};
export default Payment;
