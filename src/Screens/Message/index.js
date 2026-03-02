import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Image,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  StyleSheet,
} from "react-native";
import { Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useGetChatRoomsQuery, useMeQuery } from "../../rtkQuery/slices/home";
import { connectSocket } from "../../Services/Constants";
import {
  getFontSize,
  getHeight,
  getWidth,
  timeSince,
} from "../../../utils/ResponsiveFun";
import { API_ROUTES } from "../../rtkQuery/routes";

const Message = () => {
  const { data, refetch, isLoading } = useGetChatRoomsQuery();
  const { data: meData, refetch: meRefetch } = useMeQuery();
  const UserId = meData?.data?._id;
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    meRefetch();
    refetch();
  }, [refetch, meRefetch]);

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

  const filteredData = useMemo(() => {
    const baseData = data?.data?.parentChats?.filter((item) => {
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

  const navigation = useNavigation();

  const MessageItem = ({ item }) => {
    const otherUser =
      item.roomCreator?._id === UserId ? item.roomReceiver : item.roomCreator;
    if (!otherUser) return null;

    const isOnline = onlineUsers.includes(otherUser._id);
    const handlePress = () => {
      const socket = connectSocket();
      const data = {
        chatroomId: item?._id,
        userId: meData?.data?._id,
      };
      socket?.emit("mark-as-read", data);
      navigation.navigate("ConversationScreen", {
        chatRoomId: item?._id,
        image: otherUser?.profile_image,
        ChatRoomUserName: `${otherUser?.firstName} ${otherUser?.lastName}`,
      });
    };

    return (
      <TouchableOpacity
        onPress={handlePress}
        style={styles.messageItemContainer}
      >
        <View>
          <Image
            style={styles.profileImage}
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
            style={[
              styles.onlineIndicator,
              { backgroundColor: isOnline ? "green" : "gray" },
            ]}
          />
        </View>

        <View style={styles.messageTextContainer}>
          <Text style={styles.userName}>
            {otherUser?.firstName
              ? `${otherUser?.firstName} ${otherUser?.lastName}`
              : `***********`}
          </Text>
          <Text numberOfLines={1} style={styles.lastMessage}>
            {item?.lastMessage?.message || "Tap to start chatting..."}
          </Text>
        </View>

        <View>
          {item?.nbUnSeenMessages ? (
            <View style={styles.unseenMessages}>
              <Text style={styles.unseenMessagesText}>
                {item?.nbUnSeenMessages}
              </Text>
            </View>
          ) : null}
          {item?.lastMessage?.message ? (
            <Text style={styles.timeText}>
              {timeSince(new Date(item?.lastMessage?.createdAt))}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Search messages..."
        value={searchText}
        onChangeText={setSearchText}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
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

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    margin: 10,
    paddingHorizontal: 10,
  },
  messageItemContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    height: getHeight(10),
    alignItems: "center",
  },
  profileImage: { height: 45, width: 45, borderRadius: 40 },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    height: 12,
    width: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "white",
  },
  messageTextContainer: { flex: 1, marginLeft: getWidth(5) },
  userName: { fontSize: 16, fontWeight: "500", color: "#14203C" },
  lastMessage: { color: "#70747d", marginTop: 5 },
  unseenMessages: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    width: 22,
    height: 22,
    marginBottom: 7,
    backgroundColor: "#032f3c",
  },
  unseenMessagesText: { color: "white", fontSize: 12 },
  timeText: { color: "#70747d", fontSize: 9 },
  loadingContainer: {
    height: getHeight(80),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    height: getHeight(80),
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { fontSize: getFontSize(3), color: "#182d4a", fontWeight: "500" },
});

export default Message;
