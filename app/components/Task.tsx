import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const Task = (props:any) => {

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.circle}></View>
        <Text style={styles.itemText}>{props.text}</Text>
      </View>
      <View 
    //   style={styles.itemDate}
      >
          {/* {props.date} */}
          <Text style={styles.itemDate}>Nov 15</Text>
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  item: {
    // backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  circle: {
    width: 24,
    height: 24,
    borderColor: '#55BCF6',
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 50,
    marginRight: 15,
  },
  itemText: {
    fontSize: 17,
    fontWeight: "500",
    maxWidth: '80%',
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "400",
   },
});

export default Task;