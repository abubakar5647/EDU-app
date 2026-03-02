import React from "react";
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
} from "react-native";
import ImageCropPicker from "react-native-image-crop-picker";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
const ImagePickerModal = ({
  modalVisible = false,
  onClose,
  onSelectImage,
  multiple,
}) => {
  const handleGalleryPress = async () => {
    try {
      const images = await ImageCropPicker.openPicker({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
        multiple: multiple,
      });

      if (images && images.length > 0) {
        const imagePaths = images.map((image) => image.path);
        onSelectImage(imagePaths);
      } else {
        console.log("No images selected");
      }
    } catch (error) {
      console.log("Error selecting image from gallery:", error);
    }
    onClose();
  };

  // const handleGalleryPress = async () => {
  //   try {
  //     const image = await ImageCropPicker.openPicker({
  //       cropping: true,
  //       width: 300,
  //       height: 300,
  //       cropperCircleOverlay: true,
  //       multiple: false, // Ensures single image selection
  //     });

  //     if (image) {
  //       const imagePath = image.path; // Access single image's path
  //       onSelectImage(imagePath); // Pass the single image path
  //     } else {
  //       console.log("No image selected");
  //     }
  //   } catch (error) {
  //     console.log("Error selecting image from gallery:", error);
  //   }
  //   onClose();
  // };

  const handleCameraPress = async () => {
    try {
      const image = await ImageCropPicker.openCamera({
        cropping: true,
        width: 300,
        height: 300,
        cropperCircleOverlay: true,
      });
      onSelectImage([image.path]);
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
            <TouchableOpacity style={styles.boxes} onPress={handleGalleryPress}>
              <FontAwesome6
                name="photo-film"
                size={40}
                color="#182d4a"
                style={{ marginTop: getFontSize(2) }}
              />
              <Text
                style={{
                  width: "53%",
                  textAlign: "center",
                  marginTop: getHeight(1),
                  color: "#182d4a",
                  fontFamily: "Ubuntu-Regular",
                }}
              >
                Choose From Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.boxes} onPress={handleCameraPress}>
              <MaterialIcons name="photo-camera" size={45} color="#182d4a" />
              <Text
                style={{
                  width: "50%",
                  textAlign: "center",
                  marginTop: getHeight(1),
                  color: "#182d4a",
                  fontFamily: "Ubuntu-Regular",
                }}
              >
                Open Camera
              </Text>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    elevation: 5,
    flexDirection: "row",
    width: "100%",
    height: "20%",
    bottom: 0,
    position: "absolute",
    justifyContent: "space-around",
    paddingTop: 50,
    alignItems: "center",
    borderTopStartRadius: 22,
    borderTopRightRadius: 20,
  },
  boxes: {
    width: getWidth(50),
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ImagePickerModal;
