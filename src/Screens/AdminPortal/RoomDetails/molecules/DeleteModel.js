import { Image, Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { warning } from "../../../../assets/images";
import { Fonts } from "../../../../assets/fonts";
import Button from "../../../../Components/Button";
import { GernalStyle } from "../../../../constants/GernalStyle";
import { getWidth } from "../../../../../utils/ResponsiveFun";

const DeleteModel = ({ modalVisibility, onDismiss, iconPress }) => {
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
            source={warning}
            style={{
              width: 56,
              height: 56,
              alignSelf: "center",
              resizeMode: "contain",
            }}
          />
          <Text
            style={{
              fontFamily: Fonts?.PoppinsRegular,
              alignSelf: "center",
              marginTop: 20,
            }}
          >
            Are you sure you want to Delete Room 1
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 30,
              justifyContent: "space-between",
            }}
          >
            <Button
              btnStyle={{
                ...GernalStyle.btn,
                width: getWidth(40),
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
                width: getWidth(40),
                backgroundColor: colors?.primary,
              }}
              btnTextStyle={{
                ...GernalStyle.btnText,
                color: "white",
              }}
              text={"Delete"}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteModel;

const styles = StyleSheet.create({
  centeredModelView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modelDesign: {
    height: 240,
    backgroundColor: colors?.white,
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
