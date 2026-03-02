import React from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "../../constants/colors";
import Button from "../Button";
import { GernalStyle } from "../../constants/GernalStyle";
import Icons from "../Icons";

const CustomModal = ({
  setModalShow,
  modalShow,
  title,
  heading,
  onPress,
  loading,
  isEdit,
  editPress,
}) => {
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalShow}
        onRequestClose={() => setModalShow(false)}
      >
        <TouchableWithoutFeedback onPress={() => setModalShow(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {isEdit && (
                <TouchableOpacity
                  style={{ alignSelf: "flex-end", bottom: 10, left: 10 }}
                  onPress={() => setModalShow(false)}
                >
                  <Icons
                    family={"Entypo"}
                    name={"circle-with-cross"}
                    color={colors.primary}
                    size={30}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.modalTitle}>{title}</Text>
              <Text style={styles.modalText}>{heading}</Text>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                {isEdit ? (
                  <Button
                    onPress={editPress}
                    text="Edit"
                    btnStyle={{
                      ...GernalStyle.btn,
                      backgroundColor: colors.primary,
                      width: 115,
                      borderRadius: 5,
                      height: 45,
                    }}
                    btnTextStyle={{
                      ...GernalStyle.btnText,
                      color: colors.white,
                      fontSize: 14,
                    }}
                  />
                ) : (
                  <Button
                    onPress={() => setModalShow(false)}
                    text="Cancel"
                    btnStyle={{
                      ...GernalStyle.btn,
                      backgroundColor: colors.gray10,
                      width: 115,
                      borderRadius: 5,
                      height: 45,
                    }}
                    btnTextStyle={{
                      ...GernalStyle.btnText,
                      color: colors.HeaderTextColor,
                      fontSize: 14,
                    }}
                  />
                )}

                <Button
                  onPress={onPress}
                  text="Delete"
                  Loading={loading}
                  btnStyle={{
                    ...GernalStyle.btn,
                    backgroundColor: colors.red,
                    width: 115,
                    borderRadius: 5,
                    height: 45,
                  }}
                  btnTextStyle={{
                    ...GernalStyle.btnText,
                    color: colors.white,
                    fontSize: 14,
                  }}
                />
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 25,
    backgroundColor: "white",
    borderRadius: 30,
    alignItems: "center",
  },
  modalText: {
    marginBottom: 20,
    fontSize: 16,
    fontWeight: "medium",
    textAlign: "center",
  },
  modalTitle: {
    color: colors.black,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});

export default CustomModal;
