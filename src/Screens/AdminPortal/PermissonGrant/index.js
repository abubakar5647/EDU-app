import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../../utils/ResponsiveFun";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";
import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import { Switch } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { togglePermission } from "../../../rtkQuery/slices/user/user.slice";
import { useFocusEffect, useRoute } from "@react-navigation/native";
import { useGetPermissionBYSingleIdQuery } from "../../../rtkQuery/slices/home";
import { useUpdatePermissionMutation } from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";
import { Empty } from "../../../assets/images";
import { NewPermissionData } from "../../../../utils";

const PermissonGrant = ({ navigation }) => {
  const route = useRoute();
  const { userId } = route.params || {};
  console.log("userId===========", userId);
  const {
    data: GetPermissionById,
    refetch,
    isLoading,
  } = useGetPermissionBYSingleIdQuery(userId);
  console.log(
    "GetPermissionById====================",
    GetPermissionById?.data.map((text) => text.permissions)
  );
  useFocusEffect(
    React.useCallback(() => {
      refetch();
    }, [])
  );
  const permissionsDataApiData =
    GetPermissionById?.data.flatMap((item) =>
      item.permissions.map((permission) => ({
        id: permission._id,
        title: permission.title,
        isChecked: permission.isChecked,
      }))
    ) || [];
  console.log(
    "permissionsDataApiData==================",
    permissionsDataApiData
  );

  const [UpdatePermission] = useUpdatePermissionMutation();
  const dispatch = useDispatch();
  const per = useSelector((state) => state?.user?.permissions);

  // console.log("Permissions:", per);

  const myId = GetPermissionById?.data.map((value) => value._id);
  const [permissionsData, setPermissionsData] = useState(
    NewPermissionData.map((item) => ({
      ...item,
      permissionHandler: item.title.toLowerCase().replace(/\s+/g, ""),
    }))
  );
  const handleToggle = (itemName, value) => {
    const updatedData = permissionsData.map((item) =>
      item.title === itemName ? { ...item, isChecked: value } : item
    );

    setPermissionsData(updatedData);
    dispatch(togglePermission(updatedData));
    // console.log("updatedData===", updatedData);
  };

  const [newPermissions, setNewPermissions] = useState([]);

  useEffect(() => {
    if (GetPermissionById?.data) {
      const permissions = GetPermissionById.data
        .map((value) => value.permissions)
        .flat();

      setNewPermissions(permissions);
      console.log("permissionsooo", permissions);
    }
  }, [GetPermissionById]);

  const handleSwitchChange = async (index) => {
    const updatedPermissions = newPermissions.map((perm, i) => {
      if (i === index) {
        return { ...perm, isChecked: !perm.isChecked };
      }
      return perm;
    });
    setNewPermissions(updatedPermissions);
  };
  useEffect(() => {
    if (per?.length === 0) {
      dispatch(togglePermission(NewPermissionData));
    }
  }, []);
  const handleCallUpdateApi = async () => {
    const myId = GetPermissionById?.data.map((value) => value._id);
    const payload = {
      permissionId: myId,
      permissions: newPermissions.map(
        ({ permissionHandler, isChecked, title }) => ({
          permissionHandler: permissionHandler
            .toLowerCase()
            .replace(/\s+/g, ""),
          isChecked,
          title,
        })
      ),
    };
    // console.log("payload==============", payload);
    try {
      const res = await UpdatePermission(payload);
      if (userId) {
        navigation.goBack();
      } else {
        navigation.navigate("Permission");
      }
      showToast("success", res.data.message);
      const newPermissionsData = newPermissions.map(
        ({ permissionHandler, isChecked, title }) => ({
          permissionHandler: permissionHandler
            .toLowerCase()
            .replace(/\s+/g, ""),
          isChecked,
          title,
        })
      );
      dispatch(togglePermission(newPermissionsData));
    } catch (error) {
      console.error("Failed to update permissions: ", error);
      Alert.alert("Error", "Failed to update permissions. Please try again.");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors?.white }}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        RightIcon={<View />}
        title={"PERMISSIONS"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      {userId ? (
        <ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            {permissionsDataApiData.length > 0 ? (
              permissionsDataApiData.map((item, index) => (
                <View
                  key={item.id}
                  style={{
                    padding: 10,
                    borderRadius: 8,
                    marginVertical: getHeight(1),
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "Poppins-Medium",
                        fontSize: 14,
                        color: "#47424F",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Switch
                      value={newPermissions[index]?.isChecked}
                      color={"#50C2C9"}
                      style={{
                        transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                      }}
                      onValueChange={() => handleSwitchChange(index)}
                    />
                  </View>
                </View>
              ))
            ) : (
              <View style={GernalStyle.emptyContainer}>
                <Image
                  source={Empty}
                  style={{ height: 200, width: 250, borderRadius: 15 }}
                />
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: getHeight(2),
              }}
            >
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  backgroundColor: "#EFEFEF",
                  flexDirection: "row",
                  width: getWidth(42),
                  height: getHeight(5),
                }}
                btnTextStyle={{
                  ...GernalStyle.btnText,
                  fontSize: 14,
                  color: "#A6A6A6",
                }}
                text={"Cancel"}
              />
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  backgroundColor: colors.primary,
                  flexDirection: "row",
                  width: getWidth(42),
                  height: getHeight(5),
                }}
                btnTextStyle={{ ...GernalStyle.btnText, fontSize: 14 }}
                text={"Save"}
                onPress={handleCallUpdateApi}
                Loading={isLoading}
              />
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView>
          <View style={{ paddingHorizontal: 20 }}>
            {per.map((item) => (
              <View key={item.id}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginVertical: getHeight(1),
                  }}
                >
                  <Text
                    style={{
                      fontFamily: "Poppins-Medium",
                      fontSize: 14,
                      color: "#47424F",
                    }}
                  >
                    {item.title}
                  </Text>
                  <Switch
                    value={item.isChecked}
                    color={"#50C2C9"}
                    style={{
                      transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }],
                    }}
                    onValueChange={(value) => handleToggle(item.title, value)}
                  />
                </View>
              </View>
            ))}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: getHeight(2),
              }}
            >
              <Button
                btnStyle={{
                  ...GernalStyle.btn,
                  backgroundColor: "#EFEFEF",
                  flexDirection: "row",
                  width: getWidth(42),
                  height: getHeight(5),
                }}
                btnTextStyle={{
                  ...GernalStyle.btnText,
                  fontSize: 14,
                  color: "#A6A6A6",
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
                }}
                btnTextStyle={{ ...GernalStyle.btnText, fontSize: 14 }}
                text={"Save"}
                onPress={() => {
                  dispatch(togglePermission(permissionsData));
                  navigation.goBack();
                }}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

export default PermissonGrant;

const styles = StyleSheet.create({});
