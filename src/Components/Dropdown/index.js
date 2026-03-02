import React, { useState, useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  LayoutAnimation,
  StyleSheet,
  ScrollView,
  UIManager,
  FlatList,
  TextInput,
} from "react-native";
import Icons from "../Icons";
import CustomText from "../CustomText";
import { colors } from "../../constants/colors";
import { Fonts } from "../../assets/fonts";

UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true);
const CustomDropDown = ({
  data,
  value,
  setValue,
  label,
  errorMessage,
  disabled,
  emptyLabel,
  loading,
  emptyLabelPress,
  open,
  setOpen,
  showFlag,
  headerLabel,
  maxHeight,
  width,
  alignSelf,
}) => {
  const inputRef = useRef();
  const [isOpen, setIsOpen] = useState(open);
  const [select, setSelect] = useState(value);

  useEffect(() => {
    setTimeout(() => {
      setSelect(value);
    }, 200);
  }, [value]);

  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(!isOpen);
    setOpen?.(!open);
    if (!isOpen) {
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 300);
    }
  };
  const selectOption = (option) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setValue(option);
    setSelect(option);
    setIsOpen(false);
    setOpen?.(false);
  };
  return (
    <View style={{ marginBottom: 10 }}>
      <CustomText
        label={headerLabel}
        color={colors.blackTextColor}
        fontSize={14}
        fontFamily={Fonts.PoppinsMedium}
        marginBottom={7}
      />

      <View
        style={[
          styles.dropdownMainContainer,
          {
            alignSelf: alignSelf,
            maxHeight: maxHeight || 150,
            borderColor: errorMessage ? "red" : colors.gray7,
            width: width || "100%",
          },
        ]}
      >
        <TouchableOpacity
          disabled={disabled}
          activeOpacity={0.6}
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            height: 38,
            borderColor: colors.placeholderTextColor,
          }}
          onPress={toggleDropdown}
        >
          <CustomText
            label={loading ? "Loading..." : select?.label || label}
            fontSize={14}
            color={colors.placeholderTextColor}
          />

          <Icons
            family="Entypo"
            name={isOpen ? "chevron-thin-up" : "chevron-thin-down"}
            color={colors?.lightGrey20}
          />
        </TouchableOpacity>
        {isOpen && data?.length > 0 && (
          <>
            <ScrollView
              contentContainerStyle={{ width: "100%" }}
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              <FlatList
                data={data}
                nestedScrollEnabled
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <TouchableOpacity
                    onPress={() => selectOption(item)}
                    style={{
                      // backgroundColor: 'red',

                      borderBottomWidth: data.length - 1 === index ? 0 : 1,
                      paddingBottom: data.length - 1 === index ? 0 : 7,
                      borderBottomColor: colors.lightGrey10,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: data.length - 1 === index ? 10 : 8,
                      marginTop: index === 0 ? 10 : 0,
                    }}
                  >
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <CustomText
                        label={item.label}
                        textTransform="capitalize"
                        fontFamily={Fonts.PoppinsMedium}
                        fontSize={14}
                        marginLeft={showFlag ? 7 : 0}
                        color={colors.placeholderTextColor}
                      />
                    </View>
                  </TouchableOpacity>
                )}
                style={{
                  borderTopColor: colors.lightGrey10,
                  borderTopWidth: 1,
                }}
                showsVerticalScrollIndicator={false}
              />
            </ScrollView>
          </>
        )}
        {isOpen && data?.length === 0 && (
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => {
              setIsOpen(false);
              setOpen?.(false);
              emptyLabelPress?.();
            }}
            style={styles.emptyContainer}
          >
            <CustomText
              label={emptyLabel || "No Data"}
              color={colors.black}
              fontSize={14}
              fontFamily={Fonts.InterBold}
            />
          </TouchableOpacity>
        )}
      </View>
      {errorMessage && (
        <CustomText
          label={errorMessage}
          color={"red"}
          marginLeft={width === "90%" ? 20 : 0}
        />
      )}
    </View>
  );
};
export default CustomDropDown;
const styles = StyleSheet.create({
  dropdownMainContainer: {
    borderRadius: 7,
    paddingHorizontal: 15,
    backgroundColor: colors.white,

    borderWidth: 0.5,
    justifyContent: "center",
  },
  emptyContainer: {
    width: "100%",
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: colors.lightGrey10,
    borderTopWidth: 1,
  },
});
