import { useAppSelector } from "hooks/typedHooks";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import PropTypes from "prop-types";

const CircleWithInitialsNumbered = ({ email, position }) => {
  const { tenants } = useAppSelector((state) => state.users);
  const splitName = tenants[email].split(/(\s+)/);
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[2][0];
  return (
    <View style={styles.circle}>
      <Text style={styles.initials}>{fnameInitial + lNameInitial}</Text>
      <Text  style={styles.bottomRight}>{position}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 45,
    height: 45,
    borderColor: "#55BCF6",
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 50,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    marginBottom: 15,
    fontWeight: "bold",
    color: "#55BCF6",
    textTransform: "uppercase",
  },
  bottomRight:{
    position: "absolute",
    bottom: 5,
    fontWeight: "bold",
  }
});

CircleWithInitialsNumbered.propTypes = {
  email: PropTypes.string,
  position: PropTypes.number,
};

export default CircleWithInitialsNumbered;
