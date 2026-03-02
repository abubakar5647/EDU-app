import { StyleSheet, Image, View, Modal, TextInput, Text } from "react-native";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { gradeIcon } from "../../../assets/images";
import { GernalStyle } from "../../../constants/GernalStyle";
import { getFontSize, getWidth } from "../../../../utils/ResponsiveFun";
import { fonts } from "../../../constants/fonts";
import { Fonts } from "../../../assets/fonts";
import Button from "../../../Components/Button";

const AddGrade = ({ modalVisibility, onDismiss, iconPress, route }) => {
  return (
    <Modal
      visible={modalVisibility}
      transparent
      onRequestClose={onDismiss}
      animationType="slide"
    >
      <View style={styles?.centeredModelView}>
        <View style={styles.modelDesign}>
          <AntDesign
            onPress={iconPress}
            name="closecircleo"
            size={22}
            color={"#969696"}
            style={{ alignSelf: "flex-end" }}
          />
          <Image
            source={gradeIcon}
            style={{
              width: 56,
              height: 56,
              alignSelf: "center",
              resizeMode: "contain",
              marginBottom: 10,
            }}
          />
          <View style={{ paddingHorizontal: 10 }}>
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts?.PoppinsRegular,
                color: "#47424F",
              }}
            >
              Student
            </Text>
            <TextInput
              theme={{ roundness: getFontSize(1) }}
              style={[
                GernalStyle.newInputStyle,
                {
                  borderWidth: 1,
                  borderColor: "grey",
                  borderRadius: 5,
                  marginBottom: 10,
                },
              ]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts?.PoppinsRegular,
                color: "#47424F",
              }}
            >
              Grade
            </Text>
            <TextInput
              theme={{ roundness: getFontSize(1) }}
              style={[
                GernalStyle.newInputStyle,
                {
                  borderWidth: 1,
                  borderColor: "grey",
                  borderRadius: 5,

                  marginBottom: 10,
                },
              ]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts?.PoppinsRegular,
                color: "#47424F",
              }}
            >
              Observation
            </Text>
            <TextInput
              theme={{ roundness: getFontSize(1) }}
              style={[
                GernalStyle.newInputStyle,
                {
                  borderWidth: 1,
                  borderColor: "grey",
                  borderRadius: 5,
                  marginBottom: 10,
                },
              ]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingTop: 10,
                justifyContent: "space-between",
              }}
            >
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  width: getWidth(38),
                  backgroundColor: "#EFEFEF",
                }}
                btnTextStyle={{
                  ...GernalStyle.btnText,
                  color: "#A6A6A6",
                }}
                text={"Cancel"}
              />
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  width: getWidth(38),
                  backgroundColor: colors?.primary,
                }}
                btnTextStyle={{
                  ...GernalStyle.btnText,
                  color: "white",
                }}
                text={"Add"}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AddGrade;

const styles = StyleSheet.create({
  centeredModelView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modelDesign: {
    height: 410,
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
  },
  Image: {
    marginRight: 6,
    resizeMode: "contain",
    marginLeft: 15,
    alignSelf: "center",
  },
});
