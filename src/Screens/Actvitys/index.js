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
  Alert,
} from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import Header from "../../Components/Header";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import Message from "../Message";
import { fonts } from "../../constants/fonts";
import SelectDropdown from "react-native-select-dropdown";
import ReactNativeCalendarStrip from "react-native-calendar-strip";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import ReactNativeModal from "react-native-modal";
import { Switch, TextInput } from "react-native-paper";
import DatePicker from "react-native-date-picker";
import { launchCamera } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Platform } from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

const requestCameraPermission = async () => {
  const permission =
    Platform.OS === "ios" ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const result = await check(permission);

  if (result === RESULTS.GRANTED) {
    return true;
  }

  const requestResult = await request(permission);
  return requestResult === RESULTS.GRANTED;
};

const captureImage = async (navigation) => {
  const cameraGranted = await requestCameraPermission();
  const options = {
    mediaType: "photo",
    quality: 1,
  };

  launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log("User cancelled image picker");
    } else if (response.error) {
      console.log("ImagePicker Error: ", response.error);
    } else {
      const capturedImage = response?.assets[0];

      navigation.navigate("TagStudent", {
        name: "image",
        title: "Tag student",
        capturedImage: capturedImage,
      });
    }
  });
};

const captureVideo = async (navigation) => {
  const cameraGranted = await requestCameraPermission();
  const options = {
    mediaType: "video",
    quality: 1,
    videoQuality: "high",
    durationLimit: 60,
  };
  launchCamera(options, (response) => {
    if (response.didCancel) {
      console.log("User cancelled video capture");
    } else if (response.error) {
      console.log("Video Capture Error: ", response.error);
    } else {
      const capturedVideo = response?.assets[0];

      navigation.navigate("TagStudent", {
        name: "video",
        title: "Tag student",
        videoUri: capturedVideo.uri,
      });
    }
  });
};

const Actvitys = ({ navigation, route }) => {
  const { selectedClassroom } = route.params;
  const data = [
    {
      name: "Photo",
      icon: <FontAwesome6 name="camera" color="white" size={35} />,
      color: "#FF951C",
      onPress: () => captureImage(navigation),
    },
    {
      name: "Video",
      icon: <FontAwesome name="video-camera" color="white" size={35} />,
      color: "#FF502F",
      onPress: () => captureVideo(navigation),
    },
    {
      name: "Food",
      icon: (
        <MaterialCommunityIcons
          name="silverware-fork-knife"
          color="white"
          size={35}
        />
      ),
      color: "#50C2C9",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "food",
        }),
    },
    {
      name: "Nap",
      icon: (
        <MaterialCommunityIcons name="bed-outline" color="white" size={35} />
      ),
      color: "#E2B62E",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "nap",
        }),
    },
    {
      name: "Potty",
      icon: <FontAwesome6 name="toilet" color="white" size={35} />,
      color: "#A820CA",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "potty",
        }),
    },
    {
      name: "Note",
      icon: (
        <MaterialCommunityIcons
          name="note-text-outline"
          color="white"
          size={35}
        />
      ),
      color: "#18EA71",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "note",
        }),
    },
    {
      name: "Incident",
      icon: <FontAwesome name="warning" color="white" size={35} />,
      color: "#6B35BB",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "incident",
        }),
    },
    {
      name: "Kudos",
      icon: (
        <MaterialCommunityIcons name="medal-outline" color="white" size={35} />
      ),
      color: "#B76315",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "kudos",
        }),
    },
    {
      name: "Meds",
      icon: <FontAwesome6 name="briefcase-medical" color="white" size={35} />,
      color: "#303987",
      onPress: () =>
        navigation.navigate("TagStudent", {
          selectedClassroom: selectedClassroom,
          name: "meds",
        }),
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
        title={"Activities"}
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
      <View
        style={{
          width: "100%",
          alignSelf: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <FlatList
          data={data}
          ItemSeparatorComponent={() => (
            <View style={{ height: getHeight(4) }} />
          )}
          ListHeaderComponent={() => <View style={{ height: getHeight(5) }} />}
          numColumns={3}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={
                item.onPress
                // () =>
                //   navigation.navigate("TagStudent", {
                //     // name: item.name,
                //     // title: "Tag student",
                //   })
              }
              style={{
                width: 120,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: item.color,
                  justifyContent: "center",
                  alignItems: "center",
                  height: 80,
                  width: 80,
                  borderRadius: 40,
                }}
              >
                {item?.icon}
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "500",
                  color: "#47424F",
                  fontFamily: "Poppins-Bold",
                  marginTop: getHeight(1),
                }}
              >
                {item?.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};
export default Actvitys;
