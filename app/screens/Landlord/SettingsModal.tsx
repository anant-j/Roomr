import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { testPushNotification } from "../../notificationHandler";
import { Text, View, Button } from "components/Themed";
import { signout } from "../../reduxStates/firebaseListener";
import { useAppDispatch } from "hooks/typedHooks";

export default function SettingsModal() {
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
          console.log("Display profile");
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={styles.button}>Profile</Text>
      </Button>
      <Text></Text>
      <Button
        onPress={async () => {
          console.log("Notification Settings");
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={styles.button}>Notification Settings</Text>
      </Button>
      <Text></Text>
      <Button
        onPress={async () => {
          console.log("Roomr Score");
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={styles.button}>Roomr Score</Text>
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
  input: {
    width: "90%",
    height: 50,
    marginTop: 12,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
});
