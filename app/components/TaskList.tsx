import * as React from "react";
import Task from "components/Task";
import { ScrollView, TouchableOpacity } from "react-native";
import { View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { completeTaskThunk } from "reduxStates/taskSlice";

export default function TaskList() {
  const allTasks = useAppSelector((state) => state.tasks.allTasks);
  const dispatch = useAppDispatch();

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
        {allTasks.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => completeTask(index)}>
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
});
