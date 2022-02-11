import * as React from "react";
import Task from "components/Task";
import { ScrollView, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { completeTaskThunk } from "reduxStates/taskSlice";
import moment from "moment";
import { useEffect, useState } from "react";

export default function TaskList(props: any) {
  const selectedDate = props.selectedDate;
  const allTasks = useAppSelector((state) => state.tasks.allTasks);
  const dispatch = useAppDispatch();

  const [filteredAllTasks, setFilteredAllTasks] = useState([]);

  const filterTaskByDate = (task) => {
    const taskMonth = moment(task.due).format("MMMM YYYY");
    return taskMonth == selectedDate;
  };

  useEffect(() => {
    const filteredAllTasks = allTasks.filter(filterTaskByDate);
    setFilteredAllTasks(filteredAllTasks);
  }, [allTasks, selectedDate]);

  const completeTask = (id: string) => {
    dispatch(completeTaskThunk(id));
  };

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.items}>
        {filteredAllTasks.length == 0 && (
          <Text style={styles.emptyState}>No Tasks This Month!</Text>
        )}
        {filteredAllTasks &&
          filteredAllTasks.map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => completeTask(item.id)}
              >
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
});
