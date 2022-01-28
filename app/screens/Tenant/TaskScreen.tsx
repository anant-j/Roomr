import * as React from "react";
import { Text, View, Button } from "components/Themed";
import { StyleSheet, Keyboard } from "react-native";
import { useState } from "react";

import CircularProgress from "react-native-circular-progress-indicator";
import { addTask } from "reduxStates/taskSlice";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import TaskList from "components/TaskList";

export default function TaskScreen() {
  const { allTasks, loading, error } = useAppSelector((state) => state.tasks);
  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();

  // TODO: un-hard code the tasks
  const [task, setTask] = useState<string>("Dishes");
  const [counter, setCounter] = useState<number>(0);
  const defaultTasks = ["Laundry", "Garbage", "Vacuum"];

  // TODO plan the logic of the percentage value and how it changes/to what
  const [percentage, setPercentage] = useState<number>(0);

  const handleAddTask = () => {
    Keyboard.dismiss();

    setTask(`${defaultTasks[counter]}`);
    setCounter(counter + 1);

    if (counter >= 2) {
      setCounter(0);
    }
    if (percentage > 10) {
      setPercentage(percentage - 10);
    }
    dispatch(addTask(task, houseID, email));
  };

  // const completeTask = (index: number) => {
  //   dispatch(removeTask(index));
  // if (percentage < 90) {
  //   setPercentage(percentage + 10);
  // }
  // };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.sectionSubTitle}>Tenant</Text>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>All Tasks</Text>
          </View>
          <View style={styles.circularWrapper}>
            <CircularProgress
              value={percentage}
              valueSuffix={"%"}
              titleFontSize={20}
              circleBackgroundColor="transparent"
              inActiveStrokeColor="gray"
              activeStrokeColor="#5B8DCA"
              radius={120}
              duration={2000}
              textColor={"#5B8DCA"}
              maxValue={100}
              title={"COMPLETE"}
              titleColor={"gray"}
              titleStyle={{
                fontSize: 15,
              }}
            />
          </View>
          {error && (
            <Text style={styles.sectionTitle}>Error Fetching Tasks</Text>
          )}
          {loading ? (
            <Text style={styles.sectionTitle}>Loading...</Text>
          ) : (
            <TaskList />
          )}
        </View>
      </View>
      <Button onPress={handleAddTask} style={styles.bottomContainer}>
        <Text style={styles.buttonText}>Add Task</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionSubTitle: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "#8A8F9E",
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  circularWrapper: {
    display: "flex",
    alignItems: "center",
  },
  topContainer: {
    // flex: 1,
    maxHeight: "50%",
    marginBottom: "65%",
  },
  bottomContainer: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
});
