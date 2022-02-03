import * as React from "react";
import { Keyboard, StyleSheet } from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { addTask } from "reduxStates/taskSlice";
import { validator } from "utils/Validations";
import ErrorView from "components/ErrorView";

export default function CreateTaskModal() {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const [errorCode, setErrorCode] = useState(null);
  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();

  const handleAddTask = () => {
    Keyboard.dismiss();
    const taskNameValidation = validator(taskName, "taskName");
    if (!taskNameValidation.success) {
      setErrorCode(taskNameValidation.error);
      return;
    }
    dispatch(addTask(taskName, houseID, email));
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ErrorView errorCode={errorCode} setErrorCode={setErrorCode} />
      <TextInput
        style={styles.input}
        onChangeText={setTaskName}
        placeholder="Task Name"
      />
      <Button onPress={handleAddTask} style={styles.buttonContainer}>
        <Text style={styles.buttonText}>Save</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 35,
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
