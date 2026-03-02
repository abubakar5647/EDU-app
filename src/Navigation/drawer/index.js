import { React, useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import Image from "react-native-image-modal";
import Feather from "react-native-vector-icons/Feather";

import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import BottomTab from "../BottomTab";
import { useDispatch, useSelector } from "react-redux";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Divider } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Fontisto from "react-native-vector-icons/Fontisto";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
// import WorkOut from '../../Screens/Workouts/WorkOut';
import Message from "../../Screens/Message";
import { logout } from "../../Redux/actions/AuthActions";
import ConversationScreen from "../../Screens/Message/conversation";
import ChangePassword from "../../Screens/ChangePassword";
import UpdateProfiles from "../../Screens/UpdateProfile";
import ContactUs from "../../Screens/ContactUs";
import Help from "../../Screens/Help";
import ImageModal from "react-native-image-modal";
import { useWindowDimensions } from "react-native";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Notification from "../../Screens/Notifications";
import { colors } from "../../constants/colors";
import Events from "../../Screens/Events/Events";
import HomeSc from "../../Screens/HomeSc";
import Button from "../../Components/Button";
import { GernalStyle } from "../../constants/GernalStyle";
import Profile from "../../Screens/Profile";
import Documents from "../../Screens/Documents";
import Textbook from "../../Screens/Textbook";
import Gradebook from "../../Screens/Gradebook";
import Messag from "../../Screens/Messag";
import FamilyHome from "../../Screens/FamilyPortal/FamilyHome";
import FamilyProfile from "../../Screens/FamilyPortal/FamilyProfile";
import Payment from "../../Screens/FamilyPortal/Payment";
import { Fonts } from "../../assets/fonts";
import MyAgenda from "../../Screens/AdminPortal/MyAgenda";
import GradeAcsess from "../../Screens/GradeAccess";
import {
  captureImage,
  chooseImageGallery,
} from "../../../utils/ImageAndCamera";
import ImagePickerModal from "../../Components/ImagePickerModal";
import ImagePicker from "react-native-image-crop-picker";
import { setLoader } from "../../Redux/actions/GernalActions";
import toast from "react-native-simple-toast";
import TextbookView from "../../Screens/TextbookView";
import { API_ROUTES } from "../../rtkQuery/routes";
import { normalizeSize } from "../../../utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "../../Components/Toaster";
import { clearUserTokenAndData } from "../../rtkQuery/slices/user/user.slice";
import {
  useCreateProfileMutation,
  useMeQuery,
} from "../../rtkQuery/slices/home";
import UploadMedia from "../../Components/UploadMedia";

