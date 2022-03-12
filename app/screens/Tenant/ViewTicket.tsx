import * as React from "react";
import { StyleSheet } from "react-native";
import { Text, View } from "components/Themed";
import TicketList from "components/TicketList";

export default function ViewTicket() {
  return (
    <View style={styles.container}>
      <View style={styles.tasksWrapper}>
        <View style={styles.titleWrapper}>
          <Text style={styles.sectionTitle}>Upcoming Tickets</Text>
        </View>
        <TicketList />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 35,
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
    width: "100%",
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold"
  },
});
