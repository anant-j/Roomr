import * as React from "react";
import {
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
} from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";
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
import CircleWithInitialsNumbered from "../../components/CircleWithInitialsNumbered";

CreateTask.propTypes = {
  route: PropTypes.object,
};

export default function CreateTask({ route }) {
  const { taskToEdit } = route.params;
  const isEditMode = Object.keys(taskToEdit).length > 0;
  const occurenceDateFormat = "MMMM DD YYYY";
  const dateTextFormat = "dddd, MMMM DD, YYYY";
  const navigation = useNavigation();
  const [taskName, setTaskName] = useState(
    taskToEdit.content ? taskToEdit.content : "",
  );
  const [notes, setNotes] = useState(taskToEdit.notes ? taskToEdit.notes : "");
  const [errorCode, setErrorCode] = useState(null);
  const [isStartDatePickerVisible, setStartDatePickerVisibility] =
    useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [selectedStartDate, setSelectedStartDate] = useState(
    taskToEdit.due ? new Date(taskToEdit.due) : new Date(),
  );
  const [selectedEndDate, setSelectedEndDate] = useState(
    new Date(moment(selectedStartDate).add(1, "days").toString()),
  );
  const SOLO = "solo";
  const SPLIT = "split";
  const [taskAssignType, setTaskAssignType] = useState(SOLO);
  const repeatOptions = { 0: "never", 1: "daily", 2: "weekly", 3: "monthly" };
  const [repeatType, setRepeatType] = useState(repeatOptions[0]);
  const scrollRef = useRef(null);

  const { showActionSheetWithOptions } = useActionSheet();

  const onAssignTypePressed = () => {
    showActionSheetWithOptions(
      {
        options: [
          `${SOLO.charAt(0).toUpperCase() + SOLO.slice(1)}`,
          `${SPLIT.charAt(0).toUpperCase() + SPLIT.slice(1)}`,
          "cancel",
        ],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          setTaskAssignType(SOLO);
          Keyboard.dismiss();
        }
        if (buttonIndex == 1) {
          setTaskAssignType(SPLIT);
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
      title: isEditMode ? "Edit Task" : "Create Task",
    });
  }, [navigation, taskToEdit]);

  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const { tenants } = useAppSelector((state) => state.users);
  const assignOrder = Object.keys(tenants);
  const [usersOrder, setUsersOrder] = useState(assignOrder);
  const [excludedUsers, setExcludedUsers] = useState([]);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();

  const showStartDatePicker = () => {
    setStartDatePickerVisibility(true);
  };

  const showEndDatePicker = () => {
    setEndDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setStartDatePickerVisibility(false);
    setEndDatePickerVisibility(false);
  };

  const handleConfirmStartDate = (date) => {
    setSelectedStartDate(date);
    const endDate = moment(date).add(1, "days").format(occurenceDateFormat);
    setSelectedEndDate(new Date(endDate));
    hideDatePicker();
    Keyboard.dismiss();
  };

  const handleConfirmEndDate = (date) => {
    setSelectedEndDate(date);
    hideDatePicker();
    Keyboard.dismiss();
  };

  const genOccurrences = () => {
    let dueDates = [];

    switch (repeatType) {
      case "never": {
        const assignedTo = taskAssignType === SOLO ? email : usersOrder[0];
        const dueDate = moment(selectedStartDate).format(occurenceDateFormat);
        const occs = {
          [dueDate]: { assignedTo: assignedTo, completed: false },
        };
        return occs;
      }
      case "daily": {
        const endDate = moment(selectedEndDate)
          .add(1, "days")
          .format(occurenceDateFormat);
        dueDates = new RRule({
          freq: RRule.DAILY,
          dtstart: new Date(selectedStartDate),
          until: new Date(endDate),
          count: 366,
          interval: 1,
        }).all();
        break;
      }
      case "weekly": {
        dueDates = new RRule({
          freq: RRule.WEEKLY,
          dtstart: new Date(selectedStartDate),
          until: new Date(selectedEndDate),
          count: 53,
          interval: 1,
        }).all();
        break;
      }
      case "monthly": {
        dueDates = new RRule({
          freq: RRule.MONTHLY,
          dtstart: new Date(selectedStartDate),
          until: new Date(selectedEndDate),
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
      if (assignIndex >= usersOrder.length) {
        assignIndex = 0;
      }
      const newAcc = {
        ...acc,
        [formattedDate]: {
          assignedTo: taskAssignType === SOLO ? email : usersOrder[assignIndex],
          completed: false,
        },
      };
      assignIndex += 1;
      return newAcc;
    }, {});
    return occs;
  };

  const moveUpOrder = (item) => {
    const index = usersOrder.indexOf(item);
    if (index > 0) {
      const newOrder = [...usersOrder];
      newOrder.splice(index, 1);
      newOrder.splice(index - 1, 0, item);
      setUsersOrder(newOrder);
    }
  };

  const excludeUser = (user) => {
    const newExcludedUsers = [...excludedUsers];
    newExcludedUsers.push(user);
    setExcludedUsers(newExcludedUsers);
    const newUsers = [...usersOrder];
    newUsers.splice(newUsers.indexOf(user), 1);
    setUsersOrder(newUsers);
  };

  const includeUser = (user) => {
    const newExcludedUsers = [...excludedUsers];
    newExcludedUsers.splice(newExcludedUsers.indexOf(user), 1);
    setExcludedUsers(newExcludedUsers);
    const newUsers = [...usersOrder];
    newUsers.push(user);
    setUsersOrder(newUsers);
  };

  const renderOrderedList = () => {
    return (
      <View>
        <View>
          {usersOrder && usersOrder.length > 0 && (
            <Text
              style={{
                alignSelf: "center",
                paddingTop: 10,
                textAlign: "center",
              }}
            >
              Scheduling order:
            </Text>
          )}
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              paddingTop: 10,
            }}
          >
            {usersOrder &&
              usersOrder.length > 0 &&
              usersOrder.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={item}
                    onPress={() => {
                      moveUpOrder(item);
                    }}
                    onLongPress={() => {
                      excludeUser(item);
                    }}
                  >
                    <CircleWithInitialsNumbered
                      email={item}
                      position={index + 1}
                    ></CircleWithInitialsNumbered>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
        <View>
          {excludedUsers.length > 0 ? (
            <Text
              style={{
                alignSelf: "center",
                paddingTop: 10,
                textAlign: "center",
              }}
            >
              Excluded from task:
            </Text>
          ) : (
            <Text
              style={{
                paddingTop: 10,
                paddingHorizontal: 20,
                textAlign: "center",
              }}
            >
              Tap on a user to move them up in the scheduling order.
              {"\n\n"}
              Hold on a user to add/remove them from the task.
            </Text>
          )}
          <View style={{ flexDirection: "row", paddingTop: 10 }}>
            {excludedUsers.length > 0 &&
              excludedUsers.map((item) => {
                return (
                  <TouchableOpacity
                    key={item}
                    onLongPress={() => {
                      includeUser(item);
                    }}
                  >
                    <CircleWithInitialsNumbered
                      email={item}
                      position={-1}
                    ></CircleWithInitialsNumbered>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>
      </View>
    );
  };
  const handleAddTask = () => {
    Keyboard.dismiss();
    const taskNameValidation = validator(taskName, "taskName");
    if (!taskNameValidation.success) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      setErrorCode(taskNameValidation.error);
      return;
    }
    if (usersOrder.length === 0 && taskAssignType !== SOLO) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      setErrorCode("no-users-to-add");
      return;
    }
    if (
      usersOrder.length > 1 &&
      repeatType === "never" &&
      taskAssignType !== SOLO
    ) {
      scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
      setErrorCode("multiple-users-and-never-repeat");
      return;
    }

    if (isEditMode) {
      const payload = {
        ...taskToEdit,
        content: taskName,
        oldDueDate: taskToEdit.due,
        newDueDate: selectedStartDate.toString(),
        notes: notes,
      };
      dispatch(editTask(payload));
    } else {
      const occurrences = genOccurrences();
      if (
        taskAssignType !== SOLO &&
        repeatType !== "never" &&
        Object.keys(occurrences).length < usersOrder.length
      ) {
        scrollRef.current.scrollTo({ x: 0, y: 0, animated: true });
        setErrorCode("more-users-than-occurrences");
        return;
      }
      const payload = {
        content: taskName,
        houseID: houseID,
        email: email,
        due: selectedStartDate.toString(),
        notes: notes,
        repeatType: repeatType,
        occurrences: occurrences,
        usersInvolved: taskAssignType === SOLO ? [email] : usersOrder,
      };
      dispatch(addTask(payload));
    }
    navigation.goBack();
  };

  return (
    <ScrollView
      ref={scrollRef}
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 100,
      }}
      // style={{ bottom: 100 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.container}>
        <ErrorView errorCode={errorCode} setErrorCode={setErrorCode} />
        <TextInput
          style={styles.input}
          onChangeText={setTaskName}
          placeholder="Task Name"
          value={taskName}
        />
        {/* note: when editing a task, user should not be able to change assign type */}
        {!isEditMode && (
          <Button
            onPress={onAssignTypePressed}
            style={styles.input}
            darkColor={Colors.dark.textBackground}
            lightColor={Colors.light.textBackground}
          >
            <Text style={styles.inputText}>type: {taskAssignType}</Text>
            {taskAssignType === SOLO ? (
              <Ionicons
                name="person"
                size={24}
                color={Colors[colorScheme].text}
              />
            ) : (
              <FontAwesome
                name="group"
                size={24}
                color={Colors[colorScheme].text}
              />
            )}
          </Button>
        )}
        {!isEditMode && taskAssignType === SPLIT && renderOrderedList()}
        <Button
          onPress={showStartDatePicker}
          style={styles.input}
          darkColor={Colors.dark.textBackground}
          lightColor={Colors.light.textBackground}
        >
          <Text style={styles.inputText}>
            {moment(selectedStartDate).format(dateTextFormat)}
          </Text>
          <MaterialIcons
            name="date-range"
            size={24}
            color={Colors[colorScheme].text}
          />
        </Button>
        {/* note: when editing a task, user should not be able to change recurrence */}
        {!isEditMode && (
          <Button
            onPress={onRepeatPressed}
            style={styles.input}
            darkColor={Colors.dark.textBackground}
            lightColor={Colors.light.textBackground}
          >
            <Text style={styles.inputText}>repeats: {repeatType}</Text>
            <FontAwesome
              name="repeat"
              size={24}
              color={Colors[colorScheme].text}
            />
          </Button>
        )}
        {repeatType !== "never" && (
          <Button
            onPress={showEndDatePicker}
            style={styles.input}
            darkColor={Colors.dark.textBackground}
            lightColor={Colors.light.textBackground}
          >
            <Text style={styles.inputText}>
              Until: {moment(selectedEndDate).format(dateTextFormat)}
            </Text>
            <MaterialIcons
              name="date-range"
              size={24}
              color={Colors[colorScheme].text}
            />
          </Button>
        )}
        {/* start date picker */}
        <DateTimePicker
          isVisible={isStartDatePickerVisible}
          mode="date"
          // display="inline"
          onConfirm={handleConfirmStartDate}
          onCancel={hideDatePicker}
          minimumDate={new Date()}
          date={selectedStartDate}
        />
        {/* end date picker */}
        <DateTimePicker
          isVisible={isEndDatePickerVisible}
          mode="date"
          // display="inline"
          onConfirm={handleConfirmEndDate}
          onCancel={hideDatePicker}
          minimumDate={selectedEndDate}
          date={selectedEndDate}
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
    </ScrollView>
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
    width: "90%",
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
