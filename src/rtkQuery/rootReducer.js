import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./slices/user/user.slice";
import { authApi } from "./slices/auth";
import { homeApi } from "./slices/home";
import GernelReducers from "../Redux/reducers/GernelReducers";
import authReducer from "../Redux/reducers/AuthReducers";
import WorkoutReducers from "../Redux/reducers/WorkoutRecucers";

export const RTKReducer = {
  [authApi.reducerPath]: authApi.reducer,
  [homeApi.reducerPath]: homeApi.reducer,
};

export const rootReducer = combineReducers({
  user: userReducer,
  gernal: GernelReducers,
  auth: authReducer,
  workout: WorkoutReducers,
  ...RTKReducer,
});
export const rootMiddleWare = [authApi.middleware, homeApi.middleware];
