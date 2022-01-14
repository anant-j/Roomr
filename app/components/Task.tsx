import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text, View } from './Themed';
const Task = (props:any) => {

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
       
        <Text style={styles.itemText}
        lightColor="rgba(0,0,0,0.8)"
        darkColor="rgba(255,255,255,0.8)" >{props.text}</Text>
         <View style={styles.circle}></View>
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
    marginLeft: 15,
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