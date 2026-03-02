import React, { useState, useRef } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { TextInput } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import Button from "../../../Components/Button";
import { validateFields } from "../../../../utils/validation/validate-fields";
import GeneralStatusBar from "../../../Components/GeneralStatusBar";
import { styles } from "./style";
import {
  getFontSize,
  getHeight,
  getWidth,
} from "../../../../utils/ResponsiveFun";
import { useDispatch } from "react-redux";
import { GernalStyle } from "../../../constants/GernalStyle";
import { setFollow, setLoader } from "../../../Redux/actions/GernalActions";
import { colors } from "../../../constants/colors";
import { useFocusEffect } from "@react-navigation/native";
const InviteScreen = ({ navigation }) => {
  const dispatch = useDispatch();

  return (
    <View style={styles.contaner}>
      <GeneralStatusBar 
        barStyle="dark-content"
        hidden={false}
        backgroundColor="white"
        translucent={true}
      />
 
          <Button
             onPress={() =>{
            
               navigation.navigate('InviteVia')}}
            
            text="Invite"
            btnStyle={{
              ...GernalStyle.btn,
              marginTop: getHeight(30),
              borderColor:colors.buttonColor,
              borderWidth:1,
              backgroundColor: colors.buttonColor2,
            }}
            btnTextStyle={{...GernalStyle.btnText,color:'#000000' }}
           
          />
       
          <Button
              onPress={() =>{
      
                 navigation.navigate('RefferSchool')}}
            text="Reffer your school"
            btnStyle={{
              ...GernalStyle.btn,
              marginTop: getHeight(5),

              backgroundColor: colors.buttonColor,
            }}
            btnTextStyle={GernalStyle.btnText}
          />
           
   
    </View>
  );
};

export default InviteScreen;