const Drawer = createDrawerNavigator();
function NavHeader(props) {
  const user = useSelector((state) => state.auth.userData);
  const token = useSelector((state) => state.auth.userToken);
  const UserData = useSelector((state) => state.user.userData);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [imageCrop, setImageCrop] = useState("");
  const [imageSave, setImageSave] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [createProfile] = useCreateProfileMutation();
  const { data: getMeProfile, refetch: refetchProfile } = useMeQuery();
  const handleImagePress = () => {
    setPickerModalVisibile(true);
  };

  const HandleCreateProfile = async (imagePath) => {
    const formData = new FormData();
    formData.append("image", {
      uri: imagePath,
      name: "profile.jpg",
      type: "image/jpeg",
    });

    try {
      const res = await createProfile(formData);
      console.log("drawerPicture===============", res);
      refetchProfile();
    } catch (error) {
      console.log("Image error ", error);
    }
  };

  const HandleSelectImage = async (imagePath) => {
    console.log("Selected Path:", imagePath);
    setSelectedImage(imagePath);
    setModalVisible(false);
    await HandleCreateProfile(imagePath);
  };

  // image upload
  const uploadFromCamera = async () => {
    const res = await captureImage();
    if (res.status == false) {
      toast.show(res.error);
      return;
    }
    const imageObject = {
      uri: res?.data?.uri,
      type: res?.data?.type,
      name: res?.data?.name,
    };
    dispatch(setLoader(true));
    setPickerModalVisibile(false);
    // setSelectedImage(imageObject.uri);
    setTimeout(function () {
      cropimage(imageObject?.uri);
      dispatch(setLoader(false));
    }, 3000);
  };
  const uploadFromGallry = async () => {
    const res = await chooseImageGallery("", 1, false);
    if (res.status == false) {
      toast.show(res.error);
      return;
    }
    const imageObject = {
      uri: res?.data?.uri,
      type: res?.data?.type,
      name: res?.data?.name,
    };
    dispatch(setLoader(true));
    setTimeout(function () {
      cropimage(imageObject?.uri);
      dispatch(setLoader(false));
    }, 1000);
    setPickerModalVisibile(false);
  };

  const cropimage = (uri) => {
    ImagePicker.openCropper({
      path: Platform.OS === "android" ? "file://" + uri : uri,
    }).then((image) => {
      const MyObject = {
        uri: image?.path,
        type: image?.mime,
        name: "profileImage" + user?._id,
      };
      setPickerModalVisibile(false);
      setImageCrop(MyObject);
      setImageSave(MyObject?.uri);
    });
  };

  return (
    <View
      style={{
        flexDirection: "row",
        width: getWidth(70),
        alignItems: "center",
        height: getHeight(24),
      }}
    >
      <UploadMedia
        modalVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSelectImage={HandleSelectImage}
      />
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: getWidth(70),
        }}
      >
        <View style={{ position: "relative", alignItems: "center" }}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <ImageModal
              style={{
                width: normalizeSize(60),
                height: normalizeSize(60),
                borderRadius: 40,
              }}
              resizeMode={"cover"}
              modalImageResizeMode="contain"
              // source={
              //   selectedImage
              //     ? { uri: selectedImage }
              //     : getMeProfile?.data?.profile_image
              //     ? {
              //         uri: `${API_ROUTES.BASE_URL}/${getMeProfile?.data?.profile_image}`,
              //       }
              //     : require("../../assets/images/Pimg.jpeg")
              // }
              source={
                getMeProfile?.data?.profile_image
                  ? {
                      uri: `${API_ROUTES.BASE_URL}/${getMeProfile?.data?.profile_image}`,
                    }
                  : selectedImage
                  ? { uri: selectedImage }
                  : require("../../assets/images/Pimg.jpeg")
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: 20,
              width: 20,
              backgroundColor: "white",
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              elevation: 2,
            }}
          >
            <MaterialIcons name={"edit"} size={15} color={"#182d4a"} />
          </TouchableOpacity>
        </View>

        <Text
          style={{
            color: "white",
            marginVertical: 5,
            fontFamily: Fonts?.PoppinsBold,
          }}
        >
          {getMeProfile?.data?.firstName} {getMeProfile?.data?.lastName}
        </Text>
        <Button
          text={"Edit Profile"}
          onPress={() => navigation.navigate("FamilyProfile")}
          btnTextStyle={{ color: "white", fontSize: 15 }}
          btnStyle={{
            ...GernalStyle.btn,
            borderWidth: 1,
            borderColor: "#D8D8D8",
            width: getWidth(35),
            height: getHeight(4),
            flexDirection: "row",
            alignItems: "center",
          }}
          leftIcon={
            <Feather
              name={"edit"}
              color={colors?.white}
              size={14}
              style={{ marginRight: 5 }}
            />
          }
        />
      </View>
    </View>
  );
}
function CustomDrawerContent(props) {
  const navigation = useNavigation();
  const user = useSelector((state) => state.auth.userData);
  const role = useSelector((state) => state.gernal.follow);

  const { height } = useWindowDimensions();
  const dispatch = useDispatch();
  const marginTop = Platform.OS === "android" ? getHeight(-2) : 0;
  const margin = Platform.OS === "android" ? getHeight(1.9) : height * 0.026;
  // const marginBo = Platform.OS === "android" ? getHeight(-0.5) : height * 0.03;

  // const handleLogout = async () => {
  //   try {
  //     console.log("Starting logout process...");
  //     await AsyncStorage.removeItem("isAuth");
  //     console.log("isAuth removed from AsyncStorage");
  //     dispatch(clearUserTokenAndData());
  //     console.log("User data and token cleared from Redux store");
  //     navigation.navigate("WelcomeScreen");
  //     console.log("Navigated to WelcomeScreen");
  //     showToast("success", "User Logged out Successfully");
  //   } catch (error) {
  //     console.error("Error during logout:", error);
  //   }
  // };

  const [isModalVisible, setModalVisible] = useState(false);

  // const logoutFun = () => {
  //   Alert.alert("", " Do you want to logout?", [
  //     {
  //       text: "No",
  //       onPress: () => console.log("Cancel Pressed"),
  //       style: "destructive",
  //     },
  //     {
  //       text: "Yes",
  //       onPress: () => handleLogout(),
  //       style: "default",
  //     },
  //   ]);
  // };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("isAuth");
      dispatch(clearUserTokenAndData());
      navigation.navigate("WelcomeScreen");
      showToast("success", "User Logged out Successfully");
    } catch (error) {
      console.error("Error during logout:", error);
    }
    setModalVisible(false);
  };

  const logoutFun = () => {
    setModalVisible(true);
  };

  return (
    <DrawerContentScrollView
      contentContainerStyle={{ flex: 1, backgroundColor: "#50C2C9" }}
      {...props}
    >
      <NavHeader {...props} />
      <Divider
        style={{
          height: 1,
          backgroundColor: "#D8D8D8",
          borderRadius: 10,
          marginBottom: getHeight(1),
          width: "93%",
          alignSelf: "center",
        }}
      />

      <DrawerItemList {...props} />

      <View style={{ flex: 1, justifyContent: "flex-end", bottom: margin }}>
        {/* {role == "Admin" ? (
          <DrawerItem
            //style={{ marginTop: getHeight(-1) }}
            label={"Profile school"}
            labelStyle={{ fontFamily: "Ubuntu-Bold" }}
            onPress={() => navigation.navigate("ProfileSchool")}
            inactiveTintColor={"white"}
            activeTintColor={"white"}
            labelStyle={{ color: "white" }}
            activeBackgroundColor={"white"}
          />
        ) : null} */}
        {role === "Admin" || role === "Teacher" ? (
          <DrawerItem
            //style={{ marginTop: getHeight(-1) }}
            label={"School profile"}
            labelStyle={{ fontFamily: "Ubuntu-Bold" }}
            onPress={() => navigation.navigate("ProfileSchool")}
            inactiveTintColor={"white"}
            activeTintColor={"white"}
            labelStyle={{ color: "white" }}
            activeBackgroundColor={"white"}
          />
        ) : null}
        <DrawerItem
          //style={{ marginTop: getHeight(-1) }}
          label={"Help & Contact"}
          labelStyle={{ fontFamily: "Ubuntu-Bold" }}
          onPress={() => navigation.navigate("HelpAndContacts")}
          inactiveTintColor={"white"}
          activeTintColor={"white"}
          labelStyle={{ color: "white" }}
          activeBackgroundColor={"white"}
        />

        <View style={{ height: marginTop }}>
          <Divider
            style={{
              height: 1,
              backgroundColor: "#D8D8D8",
              borderRadius: 10,
              marginBottom: getHeight(1),
              width: "93%",
              alignSelf: "center",
            }}
          />
        </View>
        <DrawerItem
          label={"Logout"}
          labelStyle={{ fontFamily: "Ubuntu-Bold" }}
          onPress={() => setModalVisible(true)}
          inactiveTintColor={"#EB5757"}
          activeTintColor={"#EB5757"}
          labelStyle={{ color: "#EB5757" }}
          activeBackgroundColor={"#EB5757"}
          icon={({ color, size, focuced }) => (
            <MaterialIcons name={"logout"} size={20} color={"#EB5757"} />
          )}
        />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelButton}
              >
                <Text style={styles.buttonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleLogout}
                style={styles.confirmButton}
              >
                <Text style={styles.buttonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "80%",
    height: normalizeSize(150),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 20,
    color: "black",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  cancelButton: {
    backgroundColor: "gray",
    borderRadius: 8,
    marginRight: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    height: normalizeSize(40),
  },
  confirmButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    marginRight: 10,
    width: "30%",
    alignItems: "center",
    justifyContent: "center",
    height: normalizeSize(40),
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default function MyDrawer() {
  const role = useSelector((state) => state.gernal.follow);
  console.log("role", role);
  return (
    <Drawer.Navigator
      drawerPosition="right"
      screenOptions={(drawerPosition = "right")}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        options={{
          headerShown: false,
          drawerInactiveTintColor: "white",
          drawerActiveTintColor: "#333333",
          drawerActiveBackgroundColor: "white",
          drawerLabelStyle: {
            fontFamily: "Ubuntu",
            fontSize: getFontSize(1.7),
            marginLeft: getFontSize(0.3),
          },
        }}
        name="Home"
        component={role == "Family" ? FamilyHome : HomeSc}
      />
      {/* {role === "Teacher" && (
        <Drawer.Screen
          options={{
            headerShown: false,
            drawerInactiveTintColor: "white",
            drawerActiveTintColor: "#333333",
            drawerActiveBackgroundColor: "white",

            drawerLabelStyle: {
              fontFamily: "Ubuntu",
              fontSize: getFontSize(1.7),
              marginLeft: getFontSize(0.1),
            },
          }}
          name="My agenda"
          component={MyAgenda}
        />
      )} */}
      {role == "Admin" ? (
        <>
          {/* <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="My agenda"
            component={MyAgenda}
          /> */}
          <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="Homework"
            component={Textbook}
          />
          <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="Messages"
            component={Messag}
          />
          {/* <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="Documents"
            component={Documents}
          /> */}
          <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="Grades"
            component={Gradebook}
          />
        </>
      ) : (
        <>
          {!role == "Family" ? (
            <Drawer.Screen
              options={{
                headerShown: false,
                drawerInactiveTintColor: "white",
                drawerActiveTintColor: "#333333",
                drawerActiveBackgroundColor: "white",

                drawerLabelStyle: {
                  fontFamily: "Ubuntu",
                  fontSize: getFontSize(1.7),
                  marginLeft: getFontSize(0.3),
                  padding: 2,
                },
              }}
              name="Profile"
              component={role == "Family" ? FamilyProfile : Profile}
            />
          ) : null}

          {role !== "Family" && (
            <>
              <Drawer.Screen
                options={{
                  headerShown: false,
                  drawerInactiveTintColor: "white",
                  drawerActiveTintColor: "#333333",
                  drawerActiveBackgroundColor: "white",
                  drawerLabelStyle: {
                    fontFamily: "Ubuntu",
                    fontSize: getFontSize(1.7),
                    marginLeft: getFontSize(-0.3),
                  },
                }}
                name={role == "Teacher" ? "Homework" : "Textbook"}
                component={Textbook}
              />

              <Drawer.Screen
                options={{
                  headerShown: false,
                  drawerInactiveTintColor: "white",
                  drawerActiveTintColor: "#333333",
                  drawerActiveBackgroundColor: "white",

                  drawerLabelStyle: {
                    fontFamily: "Ubuntu",
                    fontSize: getFontSize(1.7),
                    //marginLeft: getFontSize(-0.3),
                  },
                }}
                name="Grades"
                component={Gradebook}
              />
              {/* <Drawer.Screen
                options={{
                  headerShown: false,
                  drawerInactiveTintColor: "white",
                  drawerActiveTintColor: "#333333",
                  drawerActiveBackgroundColor: "white",

                  drawerLabelStyle: {
                    fontFamily: "Ubuntu",
                    fontSize: getFontSize(1.7),
                    marginLeft: getFontSize(0.1),
                  },
                }}
                name="Grade"
                component={GradeAcsess}
              /> */}
            </>
          )}

          {role == "Family" ? (
            <>
              <Drawer.Screen
                options={{
                  headerShown: false,
                  drawerInactiveTintColor: "white",
                  drawerActiveTintColor: "#333333",
                  drawerActiveBackgroundColor: "white",

                  drawerLabelStyle: {
                    fontFamily: "Ubuntu",
                    fontSize: getFontSize(1.7),
                    marginLeft: getFontSize(0.3),
                  },
                }}
                name="Payment"
                component={Payment}
              />

              {/* <Drawer.Screen
                options={{
                  headerShown: false,
                  drawerInactiveTintColor: "white",
                  drawerActiveTintColor: "#333333",
                  drawerActiveBackgroundColor: "white",

                  drawerLabelStyle: {
                    fontFamily: "Ubuntu",
                    fontSize: getFontSize(1.7),
                    marginLeft: getFontSize(0.1),
                  },
                }}
                name="Grades"
                component={GradeAcsess}
              /> */}
            </>
          ) : null}
          <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(0.1),
              },
            }}
            name="Messages"
            component={Messag}
          />
          {/* <Drawer.Screen
            options={{
              headerShown: false,
              drawerInactiveTintColor: "white",
              drawerActiveTintColor: "#333333",
              drawerActiveBackgroundColor: "white",

              drawerLabelStyle: {
                fontFamily: "Ubuntu",
                fontSize: getFontSize(1.7),
                marginLeft: getFontSize(-0.1),
              },
            }}
            name="Documents"
            component={Documents}
          /> */}
        </>
      )}
    </Drawer.Navigator>
  );
}
