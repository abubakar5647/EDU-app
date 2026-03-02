import { createApi } from "@reduxjs/toolkit/query/react";
import { API_ROUTES } from "../routes";
import { baseQueryRtk } from "./helper";

export const authApi = createApi({
  reducerPath: "authApi",
  tagTypes: ["invalidate", "Login"],
  baseQuery: baseQueryRtk,
  endpoints: (builder) => ({
    SignUp: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.SIGN_UP,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["invalidate"],
    }),
    AdminSignUp: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.ADMIN_SIGN_UP,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["invalidate"],
    }),

    Login: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.LOGIN,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Login"],
    }),
    VerifyOtp: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.VERIFY_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    ResendOtp: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.RESEND_OTP,
        method: "POST",
        body: payload,
      }),
    }),
    Me: builder.query({
      query: () => ({
        url: API_ROUTES.ME,
        method: "GET",
      }),
      providesTags: ["Login"],
    }),
    SchoolVerification: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.SCHOOL_VERIFICATION,
        method: "PUT",
        body: payload,
      }),
    }),
    ResetPassword: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.RESET_PASSWORD,
        method: "POST",
        body: payload,
      }),
    }),
    ForgotPassword: builder.mutation({
      query: (payload) => ({
        url: API_ROUTES.FORGOT_PASSWORD,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});
export const {
  useSignUpMutation,
  useAdminSignUpMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useMeQuery,
  useSchoolVerificationMutation,
  useResetPasswordMutation,
  useForgotPasswordMutation,
} = authApi;
