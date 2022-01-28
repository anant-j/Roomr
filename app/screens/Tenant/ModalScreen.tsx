import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { testPushNotification } from "../../notificationHandler";
import { Text, View, Button } from "components/Themed";
import { signout } from "../../reduxStates/authSlice";
import { useAppDispatch } from "hooks/typedHooks";

export default function ModalScreen() {
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(signout());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button
        onPress={async () => {
          await testPushNotification();
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={styles.button}>Send Test Notification</Text>
      </Button>
      <Text></Text>
      <Button
        onPress={async () => {
          logout();
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={styles.button}>Logout</Text>
      </Button>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  button: {
    fontSize: 20,
    color: "white",
  },
});
