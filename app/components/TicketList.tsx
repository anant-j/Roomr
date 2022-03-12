import * as React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { View } from "components/Themed";
import { StyleSheet } from "react-native";
import { useAppSelector } from "hooks/typedHooks";
import PropTypes from "prop-types";
import Ticket from "components/Ticket";

TicketList.propTypes = {
  selectedDate: PropTypes.string,
  hideCompleted: PropTypes.bool,
};

export default function TicketList() {
  const allTickets = useAppSelector((state) => state.tickets.allTickets);

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
      }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.items}>
        {allTickets.length > 0 && <ViewTicketList tickets={allTickets} />}
      </View>
    </ScrollView>
  );
}

const ViewTicketList = ({ tickets }) => {
  return tickets.map((item, index) => {
    return (
      <TouchableOpacity key={index}>
        <Ticket ticket={item} />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </TouchableOpacity>
    );
  });
};

const styles = StyleSheet.create({
  items: {
    marginTop: 10,
    marginBottom: 10,
  },
  separator: {
    height: 1,
  },
  emptyState: {
    alignSelf: "center",
    marginTop: 15,
    textTransform: "uppercase",
    fontSize: 15,
  },
  completedText: {
    fontSize: 15,
    marginTop: 25,
    textTransform: "uppercase",
  },
});
