import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Image,
  Text,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import { Divider } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import { setLoader } from "../../Redux/actions/GernalActions";
import { ApiCall } from "../../Services/Apis";
import {
  getFontSize,
  getHeight,
  getWidth,
  timeSince,
} from "../../../utils/ResponsiveFun";

import Feather from "react-native-vector-icons/Feather";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import { getChats, setAllSms } from "../../Redux/actions/GernalActions";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useGetChatRoomsQuery, useMeQuery } from "../../rtkQuery/slices/home";
import { API_ROUTES } from "../../rtkQuery/routes";
import { connectSocket } from "../../Services/Constants";

const TeacherMessage = (props) => {
  const { data, refetch, isLoading } = useGetChatRoomsQuery();
  console.log("data======", data?.data?.teacherChats);
  const { data: meData, refetch: meRefetch } = useMeQuery();
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    meRefetch();
    refetch();
  }, [refetch, meRefetch]);

  const UserId = meData?.data?._id;
  // const filteredData = useMemo(() => {
  //   return data?.data?.teacherChats?.filter((item) => {
  //     return (
  //       item.roomCreator?._id !== UserId || item.roomReceiver?._id !== UserId
  //     );
  //   });
  // }, [data, UserId]);

  const filteredData = useMemo(() => {
    const baseData = data?.data?.teacherChats?.filter((item) => {
      return (
        item.roomCreator?._id !== UserId || item.roomReceiver?._id !== UserId
      );
    });
    if (searchText.trim() === "") return baseData;
    return baseData?.filter((item) => {
      const otherUser =
        item.roomCreator?._id === UserId ? item.roomReceiver : item.roomCreator;
      const userName =
        `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
      return userName.includes(searchText.toLowerCase());
    });
  }, [data, UserId, searchText]);
  useEffect(() => {
    if (meData?.data?._id) {
      const socket = connectSocket();
      socket.emit("join", { userId: meData?.data?._id });

      socket.on("online-status", (statusData) => {
        setOnlineUsers((prev) =>
          statusData.status === "online"
            ? [...prev, statusData.userId]
            : prev.filter((id) => id !== statusData.userId)
        );
      });

      socket.on("chat", () => refetch());

      return () => {
        socket.off("online-status");
        socket.off("chat");
      };
    }
  }, [meData, refetch]);

  const MessageItem = ({ item }) => {
    const navigation = useNavigation();
    const otherUser =
      item.roomCreator?._id === UserId ? item.roomReceiver : item.roomCreator;
    if (!otherUser) return null;

    const isOnline = onlineUsers.includes(otherUser._id);

    const handlePress = () => {
      const socket = connectSocket();
      if (!socket.connected) {
        console.log("Socket disconnected, reconnecting...");
        socket.connect();
      }
      const data = {
        chatroomId: item?._id,
        userId: meData?.data?._id,
      };
      socket.emit("mark-as-read", data);
      navigation.navigate("ConversationScreen", {
        chatRoomId: item?._id,
        image: otherUser?.profile_image,
        ChatRoomUserName: `${otherUser?.firstName} ${otherUser?.lastName}`,
      });
    };
    return (
      <TouchableOpacity
        onPress={handlePress}
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          paddingHorizontal: 10,
          height: getHeight(10),
          alignItems: "center",
        }}
      >
        <View>
          <Image
            style={{ height: 45, width: 45, borderRadius: 40 }}
            resizeMode={"cover"}
            source={
              otherUser.profile_image
                ? { uri: `${API_ROUTES?.BASE_URL}/${otherUser?.profile_image}` }
                : {
                    uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwbYMnoBKydOk2tezl6c1A1g1nQgC_8JXckA&s",
                  }
            }
          />
          <View
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              height: 12,
              width: 12,
              borderRadius: 6,
              backgroundColor: isOnline ? "green" : "gray",
              borderWidth: 2,
              borderColor: "white",
            }}
          />
        </View>
        <View style={{ flex: 1, marginLeft: getWidth(5) }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Ubuntu-Bold",
              fontWeight: "500",
              color: "#14203C",
            }}
          >
            {otherUser?.firstName
              ? `${otherUser?.firstName} ${otherUser?.lastName}`
              : `***********`}
          </Text>
          <Text
            numberOfLines={1}
            style={{
              color: "#70747d",
              fontFamily: "Ubuntu-Regular",
              marginTop: 5,
            }}
          >
            {item?.lastMessage?.message?.toLocaleLowerCase() ||
              "Tap to start chatting..."}
          </Text>
        </View>

        <View>
          {item?.nbUnSeenMessages === 0 ? (
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "flex-end",
                borderRadius: 20,
                width: 22,
                height: 22,
                marginBottom: 7,
                backgroundColor: "#032f3c",
                color: "white",
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontSize: 12,
                }}
              >
                {item?.nbUnSeenMessages}
              </Text>
            </View>
          ) : null}
          {item?.last_message?.message ? (
            <Text
              style={{
                color: "#70747d",
                fontFamily: "Ubuntu-Bold",
                fontSize: 9,
              }}
            >
              {timeSince(new Date(item?.last_message?.createdAt))} ago
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search messages..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {isLoading ? (
        <View
          style={{
            height: getHeight(80),
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" color="#182d4a" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <Divider />}
          onRefresh={() => refetch()}
          refreshing={false}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                height: getHeight(80),
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: getFontSize(3),
                  color: "#182d4a",
                  fontWeight: "500",
                  fontFamily: "Ubuntu-Regular",
                }}
              >
                No messages yet
              </Text>
              <Text
                style={{
                  width: "80%",
                  fontFamily: "Ubuntu-Regular",
                  textAlign: "center",
                  color: "#182d4a",
                  letterSpacing: 0.5,
                  marginTop: 5,
                }}
              >
                Looks like you haven’t initiated a conversation with your Coach.
              </Text>
            </View>
          )}
          renderItem={({ item }) => <MessageItem item={item} />}
        />
      )}
    </View>
  );
};

export default TeacherMessage;
const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
  },
});
