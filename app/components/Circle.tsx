import React from "react";
import { StyleSheet } from "react-native";
import { View } from "./Themed";
const Circle = (props: any) => {
  return <View style={[styles.circle, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  circle: {
    backgroundColor: "white",
    width: 29,
    height: 29,
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 85,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Circle;
