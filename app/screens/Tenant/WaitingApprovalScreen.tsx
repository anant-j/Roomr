import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import LottieView from "lottie-react-native";

export default function WaitingScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.maintitle}>Roomr</Text>
      <Text style={styles.subtitle}>
        Please wait while your landlord approves your request to join
      </Text>
      <LottieView source={require("assets/animations/loading.json")} autoPlay />
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
    // fontWeight: "bold",
  },
});
