import React from "react";
import { Text, View, Image, ScrollView, TextInput } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getFontSize, getHeight, getWidth } from "../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import { colors } from "../../constants/colors";
import { GernalStyle } from "../../constants/GernalStyle";

import { Switch } from "react-native-paper";
import Button from "../../Components/Button";

const Profile = ({ navigation, route }) => {
  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <View style={styles.headerview}>
        <AntDesign
          size={30}
          color={"white"}
          onPress={() => navigation.goBack()}
          name="arrowleft"
        />

        <Text style={styles.headerTitle}>Profile</Text>

        <View />
      </View>
      <View
        style={{
          backgroundColor: colors.buttonColor,
          width: getWidth(100),
          height: getHeight(15),
          borderBottomLeftRadius: 25,
          borderBottomRightRadius: 25,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            alignSelf: "center",
            // marginTop:getHeight(4)
          }}
          resizeMode="cover"
          modalImageResizeMode="contain"
          source={require("../../assets/images/Pimg.jpeg")}
        />
        <Text
          style={{
            color: "white",
            fontFamily: "Poppins-Bold",
            fontSize: 20,
            fontWeight: "600",
            alignSelf: "center",
            marginTop: getHeight(1),
          }}
        >
          Amine Jebli
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            width: getWidth(90),
            alignSelf: "center",
            marginBottom: getHeight(2),
          }}
        >
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Personal information
            </Text>
            <TextInput
              placeholder="First Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Last Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Email"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Phone No"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              School information
            </Text>
            <TextInput
              placeholder="School Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Subject"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Main room"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
            <TextInput
              placeholder="Other rooms"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
            />
          </View>

          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 16,
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Notification
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Check-In & Check-Out
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Messages
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Notes
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Photos & Videos
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Activities
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Incidents
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Meds
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginVertical: getHeight(0.5),
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Kudos
              </Text>
              <Switch
                value={true}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
              />
            </View>
          </View>
        </View>
        <Button
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            marginTop: getHeight(3),
            marginBottom: 20,
          }}
          btnTextStyle={GernalStyle.btnText}
          text={"Save"}
        />
      </ScrollView>
    </View>
  );
};
export default Profile;
