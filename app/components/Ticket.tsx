import React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "./Themed";

const Ticket = (props: any) => {
  const { content, createdOn } = props.ticket;

  const dateFormat = {
    month: "long",
    day: "numeric",
  };

  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <Text
          style={styles.itemText}
          lightColor="rgba(0,0,0,0.8)"
          darkColor="rgba(255,255,255,0.8)"
        >
          {content}
        </Text>
      </View>
      <View>
        <Text style={styles.itemDate}>
          {new Date(createdOn).toLocaleDateString("en-US", dateFormat)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    // backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%"
    // marginBottom: 20,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  itemText: {
    fontSize: 17,
    fontWeight: "500",
    // maxWidth: "80%",
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "400",
  },
});

export default Ticket;
