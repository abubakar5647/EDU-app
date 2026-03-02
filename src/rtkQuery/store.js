import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import { rootMiddleWare, rootReducer } from "./rootReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  blacklist: ["user"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      serializableCheck: false,
      immutableCheck: false,
    }).concat(rootMiddleWare),
});
setupListeners(store.dispatch);
const persistor = persistStore(store);
export { store, persistor };

export const useAppDispatch = useDispatch;
export const useAppSelector = useSelector;
