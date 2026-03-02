import React from "react";
import { Text, View, TouchableOpacity, Linking } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import { useNavigation } from "@react-navigation/native";

const ContactSupport = ({ route }) => {
  const navigation = useNavigation();

  const handleSendEmail = () => {
    const email = "madrastieduapp@gmail.com";
    const subject = "Support Inquiry";
    const emailUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;

    Linking.openURL(emailUrl).catch((err) =>
      console.error("Failed to open email app:", err)
    );
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
        title={"Contact support"}
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
        <Button
          text="Call us"
          btnStyle={{
            ...GernalStyle.btn,
            marginTop: getHeight(30),
            borderColor: colors.buttonColor,
            borderWidth: 1,
            backgroundColor: colors.buttonColor2,
          }}
          btnTextStyle={{ ...GernalStyle.btnText, color: colors.primary }}
          onPress={() => navigation.navigate("CallUs")}
        />

        <Button
          text="Send e-mail"
          btnStyle={{
            ...GernalStyle.btn,
            marginTop: getHeight(5),
            backgroundColor: colors.buttonColor,
          }}
          btnTextStyle={GernalStyle.btnText}
          onPress={handleSendEmail} // Call the email function here
        />
      </View>
    </View>
  );
};

export default ContactSupport;
