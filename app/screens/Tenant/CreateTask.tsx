import * as React from "react";
import { Keyboard, StyleSheet } from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { addTask } from "reduxStates/taskSlice";
import { validator } from "utils/Validations";
import ErrorView from "components/ErrorView";
import DateTimePicker from "react-native-modal-datetime-picker";
import Colors from "constants/Colors";
import { MaterialIcons, Entypo } from "@expo/vector-icons";
import useColorScheme from "hooks/useColorScheme";

export default function CreateTask() {
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState("");
  const [notes, setNotes] = useState("");
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
  const colorScheme = useColorScheme();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
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
    console.log(selectedDate);
    const payload = {
      content: taskName,
      houseID: houseID,
      email: email,
      due: selectedDate.toString(),
      notes: notes,
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
        <MaterialIcons
          name="date-range"
          size={24}
          color={Colors[colorScheme].text}
        />
      </Button>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        display="inline"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />
      <View style={styles.notesContainer}>
        <TextInput
          style={[styles.input, styles.notesInput]}
          onChangeText={setNotes}
          placeholder="Notes"
          maxLength={50}
        />
        <View style={styles.notesIconView}>
          <Entypo name="text" size={24} color={Colors[colorScheme].text} />
        </View>
      </View>
      {notes.length > 0 ? (
        <Text style={styles.notesLimit}>{notes.length}/50</Text>
      ) : (
        <Text style={styles.notesLimit}> </Text>
      )}
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
  desc: {
    position: "absolute",
  },
  notesContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  notesLimit: {
    alignSelf: "flex-end",
    marginRight: 30,
    paddingTop: 12,
  },
  notesInput: {
    margin: 0,
    marginTop: 0,
    paddingRight: 40,
  },
  notesIconView: {
    alignSelf: "center",
    position: "absolute",
    right: 2,
    backgroundColor: "transparent",
    margin: 5,
    padding: 5,
  },
  input: {
    width: "90%",
    marginTop: 12,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
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
    // marginTop: 15,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
  },
});
