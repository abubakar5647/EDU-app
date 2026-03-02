import { View, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import { colors } from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import CustomText from "../CustomText";
import DatePicker from "react-native-date-picker";
import moment from "moment";

const StartEndTimer = ({ startTime, setStartTime, endTime, setEndTime }) => {
  // const [startTime, setStartTime] = useState(startTimeProp || new Date());
  // const [endTimer, setEndTimer] = useState(endTimeProp || new Date());
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);

  return (
    <>
      <View style={styles.mainContainer}>
        <View>
          <CustomText
            label={"Start"}
            color={colors.blackTextColor}
            fontSize={14}
          />
          <View style={styles.startContainer}>
            <CustomText label={moment(startTime).format("hh:mm A")} />
            <AntDesign
              name="clockcircleo"
              size={20}
              color={colors.placeholderTextColor}
              onPress={() => setOpen(true)}
            />
          </View>
        </View>
        <View>
          <CustomText
            label={"End"}
            color={colors.blackTextColor}
            fontSize={14}
          />
          <View style={styles.startContainer}>
            <CustomText label={moment(endTime).format("hh:mm A")} />
            <AntDesign
              name="clockcircleo"
              size={20}
              color={colors.placeholderTextColor}
              onPress={() => setOpen2(true)}
            />
          </View>
        </View>
      </View>
      {open && (
        <DatePicker
          modal
          open={open}
          mode="time"
          date={startTime}
          onConfirm={(date) => {
            setOpen(false);
            setStartTime(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      )}
      {open2 && (
        <DatePicker
          modal
          open={open2}
          mode="time"
          date={endTime}
          onConfirm={(date) => {
            setOpen2(false);
            setEndTime(date);
          }}
          onCancel={() => {
            setOpen2(false);
          }}
        />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  startContainer: {
    borderWidth: 1,
    height: 38,
    width: 140,
    borderRadius: 5,
    borderColor: colors.borderColor,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
export default StartEndTimer;
