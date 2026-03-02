import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import Header from "../../../Components/Header";
import { Fonts } from "../../../assets/fonts";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { showToast } from "../../../Components/Toaster";
import { Empty } from "../../../assets/images";
import { normalizeSize } from "../../../../utils";
import {
  useDeleteGroupMutation,
  useGetAllGroupsQuery,
} from "../../../rtkQuery/slices/home";
import CustomModal from "../../../Components/CustomModal";

const AllGroups = ({ navigation }) => {
  const [modalShow, setModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const { data: allGroups, isLoading: isLoadingAllGroups } =
    useGetAllGroupsQuery();

  const [deleteGroup, { isLoading }] = useDeleteGroupMutation();
  const handleGroupDeleted = async (selectedGroup) => {
    try {
      const response = await deleteGroup({ groupId: selectedGroup?._id });
      console.log("response", response);
      if (response.error) {
        showToast("error", response.error.error);
        console.log("API error in Delete group:", response.error);
      } else {
        console.log("Group Deleted Successfully:", response);
        showToast("success", response.data.message);
        setModalShow(false);
      }
    } catch (error) {
      console.error("Failed to delete the group: ", error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: 1,
            padding: 5,
            borderBottomColor: "#EAEAEA",
            marginHorizontal: 10,
            marginVertical: 10,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins_Bold",
              color: "#47424F",
            }}
          >
            {item?.name}
          </Text>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                setModalShow(true);
                setSelectedItem(item);
              }}
            >
              <MaterialIcons name="delete" size={18} color={colors.red} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("AddGroup", { selectedGroup: item })
              }
              style={{ paddingRight: 3 }}
            >
              <MaterialIcons name="edit" size={18} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </>
    );
  };

  return (
    <View>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        backgroundColor={colors.primary}
        RightIcon={<View />}
        title={"All Groups"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
      <Text
        style={{
          fontSize: 18,
          fontFamily: Fonts.PoppinsBold,
          color: "#47424F",
          margin: 10,
        }}
      >
        All Groups
      </Text>
      {isLoadingAllGroups ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={allGroups?.data}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                alignSelf: "center",
                marginTop: normalizeSize(40),
              }}
            >
              <Image
                source={Empty}
                style={{
                  width: normalizeSize(300),
                  height: normalizeSize(300),
                }}
              />
              <Text
                style={{
                  alignSelf: "center",
                  marginTop: normalizeSize(20),
                  fontSize: normalizeSize(20),
                  color: colors.black,
                  fontWeight: "bold",
                }}
              >
                No Data
              </Text>
            </View>
          }
        />
      )}
      <CustomModal
        modalShow={modalShow}
        setModalShow={setModalShow}
        heading={"Are you sure you want to delete this group?"}
        title={"Delete Group"}
        onPress={() => handleGroupDeleted(selectedItem)}
        loading={isLoading}
      />
    </View>
  );
};

export default AllGroups;

const styles = StyleSheet.create({});
