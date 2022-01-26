import * as React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View, Button } from "../components/Themed";
import { registerFakeTenant, loginFakeTenant } from "../firebase";
import { useAppDispatch } from "hooks/typedHooks";
import { fetchAuth } from "reduxStates/authListener";
import { useEffect } from "react";
export default function LoginScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch<any>(fetchAuth());
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Roomr.</Text>
      <Button
        onPress={() => {
          loginFakeTenant();
        }}
        style={styles.link}
      >
        <Text style={styles.linkText}>Login (Fake)</Text>
      </Button>
      <Text></Text>
      <Button
        onPress={() => {
          registerFakeTenant();
        }}
        style={styles.link}
      >
        <Text style={styles.linkText}>Register (Fake)</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
  },
  linkText: {
    fontSize: 25,
    color: "white",
  },
});
