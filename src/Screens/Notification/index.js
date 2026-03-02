import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import { colors } from "../../constants/colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getFontSize, getWidth } from "../../../utils/ResponsiveFun";
import { useNotificationQuery } from "../../rtkQuery/slices/home";

const Notification = ({ navigation }) => {
  const { data, isLoading } = useNotificationQuery();

  console.log("datadatadatadatadatadatadatadatadata", data);

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity style={styles.notificationCard} activeOpacity={0.95}>
      <View style={styles.notificationIcon}>
        <Ionicons
          name="notifications-outline"
          size={24}
          color={colors.PrimaryDark}
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item?.title}</Text>
        <Text style={styles.notificationDescription}>{item?.body}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <GeneralStatusBar
        barStyle="dark-content"
        hidden={false}
        backgroundColor={colors.PrimaryLight}
        translucent={true}
      />
      <Header
        title={"Notification"}
        color={colors.HeaderTextColor}
        backgroundColor={colors.PrimaryLight}
        LeftIcon={
          <Ionicons
            style={{ alignSelf: "center", marginRight: getWidth(2) }}
            name={"arrow-back"}
            size={25}
            color={"black"}
            onPress={() => navigation.goBack()}
          />
        }
        RightIcon={<View style={{ marginRight: getFontSize(3) }} />}
      />

      {isLoading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={data?.data}
          keyExtractor={(item) => item.id}
          renderItem={renderNotificationItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No notifications available</Text>
          }
        />
      )}
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    padding: 16,
  },
  listContent: {
    padding: 16,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fdfdfd",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  notificationIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#eaf3fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black10,
    marginBottom: 4,
  },
  notificationDescription: {
    fontSize: 14,
    color: "#6b7280",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 16,
    color: "#888",
    marginTop: 20,
  },
});
