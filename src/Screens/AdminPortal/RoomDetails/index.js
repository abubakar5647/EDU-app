import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { colors } from "../../../constants/colors";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import Header from "../../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getHeight, getWidth } from "../../../../utils/ResponsiveFun";
import Button from "../../../Components/Button";
import { GernalStyle } from "../../../constants/GernalStyle";
import DeleteModel from "./molecules/DeleteModel";
import { Fonts } from "../../../assets/fonts";
import { Switch } from "react-native-paper";
import CustomText from "../../../Components/CustomText";
import Icons from "../../../Components/Icons";

const RoomDetails = ({ navigation, route }) => {
  const [deleteModel, setDeleteModel] = useState(false);
  const [isManageSetting, setIsManageSetting] = useState(false);
  const { name } = route?.params || {};
  return (
    <View style={styles.parent}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        RightIcon={<View />}
        title={isManageSetting ? "Settings" : name}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => {
              if (isManageSetting) {
                setIsManageSetting(false);
              } else {
                navigation.goBack();
              }
            }}
            name="arrowleft"
          />
        }
      />
      {isManageSetting ? (
        <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts?.PoppinsBold,
              marginBottom: 5,
            }}
          >
            Sort
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Text style={{ fontSize: 14, fontFamily: Fonts?.PoppinsRegular }}>
              Sort by Last Name
            </Text>
            <Switch
              value={true}
              color={"#50C2C9"}
              style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
            />
          </View>
          <TextInput
            style={[
              GernalStyle.newInputStyle,
              {
                borderWidth: 1,
                borderColor: colors.placeholderTextColor,
                borderRadius: 5,
                height: 38,
                paddingTop: 2,

                marginBottom: getHeight(2),
              },
            ]}
            placeholder="Search Student"
            returnKeyType={"next"}
            keyboardType="default"
            blurOnSubmit={false}
            // value={text}
            // onChangeText={(text) => {
            //   setText(text);
            //   filterData(text);
            // }}
          />

          <Text
            style={{
              fontSize: 16,
              fontFamily: Fonts?.PoppinsBold,
              marginBottom: 5,
            }}
          >
            All Students
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Ala Jaib
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Azhar
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Zohaib
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Zain Amin
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Ala Adam
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Jaib ali
            </Text>
            <View
              style={{
                width: 67,
                height: 26,
                backgroundColor: "#FFF5D1",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#FFC700",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                In Room
              </Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Anas Dahman
            </Text>
            <View
              style={{
                width: 90,
                height: 26,
                backgroundColor: "#fed8ff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#F922FF",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                Add to room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Dahman ali
            </Text>
            <View
              style={{
                width: 90,
                height: 26,
                backgroundColor: "#fed8ff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#F922FF",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                Add to room
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              borderBottomWidth: 1,
              borderBottomColor: "#EAEAEA",
              paddingVertical: 10,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#47424F",
                fontFamily: Fonts?.PoppinsMedium,
              }}
            >
              Majed mohdi
            </Text>
            <View
              style={{
                width: 90,
                height: 26,
                backgroundColor: "#fed8ff",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  color: "#F922FF",
                  fontFamily: Fonts?.PoppinsMedium,
                }}
              >
                Add to room
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={{ paddingHorizontal: 15, paddingTop: 15 }}>
            <CustomText
              label={name}
              fontSize={16}
              fontFamily={Fonts.PoppinsBold}
            />
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              activeOpacity={0.5}
              onPress={() => setIsManageSetting(true)}
            >
              <CustomText label={"Manage settings"} f />
              <Icons
                family={"Entypo"}
                name={"chevron-small-right"}
                size={25}
                color={colors.placeholderTextColor}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              height: getHeight(80),
              justifyContent: "flex-end",
              paddingHorizontal: 15,
            }}
          >
            <Button
              onPress={() => setDeleteModel(true)}
              btnStyle={{
                ...GernalStyle.btn,
                backgroundColor: "#ED310E",
                width: "100%",
                height: getHeight(6),
                marginTop: getHeight(3),
              }}
              btnTextStyle={{ ...GernalStyle.btnText, fontSize: 18 }}
              text={"Delete Room"}
            />
          </View>
          <DeleteModel
            modalVisibility={deleteModel}
            iconPress={() => setDeleteModel(false)}
          />
        </>
      )}
    </View>
  );
};

export default RoomDetails;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: colors?.white,
  },
});
