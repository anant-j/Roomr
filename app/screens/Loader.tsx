import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Button, Text, View } from "../components/Themed";
import LottieView from "lottie-react-native";
import { useAppDispatch } from "hooks/typedHooks";
import { signout } from "reduxStates/authSlice";

export default function LoadingScreen() {
  const dispatch = useAppDispatch();
  const logout = () => {
    dispatch(signout());
  };
  return (
    <View style={styles.container}>
      <Text style={styles.maintitle}>Roomr</Text>
      <Text style={styles.subtitle}>Please wait</Text>
      <LottieView source={require("assets/animations/loading.json")} autoPlay />
      <Button
        onPress={() => {
          logout();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // padding: 20,
  },
  maintitle: {
    position: "absolute",
    top: 100,
    fontSize: 40,
    fontWeight: "bold",
  },
  subtitle: {
    position: "absolute",
    top: 200,
    fontSize: 20,
    padding: 20,
  },
  button: {
    position: "absolute",
    bottom: 50,
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 30,
    color: "white",
  },
});
