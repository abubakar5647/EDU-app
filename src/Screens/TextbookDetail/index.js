import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import Header from "../../Components/Header";
import AntDesign from "react-native-vector-icons/AntDesign";
import { colors } from "../../constants/colors";
import { useNavigation } from "@react-navigation/native";
import { Fonts } from "../../assets/fonts";
import GeneralStatusBar from "../../Components/GeneralStatusBar";
import CustomText from "../../Components/CustomText";
import { normalizeSize } from "../../../utils";
import { useHomeworkDetailQuery } from "../../rtkQuery/slices/home";
import moment from "moment";

const TextbookDetail = ({ route }) => {
  const { homeworkId } = route.params || [];
  const {
    data: homeWorkDetail,
    error,
    isLoading,
  } = useHomeworkDetailQuery(homeworkId);
  console.log("iddd=================", homeworkId);
  console.log("homeWorkDetail==========", homeWorkDetail);
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <GeneralStatusBar
        barStyle="light-content"
        hidden={false}
        backgroundColor={colors.primary}
        translucent={true}
      />
      <Header
        TitelStyle={{
          color: colors.white,
          fontSize: 22,
          fontFamily: Fonts.PoppinsBold,
        }}
        backgroundColor={colors.primary}
        title={"Homework Detail"}
        LeftIcon={
          <AntDesign
            size={30}
            color={colors.white}
            onPress={() => navigation.goBack()}
            name="arrowleft"
          />
        }
        RightIcon={<View />}
      />
      <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
        <CustomText
          label={moment(homeWorkDetail?.data?.date).format("ddd-MM-YYYY")}
          fontFamily={Fonts.PoppinsBold}
          fontSize={15}
          alignSelf={"flex-end"}
        />
      </View>
      {isLoading ? (
        <ActivityIndicator size="medium" color="green" />
      ) : homeWorkDetail?.data ? (
        <View style={styles.main}>
          <CustomText
            label={homeWorkDetail?.data?.subject?.title}
            fontFamily={Fonts.PoppinsBold}
            fontSize={15}
          />
          <CustomText
            label={homeWorkDetail?.data?.description}
            fontFamily={Fonts.PoppinsMedium}
            fontSize={15}
            paddingLeft={normalizeSize(15)}
          />
        </View>
      ) : (
        <CustomText
          label={"HomeWork Not Found"}
          fontFamily={Fonts.PoppinsMedium}
          fontSize={15}
          alignSelf={"center"}
          marginTop={20}
          color={colors.primary}
        />
      )}
    </SafeAreaView>
  );
};

export default TextbookDetail;

const styles = StyleSheet.create({
  main: {
    backgroundColor: "#50C2C929",
    marginHorizontal: normalizeSize(20),
    marginVertical: normalizeSize(20),
    paddingVertical: normalizeSize(20),
    borderRadius: normalizeSize(20),
    paddingLeft: normalizeSize(20),
  },
  container: { backgroundColor: colors.white, flex: 1 },
});
