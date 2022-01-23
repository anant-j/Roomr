import * as React from "react";
import { Text, View } from "components/Themed";
import {
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  ScrollView,
  Button,
} from "react-native";
import { useEffect, useState } from "react";
import Task from "components/Task";
import CircularProgress from "react-native-circular-progress-indicator";
import { addTask, removeTask } from "reduxStates/taskSlice";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";

export default function TaskScreen() {
  const { allTasks, loading, error } = useAppSelector((state) => state.tasks);
  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   dispatch<any>(fetchTasks())
  // }, []);

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
    const payload = [...allTasks, task];
    dispatch(addTask(payload));
  };

  const completeTask = (index: number) => {
    dispatch(removeTask(index));
    if (percentage < 90) {
      setPercentage(percentage + 10);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.tasksWrapper}>
          <Text style={styles.sectionSubTitle}>Tenant</Text>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>All Tasks</Text>
          </View>
          <View style={styles.circularWrapper}>
            <CircularProgress
              value={percentage}
              valueSuffix={"%"}
              titleFontSize={20}
              circleBackgroundColor="transparent"
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
            <ScrollView
              contentContainerStyle={{
                flexGrow: 1,
              }}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.items}>
                {/* This is where the tasks will go! */}
                {allTasks.map((item, index) => {
                  return (
                    <TouchableOpacity
                      // TODO: Better practice is to use unique ID of element as the key
                      key={index}
                      onPress={() => completeTask(index)}
                    >
                      <Task text={item} />
                      <View
                        style={styles.separator}
                        lightColor="#eee"
                        darkColor="rgba(255,255,255,0.1)"
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          onPress={handleAddTask}
          title="Add Task"
          color="white"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
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
  separator: {
    height: 1,
  },
  sectionSubTitle: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "#8A8F9E",
    paddingTop: 10,
    paddingHorizontal: 5,
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
  items: {
    marginTop: 10,
    marginBottom: 10,
  },
  topContainer: {
    // flex: 1,
    maxHeight: "50%",
    marginBottom: "65%",
  },
  bottomContainer: {
    backgroundColor: "#5B8DCA",
    borderRadius: 10,
    color: "black",
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    fontWeight: "bold",
  },
});
