import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
// import { persistor, store } from "./src/Redux/store";
import Main from "./src/Navigation/Main";
import SplashScreen from "react-native-splash-screen";

import { Platform } from "react-native";
import { persistor, store } from "./src/rtkQuery/store";
import Toast from "react-native-toast-message";
import { toastConfig } from "./src/Components/Toaster";
const App = () => {
  useEffect(() => {
    // if(Platform.OS==="android")
    SplashScreen.hide(); //hides the splash screen on app load.
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Main />
        <Toast config={toastConfig} />
      </PersistGate>
    </Provider>
  );
};

export default App;
