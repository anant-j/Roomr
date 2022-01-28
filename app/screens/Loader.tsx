import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Text, View } from "../components/Themed";
import LottieView from "lottie-react-native";
import { useAppDispatch } from "hooks/typedHooks";
import { useEffect } from "react";
import { fetchUserData } from "reduxStates/authListener";

export default function LoadingScreen() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch<any>(fetchUserData());
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
});
