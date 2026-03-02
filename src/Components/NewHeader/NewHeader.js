import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";
import DropdownMenu from "../DropdownMenu";
import { useNavigation } from "@react-navigation/native";
import Icons from "../Icons";
import { normalizeSize } from "../../../utils";
import CustomDropDown from "../Dropdown";
import CustomModal from "../CustomModal";
const NewHeader = ({
  title,
  onPress,
  isRightIcon,
  isFilterBtn,
  setIsFilterBtn,
  group,
  onDeletePress,
  onEditPress,
  classroomData,
  roomLoading,
}) => {
  const navigation = useNavigation();
  console.log("isRightIcon", group);
  const [modalShow, setModalShow] = useState(false);

  return (
    <>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={onPress}
          activeOpacity={0.5}
        >
          <Icons
            name={"keyboard-arrow-left"}
            family={"MaterialIcons"}
            size={27}
            color={colors.HeaderTextColor}
          />
        </TouchableOpacity>

        <Text style={styles.heading}>{title}</Text>
        {isRightIcon ? (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => setIsFilterBtn(!isFilterBtn)}
          >
            <Icons
              name={"dots-three-vertical"}
              family={"Entypo"}
              size={20}
              color={colors.HeaderTextColor}
            />
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
      <DropdownMenu isVisible={isFilterBtn}>
        <View
          style={{
            backgroundColor: colors.PrimaryLight,
            height: "100%",
            justifyContent: "center",
          }}
        >
          <View style={styles.Dropdown}>
            <Icons
              family={"FontAwesome"}
              name={"pencil"}
              size={18}
              color={colors.primary}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.PoppinsMedium,
                // paddingTop: normalizeSize(10),
                color: colors.blackTextColor,
                borderBottomWidth: 0.5,
                paddingHorizontal: 10,
                borderColor: colors.primary,
              }}
              onPress={() => {
                setIsFilterBtn(false);
                if (onEditPress) {
                  onEditPress();
                }
                group
                  ? navigation.navigate("AddGroup", {
                      isEdit: true,
                      title: "Edit a group",
                    })
                  : navigation.navigate("AddRoom", {
                      isEdit: true,
                      title: "Edit a classroom",
                      classroomData: classroomData,
                    });
              }}
            >
              Edit
            </Text>
          </View>
          <View style={[styles.Dropdown, { marginTop: normalizeSize(7) }]}>
            <Icons
              family={"AntDesign"}
              name={"delete"}
              size={18}
              color={colors.primary}
            />
            <Text
              style={{
                fontSize: 14,
                fontFamily: Fonts.PoppinsMedium,
                color: colors.blackTextColor,
                paddingHorizontal: 10,
              }}
              onPress={() => setModalShow(true)}
            >
              Delete
            </Text>
          </View>
        </View>
        <CustomModal
          modalShow={modalShow}
          setModalShow={setModalShow}
          heading={"Are you sure you want to delete the classroom?"}
          title={"Delete ClassRoom"}
          loading={roomLoading}
          onPress={() => {
            setIsFilterBtn(false);
            if (onDeletePress) {
              onDeletePress();
            }
          }}
        />
      </DropdownMenu>
    </>
  );
};
export default NewHeader;

const styles = StyleSheet.create({
  headerContainer: {
    height: 68,
    flexDirection: "row",
    backgroundColor: colors.PrimaryLight,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 15,
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingBottom: 10,
  },
  heading: {
    marginTop: normalizeSize(20),
    fontSize: 20,
    color: colors.HeaderTextColor,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  icon: {
    height: 24,
    width: 24,
    marginBottom: 6,
  },
  menuButton: {
    padding: 8,
  },
  menuButtonText: {
    fontSize: 34,
    color: colors.black2,
  },
  Dropdown: {
    flexDirection: "row",
    paddingHorizontal: normalizeSize(8),
    alignItems: "center",
  },
});
