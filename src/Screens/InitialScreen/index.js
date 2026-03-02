import { StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setUserData } from "../../rtkQuery/slices/user/user.slice";
import { ActivityIndicator } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setFollow } from "../../Redux/actions/GernalActions";
import { useMeQuery } from "../../rtkQuery/slices/home";

const InitialScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const { data, refetch } = useMeQuery();
  // console.log("data======>>>", data);

  // console.log("first,,,,,,,,,,,,,,", userData);

  useEffect(() => {
    dispatch(setUserData(data?.data));
  }, [data]);

  useEffect(() => {
    dispatch(setUserData(userData));
    const storeToken = async () => {
      try {
        const token = await AsyncStorage.getItem("isAuth");
        console.log("token.........", token);
        if (token) {
          dispatch(
            setFollow(
              userData?.role === "parent"
                ? "Family"
                : userData?.role === "teacher"
                ? "Teacher"
                : "Admin"
            )
          );
          navigation.navigate("Home");
          return;
        } else {
          navigation.navigate("WelcomeScreen");
        }
      } catch (error) {
        console.log("Error storing token:", error);
      }
    };
    storeToken();
  }, [userData]);
  return (
    <View style={styles.loaderbackground}>
      <ActivityIndicator size={20} color="rgba(247, 147, 0, 1)" />
    </View>
  );
};

export default InitialScreen;

const styles = StyleSheet.create({
  loaderbackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    alignSelf: "center",
  },
});
