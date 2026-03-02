import React, { useState } from "react";
import { Text, View } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";
import Header from "../../Components/Header";
import Button from "../../Components/Button";
import CustomInput from "../../Components/CustomInput";
import { useAddContactMutation } from "../../rtkQuery/slices/home";
import { showToast } from "../../Components/Toaster";

const ReportProblem = ({ navigation, route }) => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [addContact, { isLoading }] = useAddContactMutation();
  const handleContact = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }
    try {
      const payload = {
        type: "reportAProblem",
        message: message,
      };
      const res = await addContact(payload);
      if (res?.data) {
        console.log("report=========", res);
        showToast("success", res?.data?.message);
        navigation.goBack();
        setMessage("");
        setError("");
      } else {
        showToast(
          "error",
          res?.error?.data?.message || "Something went wrong!"
        );
      }
    } catch (error) {
      console.log("error", error);
    }
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
        title={"Report a problem"}
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
        <Text
          style={{
            fontFamily: "Poppins-Bold",
            fontSize: 18,
            fontWeight: "700",
            color: "#47424F",
            marginTop: getHeight(3.5),
            marginBottom: getHeight(3.5),
          }}
        >
          Report your problem
        </Text>
        <View>
          <CustomInput
            placeholder={"Enter Message"}
            height={200}
            textAlignVertical={"top"}
            value={message}
            onChangeText={(text) => {
              setMessage(text);
              if (error) setError("");
            }}
            errorMessage={error}
          />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: "#EFEFEF",
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
            btnTextStyle={{
              ...GernalStyle.btnText,
              fontSize: 18,
              color: "#A6A6A6  ",
            }}
            text={"Cancel"}
            onPress={navigation.goBack}
          />
          <Button
            btnStyle={{
              ...GernalStyle.btn,
              backgroundColor: colors.primary,
              flexDirection: "row",
              width: getWidth(42),
              height: getHeight(5),
              marginTop: getHeight(3),
            }}
            btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
            text={"Send"}
            onPress={handleContact}
            Loading={isLoading}
          />
        </View>
      </View>
    </View>
  );
};
export default ReportProblem;
