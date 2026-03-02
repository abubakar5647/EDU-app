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
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";

const HelpAndContacts = ({ navigation, route }) => {
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Help & Contact"}
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

      <View style={{ width: getWidth(90), alignSelf: "center" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SendMessage")}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: getHeight(5),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_Bold",
              fontWeight: "500",
              color: "#47424F",
            }}
          >
            Send a message
          </Text>
          <AntDesign name="right" color={"#929292"} size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("ContactSupport")}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: getHeight(2.5),
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontFamily: "Poppins_Bold",
              fontWeight: "500",
              color: "#47424F",
            }}
          >
            Contact support
          </Text>
          <AntDesign name="right" color={"#929292"} size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default HelpAndContacts;
