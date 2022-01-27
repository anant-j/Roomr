import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";
import { Feather } from "@expo/vector-icons";

const ErrorBox = (props: any) => {
  if (props.text) {
    return (
      <View style={styles.container}>
        <View style={styles.icon}>
          <Feather
            name="alert-triangle"
            size={25}
            color="red"
            style={{ marginRight: 15 }}
          />
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>{props.text}</Text>
        </View>
      </View>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#373737",
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
  },
  icon: {
    alignItems: "center",
    justifyContent: "center",
    // width: 20,
    backgroundColor: "transparent",
  },
  item: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    maxWidth: "90%",
    // marginBottom: 20,
  },
  itemText: {
    fontSize: 17,
    color: "orange",
  },
});

export default ErrorBox;
