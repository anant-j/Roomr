import * as React from "react";
// import { StyleSheet } from "react-native";
import { Text, View } from "../../components/Themed";
import { Feather } from '@expo/vector-icons';
import { RootTabScreenProps } from "../../types";
import { Image, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Keyboard, ScrollView, Platform, Button } from 'react-native';
import Task from '../../components/Task';
import { useState } from "react";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  const [task, setTask] = useState<string | undefined>("Task");
  let [counter, setCounter] = useState<number>(0);
  const [taskItems, setTaskItems] = useState<any[]>([]);
  const handleAddTask = () => {
    Keyboard.dismiss();
    setTaskItems([...taskItems, task])
    setCounter(counter + 1);
    setTask(`Task ${counter}`);
  }

  const completeTask = (index: number) => {
    let itemsCopy = [...taskItems];
    itemsCopy.splice(index, 1);
    setTaskItems(itemsCopy)
  }
  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}

      <View style={styles.topContainer}>
        {/* Today's Tasks */}
        <Text style={styles.sectionSubTitle}>Tenant</Text>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
            {/* <Text style={styles.sectionAddButton}>+</Text> */}
            <Feather name="plus-circle" size={24} onPress={handleAddTask} color="black" />
          </View>
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1
            }}
            keyboardShouldPersistTaps='handled'
          >
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
          </ScrollView>
        </View>
      </View>


      <TouchableOpacity style={styles.btn}>
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>View Tickets</Text>
        </View>
        <Image source={require('../../assets/tenant/home_screen_1.png')} style={styles.img} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>Create Landlord</Text>
          <Text style={styles.buttonText}>Support Ticket</Text>
        </View>
        <Image source={require('../../assets/tenant/home_screen_2.png')} style={styles.img} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn}>
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>Report</Text>
          <Text style={styles.buttonText}>Emergency</Text>
        </View>
        <Image source={require('../../assets/tenant/home_screen_3.png')} style={styles.img} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#E8EAED',
  },
  topContainer: {
    flex: 1,
    // maxHeight: "45%",
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  sectionSubTitle: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: '#8A8F9E',
    paddingTop: 10,
    paddingHorizontal: 30,
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 10,
    marginBottom:10,
  },
  separator: {
    height: 1,
  },
  buttonTextView: {
    paddingHorizontal: 10,
    marginTop: 40,
    // bottom: 0,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  img: {},
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 10,
    backgroundColor: '#F6F6F6',
    marginHorizontal: 25,
    marginVertical: 5,
    padding: 15
  }
});
