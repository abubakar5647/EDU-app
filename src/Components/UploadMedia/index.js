import React from "react";
import {
  Image,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { CameraBlue, Empty } from "../../assets/images";
import CustomText from "../CustomText";
import { Fonts } from "../../assets/fonts";
import { colors } from "../../constants/colors";
import { normalizeSize } from "../../../utils";
import Icons from "../Icons";

const UploadMedia = ({ modalVisible, onClose, onSelectImage }) => {
  const handleGalleryPress = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
      });
      onSelectImage(image.path);
    } catch (error) {
      console.log("Error selecting image from gallery:", error);
    }
    onClose();
  };

  const handleCameraPress = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
      });
      onSelectImage(image.path);
    } catch (error) {
      console.log("Error capturing image from camera:", error);
    }
    onClose();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.modalContainer}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={handleGalleryPress}>
              <Icons
                family={"MaterialCommunityIcons"}
                name={"camera-image"}
                size={60}
                color={colors.primary}
              />
              <CustomText
                label="Gallery"
                fontSize={14}
                fontFamily={Fonts.PoppinsMedium}
                alignSelf="center"
                color={colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCameraPress}>
              <Image source={CameraBlue} style={{ height: 60, width: 60 }} />
              <CustomText
                label="Camera"
                fontSize={14}
                fontFamily={Fonts.PoppinsMedium}
                alignSelf="center"
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.ModalColor,
  },
  modalContent: {
    backgroundColor: colors.white,
    padding: 20,
    elevation: 5,
    flexDirection: "row",
    width: "100%",
    height: "20%",
    bottom: 0,
    position: "absolute",
    justifyContent: "space-around",
    paddingTop: normalizeSize(50),
    alignItems: "center",
    borderTopStartRadius: normalizeSize(22),
    borderTopRightRadius: normalizeSize(20),
  },
});

export default UploadMedia;
