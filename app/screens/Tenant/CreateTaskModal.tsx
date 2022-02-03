import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { Keyboard, Platform, StyleSheet } from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { addTask } from "reduxStates/taskSlice";

export default function CreateTaskModal() {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();

  const handleAddTask = () => {
    Keyboard.dismiss();
    dispatch(addTask(taskName, houseID, email));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setTaskName}
        placeholder="Task Name"
      />
      <Button onPress={handleAddTask} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Save</Text>
      </Button>
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  input: {
    width: "90%",
    height: 50,
    marginTop: 12,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
  buttonContainer: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
    marginTop: 15,
  },
});
