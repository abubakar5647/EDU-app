import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "../routes";
import { baseQueryRtk } from "./helper";
import { book } from "../../assets/images";

export const homeApi = createApi({
  reducerPath: "homeApi",
  tagTypes: [
    "invalidate",
    "Events",
    "Rooms",
    "Parents",
    "Students",
    "attendance",
    "Groups",
    "Children",
    "Teachers",
    "Staffs",
    "Subject",
    "studentGrade",
    "homework",
    "Moves",
    "Document",
    "Activity",
    "Profile",
  ],
  baseQuery: baseQueryRtk,
  endpoints: (builder) => ({
    // Mutations
    Register: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.REGISTER,
        method: "POST",
        body: payload,
      }),
    }),
    Event: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.EVENT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Events"],
    }),
    createRoom: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ROOM_CREATE,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),
    createGrades: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_GRADES,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["studentGrade"],
    }),
    addStaffTeacher: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_STAFF_TEACHER,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Teachers", "Teachers", "Staffs"],
    }),
    // getTeachers: builder.query({
    //   query: () => ({
    //     url: `${API_ROUTES.GET_TEACHER}`,
    //     method: "GET",
    //   }),
    // }),
    getStaff: builder.query({
      query: () => ({
        url: `${API_ROUTES.GET_STAFF}`,
        method: "GET",
      }),
      providesTags: ["Staffs", "Teachers"],
    }),
    // }),
    AddContact: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_CONTACT,
        method: "POST",
        body: payload,
      }),
    }),
    AddStudent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_STUDENT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Students"],
    }),
    AddChildren: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_CHILD,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Students", "Children"],
    }),
    Me: builder.query({
      query: () => ({
        url: API_ROUTES.ME,
        method: "GET",
      }),
      providesTags: ["Profile", "Children", "Students"],
    }),
    AddParent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_PARENTS,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Parents"],
    }),
    CreateActivity: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_ACTIVITY,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Activity"],
    }),
    CreateHomeWork: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_HOMEWORK,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["homework"],
    }),
    CheckInStudent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CHECK_IN_STUDENT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["attendance"],
    }),
    CheckOutStudent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CHECK_OUT_STUDENT,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["attendance"],
    }),
    AbsentStudent: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ABSENT_STUDENT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["attendance"],
    }),
    // Queries
    GetGrade: builder.query({
      query: ({ classRoom, subject, month, year, searchKeyword, date }) => ({
        url: `${API_ROUTES.GET_GRADES}/all?roomId=${classRoom}&subjectId=${subject}&month=${month}&year=${year}&searchKeyword=${searchKeyword}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["studentGrade"],
    }),
    GetDateGrades: builder.query({
      query: ({ classRoom, subject, month, year, searchKeyword }) => ({
        url: `${API_ROUTES.GET_GRADES}/all?roomId=${classRoom}&subjectId=${subject}&month=${month}&year=${year}&searchKeyword=${searchKeyword}`,
        method: "GET",
      }),
      providesTags: ["studentGrade"],
    }),
    getEvents: builder.query({
      query: ({ date }) => ({
        url: `${API_ROUTES.GET_EVENTS}?date=${date}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    GetStudents: builder.query({
      query: ({ date, roomId }) => {
        return {
          url: `${API_ROUTES.GET_STUDENT}?date=${date}&roomId=${roomId}`,
          method: "GET",
        };
      },
      providesTags: ["Students", "attendance"],
    }),

    getTeachers: builder.query({
      query: () => ({
        url: API_ROUTES.GET_TEACHER,
        method: "GET",
      }),
      providesTags: ["Teachers", "Staffs"],
    }),
    getStaff: builder.query({
      query: () => ({
        url: API_ROUTES.GET_STAFF,
        method: "GET",
      }),
      providesTags: ["Staffs", "Teachers"],
    }),
    GetAllHomeWork: builder.query({
      query: ({ meRoomId, date }) => ({
        url: `${API_ROUTES.GET_ALL_HOMEWORK}?roomId=${meRoomId}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["homework"],
    }),
    GetAllSubject: builder.query({
      query: () => ({
        url: API_ROUTES.ALL_SUBJECT,
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),
    GetSubjectwithCareerId: builder.query({
      query: ({ schoolCareer }) => ({
        url: `${API_ROUTES.ALL_SUBJECT}?schoolCareer=${schoolCareer}`,
        method: "GET",
      }),
      providesTags: ["Subject"],
    }),
    GetParent: builder.query({
      query: () => ({
        url: API_ROUTES.GET_PARENTS,
        method: "GET",
      }),
      providesTags: ["Parents"],
    }),
    GetRooms: builder.query({
      query: (levelId) => ({
        url: `${API_ROUTES.GET_ROOMS}?levelId=${levelId}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    GetAllActivity: builder.query({
      query: () => ({
        url: API_ROUTES.GET_ALL_ACTIVITY,
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),
    createDocument: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_DOCUMENT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Document"],
    }),
    GetDocument: builder.query({
      query: ({ routeStudentId, startDates, endDates, docsName }) => ({
        url: `${API_ROUTES.GET_DOCUMENT}/get?studentId=${routeStudentId}`,
        method: "GET",
        params: {
          startDates,
          endDates,
          docsName,
        },
      }),
      providesTags: ["Document"],
    }),
    // StudentActivity: builder.mutation({
    //   query: (payload) => ({
    //     url: API_ROUTES.STUDENT_ACTIVITY,
    //     method: "POST",
    //     body: payload,
    //   }),
    //   providesTags: ["invalidate"],
    // }),
    GetChildernActivity: builder.query({
      query: ({ studentId, range, type }) => {
        return {
          url: `${API_ROUTES.CHILD_ACTIVITY}${studentId}?range=${range}&type=${type}`,
          method: "GET",
        };
      },
      providesTags: ["Activity"],
    }),

    GetAllStudentsActivity: builder.query({
      query: ({ studentId, range, type }) => ({
        url: `${API_ROUTES.STUDENT_ACTIVITY}?studentId=${studentId}&range=${range}&type=${type}`,
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),

    GetSchoolDashboard: builder.query({
      query: () => ({
        url: API_ROUTES.GET_SCHOOL_DASHBOARD,
        method: "GET",
      }),
      providesTags: [
        "Rooms",
        "Students",
        "Parents",
        "Teachers",
        "Staffs",
        "Children",
        "Profile",
      ],
    }),
    CreatePermission: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_PERMISSION,
        method: "POST",
        body: payload,
      }),
    }),
    GetPermissionBYSingleId: builder.query({
      query: (userId) => ({
        url: `${API_ROUTES.GET_PERMISSION_BY_SINGLE_ID}/${userId}?type=user`,
      }),
    }),
    UpdatePermission: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.UPDATE__PERMISSION,
        method: "PUT",
        body: payload,
      }),
    }),
    createProfile: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_PROFILE,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Profile"],
    }),
    CreateGroup: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_GROUP,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Groups"],
    }),
    GetGroups: builder.query({
      query: (roomId) => ({
        url: `${API_ROUTES.GET_GROUPS}?roomId=${roomId}`,
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),
    GetStudentHomeWork: builder.query({
      query: ({ studentId, startDate, endDate }) => ({
        url: `${API_ROUTES.GET_ALL_HOMEWORK}?studentId=${studentId}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: ["homework"],
    }),
    GetEventsByRoomId: builder.query({
      query: (roomId) => ({
        url: `${API_ROUTES.GET_EVENTS_BY_ROOM_ID}${roomId}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),
    UploadInfo: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.UPLOAD_INFO,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["invalidate"],
    }),
    UpdateStudent: builder.mutation({
      query: ({ studentId, payload }) => ({
        url: `${API_ROUTES.UPDATE_STUDENT}${studentId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Students"],
    }),
    UpdateRoom: builder.mutation({
      query: ({ roomId, payload }) => ({
        url: `${API_ROUTES.UPDATE_ROOM}${roomId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Rooms"],
    }),
    UpdateGroup: builder.mutation({
      query: ({ groupId, payload }) => ({
        url: `${API_ROUTES.UPDATE_GROUP}${groupId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Groups"],
    }),
    UpdateSubject: builder.mutation({
      query: ({ subjectId, payload }) => ({
        url: `${API_ROUTES.UPDATE_SUBJECT}${subjectId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Subject"],
    }),
    UpdateEvent: builder.mutation({
      query: ({ eventId, payload }) => ({
        url: `${API_ROUTES.UPDATE_EVENT}${eventId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Events"],
    }),
    DeleteStudent: builder.mutation({
      query: ({ studentId }) => ({
        url: `${API_ROUTES.DELETE_STUDENT}${studentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Students"],
    }),
    DeleteClassroom: builder.mutation({
      query: ({ roomId }) => ({
        url: `${API_ROUTES.DELETE_CLASSROOM}${roomId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Rooms"],
    }),
    DeleteGroup: builder.mutation({
      query: ({ groupId }) => ({
        url: `${API_ROUTES.DELETE_GROUP}${groupId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Groups"],
    }),
    DeleteSubject: builder.mutation({
      query: ({ subjectId }) => ({
        url: `${API_ROUTES.DELETE_SUBJECT}${subjectId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subject"],
    }),
    DeleteEvent: builder.mutation({
      query: ({ eventId }) => ({
        url: `${API_ROUTES.DELETE_EVENT}${eventId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Events"],
    }),
    GetSchoolCareer: builder.query({
      query: () => ({
        url: API_ROUTES.GET_SCHOOL_CAREER,
        method: "GET",
      }),
    }),
    StudentGrade: builder.query({
      query: ({ studentId, month, year }) => ({
        url: `${API_ROUTES.STUDENT_GRADE}/${studentId}?month=${month}&year=${year}`,
        method: "GET",
        providesTags: ["studentGrade"], // Add this line
      }),
    }),
    StudentEvent: builder.query({
      query: ({ studentId, date }) => ({
        url: `${API_ROUTES.STUDENT_EVENT}?studentId=${studentId}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["invalidate"],
    }),
    SingleStudent: builder.query({
      query: ({ studentId }) => ({
        url: `${API_ROUTES.GET_SINGLE_STUDENT}?studentId=${studentId}`,
        method: "GET",
      }),
      providesTags: ["validate"],
    }),
    SearchTeacherAndStaff: builder.query({
      query: ({ userNames }) => ({
        url: `${API_ROUTES.SEARCH_TEACHER_STAFF}?search=${userNames}`,
        method: "GET",
      }),
    }),
    getCareer: builder.query({
      query: () => ({
        url: API_ROUTES.GET_CAREER,
        method: "GET",
      }),
    }),
    GetLevel: builder.query({
      query: (careerId) => ({
        url: `${API_ROUTES.GET_LEVEL}?careerId=${careerId}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    GetAllRooms: builder.query({
      query: () => ({
        url: API_ROUTES.GET_ROOMS,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    GetAllGrade: builder.query({
      query: () => ({
        url: API_ROUTES.GET_ALL_GRADES,
        method: "GET",
      }),
      providesTags: ["studentGrade", "Students"],
    }),
    GetRoomStudent: builder.query({
      query: ({ id }) => ({
        url: `${API_ROUTES.GET_STUDENT}?roomId=${id}`,
        method: "GET",
      }),
      providesTags: ["Students"],
    }),
    GetAllClassRoom: builder.query({
      query: () => ({
        url: API_ROUTES.GET_ALL_CLASSROOM,
        method: "GET",
      }),
    }),

    EditStaffAndTeacher: builder.mutation({
      query: ({ selectId, payload }) => {
        console.log("Payload====================:", payload);
        return {
          url: `${API_ROUTES.EDIT_STAFF_TEACHER}/${selectId}`,
          method: "PUT",
          body: payload,
        };
      },
      invalidatesTags: ["Teachers", "Staffs", "Rooms", "Subject"],
    }),
    GetStudentByRoomId: builder.query({
      query: ({ roomId, groupId }) => ({
        url: `${API_ROUTES.GET_STUDENT}?roomId=${roomId}&groupId=${groupId}`,
        method: "GET",
      }),
      providesTags: ["Students", "Parents", "Rooms"],
    }),
    GetAllStudents: builder.query({
      query: () => {
        return {
          url: `${API_ROUTES.GET_STUDENT}`,
          method: "GET",
        };
      },
      providesTags: ["Students", "attendance"],
    }),
    GetRoomsHomework: builder.query({
      query: () => ({
        url: `${API_ROUTES.GET_ROOMS}`,
        method: "GET",
      }),
      providesTags: ["Rooms"],
    }),
    GetSubjectByRoomId: builder.query({
      query: (schoolCareer) => ({
        url: `${API_ROUTES.ALL_SUBJECT}?schoolCareer=${schoolCareer}`,
        method: "GET",
      }),
      providesTags: ["subject"],
    }),

    CreateSubject: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.CREATE_SUBJECT,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Subject"],
    }),
    GetStudentByGradesRoomId: builder.query({
      query: ({ roomId, subjectId, date }) => ({
        url: `${API_ROUTES.GET_STUDENT}?roomId=${roomId}&subjectId=${subjectId}&date=${date}`,
        method: "GET",
      }),
      providesTags: ["Students", "studentGrade"],
    }),
    MoveRoom: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.MOVE_ROOM,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Moves"],
    }),
    AllStudentByRoomId: builder.query({
      query: (roomId) => ({
        url: `${API_ROUTES.GET_STUDENT}?roomId=${roomId}`,
        method: "GET",
      }),
      providesTags: ["Moves"],
    }),
    GetAllGroups: builder.query({
      query: () => ({
        url: `${API_ROUTES.GET_GROUPS}`,
        method: "GET",
      }),
      providesTags: ["Groups"],
    }),

    GetEventsByRoomIdWithDate: builder.query({
      query: ({ roomId, date }) => ({
        url: `${API_ROUTES.GET_EVENTS_BY_ROOM_ID}${roomId}?date=${date}`,
        method: "GET",
      }),
      providesTags: ["Events"],
    }),

    GetAllActivityByFilter: builder.query({
      query: ({ range, type, roomId }) => ({
        url: `${API_ROUTES.GET_ALL_ACTIVITY}?range=${range}&type=${type}&roomId=${roomId}`,
        method: "GET",
      }),
      providesTags: ["Activity"],
    }),
    DeleteStaffAndTeacher: builder.mutation({
      query: (id) => ({
        url: `${API_ROUTES.DELETE_STAFF_TEACHER}${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teachers", "Staffs"],
    }),
    AddChildWithCode: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADD_CHILD_BY_CODE,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Children", "Students", "attendance", "Activity"],
    }),
    DeleteDocument: builder.mutation({
      query: (documentId) => ({
        url: `${API_ROUTES.DELETE_DOCUMENT}${documentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),

    EditGrade: builder.mutation({
      query: ({ id, ...payload }) => ({
        url: `${API_ROUTES.EDIT_GRADES}/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["studentGrade"],
    }),

    DeleteGrade: builder.mutation({
      query: (id) => ({
        url: `${API_ROUTES.DELETE_GRADE}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["studentGrade", "Students"],
    }),

    HomeworkDetail: builder.query({
      query: (homeWorkId) => ({
        url: `${API_ROUTES.HOMEWORK_DETAIL}/${homeWorkId}`,
        method: "GET",
      }),
      providesTags: ["homework"],
    }),
    UpdateDocument: builder.mutation({
      query: ({ documentId, payload }) => ({
        url: `${API_ROUTES.UPDATE_DOCUMENT}${documentId}`,
        method: "PUT",
        body: payload,
      }),
    }),
    UpdateParent: builder.mutation({
      query: ({ parentId, payload }) => ({
        url: `${API_ROUTES.UPDATE_PARENT}${parentId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Parents"],
    }),
    DeleteParent: builder.mutation({
      query: (parentId) => ({
        url: `${API_ROUTES.DELETE_PARENT}${parentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Parents"],
    }),

    GetChatRooms: builder.query({
      query: () => ({
        url: `${API_ROUTES.CHAT_ROOMS}`,
        method: "GET",
      }),
    }),

    ConversationMessage: builder.query({
      query: (id) => ({
        url: `${API_ROUTES.MESSAGE_CONVERSATION}/${id}`,
        invalidatesTags: ["Children", "Students", "attendance", "Activity"],
      }),
    }),
    HomeWorkUpdate: builder.mutation({
      query: ({ homeWorkId, ...payload }) => ({
        url: `${API_ROUTES.HOMEWORK_UPDATE}/${homeWorkId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["homework"],
    }),
    DeleteHomeWork: builder.mutation({
      query: (homeWorkId) => ({
        url: `${API_ROUTES.HOMEWORK_DELETE}/${homeWorkId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["homework"],
    }),
    UpdateParent: builder.mutation({
      query: ({ parentId, payload }) => ({
        url: `${API_ROUTES.UPDATE_PARENT}${parentId}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: ["Parents"],
    }),
    DeleteParent: builder.mutation({
      query: (parentId) => ({
        url: `${API_ROUTES.DELETE_PARENT}${parentId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Parents"],
    }),
    SingleStudentGrades: builder.query({
      query: ({ studentId, month, year }) => ({
        url: `${API_ROUTES.GET_SINGLE_STUDENT_GRADES}/${studentId}?month=${month}&year=${year}`,
        method: "GET",
      }),
      providesTags: ["studentGrade"],
    }),
    SingleStudentHomeWork: builder.query({
      query: ({ studentId, startDate, endDate }) => ({
        url: `${API_ROUTES.GET_SINGLE_STUDENT_HOMEWORK}?studentId=${studentId}&startDate=${startDate}&endDate=${endDate}`,
        method: "GET",
      }),
      providesTags: ["Rooms", "Homework"],
    }),
    SingleStudentCalender: builder.query({
      query: ({ studentId, date }) => ({
        url: `${API_ROUTES.GET_SINGLE_STUDENT_CALENDER}?studentId=${studentId}&date=${date}`,
        method: "GET",
      }),
    }),
    Notification: builder.query({
      query: () => ({
        url: `${API_ROUTES.NOTIFICATION}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useEventMutation,
  useGetGradeQuery,
  useGetEventsQuery,
  useCreateRoomMutation,
  useGetStudentsQuery,
  useCreateGradesMutation,
  useCreateDocumentMutation,
  useAddStaffTeacherMutation,
  useGetTeachersQuery,
  useGetStaffQuery,
  useAddStudentMutation,
  useAddParentMutation,
  useAddContactMutation,
  useCreateActivityMutation,
  useGetAllHomeWorkQuery,
  useGetAllSubjectQuery,
  useGetParentQuery,
  useCreateHomeWorkMutation,
  useGetDocumentQuery,
  useGetRoomsQuery,
  useGetAllActivityQuery,
  useCheckInStudentMutation,
  useCheckOutStudentMutation,
  useAbsentStudentMutation,
  useGetSchoolDashboardQuery,
  useGetEventsByRoomIdQuery,
  useAddChildrenMutation,
  useMeQuery,
  useGetPermissionBYSingleIdQuery,
  useUpdatePermissionMutation,
  useStudentActivityMutation,
  useCreateGroupMutation,
  useCreateProfileMutation,
  useGetStudentHomeWorkQuery,
  useUploadInfoMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation,
  useGetGroupsQuery,
  useCreatePermissionMutation,
  useGetSchoolCareerQuery,
  useGetLevelQuery,
  useGetAllRoomsQuery,
  useStudentGradeQuery,
  useStudentEventQuery,
  useSingleStudentQuery,
  useSearchTeacherAndStaffQuery,
  useGetCareerQuery,
  useGetAllGradeQuery,
  useGetRoomStudentQuery,
  useGetAllClassRoomQuery,
  useEditStaffAndTeacherMutation,
  useGetStudentByRoomIdQuery,
  useGetAllStudentsQuery,
  useGetRoomsHomeworkQuery,
  useGetSubjectByRoomIdQuery,
  useCreateSubjectMutation,
  useGetStudentByGradesRoomIdQuery,
  useMoveRoomMutation,
  useAllStudentByRoomIdQuery,
  useGetAllGroupsQuery,
  useGetEventsByRoomIdWithDateQuery,
  useGetAllActivityByFilterQuery,
  useGetChildernActivityQuery,
  useGetAllStudentsActivityQuery,
  useDeleteClassroomMutation,
  useUpdateRoomMutation,
  useDeleteStaffAndTeacherMutation,
  useAddChildWithCodeMutation,
  useHomeWorkUpdateMutation,
  useDeleteHomeWorkMutation,
  useDeleteDocumentMutation,
  useEditGradeMutation,
  useDeleteGradeMutation,
  useHomeworkDetailQuery,
  useUpdateDocumentMutation,
  useDeleteEventMutation,
  useUpdateEventMutation,
  useUpdateParentMutation,
  useDeleteParentMutation,
  useGetChatRoomsQuery,
  useConversationMessageQuery,
  useSingleStudentGradesQuery,
  useSingleStudentHomeWorkQuery,
  useSingleStudentCalenderQuery,
  useDeleteGroupMutation,
  useUpdateGroupMutation,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
  useNotificationQuery,
  useGetSubjectwithCareerIdQuery,
  useGetDateGradesQuery,
} = homeApi;
