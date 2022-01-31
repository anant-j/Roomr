import { useAppSelector } from "hooks/typedHooks";
import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Alert,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { Agenda, AgendaEntry, AgendaSchedule } from "react-native-calendars";

interface AgendaState {
  items?: AgendaSchedule;
}

export default function CalendarScreen() {
  const { allTasks } = useAppSelector((state) => state.tasks);

  const initAgendaState: AgendaState = { items: undefined };
  const [agendaState, setAgendaState] = useState(initAgendaState);
  const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  const todayInUTC: any = new Date();
  const today = new Date(todayInUTC - timeZoneOffset)
    .toISOString()
    .slice(0, 10);

  useEffect(() => {
    getTasksByDate(allTasks, setAgendaState);
  }, [allTasks]);

  const colorScheme = useColorScheme();

  const getTheme = (colorScheme) => {
    const theme = {};
    if (colorScheme === "dark") {
      // theme["color"] = "#fff";
      theme["backgroundColor"] = "#000";
      theme["calendarBackground"] = "#373737";
      theme["dayTextColor"] = "#fff";
      theme["agendaDayTextColor"] = "red";
    }

    return theme;
  };

  const [{ key, theme }, setTheme] = useState({
    key: colorScheme,
    theme: getTheme(colorScheme),
  });

  useEffect(() => {
    const theme = getTheme(colorScheme);
    setTheme({ key: colorScheme, theme: theme });
  }, [colorScheme]);

  return (
    <Agenda
      items={agendaState.items}
      selected={today}
      renderItem={renderItem}
      renderEmptyData={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      showClosingKnob={true}
      key={key}
      theme={theme}
    />
  );
}

const getTasksByDate = (allTasks, setAgendaState) => {
  const tasksByDate = allTasks.reduce(
    (acc, current) => accumulateTasks(acc, current),
    {},
  );
  const newAgendaState = { items: tasksByDate };
  setAgendaState(newAgendaState);
};

const accumulateTasks = (acc, current) => {
  const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  const thisDayObject: any = new Date(current.createdOn);
  const thisTaskDate = new Date(thisDayObject - timeZoneOffset)
    .toISOString()
    .slice(0, 10);

  const taskContent = current.content + " - " + current.createdBy;
  const agendaItem = {
    day: thisTaskDate,
    name: taskContent,
    height: 50,
  };

  return {
    ...acc,
    [thisTaskDate]: acc[thisTaskDate]
      ? [...acc[thisTaskDate], agendaItem]
      : [agendaItem],
  };
};

const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
  const fontSize = 14;
  const color = isFirst ? "black" : "#43515c";

  return (
    <TouchableOpacity
      style={[styles.item, { height: reservation.height }]}
      onPress={() => Alert.alert(reservation.name)}
    >
      <Text style={{ fontSize, color }}>{reservation.name}</Text>
    </TouchableOpacity>
  );
};

const renderEmptyDate = () => {
  return (
    <View style={styles.emptyDate}>
      <Text>No tasks today!</Text>
    </View>
  );
};

const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
  return r1.name !== r2.name;
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
    alignItems: "center",
  },
});
