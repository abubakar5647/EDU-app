import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { API_ROUTES } from "../routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Mutex } from "async-mutex";

const mutex = new Mutex();

const baseQuery = fetchBaseQuery({
  baseUrl: API_ROUTES.BASE_URL,
  credentials: "same-origin",

  prepareHeaders: async (headers) => {
    const token = await AsyncStorage.getItem("isAuth");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryRtk = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refreshToken = await AsyncStorage.getItem("isAuthRefresh");
        // console.log("Refresh Token Response", refreshToken);
        if (refreshToken) {
          const refreshResult = await fetchBaseQuery({
            baseUrl: API_ROUTES.BASE_URL,
            credentials: "same-origin",
            prepareHeaders: (headers) => {
              headers.set("authorization", `Bearer ${refreshToken}`);
              return headers;
            },
          })("/auth/refresh", api, extraOptions);
          // console.log("Refresh Result Response", refreshResult);
          if (refreshResult.data) {
            await AsyncStorage.setItem(
              "isAuth",
              refreshResult.data?.data?.access_token
            );
            await AsyncStorage.setItem(
              "isAuthRefresh",
              refreshResult.data?.data?.refresh_token
            );
            result = await baseQuery(args, api, extraOptions);
          } else {
            await AsyncStorage.removeItem("isAuth");
            await AsyncStorage.removeItem("isAuthRefresh");
          }
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQuery(args, api, extraOptions);
    }
  }
  return result;
};
