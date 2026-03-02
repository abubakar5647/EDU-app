import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { colors } from "../../constants/colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import Header from "../../Components/Header";

const CallUs = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        title={"Contact support"}
        LeftIcon={
          <AntDesign
            size={30}
            color={"white"}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        RightIcon={<View />}
      />
      <View style={{ alignItems: "center", justifyContent: "center", flex: 1 }}>
        <Text
          style={{
            color: colors.primary,
            fontSize: 20,
          }}
        >
          +447488855336
        </Text>
      </View>
    </View>
  );
};

export default CallUs;

const styles = StyleSheet.create({});
