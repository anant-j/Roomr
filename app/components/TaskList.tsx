import * as React from "react";
import Task from "components/Task";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import {
  completeTaskThunk,
  deleteTaskThunk,
  setCompletionPercentage,
  TaskObject,
} from "reduxStates/taskSlice";
import moment from "moment";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { useNavigation } from "@react-navigation/native";

TaskList.propTypes = {
  selectedDate: PropTypes.string,
  hideCompleted: PropTypes.bool,
};

export default function TaskList({ selectedDate, hideCompleted = false }) {
  const allTasks = useAppSelector((state) => state.tasks.allTasks);
  const dispatch = useAppDispatch();
  const { showActionSheetWithOptions } = useActionSheet();

  const [todoTasks, setTodoTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  const filterTaskByDate = (task) => {
    const taskMonth = moment(new Date(task.due)).format("MMMM YYYY");
    return taskMonth == selectedDate;
  };

  const navigation = useNavigation();

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

  const onTodoTaskPress = (task: TaskObject) => {
    showActionSheetWithOptions(
      {
        options: ["Complete", "Edit", "Delete", "Cancel"],
        cancelButtonIndex: 3,
        title: task.notes ? task.notes : "",
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          completeTask(task);
        }
        if (buttonIndex === 1) {
          navigation.navigate("CreateTask", { taskToEdit: task });
        } else if (buttonIndex === 2) {
          onConfirmDelete(task);
        }
      },
    );
  };

  const onCompleteTaskPress = (task: TaskObject) => {
    showActionSheetWithOptions(
      {
        options: ["Delete", "Cancel"],
        cancelButtonIndex: 1,
        title: task.notes ? task.notes : "",
      },
      (buttonIndex) => {
        if (buttonIndex == 0) {
          onConfirmDelete(task);
        }
      },
    );
  };

  const onConfirmDelete = (task: TaskObject) => {
    showActionSheetWithOptions(
      {
        title: "Are you sure?",
        options: ["Delete", "Cancel"],
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(deleteTaskThunk(task.id));
        }
      },
    );
  };

  const completeTask = (task: TaskObject) => {
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
        {todoTasks.length > 0 && (
          <TodoTasksList
            todoTasks={todoTasks}
            onTodoTaskPress={onTodoTaskPress}
          />
        )}
        {completedTasks.length > 0 && !hideCompleted && (
          <>
            <Text style={styles.completedText}>Completed Tasks:</Text>
            <CompletedTasksList
              completedTasks={completedTasks}
              onCompleteTaskPress={onCompleteTaskPress}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
}

const TodoTasksList = ({ todoTasks, onTodoTaskPress }) => {
  return todoTasks.map((item, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => onTodoTaskPress(item)}>
        <Task task={item} />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </TouchableOpacity>
    );
  });
};

const CompletedTasksList = ({ completedTasks, onCompleteTaskPress }) => {
  return completedTasks.map((item, index) => {
    return (
      <TouchableOpacity key={index} onPress={() => onCompleteTaskPress(item)}>
        <Task task={item} />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </TouchableOpacity>
    );
  });
};

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
