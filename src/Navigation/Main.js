import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { Image, View, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch } from "react-redux";

import { useSelector } from "react-redux";

import { getHeight, getWidth } from "../../utils/ResponsiveFun";
import { getSingleUser } from "../Redux/actions/AuthActions";
import AuthStack from "./AuthStack";
import HomeStack from "./HomeStack";
import { appListner } from "../Screens/Notifications";
//import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMeQuery } from "../rtkQuery/slices/auth";
import { setUserData } from "../rtkQuery/slices/user/user.slice";

const Main = () => {
  const { data, isLoading } = useMeQuery();
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);

  // useEffect(() => {
  //   const storeToken = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem("isAuth");
  //       console.log("token.........", token);
  //       token = token;
  //     } catch (error) {
  //       console.log("Error storing token:", error);
  //     }
  //   };
  //   dispatch(setUserData(data?.data));
  //   storeToken();
  // }, []);

  return (
    <NavigationContainer>
      {/* {userData == null ? <AuthStack /> : <HomeStack />} */}

      <AuthStack />
      {/* {isLoading ? (
        <View style={styles.loaderbackground}>
          <View>
            <ActivityIndicator
              size={getHeight(5)}
              color="rgba(247, 147, 0, 1)"
            />
          </View>
        </View>
      ) : null} */}
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  loaderbackground: {
    justifyContent: "center",
    alignItems: "center",
    height: getHeight(110),
    width: getWidth(100),
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    position: "absolute",
    alignSelf: "center",
  },
});
export default Main;
