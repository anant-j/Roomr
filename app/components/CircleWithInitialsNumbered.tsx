import { useAppSelector } from "hooks/typedHooks";
import React from "react";
import { StyleSheet } from "react-native";
import { View, Text } from "./Themed";
import PropTypes from "prop-types";

const CircleWithInitialsNumbered = ({ email, position }) => {
  const { tenants } = useAppSelector((state) => state.users);
  if (!tenants) return null;
  const splitName = tenants[email].split(/(\s+)/);
  if (!splitName) return null;
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[2][0];
  if (position >= 0) {
    return (
      <View style={styles.circle}>
        <Text style={[styles.initials, styles.initialsRaised]}>
          {fnameInitial + lNameInitial}
        </Text>
        <Text style={styles.bottomRight}>{position}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.circle, styles.redCircle]}>
      <Text style={styles.initials}>{fnameInitial + lNameInitial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  circle: {
    width: 45,
    height: 45,
    borderColor: "#55BCF6",
    borderWidth: 2,
    // opacity: 0.8,
    borderRadius: 50,
    marginLeft: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  redCircle: {
    borderColor: "#FF0000",
  },
  initials: {
    fontWeight: "bold",
    color: "#55BCF6",
    textTransform: "uppercase",
  },
  initialsRaised: {
    marginBottom: 15,
  },
  bottomRight: {
    position: "absolute",
    bottom: 5,
    fontWeight: "bold",
  },
});

CircleWithInitialsNumbered.propTypes = {
  email: PropTypes.string,
  position: PropTypes.number,
};

export default CircleWithInitialsNumbered;
