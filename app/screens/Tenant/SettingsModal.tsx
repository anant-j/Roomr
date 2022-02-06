import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Platform, StyleSheet, Alert } from "react-native";
import { testPushNotification } from "../../notificationHandler";
import { Text, View, Button, TextInput } from "components/Themed";
import { signout } from "../../reduxStates/authSlice";
import { useAppDispatch } from "hooks/typedHooks";
import { useState } from "react";
import { sendMessage } from "../../firebase";

export default function SettingsModal() {
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(signout());
  };

  const [email, onChangeEmail] = useState("");
  const [message, onChangeMessage] = useState("");

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
      <View style={{ width: "90%" }}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          keyboardType="email-address"
          placeholder="Enter Email to send message to"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeMessage}
          value={message}
          placeholder="Message"
          autoCapitalize="sentences"
        />
        <Button
          onPress={async () => {
            await sendMessage({ message: message, to: email })
              .then((result) => {
                console.log(result);
              })
              .catch((err) => {
                console.log(err);
              });
            Alert.alert("done");
          }}
          style={{ padding: 10, borderRadius: 10 }}
        >
          <Text style={styles.button}>Send Message</Text>
        </Button>
      </View>
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
