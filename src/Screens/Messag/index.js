import React, { useState } from "react";
import { View, Text } from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TabView, TabBar } from "react-native-tab-view";
import { useSelector } from "react-redux";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";
import Message from "../Message";
import { colors } from "../../constants/colors";
import { styles } from "./styles";
import { getFontSize, getWidth } from "../../../utils/ResponsiveFun";
import HomeSc from "../HomeSc";
import StaffMessage from "../StaffMessage";
import TeacherMessage from "../TeacherMessage";
import AdminMessage from "../AdminScreen";

const Messag = ({ navigation }) => {
  const [index, setIndex] = useState(0);
  const role = useSelector((state) => state.gernal.follow);

  const routes =
    role === "Family"
      ? [
          { key: "Admin", title: "Admin" },
          { key: "Staff", title: "Staff" },
          { key: "Teacher", title: "Teacher" },
        ]
      : role === "Teacher"
      ? [
          { key: "Parents", title: "Parents" },
          { key: "Staff", title: "Staff" },
          { key: "Admin", title: "Admin" },
        ]
      : [
          { key: "Parents", title: "Parents" },
          { key: "Staff", title: "Staff" },
          { key: "Teacher", title: "Teacher" },
        ];

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "Teacher":
        return <TeacherMessage type="Teacher" />;
      case "Staff":
        return <StaffMessage type="Staff" />;
      case "Parents":
        return <Message type="Parents" />;
      case "Admin":
        return <AdminMessage type="Admin" />;
      default:
        return <Text>No Content</Text>;
    }
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
        title="Messages"
        LeftIcon={
          <AntDesign
            size={30}
            color="white"
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        RightIcon={<View />}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={(i) => {
          console.log("Tab changed to index: ", i);
          setIndex(i);
        }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={{
              backgroundColor: "white",
              borderBottomColor: "#F5F6F8",
              borderBottomWidth: 1,
              marginTop: getFontSize(2),
            }}
            labelStyle={{
              color: "#14203C",
              fontWeight: "500",
              fontSize: 12.7,
            }}
            indicatorStyle={{
              backgroundColor: "#47424F",
              width: getWidth(14),
              marginLeft: getWidth(10),
            }}
            pressOpacity={1.0}
          />
        )}
      />
    </View>
  );
};

export default Messag;
