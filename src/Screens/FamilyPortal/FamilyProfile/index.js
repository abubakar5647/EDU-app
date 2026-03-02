import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { styles } from "./styles";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { colors } from "../../../constants/colors";
import { GernalStyle } from "../../../constants/GernalStyle";

import { Switch } from "react-native-paper";
import Button from "../../../Components/Button";
import Header from "../../../Components/Header";
import { Fonts } from "../../../assets/fonts";
import { useSelector } from "react-redux";
import {
  useGetAllGroupsQuery,
  useGetAllRoomsQuery,
  useGetAllSubjectQuery,
  useMeQuery,
  useUploadInfoMutation,
} from "../../../rtkQuery/slices/home";
import { showToast } from "../../../Components/Toaster";

const FamilyProfile = ({ navigation, route }) => {
  const role = useSelector((state) => state.gernal.follow);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [school, setSchool] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [classRoom, setClassRoom] = useState([]);
  const [groups, setGroups] = useState([]);
  const [contactNo1, setContact1] = useState("");
  const [contactNo2, setContact2] = useState("");
  const [childNames, setChildNames] = useState([]);

  const { data, refetch } = useMeQuery();
  useEffect(() => {
    const names =
      data?.data?.userId?.children?.map((child) =>
        `${child?.firstName || ""} ${child?.lastName || ""}`.trim()
      ) || [];
    setChildNames(names);
  }, [data]);
  const [checkIn, setCheckIn] = useState(
    data?.data?.notificationPreferences?.checkInOut || false
  );
  const [message, setMessage] = useState(
    data?.data?.notificationPreferences?.messages || false
  );
  const [notes, setNotes] = useState(
    data?.data?.notificationPreferences?.note || false
  );
  const [photo, setPhoto] = useState(
    data?.data?.notificationPreferences?.image || false
  );
  const [Video, setVideo] = useState(
    data?.data?.notificationPreferences?.video || false
  );
  const [incidents, setIncidents] = useState(
    data?.data?.notificationPreferences?.incident || false
  );
  const [meds, setMeds] = useState(
    data?.data?.notificationPreferences?.meds || false
  );
  const [kudos, setKudos] = useState(
    data?.data?.notificationPreferences?.kudos || false
  );
  const [food, setFood] = useState(
    data?.data?.notificationPreferences?.food || false
  );
  const [nap, setNap] = useState(
    data?.data?.notificationPreferences?.nap || false
  );
  const [potty, setPotty] = useState(
    data?.data?.notificationPreferences?.potty || false
  );
  const [uploadInfo, { isLoading }] = useUploadInfoMutation();
  const { data: RoomData } = useGetAllRoomsQuery();
  const { data: GroupData } = useGetAllGroupsQuery();
  const { data: subjectData } = useGetAllSubjectQuery();

  useEffect(() => {
    if (data) {
      const {
        firstName,
        lastName,
        email,
        address,
        phoneNo,
        contact1,
        contact2,
      } = data.data;
      setFirstName(firstName);
      setLastName(lastName);
      setEmail(email);
      setAddress(address);
      setPhoneNo(phoneNo);
      setContact1(contact1);
      setContact2(contact2);
      setSchool(school);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      const { groups, rooms, subjects, schoolId } = data?.data?.userId || {};
      const schoolName = schoolId?.schoolName || data?.data?.userId?.schoolName;
      setSchool(schoolName);
      const Groups =
        groups?.map((item) => item.name) ||
        GroupData?.data?.map((item) => item.name) ||
        [];
      setGroups(Groups);
      const Rooms =
        rooms?.map((item) => item.name) ||
        RoomData?.data?.map((item) => item.name) ||
        [];
      setClassRoom(Rooms);
      const Subjects =
        subjects?.map((item) => item.title) ||
        subjectData?.data?.map((item) => item.title) ||
        [];
      setSubjects(Subjects);
    }
  }, [data, RoomData, GroupData, subjectData]);

  const HandleUploadProfile = async () => {
    const payload = {
      firstName: firstName,
      lastName: lastName,
      phoneNo: phoneNo,
      address: address,
      contact1: contactNo1,
      contact2: contactNo2,
      schoolName: school,
      notificationPreferences: {
        checkInOut: checkIn,
        messages: message,
        kudos: kudos,
        video: Video,
        image: photo,
        food: food,
        nap: nap,
        potty: potty,
        note: notes,
        incident: incidents,
        meds: meds,
      },
    };
    // console.log("payloadkkkkkkkkkk", payload);
    try {
      const res = await uploadInfo(payload);

      const preferences = res?.data?.data?.notificationPreferences;
      if (res?.data) {
        showToast("success", res?.data?.message);
      }
      console.log("res>>>>>>>>>>", res?.data?.message);
      // if (preferences) {
      //   setCheckIn(preferences.checkInOut);
      //   setMessage(preferences.messages);
      //   setNotes(preferences.note);
      //   setPhoto(preferences.image);
      //   setVideo(preferences.video);
      //   setIncidents(preferences.incident);
      //   setMeds(preferences.meds);
      //   setKudos(preferences.kudos);
      //   setFood(preferences.food);
      //   setNap(preferences.nap);
      //   setPotty(preferences.potty);
      // }
      refetch();
    } catch (error) {
      console.log("upload profile error", error);
    }
  };

  const HandleCheckInOutToggle = () => {
    setCheckIn((previousState) => {
      const newState = !previousState;
      console.log("New CheckIn State:", newState);
      return newState;
    });
  };

  const HandleMessageToggle = () => {
    setMessage((previousState) => !previousState);
  };

  const HandleNotesToggle = () => {
    setNotes((previousState) => !previousState);
  };

  const HandlePhotoToggle = () => {
    setPhoto((previousState) => !previousState);
  };

  const HandleVideoToggle = () => {
    setVideo((previousState) => !previousState);
  };

  const HandleIncidentsToggle = () => {
    setIncidents((previousState) => !previousState);
  };
  const HandleMedsToggle = () => {
    setMeds((previousState) => !previousState);
  };
  const HandleKudosToggle = () => {
    setKudos((previousState) => !previousState);
  };

  const HandleFoodToggle = () => {
    setFood((previousState) => !previousState);
  };

  const HandleNapToggle = () => {
    setNap((previousState) => !previousState);
  };
  const HandlePottyToggle = () => {
    setPotty((previousState) => !previousState);
  };

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />

      <Header
        RightIcon={<View />}
        title={"Profile"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
      />
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
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Personal informations
            </Text>

            <TextInput
              placeholder="First Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              placeholder="Last Name"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              placeholder="Email"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={email}
              onChangeText={setEmail}
              editable={false}
            />
            <TextInput
              placeholder="Phone Number"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={phoneNo}
              onChangeText={setPhoneNo}
            />
            <TextInput
              placeholder="address"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              Contact
            </Text>
            <TextInput
              placeholder="Contact 1"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={contactNo1}
              onChangeText={setContact1}
            />
            <TextInput
              placeholder="Contact 2"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={contactNo2}
              onChangeText={setContact2}
            />
          </View>
          {role === "Family" && (
            <View>
              <Text
                style={{
                  fontFamily: "Poppins-Bold",
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#47424F",
                  marginTop: getHeight(2),
                  marginBottom: getHeight(0.5),
                }}
              >
                Children
              </Text>
              <View>
                {childNames.length > 0 ? (
                  childNames.map((name, index) => (
                    <Text
                      key={index}
                      style={{
                        fontFamily: Fonts.PoppinsRegular,
                        fontSize: 14,
                        color: "#47424F",
                        marginTop: getHeight(2),
                        marginBottom: getHeight(0.5),
                        borderBottomWidth: 0.5,
                        borderColor: "#EAEAEA",
                      }}
                    >
                      {name}
                    </Text>
                  ))
                ) : (
                  <Text>No names available</Text>
                )}
              </View>
            </View>
          )}

          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
                color: "#47424F",
                marginTop: getHeight(2),
                marginBottom: getHeight(0.5),
              }}
            >
              School
            </Text>
            <TextInput
              placeholder="School"
              theme={{ roundness: getFontSize(1) }}
              style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
              returnKeyType={"next"}
              keyboardType="default"
              blurOnSubmit={false}
              value={school}
              onChangeText={setSchool}
            />
            {role === "teacher" && (
              <View>
                <TextInput
                  placeholder="Subjects"
                  theme={{ roundness: getFontSize(1) }}
                  style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
                  returnKeyType={"next"}
                  keyboardType="default"
                  blurOnSubmit={false}
                  value={subjects.join(", ") || ""}
                  onChangeText={setSubjects}
                  editable={false}
                />
                <TextInput
                  placeholder="Classrooms"
                  theme={{ roundness: getFontSize(1) }}
                  style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
                  returnKeyType={"next"}
                  keyboardType="default"
                  blurOnSubmit={false}
                  value={classRoom.join(", ")}
                  onChangeText={setClassRoom}
                  editable={false}
                />
                <TextInput
                  placeholder="Groups"
                  theme={{ roundness: getFontSize(1) }}
                  style={[GernalStyle.newInputStyle, { paddingLeft: -4 }]}
                  returnKeyType={"next"}
                  keyboardType="default"
                  blurOnSubmit={false}
                  value={groups.join(", ")}
                  onChangeText={setGroups}
                  editable={false}
                />
              </View>
            )}
          </View>
          <View>
            <Text
              style={{
                fontFamily: "Poppins-Bold",
                fontSize: 18,
                fontWeight: "700",
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Check-In & Check-Out
              </Text>
              <Switch
                value={checkIn}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleCheckInOutToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Messages
              </Text>
              <Switch
                value={message}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleMessageToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Notes
              </Text>
              <Switch
                value={notes}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleNotesToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Photos
              </Text>
              <Switch
                value={photo}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandlePhotoToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Videos
              </Text>
              <Switch
                value={Video}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleVideoToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Incidents
              </Text>
              <Switch
                value={incidents}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleIncidentsToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Meds
              </Text>
              <Switch
                value={meds}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleMedsToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Kudos
              </Text>
              <Switch
                value={kudos}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleKudosToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Food
              </Text>
              <Switch
                value={food}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleFoodToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Nap
              </Text>
              <Switch
                value={nap}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandleNapToggle}
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
                  fontFamily: Fonts.PoppinsRegular,
                  fontSize: 14,
                  color: "#47424F",
                }}
              >
                Potty
              </Text>
              <Switch
                value={potty}
                color={"#50C2C9"}
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }] }}
                onValueChange={HandlePottyToggle}
              />
            </View>
          </View>
        </View>
        <Button
          btnStyle={{
            ...GernalStyle.btn,
            backgroundColor: colors.primary,
            marginTop: getHeight(3),
          }}
          btnTextStyle={GernalStyle.btnText}
          text={
            isLoading ? (
              <ActivityIndicator size={"small"} color={colors.white} />
            ) : (
              "Save"
            )
          }
          onPress={HandleUploadProfile}
        />

        <View style={{ height: getHeight(10) }} />
      </ScrollView>
    </View>
  );
};
export default FamilyProfile;
