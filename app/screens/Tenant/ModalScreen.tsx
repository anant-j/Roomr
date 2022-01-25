import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { testPushNotification } from "../../notificationHandler";
import { Text, View, Button } from "components/Themed";

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Button
        onPress={async () => {
          await testPushNotification();
        }}
        style={{ padding: 10, borderRadius: 10 }}
      >
        <Text style={{ fontSize: 20 }}>Send Test Notification</Text>
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
});
