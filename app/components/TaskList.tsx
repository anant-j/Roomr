import * as React from "react";
import Task from "components/Task";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import {
  completeTaskThunk,
  setCompletionPercentage,
} from "reduxStates/taskSlice";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TaskList(props: any) {
  const selectedDate = props.selectedDate;
  const allTasks = useAppSelector((state) => state.tasks.allTasks);
  const dispatch = useAppDispatch();

  const [todoTasks, setTodoTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const filterTaskByDate = (task) => {
    const taskMonth = moment(new Date(task.due)).format("MMMM YYYY");
    return taskMonth == selectedDate;
  };

  useEffect(() => {
    const filteredAllTasks = allTasks.filter(filterTaskByDate);

    // Separate filteredTasks into todo and completed
    const tasksTodoAndCompleted = filteredAllTasks.reduce(
      (acc: any, task: any) => {
        if (task.completed) {
          return { ...acc, completed: [...acc.completed, task] };
        } else {
          return { ...acc, todo: [...acc.todo, task] };
        }
      },
      { todo: [], completed: [] },
    );
    const { todo, completed } = tasksTodoAndCompleted;
    setTodoTasks(todo);
    setCompletedTasks(completed);

    const numTodo = todo.length;
    const numCompleted = completed.length;
    const percentage =
      numTodo == 0 && numCompleted == 0
        ? 0
        : (numCompleted / (numTodo + numCompleted)) * 100;
    dispatch(setCompletionPercentage(percentage));
  }, [allTasks, selectedDate]);

  const completeTask = (task: object) => {
    dispatch(completeTaskThunk(task));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.items}>
        {todoTasks.length == 0 && completedTasks.length == 0 && (
          <Text style={styles.emptyState}>No Tasks This Month!</Text>
        )}
        {todoTasks &&
          todoTasks.map((item, index) => {
            return (
              // <>
              <TouchableOpacity key={index} onPress={() => completeTask(item)}>
                <Task task={item} />
                <View
                  style={styles.separator}
                  lightColor="#eee"
                  darkColor="rgba(255,255,255,0.1)"
                />
              </TouchableOpacity>
              // </>
            );
          })}
        {completedTasks.length > 0 && (
          <Text style={styles.completedText}>Completed Tasks:</Text>
        )}
        {completedTasks.length > 0 &&
          completedTasks.map((item, index) => {
            return (
              <TouchableOpacity key={index}>
                <Task task={item} />
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
  );
}

const styles = StyleSheet.create({
  items: {
    marginTop: 10,
    marginBottom: 10,
  },
  separator: {
    height: 1,
  },
  emptyState: {
    alignSelf: "center",
    marginTop: 15,
    textTransform: "uppercase",
    fontSize: 15,
  },
  completedText: {
    fontSize: 15,
    marginTop: 25,
    textTransform: "uppercase",
  },
});
