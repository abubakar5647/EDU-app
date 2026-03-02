import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
  SafeAreaView,
  StatusBar,
  Platform,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import DocumentPicker from "react-native-document-picker";
import { Bubble, GiftedChat, Avatar } from "react-native-gifted-chat";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import AntDesign from "react-native-vector-icons/AntDesign";
import { ApiCall } from "../../Services/Apis";
import { useDispatch, useSelector } from "react-redux";
import Feather from "react-native-vector-icons/Feather";
import ImageModal from "react-native-image-modal";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SvgUri } from "react-native-svg";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import SimpleToast from "react-native-simple-toast";

import fs from "react-native-fs";
import {
  getChats,
  setAllSms,
  setLoader,
} from "../../Redux/actions/GernalActions";
import {
  IMAGE_URL,
  SOCKET_URL,
  connectSocket,
  disconnectSocket,
  getSocket,
} from "../../Services/Constants";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Header from "../../Components/Header";
import { Divider } from "react-native-paper";
import { GernalStyle } from "../../constants/GernalStyle";
import { colors } from "../../constants/colors";
import { CameraIcon, Empty, PdfIcon, SendIcon } from "../../assets/images";
import { fonts } from "../../constants/fonts";
import ImagePickerModal from "../../Components/ImagePickerModal";
import {
  captureImage,
  chooseImageGallery,
} from "../../../utils/ImageAndCamera";
import HeaderBottom from "../../Components/HeaderBottom";
import { normalizeSize } from "../../../utils";
import {
  useConversationMessageQuery,
  useGetChatRoomsQuery,
  useMeQuery,
} from "../../rtkQuery/slices/home";
import { API_ROUTES } from "../../rtkQuery/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ConversationScreen = ({ navigation, route }) => {
  const [pickerModalVisibile, setPickerModalVisibile] = useState(false);
  const [selectedImage, setSelectedImage] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [fileInfo, setFileInfo] = useState(null);
  const { chatRoomId, image, ChatRoomUserName } = route.params;
  const [error, setError] = useState(null);
  const { data, refetch, isSuccess, isLoading } = useGetChatRoomsQuery();
  const { data: useMeData } = useMeQuery();
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [onlineStatus, setOnlineStatus] = useState(null);
  const [apiResponse, setApiResponse] = useState();
  const [loading, setLoading] = useState(false);

  console.log("imageimage", image);

  const fetchMessages = async () => {
    setLoading(true);
    const url = `${API_ROUTES.BASE_URL}${API_ROUTES.MESSAGE_CONVERSATION}/${chatRoomId}`;
    const token = await AsyncStorage.getItem("isAuth");
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setApiResponse(data);
      setLoading(false);
      return data;
    } catch (error) {
      console.error("Error fetching homework:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatRoomId) {
      fetchMessages(chatRoomId);
    }
  }, [chatRoomId]);

  useEffect(() => {
    if (messages.length) {
      fetchMessages(chatRoomId);
      refetch();
    }
  }, [messages.length, refetch]);

  useEffect(() => {
    if (apiResponse?.data) {
      const transformedMessages = apiResponse.data.map((message) => ({
        _id: message._id,
        text: message.message,
        createdAt: new Date(message.createdAt),
        user: {
          _id: message.senderId,
          name:
            message.chatroomId?.roomCreator === message?.senderId
              ? "Creator"
              : "Receiver",
          avatar: image
            ? `${API_ROUTES.BASE_URL}/${image}`
            : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwbYMnoBKydOk2tezl6c1A1g1nQgC_8JXckA&s",
        },
        seen: message?.seen,
        image: message?.url,
      }));
      setMessages(transformedMessages.reverse());
    }
  }, [apiResponse]);

  useEffect(() => {
    if (!chatRoomId || !useMeData?.data?._id) return;

    const fetchData = async () => {
      if (isLoading) {
        console.log("Query is still loading, waiting for it to complete...");
        return;
      }

      const socket = connectSocket();
      if (socket) {
        const data1 = {
          chatroomId: chatRoomId,
          userId: useMeData?.data?._id,
        };
        socket.emit("join", data1);
        socket.on("chat", async (res) => {
          setMessages((prevMessages) => [...prevMessages, res]);
        });

        const data = {
          chatroomId: chatRoomId,
          userId: useMeData?.data?._id,
        };
        socket.emit("mark-as-read", data);
        socket.on("messages-read", (response) => {});

        return () => {
          socket.off("chat");
          socket.off("messages-read");
        };
      }
    };

    fetchData().catch((error) =>
      console.error("Error initializing socket:", error)
    );
  }, [chatRoomId, useMeData, refetch, isSuccess, isLoading]);

  const sendChat = async () => {
    try {
      const socket = getSocket();
      if (!socket) {
        console.error("Socket is not connected. Please initialize it first.");
        return;
      }
      const userId = useMeData?.data?._id;
      if (!userId) {
        console.error("User ID is not available. Check useMeData:", useMeData);
        return;
      }
      const filesArray = [];
      if (selectedImage?.length > 0) {
        for (const imagePath of selectedImage) {
          try {
            const fileName = imagePath.split("/").pop();
            const response = await fetch(imagePath);
            const blob = await response?.blob();
            const base64Data = await new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result.split(",")[1]);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });

            filesArray.push({ file: base64Data, fileName });
          } catch (error) {
            console.error("Error converting image to base64:", error);
          }
        }
      }

      const messageData = {
        chatroomId: chatRoomId,
        userId,
        message: sms,
        files: filesArray,
      };

      socket.emit("chat", messageData);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          _id: Math.random().toString(),
          createdAt: new Date(),
          text: sms,
          user: { _id: userId },
        },
      ]);

      await fetchMessages(chatRoomId);
      setSms("");
      setSelectedImage([]);
    } catch (error) {
      console.error("Error in sendChat:", error);
    }
  };

  const [sms, setSms] = useState("");

  const renderAvatar = (props) => {
    const { currentMessage } = props;
    const user = currentMessage.user;
    const profileImage = user && user.profile_image;

    return (
      <>
        {profileImage !== "" ? (
          <ImageModal
            source={{ uri: profileImage }}
            resizeMode="cover"
            modalImageResizeMode="contain"
            style={{
              width: getWidth(10),
              height: getHeight(4.5),
              borderRadius: getWidth(5),
            }}
          />
        ) : (
          <Image
            resizeMode="cover"
            style={{
              width: getWidth(10),
              height: getHeight(4.5),
              borderRadius: getWidth(5),
            }}
            source={require("../../assets/images/Pimg.jpeg")}
          />
        )}
      </>
    );
  };

  const handleImageSelection = (images) => {
    setSelectedImage(images);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={ChatRoomUserName}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        RightIcon={<View />}
        description={onlineStatus?.status}
      />
      <ImagePickerModal
        modalVisible={pickerModalVisibile}
        onClose={() => setPickerModalVisibile(false)}
        onSelectImage={handleImageSelection}
        multiple={true}
      />
      {isLoading ? (
        <View style={{}}>
          <ActivityIndicator size="large" color={"black"} />
        </View>
      ) : (
        <View style={{ flex: 1, bottom: normalizeSize(25) }}>
          <GiftedChat
            // renderAvatar={renderAvatar}
            renderAvatar={(props) => (
              <ImageModal
                source={{
                  uri: props.currentMessage?.user.avatar,
                }}
                style={{ width: 40, height: 40, borderRadius: 20 }}
              />
            )}
            renderBubble={(props) => {
              return (
                <View>
                  <Bubble
                    {...props}
                    wrapperStyle={{
                      right: {
                        backgroundColor: colors.primary,
                        borderRadius: 5,
                        marginBottom: 8,
                      },
                      left: {
                        backgroundColor: colors.secondary,
                        borderRadius: 5,
                        marginBottom: 10,
                      },
                    }}
                    textStyle={{
                      left: {
                        color: colors.white,
                        fontFamily: fonts.URe,
                        fontSize: 14,
                      },
                      right: {
                        color: colors.white,
                        fontFamily: fonts.URe,
                        fontSize: 14,
                      },
                    }}
                    renderTicks={() => {
                      if (props.position === "right") {
                        return (
                          <Text
                            style={{
                              fontSize: 10,
                              color:
                                props.currentMessage?.seen === true
                                  ? colors.blue
                                  : colors.gray1,
                              marginLeft: 10,
                              right: 6,
                            }}
                          >
                            ✓✓
                          </Text>
                        );
                      }
                      return null;
                    }}
                    renderMessageImage={(props) => {
                      const { currentMessage } = props;
                      if (
                        currentMessage?.image &&
                        Array.isArray(currentMessage.image)
                      ) {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              flexWrap: "wrap",
                            }}
                          >
                            {currentMessage?.image?.map((url, index) => (
                              <ImageModal
                                key={index}
                                style={{
                                  width: 150,
                                  height: 150,
                                  borderRadius: 5,
                                  margin: 5,
                                }}
                                resizeMode="cover"
                                modalImageResizeMode="contain"
                                source={{
                                  uri: `${API_ROUTES.BASE_URL}/${url}`,
                                }}
                              />
                            ))}
                          </View>
                        );
                      }
                      return null;
                    }}
                  />
                </View>
              );
            }}
            renderInputToolbar={() => {
              return (
                // null
                <View style={{ ...styles.inputCon, marginTop: getHeight(1.5) }}>
                  <View style={styles.textinputCon}>
                    <TextInput
                      style={{
                        ...GernalStyle.textInputMessage,
                        width: getWidth(60),
                        marginTop: 0,
                        backgroundColor: "white",
                        height: getHeight(5),
                        // paddingLeft: getWidth(3),
                      }}
                      value={sms}
                      onChangeText={(e) => setSms(e)}
                      onSubmitEditing={() => sendChat(sms)}
                      placeholder="Type a message..."
                      placeholderTextColor={colors.graytext4}
                    />
                    {selectedImage?.length > 0 && (
                      <>
                        {selectedImage.slice(0, 1).map((image, index) => (
                          <Image
                            key={index}
                            source={{ uri: image }}
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 5,
                              marginLeft: index === 0 ? -70 : 10,
                            }}
                            // resizeMode="cover"
                          />
                        ))}

                        {selectedImage.length > 1 && (
                          <TouchableOpacity
                            style={{
                              width: 35,
                              height: 30,
                              backgroundColor: "black",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 10,
                              borderRadius: 5,
                            }}
                            onPress={() => setIsModalVisible(true)}
                          >
                            <Text style={{ color: "white", fontSize: 8 }}>
                              View more
                            </Text>
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {/* {fileInfo && (
                      <View style={{ marginTop: 10, width: 20 }}>
                        <Text>{fileInfo.name}</Text>
                      </View>
                    )} */}
                    <TouchableOpacity
                      onPress={() => setPickerModalVisibile(true)}
                      style={{ marginLeft: 20 }}
                    >
                      <CameraIcon height={20} width={20} />
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={() => UploadFile()}>
                      <PdfIcon
                        height={25}
                        width={25}
                        style={{ marginLeft: getWidth(2.5) }}
                      />
                    </TouchableOpacity> */}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        sms.trim() !== "" ||
                        (selectedImage && selectedImage.length > 0)
                      ) {
                        sendChat();
                      }
                    }}
                    style={[styles.sendBtn]}
                  >
                    <SendIcon height={25} width={25} />
                  </TouchableOpacity>
                </View>
              );
            }}
            renderAvatarOnTop={true}
            keyboardShouldPersistTaps={"handled"}
            renderUsernameOnMessage
            showAvatarForEveryMessage={true}
            isKeyboardInternallyHandled
            showScrollIndicator={false}
            messages={messages}
            // onSend={() => sendChat(sms)}
            onSend={() => sendChat()}
            // onSend={(messages) =>
            //   setMessages(GiftedChat.append(messages, chatData))
            // }
            user={{
              _id: useMeData?.data?._id,
            }}
          />

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setIsModalVisible(false)}>
              <View style={styles.overlay}>
                <TouchableWithoutFeedback>
                  <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Selected Images</Text>
                    <FlatList
                      data={selectedImage}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <Image
                          source={{ uri: item }}
                          style={styles.modalImage}
                          resizeMode="cover"
                        />
                      )}
                      numColumns={3}
                    />
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setIsModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headview: {
    height: getHeight(8),

    flexDirection: "row",
    backgroundColor: "#182d4a",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    shadowColor: "#126BB7",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 0,
    marginBottom: -getHeight(3.8),
  },
  titletext: {
    fontSize: getFontSize(2.5),
    fontFamily: "Rubik-Medium",
    color: "#182d4a",
  },
  viewstyle: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: getWidth(5),
    justifyContent: "center",
    minHeight: getHeight(9),
    maxHeight: getHeight(9),
  },
  imageview2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  messagetext: {
    fontSize: getFontSize(2.2),
    width: getWidth(90),
    fontFamily: "Ubuntu-Bold",
    marginLeft: getWidth(2),
    color: "white",
  },
  selfimage: { width: 30, height: 30, marginRight: 10, borderRadius: 15 },
  imageviewstyle: {
    width: 40,
    borderRadius: 20,
    height: 40,
    position: "absolute",
    left: -50,
  },
  list: {
    paddingHorizontal: 17,
  },
  footer: {
    flexDirection: "row",
    //height: getFontSize(20),
    backgroundColor: "#4F4F4F",
    paddingHorizontal: 15,
    padding: getFontSize(1),
    //marginTop: getFontSize(-1),
  },
  btnSend: {
    backgroundColor: "#182d4a",
    width: 50,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  iconSend: {
    width: 20,
    height: 20,

    alignSelf: "center",
  },
  inputContainer: {
    borderColor: "black",
    backgroundColor: "#4F4F4F",
    borderRadius: 10,
    borderWidth: 1,
    height: getFontSize(5),
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: "#F6F6F6",
    flex: 1,
  },
  balloon: {
    maxWidth: 280,
    padding: 15,
    borderRadius: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 13,
    margin: 3,
  },
  itemIn: {
    alignSelf: "flex-start",
    marginLeft: 40,
  },
  itemOut: {
    alignSelf: "flex-end",
    backgroundColor: "#EBF3F5",
  },
  time: {
    alignSelf: "flex-end",
    margin: 15,
    fontSize: 12,
    color: "#808080",
  },
  item: {
    marginVertical: 8,
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#eeeeee",
    borderRadius: 30,
    padding: 5,
  },
  userImage: {
    width: 37,
    height: 37,
    borderRadius: 10,
  },
  seprator: {
    marginTop: getHeight(0.5),
    width: getWidth(95),
    alignSelf: "center",
  },
  timText: {
    fontSize: getFontSize(2),
    color: colors.gray3,
    fontFamily: fonts.UMe,
    alignSelf: "flex-end",
    marginBottom: getHeight(1),
    marginRight: getWidth(3),
  },
  ruleText: {
    fontSize: 10,
    color: colors.graytext5,
    fontFamily: fonts.URe,
    marginLeft: getWidth(2),
  },
  Insideconn: {
    height: getHeight(15),
    backgroundColor: colors.secondary,
    borderRadius: 5,
    width: getWidth(62),
    marginLeft: getWidth(1),
  },
  headerCon: {
    height: getHeight(10),
    flexDirection: "row",
    alignItems: "center",
  },
  today: {
    fontSize: getFontSize(2),
    color: colors.graytext5,
    alignSelf: "center",
    fontFamily: fonts.UMe,
    marginTop: getHeight(2),
  },
  sendBtn: {
    width: getWidth(15),
    backgroundColor: colors.primary,
    height: getHeight(6),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: getWidth(1),
    borderRadius: 5,
    marginBottom: getFontSize(2),
  },
  textinputCon: {
    width: getWidth(77),
    height: getHeight(6),
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: getFontSize(2),
  },
  inputCon: {
    // position: 'absolute',
    bottom: getHeight(1.5),
    // backgroundColor:'red',
    // marginBottom: getHeight(6),
    alignSelf: "center",
    width: getWidth(100),
    height: getHeight(7),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  sendMsgCon: {
    flexDirection: "row-reverse",
    alignItems: "flex-end",
    width: getWidth(96),
    alignSelf: "center",
    marginTop: getHeight(1),
  },
  rightIconCon: {
    height: getHeight(4),
    marginLeft: getWidth(1),
    width: getWidth(8),
    borderRadius: 25,
    backgroundColor: colors.secondary,
    justifyContent: "center",
    alignItems: "center",
  },

  chaTcon: {
    height: getHeight(15),
    backgroundColor: colors.black,
    borderRadius: 5,
    width: getWidth(62),
    marginLeft: getWidth(1),
  },
  insideCon: {
    justifyContent: "center",
    alignItems: "center",
    height: getHeight(12),
    paddingHorizontal: getWidth(5),
  },
  chattext: {
    fontSize: getFontSize(2),
    color: colors.white,
    fontFamily: fonts.URe,
  },
  timeText: {
    fontSize: getFontSize(2),
    color: colors.gray3,
    fontFamily: fonts.UMe,
    alignSelf: "flex-end",
    marginBottom: getHeight(1),
    marginRight: getWidth(3),
  },
  recievedCon: {
    flexDirection: "row",
    alignItems: "flex-end",
    width: getWidth(96),
    alignSelf: "center",
    marginTop: getHeight(1),
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 13,
    margin: 3,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "white",
    width: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 400,
    paddingHorizontal: 20,
    paddingTop: normalizeSize(20),
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colors.black,
  },
  modalImage: {
    width: "30%",
    height: 70,
    marginBottom: 20,
    marginLeft: 10,
    borderRadius: 8,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    bottom: 20,
  },
  closeButtonText: {
    color: "white",
    textAlign: "center",
  },
});

export default ConversationScreen;
