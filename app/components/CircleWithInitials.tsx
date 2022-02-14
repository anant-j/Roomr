import { useAppSelector } from "hooks/typedHooks";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import PropTypes from "prop-types";

const CircleWithInitials = ({ email }) => {
  const { tenants } = useAppSelector((state) => state.users);
  const splitName = tenants[email].split(/(\s+)/);
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[2][0];
  return (
    <View style={styles.circle}>
      <Text style={styles.initials}>{fnameInitial + lNameInitial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 28,
    height: 28,
    borderColor: "#55BCF6",
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 50,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "bold",
    color: "#55BCF6",
    textTransform: "uppercase",
  },
});

CircleWithInitials.propTypes = {
  email: PropTypes.string,
};

export default CircleWithInitials;
