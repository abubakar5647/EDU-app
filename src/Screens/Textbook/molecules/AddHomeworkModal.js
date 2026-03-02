import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { book, gradeIcon } from "../../../assets/images";
import { Fonts } from "../../../assets/fonts";
import { getFontSize, getWidth } from "../../../../utils/ResponsiveFun";
import { GernalStyle } from "../../../constants/GernalStyle";
import Button from "../../../Components/Button";
import { colors } from "../../../constants/colors";
import CustomDropDown from "../../../Components/Dropdown";
import StartEndTimer from "../../../Components/StartEndTimer";
import CustomInput from "../../../Components/CustomInput";
import DatePicker from "react-native-date-picker";
import { TextInput } from "react-native-paper";
import {
  useCreateHomeWorkMutation,
  useGetAllHomeWorkQuery,
  useGetAllSubjectQuery,
  useHomeWorkUpdateMutation,
} from "../../../rtkQuery/slices/home";
import GenericDropdown from "../../../Components/AutoDropdown";
import { normalizeSize } from "../../../../utils";
import { showToast } from "../../../Components/Toaster";
import moment from "moment";
import { useSelector } from "react-redux";
import { setHomeworkItem } from "../../../rtkQuery/slices/user/user.slice";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppDispatch } from "../../../rtkQuery/store";
const AddHomeWorkModal = ({
  modalVisibility,
  onDismiss,
  iconPress,
  meRoomId,
  meSchoolId,
  date,
  setDate,
  refetch,
  fetchData,
}) => {
  const [subject, setSubject] = useState([]);
  const [des, setDes] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const formattedDate = moment(date).format("YYYY/MM/DD");
  const [createHomeWork, { isError, isLoading }] = useCreateHomeWorkMutation();
  const [editHomeWork] = useHomeWorkUpdateMutation();
  const { data: allSubject } = useGetAllSubjectQuery();
  // console.log("objectSubject=========", allSubject?.data);
  // const titles = allSubject?.data.map((item) => item.title) || [];

  const editingHomeworkItem = useSelector((state) => state.user.HomeworkItem);
  const dispatch = useAppDispatch();
  const handleCreateHomeWork = async () => {
    if (!des.trim()) {
      setError("Description is required.");
      return;
    }
    setDes("");
    setError("");
    onDismiss();
    try {
      const payload = {
        date: moment(date).format("YYYY-MM-DD"),
        startTime: moment(startTime, "HH:mm").format("HH:mm"),
        endTime: moment(endTime, "HH:mm").format("HH:mm"),
        subject: subject?.id,
        description: des,
        roomId: editingHomeworkItem ? editingHomeworkItem?.room?._id : meRoomId,
        schoolId: meSchoolId,
      };
      if (editingHomeworkItem) {
        const res = await editHomeWork({
          homeWorkId: editingHomeworkItem?._id,
          ...payload,
        });
        console.log("resresresresresresresres", res);
        showToast(
          res?.error?.status === 400 || res?.error?.status === 500
            ? "error"
            : "success",
          res?.error?.status === 400
            ? res?.error?.data?.message
            : res?.data?.message
        );
        fetchData();
        editRefetch();
      } else {
        const res = await createHomeWork(payload);
        showToast(
          res?.error?.status === 400 || res?.error?.status === 500
            ? "error"
            : "success",
          res?.error?.status === 400
            ? res?.error?.data?.message
            : res?.data?.message
        );
        fetchData();
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  const handleConfirm = (selectedDate) => {
    setOpen(false);
    setDate(selectedDate);
    console.log("Selected Date:", selectedDate.toISOString());
  };
  return (
    <Modal
      visible={modalVisibility}
      transparent
      onRequestClose={onDismiss}
      animationType="slide"
    >
      <View style={styles?.centeredModelView}>
        <View style={styles.modelDesign}>
          <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
            <AntDesign
              onPress={() => {
                onDismiss();
                dispatch(setHomeworkItem(null));
              }}
              name="closecircleo"
              size={22}
              color={"#969696"}
              style={{ alignSelf: "flex-end" }}
            />
            <View style={styles.bookContainer}>
              <Image source={book} style={styles.bookIcon} />
            </View>
            <View style={{ paddingHorizontal: 10 }}>
              <Text style={styles.mediumText}>Subject </Text>
              <GenericDropdown
                data={allSubject?.data?.map((item) => ({
                  title: item?.title,
                  id: item?._id,
                }))}
                defaultValue={
                  editingHomeworkItem?.subject?.title || "Select Subject"
                }
                onSelect={(selectedItem) => {
                  setSubject(selectedItem);
                }}
                // defaultButtonText="Subject"
                buttonWidth={"100%"}
                buttonStyle={{
                  borderColor: colors.black,
                  backgroundColor: colors.white,
                  borderRadius: 6,
                  width: "100%",
                  marginBottom: normalizeSize(15),
                }}
                TextColor={colors.black}
                buttonTextStyle={{
                  color: colors.black,
                  fontFamily: Fonts.PoppinsBold,
                }}
                dropdownStyle={{
                  borderRadius: 10,
                  marginTop: normalizeSize(-30),
                }}
                rowStyle={{ borderBottomColor: "gray" }}
                rowTextStyle={{
                  fontSize: normalizeSize(16),
                  color: colors.black,
                }}
                renderCustomizedRowChild={(item) => (
                  <View>
                    <Text
                      style={{
                        color: "black",
                        fontSize: getFontSize(2),
                        textAlign: "left",
                        paddingLeft: getFontSize(1),
                      }}
                    >
                      {item.title}
                    </Text>
                  </View>
                )}
                renderCustomizedButtonChild={(selectedItem) => {
                  console.log("selectedItemSelectedItem", selectedItem);
                  return (
                    <View>
                      <Text
                        style={{
                          color: "black",
                          fontSize: 14,
                          fontFamily: Fonts.PoppinsMedium,
                        }}
                      >
                        {selectedItem?.title ||
                          editingHomeworkItem?.subject?.title ||
                          "Subject"}
                      </Text>
                    </View>
                  );
                }}
              />

              <View style={{ marginTop: 1 }}>
                <Text style={styles.txt2}>Date</Text>
                <DatePicker
                  modal
                  open={open}
                  mode="date"
                  date={date || new Date()}
                  onConfirm={handleConfirm}
                  onCancel={() => setOpen(false)}
                />
                <TextInput
                  mode="outlined"
                  editable={false}
                  value={new Date(date).toLocaleDateString()}
                  theme={{ roundness: getFontSize(0.5) }}
                  outlineColor="rgba(189, 189, 189, 1)"
                  cursorColor="rgba(189, 189, 189, 1)"
                  textColor={colors.black}
                  activeUnderlineColor="rgba(189, 189, 189, 1)"
                  activeOutlineColor="rgba(189, 189, 189, 1)"
                  style={{
                    ...GernalStyle.input,
                    width: "100%",
                    height: 40,
                    marginBottom: normalizeSize(15),
                  }}
                  onPressIn={() => setOpen(true)}
                  right={
                    <TextInput.Icon
                      icon={() => (
                        <AntDesign
                          name={"calendar"}
                          onPress={() => setOpen(true)}
                          size={getFontSize(2.5)}
                          color={"#929292"}
                        />
                      )}
                    />
                  }
                />
              </View>

              <StartEndTimer
                startTime={startTime}
                setStartTime={setStartTime}
                endTime={endTime}
                setEndTime={setEndTime}
              />
              <CustomInput
                placeholder={" Describe homework"}
                withLabel={"HomeWork"}
                height={100}
                textAlignVertical={"top"}
                value={des || editingHomeworkItem?.description || ""}
                onChangeText={(text) => {
                  setDes(text);
                  if (error) setError("");
                }}
                errorMessage={!editingHomeworkItem ? error : ""}
              />

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 10,
                  justifyContent: "space-between",
                }}
              >
                <Button
                  btnStyle={{
                    ...GernalStyle.btn,
                    width: getWidth(38),
                    backgroundColor: "#EFEFEF",
                  }}
                  btnTextStyle={{
                    ...GernalStyle.btnText,
                    color: "#A6A6A6",
                  }}
                  text={"Cancel"}
                  onPress={() => {
                    onDismiss();
                    dispatch(setHomeworkItem(null));
                  }}
                />
                <Button
                  btnStyle={{
                    ...GernalStyle.btn,
                    width: getWidth(38),
                    backgroundColor: colors?.primary,
                  }}
                  btnTextStyle={{
                    ...GernalStyle.btnText,
                    color: "white",
                  }}
                  onPress={handleCreateHomeWork}
                  Loading={isLoading}
                  text={editingHomeworkItem ? "Update" : "Add"}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </Modal>
  );
};
export default AddHomeWorkModal;
const styles = StyleSheet.create({
  centeredModelView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modelDesign: {
    // height: 410,
    backgroundColor: "white",
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
  },
  Image: {
    marginRight: 6,
    resizeMode: "contain",
    marginLeft: 15,
    alignSelf: "center",
  },
  bookContainer: {
    height: 56,
    width: 56,
    backgroundColor: "#EDFEFF",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  bookIcon: {
    height: 22,
    width: 16,
  },
  mediumText: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: colors.blackTextColor,
    marginBottom: normalizeSize(10),
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: colors.borderColor,
    borderRadius: 5,
    height: 38,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  txt2: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 3,
    color: colors.black,
  },
});
