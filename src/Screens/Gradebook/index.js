import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import SelectDropdown from "react-native-select-dropdown";
import AddGrade from "./moelcule/AddGrade";
import { useSelector } from "react-redux";
import TableHeader from "../Documents/molecules/TableHeader";
import TableRow from "../Documents/molecules/TableRow";
import { girl } from "../../assets/images";
import CustomText from "../../Components/CustomText";
import { Fonts } from "../../assets/fonts";

const Gradebook = ({ navigation, route }) => {
  const { roleSpecific } = route?.params || {};
  const [gradeModel, setGradeModel] = useState(false);
  const role = useSelector((state) => state.gernal.follow);
  const currentYear = new Date().getFullYear();
  const nextYear = new Date().getFullYear() + 1;
  const documnetArray = [
    {
      id: 0,
      lable: "Arabic",
      title: "16",
      obs: "Good work",
    },
    {
      id: 1,
      lable: "Maths",
      title: "11",
      obs: "Can do better",
    },
    {
      id: 2,
      lable: "English",
      title: "18",
      obs: "Excellent",
    },
    {
      id: 3,
      lable: "French",
      title: "12",
      obs: "Passable",
    },
    {
      id: 4,
      lable: "Science",
      title: "15",
      obs: "Good",
    },
    {
      id: 4,
      lable: "Physics",
      title: "10,5",
      obs: "Average",
    },
    {
      id: 4,
      lable: "Philosophy",
      title: "15",
      obs: "Good work",
    },
    {
      id: 4,
      lable: "History",
      title: "17",
      obs: "Very good",
    },
    {
      id: 4,
      lable: "Musique",
      title: "17",
      obs: "Very good",
    },
  ];
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Grades"}
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
      <ScrollView>
        {role == "Family" ? (
          <View style={{ marginTop: getHeight(3) }}>
            <View
              style={{
                backgroundColor: "#B1B1B1",
                height: 100,
                width: 100,
                borderRadius: 50,
                alignSelf: "center",
              }}
            >
              <Image
                source={girl}
                style={{ height: "100%", width: "100%", resizeMode: "contain" }}
              />
            </View>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "500",
                color: "#47424F",
                fontFamily: "Poppins-Bold",
                marginTop: getHeight(0.5),
                color: colors.primary,
                alignSelf: "center",
                marginBottom: getHeight(2),
              }}
            >
              Adam Jebli
            </Text>
            <SelectDropdown
              defaultValue={"school year"}
              data={["2022/2023", "2022/2023", "2022/2023", "2022/2023"]}
              defaultButtonText="school year"
              buttonStyle={{
                width: getWidth(47),
                backgroundColor: "white",
                borderRadius: 5,
                height: getHeight(5),
                marginBottom: 10,
              }}
              buttonTextStyle={{
                fontFamily: "Poppins-Bold",
                fontSize: 15,
                fontWeight: "400",
              }}
              renderDropdownIcon={(isOpened) => {
                return (
                  <Entypo
                    name={isOpened ? "chevron-thin-up" : "chevron-thin-down"}
                    color={"#47424F"}
                    size={getFontSize(2)}
                  />
                );
              }}
              dropdownIconPosition={"right"}
              showsVerticalScrollIndicator={false}
              dropdownStyle={{
                backgroundColor: "white",
                borderRadius: 5,
              }}
              rowStyle={{
                backgroundColor: "white",
                borderBottomColor: "rgba(0, 0, 0, 0.1)",
              }}
              rowTextStyle={{
                color: "black",
                fontSize: getFontSize(2),
                textAlign: "left",
                paddingLeft: getFontSize(1),
                fontFamily: "Pooppins-bold",
              }}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <AntDesign size={20} color={"black"} name="left" />
              <View
                style={{
                  width: "87%",
                  alignSelf: "center",
                }}
              >
                <FlatList
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  ItemSeparatorComponent={() => (
                    <View style={{ width: getWidth(1) }} />
                  )}
                  ListHeaderComponent={() => (
                    <View style={{ width: getWidth(3) }} />
                  )}
                  ListFooterComponent={() => (
                    <View style={{ width: getWidth(3) }} />
                  )}
                  horizontal={true}
                  data={[
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "June",
                    "July",
                    "Aug",
                    "Sept",
                    "Oct",
                    "Nov",
                    "Dec",
                  ]}
                  renderItem={({ item }) => (
                    <View
                      style={
                        item == "Sept"
                          ? {
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              backgroundColor: "#50C2C9",
                              borderRadius: 5,
                            }
                          : {
                              paddingHorizontal: 20,
                              paddingVertical: 10,
                              backgroundColor: "#F8F8F8",
                              borderRadius: 5,
                            }
                      }
                    >
                      <Text
                        style={
                          item == "Sept"
                            ? {
                                color: "white",
                                fontSize: 12,
                                fontWeight: "500",
                              }
                            : {
                                fontSize: 12,
                                color: "black",
                                fontWeight: "500",
                              }
                        }
                      >
                        {item}
                      </Text>
                    </View>
                  )}
                />
              </View>
              <AntDesign size={20} color={"black"} name="right" />
            </View>
            <View style={styles.row}>
              <CustomText
                label={"September"}
                fontSize={18}
                fontFamily={Fonts.PoppinsBold}
              />
              <CustomText
                label={currentYear + "/" + nextYear}
                fontSize={18}
                marginLeft={10}
                fontFamily={Fonts.PoppinsRegular}
              />
            </View>

            <View style={{ paddingHorizontal: 10 }}>
              <TableHeader th1="Subject" th2="Grade" th3="Observation" />
              {documnetArray.map((item) => {
                return (
                  <TableRow
                    gradeBook={true}
                    label={item?.lable}
                    title={item.title}
                    obs={item.obs}
                  />
                );
              })}
            </View>
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: getHeight(3),
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: "row",
              marginTop: getHeight(15),
            }}
          ></View>
        )}

        {role !== "Family" ? (
          <>
            <View>
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  backgroundColor: colors.primary,
                }}
                btnTextStyle={GernalStyle.btnText}
                text={"Add grades"}
                onPress={() => {
                  navigation.navigate("AddGrade", {
                    seeGrade: false,
                  });
                }}
              />
            </View>
            <View style={{ marginTop: 50 }}>
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  backgroundColor: colors.primary,
                }}
                btnTextStyle={GernalStyle.btnText}
                text={"See grades"}
                onPress={() => {
                  navigation.navigate("AddGrade", {
                    seeGrade: true,
                  });
                }}
              />
            </View>
          </>
        ) : null}
        <AddGrade
          modalVisibility={gradeModel}
          iconPress={() => setGradeModel(false)}
        />
      </ScrollView>
    </View>
  );
};
export default Gradebook;
