import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View, Button, TextInput } from "../components/Themed";
import { registerFakeTenant, login } from "../firebase";
import { useAppDispatch } from "hooks/typedHooks";
import { fetchAuth } from "reduxStates/authListener";
import { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  const [progress, setProgress] = useState(0);
  // const [isTenant, setIsTenant] = useState(null);
  const [email, onChangeEmail] = useState("");
  const [hidePass, setHidePass] = useState(true);
  const [password, onChangePassword] = useState("");

  useEffect(() => {
    dispatch<any>(fetchAuth());
  }, []);

  if (progress === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome to{"\n"}Roomr</Text>
        <Button
          onPress={() => {
            setProgress(progress + 1);
          }}
          style={styles.link}
        >
          <Text style={styles.linkText}>Login</Text>
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
  } else if (progress === 1) {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => {
            setProgress(0);
          }}
          style={styles.backbutton}
        >
          <Feather name="arrow-left" color={"white"} size={30} />
        </Button>
        <Text style={styles.title}>Log In</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Enter Email"
        />
        {/* <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Enter Password"
          secureTextEntry={true}
        /> */}
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter Password"
            autoCompleteType="password"
            secureTextEntry={hidePass ? true : false}
            onChangeText={onChangePassword}
            style={styles.passwordInput}
          />
          <Feather
            name={hidePass ? "eye-off" : "eye"}
            size={25}
            color="grey"
            onPress={() => setHidePass(!hidePass)}
            style={styles.passwordEye}
          />
        </View>
        <Button
          onPress={() => {
            login(email, password);
          }}
          style={styles.link}
        >
          <Text style={styles.linkText}>Login</Text>
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    width: "80%",
    margin: 12,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    width: "80%",
    marginBottom: 12,
  },
  passwordInput: {
    height: 50,
    width: "80%",
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  passwordEye: {
    alignSelf: "center",
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    position: "absolute",
    top: 100,
    fontSize: 40,
    fontWeight: "bold",
  },
  backbutton: {
    position: "absolute",
    top: 110,
    left: 30,
    margin: 0,
    padding: 0,
    borderRadius: 50,
  },
  link: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "80%",
    alignItems: "center",
  },
  linkText: {
    fontSize: 25,
    color: "white",
  },
});
