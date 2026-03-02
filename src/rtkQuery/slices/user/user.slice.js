import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    studentData: "",
    permissions: [],
    selectedStudentsId: [],
    attendanceID: [],
    fcmToken: "",
    selectedId: "",
    HomeworkItem: "",
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    togglePermission: (state, action) => {
      state.permissions = action.payload;
    },
    setStudentData: (state, action) => {
      state.studentData = action.payload;
    },
    setSelectedStudentsId: (state, action) => {
      const id = action.payload;
      if (state.selectedStudentsId.includes(id)) {
        state.selectedStudentsId = state.selectedStudentsId.filter(
          (selectedId) => selectedId !== id
        );
      } else {
        state.selectedStudentsId.push(id);
      }
    },
    setAttendanceID: (state, action) => {
      if (!state.attendanceID.includes(action.payload)) {
        state.attendanceID.push(action.payload);
      }
    },
    clearUserTokenAndData: (state) => {
      state.userData = null;
    },
    setFcmToken: (state, action) => {
      state.fcmToken = action.payload;
    },
    setSelectedId: (state, action) => {
      state.selectedId = action.payload;
    },
    setHomeworkItem: (state, action) => {
      state.HomeworkItem = action.payload;
    },
  },
});

export const {
  setUserData,
  togglePermission,
  setStudentData,
  setSelectedStudentsId,
  setAttendanceID,
  clearUserTokenAndData,
  setFcmToken,
  setSelectedId,
  setHomeworkItem,
} = userSlice.actions;
export default userSlice.reducer;
