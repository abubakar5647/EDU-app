import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "../../Screens/Auth/Login";

import ForgotPassword from "../../Screens/Auth/ForgotPassword";

import MyDrawer from "../drawer";

import OTP from "../../Screens/Auth/OTP";
import WelcomeScreen from "../../Screens/Auth/WelcomeScreen";
import Signup from "../../Screens/Auth/Singup";
import OTPverify2 from "../../Screens/Auth/OTP2";
import AdminSignup from "../../Screens/Auth/AdminSingup";
import AdminWelcome from "../../Screens/Auth/AdminWelcome";
import InviteScreen from "../../Screens/Auth/InviteScreen";
import InviteVia from "../../Screens/Auth/InviteVia";
import Messag from "../../Screens/Messag";
import ConversationScreen from "../../Screens/Message/conversation";
import Calendrar from "../../Screens/Calendrar";
import Room from "../../Screens/Room";
import Students from "../../Screens/Students";
import Actvitys from "../../Screens/Actvitys";
import TagStudent from "../../Screens/TagStudent";
import AddActivity from "../../Screens/AddActivity";
import HelpAndContacts from "../../Screens/HelpAndContacts";
import SendMessage from "../../Screens/SendMessage";
import ContactSupport from "../../Screens/ContactSupport";
import ReportProblem from "../../Screens/ReportProblem";
import StudentFeed from "../../Screens/FamilyPortal/StudentFeed";
import StudentProfile from "../../Screens/FamilyPortal/StudentProfile";
import FamilyProfile from "../../Screens/FamilyPortal/FamilyProfile";
import ProfileSchool from "../../Screens/AdminPortal/ProfileSchool";
import Permission from "../../Screens/AdminPortal/Permission";
import Teachers from "../../Screens/AdminPortal/Teachers";
import AddTeacher from "../../Screens/AdminPortal/AddTeacher";
import Rooms from "../../Screens/AdminPortal/Rooms";
import AddRoom from "../../Screens/AdminPortal/AddRoom";
import Student from "../../Screens/AdminPortal/Student";
import Parents from "../../Screens/AdminPortal/Parents";
import AddParent from "../../Screens/AdminPortal/AddParent";
import AddDocument from "../../Screens/AddDocument";
import RoomDetails from "../../Screens/AdminPortal/RoomDetails";
import TextbookView from "../../Screens/TextbookView";
import EditTeacher from "../../Screens/AdminPortal/EditTeacher";
import PermissonGrant from "../../Screens/AdminPortal/PermissonGrant";
import RefferSchool from "../../Screens/Auth/RefferSchool";
import Textbook from "../../Screens/Textbook";
import Gradebook from "../../Screens/Gradebook";
import TeacherStaffList from "../../Screens/TeacherStaffList";
import AddGrade from "../../Screens/AddGrades";
import Classes from "../../Screens/Classes";
import AddGroup from "../../Screens/AdminPortal/AddGroup";
import AllStudent from "../../Screens/AllStudent";
import GradeAcsess from "../../Screens/GradeAccess";
import AddGradesScreen from "../../Screens/AddGrades/molecule/addGradeView";
import SeeGradesView from "../../Screens/AddGrades/molecule/seeGradeView";
import InitialScreen from "../../Screens/InitialScreen";
import ResetPassword from "../../Screens/Auth/ResetPassword";
import StudentCalendar from "../../Screens/StudentCalendar";
import AddStudent from "../../Screens/Student";
import AddSubject from "../../Screens/Student";
import TextbookDetail from "../../Screens/TextbookDetail";
import StaffMessage from "../../Screens/StaffMessage";
import TeacherMessage from "../../Screens/TeacherMessage";
import AdminMessage from "../../Screens/AdminScreen";
import AllSubject from "../../Screens/AdminPortal/AllSubject";
import AllGroups from "../../Screens/AdminPortal/AllGroups";
import Notification from "../../Screens/Notification";
import FamilyHome from "../../Screens/FamilyPortal/FamilyHome";
import CallUs from "../../Screens/CallUs";

const stack = createNativeStackNavigator();
const AuthStack = () => {
  return (
    <stack.Navigator
      initialRouteName={"InitialScreen"}
      screenOptions={{ headerShown: false }}
    >
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="InitialScreen"
        component={InitialScreen}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="WelcomeScreen"
        component={WelcomeScreen}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="RefferSchool"
        component={RefferSchool}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="FamilyProfile"
        component={FamilyProfile}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="FamilyHome"
        component={FamilyHome}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="TextbookView"
        component={TextbookView}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ProfileSchool"
        component={ProfileSchool}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Permission"
        component={Permission}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="PermissonGrant"
        component={PermissonGrant}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Teachers"
        component={Teachers}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddTeacher"
        component={AddTeacher}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="EditTeacher"
        component={EditTeacher}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Rooms"
        component={Rooms}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Classes"
        component={Classes}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddRoom"
        component={AddRoom}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="RoomDetails"
        component={RoomDetails}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Student"
        component={Student}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddSubject"
        component={AddSubject}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="StaffMessage"
        component={StaffMessage}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="TeacherMessage"
        component={TeacherMessage}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AdminMessage"
        component={AdminMessage}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Notification"
        component={Notification}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Parents"
        component={Parents}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AllStudent"
        component={AllStudent}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddParent"
        component={AddParent}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddGroup"
        component={AddGroup}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="StudentProfile"
        component={StudentProfile}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="StudentFeed"
        component={StudentFeed}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="SendMessage"
        component={SendMessage}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ContactSupport"
        component={ContactSupport}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ReportProblem"
        component={ReportProblem}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Login"
        component={Login}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Actvitys"
        component={Actvitys}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="TeacherStaffList"
        component={TeacherStaffList}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="TagStudent"
        component={TagStudent}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Room"
        component={Room}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddGradesScreen"
        component={AddGradesScreen}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="SeeGradesView"
        component={SeeGradesView}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="GradeAcsess"
        component={GradeAcsess}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Students"
        component={Students}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddActivity"
        component={AddActivity}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Calendrar"
        component={Calendrar}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="HelpAndContacts"
        component={HelpAndContacts}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Messages"
        component={Messag}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ConversationScreen"
        component={ConversationScreen}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Signup"
        component={Signup}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="InviteScreen"
        component={InviteScreen}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddDocument"
        component={AddDocument}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="InviteVia"
        component={InviteVia}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AdminSignup"
        component={AdminSignup}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AdminWelcome"
        component={AdminWelcome}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Home"
        component={MyDrawer}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ForgotPassword"
        component={ForgotPassword}
      />

      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="OTP"
        component={OTP}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="OTPverify2"
        component={OTPverify2}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Textbook"
        component={Textbook}
      />
      {/* <stack.Screen
        options={{
          headerShown: false,
        }}
        name="Grades"
        component={Gradebook}
      /> */}
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AddGrade"
        component={AddGrade}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="ResetPassword"
        component={ResetPassword}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="StudentCalendar"
        component={StudentCalendar}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="TextbookDetail"
        component={TextbookDetail}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AllSubject"
        component={AllSubject}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="AllGroups"
        component={AllGroups}
      />
      <stack.Screen
        options={{
          headerShown: false,
        }}
        name="CallUs"
        component={CallUs}
      />
    </stack.Navigator>
  );
};

export default AuthStack;
