import * as React from "react";
// import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { RootTabScreenProps } from "../../types";
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform } from 'react-native';
import Task from '../../components/Task';
import { useState } from "react";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [task, setTask] = useState<string | undefined>();
  const [taskItems, setTaskItems] = useState<any[]>([]);
  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setTask("");
  }

  const completeTask = (index:number) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }
  return (
    <View style={styles.container}>
        {/* Added this scroll view to enable scrolling when list gets longer than the page */}
        <ScrollView
        contentContainerStyle={{
          flexGrow: 1
        }}
        keyboardShouldPersistTaps='handled'
      >

      {/* Today's Tasks */}
      <Text style={styles.sectionSubTitle}>Landlord</Text>
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
        <View style={styles.items}>
          {/* This is where the tasks will go! */}
          {
            taskItems.map((item, index) => {
              return (
                <TouchableOpacity key={index} 
                 onPress={() => completeTask(index)}
                 >
                  <Task text={item} /> 
                  <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </View>
        
      </ScrollView>

      {/* Write a task */}
      {/* Uses a keyboard avoiding view which ensures the keyboard does not cover the items on screen */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.writeTaskWrapper}
      >
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} 
        onChangeText={text => setTask(text)}
         />
        <TouchableOpacity
         onPress={() => handleAddTask()}
         >
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#E8EAED',
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  sectionSubTitle: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: '#8A8F9E',
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 10,
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250,
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1,
  },
  separator: {
    height: 1,
  },
  addText: {},
});
