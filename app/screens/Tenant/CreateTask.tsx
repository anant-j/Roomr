import * as React from "react";
import { Keyboard, StyleSheet, Switch } from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { addTask, editTask } from "reduxStates/taskSlice";
import { validator } from "utils/Validations";
import ErrorView from "components/ErrorView";
import DateTimePicker from "react-native-modal-datetime-picker";
import Colors from "constants/Colors";
import {
  MaterialIcons,
  Entypo,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import useColorScheme from "hooks/useColorScheme";
import PropTypes from "prop-types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import moment from "moment";
import { RRule } from "rrule";

CreateTask.propTypes = {
  route: PropTypes.object,
};

export default function CreateTask({ route }) {
  const { taskToEdit } = route.params;
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState(
    taskToEdit.content ? taskToEdit.content : "",
  );
  const [notes, setNotes] = useState(taskToEdit.notes ? taskToEdit.notes : "");
  const [errorCode, setErrorCode] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    taskToEdit.due ? new Date(taskToEdit.due) : new Date(),
  );
  const [taskAssignType, setTaskAssignType] = useState("personal");
  const repeatOptions = { 0: "never", 1: "daily", 2: "weekly", 3: "monthly" };
  const [repeatType, setRepeatType] = useState(repeatOptions[0]);

  const { showActionSheetWithOptions } = useActionSheet();

  const onAssignTypePressed = () => {
    showActionSheetWithOptions(
      {
        options: ["Personal", "Group", "cancel"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          setTaskAssignType("personal");
          Keyboard.dismiss();
        }
        if (buttonIndex == 1) {
          setTaskAssignType("group");
          Keyboard.dismiss();
        }
      },
    );
  };

  const onRepeatPressed = () => {
    showActionSheetWithOptions(
      {
        options: ["Never", "Daily", "Weekly", "Monthly", "cancel"],
        cancelButtonIndex: 4,
      },
      (buttonIndex) => {
        if (buttonIndex != 4) {
          setRepeatType(repeatOptions[buttonIndex]);
          Keyboard.dismiss();
        }
      },
    );
  };

  // set the title of the modal based on if we got a task param (in the case of edit task)
  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: Object.keys(taskToEdit).length > 0 ? "Edit Task" : "Create Task",
    });
  }, [navigation, taskToEdit]);

  const dateFormat = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const { tenants } = useAppSelector((state) => state.users);
  const assignOrder = Object.keys(tenants);
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

  const occurenceDateFormat = "MMMM DD YYYY";

  const genOccurrences = () => {
    let dueDates = [];

    switch (repeatType) {
      case "never": {
        const assignTo = taskAssignType === "personal" ? email : email;
        const dueDate = moment(selectedDate).format(occurenceDateFormat);
        const occs = { [dueDate]: { assignedTo: assignTo, completed: false } };
        return occs;
      }
      case "daily": {
        // set the selected date 1 back so the rrule library starts at selectedDate
        const startDate = moment(selectedDate)
          .subtract(1, "days")
          .format(occurenceDateFormat);
        dueDates = new RRule({
          freq: RRule.DAILY,
          dtstart: new Date(startDate),
          count: 366,
          interval: 1,
        }).all();
        break;
      }
      case "weekly": {
        const startDate = moment(selectedDate)
          .subtract(1, "weeks")
          .format(occurenceDateFormat);
        dueDates = new RRule({
          freq: RRule.WEEKLY,
          dtstart: new Date(startDate),
          count: 53,
          interval: 1,
        }).all();
        break;
      }
      case "monthly": {
        const startDate = moment(selectedDate)
          .subtract(1, "months")
          .format(occurenceDateFormat);
        dueDates = new RRule({
          freq: RRule.MONTHLY,
          dtstart: new Date(startDate),
          count: 13,
          interval: 1,
        }).all();
        break;
      }
      default:
        break;
    }
    let assignIndex = 0;
    const occs = dueDates.reduce((acc, date) => {
      const formattedDate = moment(date).format(occurenceDateFormat);
      if (assignIndex >= assignOrder.length) {
        assignIndex = 0;
      }
      const newAcc = {
        ...acc,
        [formattedDate]: {
          assignTo:
            taskAssignType === "personal" ? email : assignOrder[assignIndex],
          completed: false,
        },
      };
      assignIndex += 1;
      return newAcc;
    }, {});
    return occs;
  };

  const handleAddTask = () => {
    Keyboard.dismiss();
    const taskNameValidation = validator(taskName, "taskName");
    if (!taskNameValidation.success) {
      setErrorCode(taskNameValidation.error);
      return;
    }
    const occurrences = genOccurrences();
    if (Object.keys(taskToEdit).length > 0) {
      const payload = {
        ...taskToEdit,
        content: taskName,
        due: selectedDate.toString(),
        notes: notes,
      };
      dispatch(editTask(payload));
    } else {
      const payload = {
        content: taskName,
        houseID: houseID,
        email: email,
        due: selectedDate.toString(),
        notes: notes,
        repeatType: repeatType,
        occurrences: occurrences,
      };
      dispatch(addTask(payload));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ErrorView errorCode={errorCode} setErrorCode={setErrorCode} />
      <TextInput
        style={styles.input}
        onChangeText={setTaskName}
        placeholder="Task Name"
        value={taskName}
      />
      <Button
        onPress={onAssignTypePressed}
        style={styles.input}
        darkColor={Colors.dark.textBackground}
        lightColor={Colors.light.textBackground}
      >
        <Text style={styles.inputText}>type: {taskAssignType}</Text>
        {taskAssignType === "personal" ? (
          <Ionicons name="person" size={24} color={Colors[colorScheme].text} />
        ) : (
          <FontAwesome
            name="group"
            size={24}
            color={Colors[colorScheme].text}
          />
        )}
      </Button>
      <Button
        onPress={showDatePicker}
        style={styles.input}
        darkColor={Colors.dark.textBackground}
        lightColor={Colors.light.textBackground}
      >
        <Text style={styles.inputText}>
          {selectedDate.toLocaleDateString("en-US", dateFormat)}
        </Text>
        <MaterialIcons
          name="date-range"
          size={24}
          color={Colors[colorScheme].text}
        />
      </Button>
      <Button
        onPress={onRepeatPressed}
        style={styles.input}
        darkColor={Colors.dark.textBackground}
        lightColor={Colors.light.textBackground}
      >
        <Text style={styles.inputText}>repeats: {repeatType}</Text>
        <FontAwesome name="repeat" size={24} color={Colors[colorScheme].text} />
      </Button>
      <DateTimePicker
        isVisible={isDatePickerVisible}
        mode="date"
        display="inline"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
        date={selectedDate}
      />
      <View style={styles.notesContainer}>
        <TextInput
          style={[styles.input, styles.notesInput]}
          onChangeText={setNotes}
          placeholder="Notes"
          maxLength={50}
          value={notes}
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
    marginTop: 18,
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
    marginTop: 18,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  inputText: {
    fontSize: 20,
    fontWeight: "500",
    textTransform: "capitalize",
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
