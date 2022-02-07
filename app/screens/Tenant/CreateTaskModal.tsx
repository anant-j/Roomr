import * as React from "react";
import { Keyboard, StyleSheet } from "react-native";
import {
  Text,
  View,
  Button,
  TextInput,
  ButtonWithImage,
} from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { addTask } from "reduxStates/taskSlice";
import { validator } from "utils/Validations";
import ErrorView from "components/ErrorView";
import DateTimePicker from "react-native-modal-datetime-picker";
import Colors from "constants/Colors";

export default function CreateTaskModal() {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const [errorCode, setErrorCode] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const dateFormat = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const [selectedDate, setSelectedDate] = useState(new Date());

  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    const taskNameValidation = validator(taskName, "taskName");
    if (!taskNameValidation.success) {
      setErrorCode(taskNameValidation.error);
      return;
    }
    const payload = {
      content: taskName,
      houseID: houseID,
      email: email,
      due: selectedDate.toString(),
    };
    dispatch(addTask(payload));
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
      <Button
        onPress={showDatePicker}
        style={styles.input}
        darkColor={Colors.dark.textBackground}
        lightColor={Colors.light.textBackground}
      >
        <Text style={styles.dateText}>
          {selectedDate.toLocaleDateString("en-US", dateFormat)}
        </Text>
      </Button>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
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
  input: {
    width: "90%",
    height: 50,
    marginTop: 12,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 20,
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
