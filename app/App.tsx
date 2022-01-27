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
import { fetchAuth } from "reduxStates/authListener";
import Loading from "screens/Loader";

const tenantMode = true;

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

  const loggedIn = useAppSelector((state) => state.auth.loggedIn);
  const authFlowDoneOnce = useAppSelector(
    (state) => state.auth.authFlowDoneOnce,
  );
  const dispatch = useAppDispatch();

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
  if (!authFlowDoneOnce) {
    return (
      <SafeAreaProvider>
        <Loading />
        <StatusBar />
      </SafeAreaProvider>
    );
  } else {
    if (!loggedIn) {
      return (
        <SafeAreaProvider>
          <Login />
          <StatusBar />
        </SafeAreaProvider>
      );
    } else {
      if (tenantMode) {
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
  }
};
