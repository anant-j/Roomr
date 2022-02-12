import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "./notificationHandler";
import React, { useState, useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import TenantNavigation from "./navigation/Tenant";
import LandlordNavigation from "./navigation/Landlord";
import { registerExpoToken } from "./reduxStates/authSlice";
import { store } from "./store";
import Login from "screens/Login";
import { useAppSelector, useAppDispatch } from "hooks/typedHooks";
import { fetchAuth } from "reduxStates/firebaseListener";
import WaitingScreen from "screens/Tenant/WaitingApprovalScreen";
import EmergencyState from "screens/Tenant/EmergencyState";

import "intl";
import { Platform } from "react-native";

if (Platform.OS === "android") {
  // See https://github.com/expo/expo/issues/6536 for this issue.
  if (typeof (Intl as any).__disableRegExpRestore === "function") {
    (Intl as any).__disableRegExpRestore();
  }
}
import "intl/locale-data/jsonp/en";

export default function App() {
  return (
    <Provider store={store}>
      <AppWithProvider />
    </Provider>
  );
}

const AppWithProvider = () => {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const loggedIn = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();
  const tenantMode = useAppSelector((state) => state.auth.type) === "tenant";
  const approved = useAppSelector((state) => state.auth.approved);
  const isEmergency = useAppSelector((state) => state.emergency.active);
  const showEmergency = useAppSelector((state) => state.emergency.show);

  useEffect(() => {
    dispatch(fetchAuth());
    registerForPushNotificationsAsync().then((token) => {
      dispatch(registerExpoToken(token));
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  if (!isLoadingComplete) {
    return null;
  }
  if (!loggedIn) {
    return (
      <SafeAreaProvider>
        <Login />
        <StatusBar />
      </SafeAreaProvider>
    );
  } else {
    if (isEmergency && showEmergency) {
      return (
        <SafeAreaProvider>
          <EmergencyState />
          <StatusBar />
        </SafeAreaProvider>
      );
    }
    if (tenantMode) {
      if (!approved) {
        return (
          <SafeAreaProvider>
            <WaitingScreen />
            <StatusBar />
          </SafeAreaProvider>
        );
      }
      return (
        <SafeAreaProvider>
          <TenantNavigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      );
    } else {
      return (
        <SafeAreaProvider>
          <LandlordNavigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      );
    }
  }
};
