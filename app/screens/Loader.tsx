import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Button, Text, View } from "../components/Themed";
import LottieView from "lottie-react-native";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { useEffect } from "react";
import { fetchUserData } from "reduxStates/authListener";
import { signout } from "reduxStates/authSlice";

export default function LoadingScreen() {
  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.auth.email);
  const logout = () => {
    dispatch(signout());
  };
  useEffect(() => {
    if (email) {
      dispatch(fetchUserData(email));
    }
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.maintitle}>Roomr</Text>
      <LottieView
        source={require("../assets/animations/loading.json")}
        autoPlay
      />
      <Image
        style={styles.logo}
        source={require("../assets/images/transparentIcon.png")}
      />
      <Button
        onPress={() => {
          logout();
        }}
        style={styles.button}
      >
        <Text>Logout</Text>
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
  button: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "90%",
    alignItems: "center",
  },
});
