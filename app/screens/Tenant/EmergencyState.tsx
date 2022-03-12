import * as React from "react";
import { StyleSheet, Image } from "react-native";
import { Button, Text, View } from "../../components/Themed";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { endEmergency, hideEmergency } from "reduxStates/emergencySlice";
import { useActionSheet } from "@expo/react-native-action-sheet";

export default function EmergencyState() {
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const hideEmergencyDispatch = () => {
    dispatch(hideEmergency());
  };

  const endEmergencyHandler = () => {
    showActionSheetWithOptions(
      {
        title: "Are you sure?",
        message: "This will end the emergency for everyone in the house.",
        options: ["End", "Cancel"],
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(endEmergency());
        }
      },
    );
  };

  const emergency = useAppSelector((state) => state.emergency);
  return (
    <View style={styles.container}>
      <Text style={styles.maintitle}>Emergency Declared</Text>
      {!emergency.isSafe && (
        <Text style={[styles.maintitle, styles.leaveHouse]}>
          LEAVE HOUSE IMMEDIATELY
        </Text>
      )}
      <Text style={styles.subtitle}>{emergency.message}</Text>
      <Text style={styles.subtitle}>{emergency.description}</Text>
      <Image
        source={require("../../assets/images/alert.png")}
        style={styles.img}
      />
      <Button
        onPress={() => {
          hideEmergencyDispatch();
        }}
        style={styles.topButton}
      >
        <Text style={styles.buttonText}>Hide</Text>
      </Button>
      <Text></Text>
      <Button
        onPress={() => {
          endEmergencyHandler();
        }}
        style={styles.button}
      >
        <Text style={styles.buttonText}>End Emergency</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 150,
    height: 150,
    marginBottom: 20,
    alignSelf: "center",
    // contain
    resizeMode: "contain",
  },
  logo: {
    width: 100,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    // padding: 20,
  },
  maintitle: {
    // position: "absolute",
    marginTop: 100,
    fontSize: 40,
    fontWeight: "bold",
    width: "90%",
    textAlign: "center",
  },
  leaveHouse: {
    marginTop: 0,
    color: "red",
  },
  subtitle: {
    // position: "absolute",
    // top: 200,
    fontSize: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  button: {
    // position: "absolute",
    // bottom: 50,
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    width: "90%",
    alignItems: "center",
    backgroundColor: "green",
  },
  topButton: {
    // position: "absolute",
    // bottom: 100,
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
