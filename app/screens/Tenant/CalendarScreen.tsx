import { useAppSelector } from "hooks/typedHooks";
import React, { useState, useEffect } from "react";
import { StyleSheet, Alert, View, useColorScheme } from "react-native";
import { Button, Text } from "components/Themed";
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
      theme["dayTextColor"] = "#e6e3e3";
      theme["itemBGColor"] = "#373737";
      theme["agendaDayTextColor"] = "#00BBF2";
      theme["agendaDayNumColor"] = "#00BBF2";
      theme["monthTextColor"] = "#e6e3e3";
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
  if (current.completed) {
    return { ...acc };
  }
  const timeZoneOffset = new Date().getTimezoneOffset() * 60000;
  const thisDayObject: any = new Date(current.due);
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

  return (
    <Button
      style={[styles.item, { height: reservation.height }]}
      lightColor="#fff"
      darkColor="#5e5d5d"
      onPress={() => Alert.alert(reservation.name)}
    >
      <Text
        style={{ fontSize }}
        lightColor="rgba(0,0,0,0.8)"
        darkColor="rgba(255,255,255,0.8)"
      >
        {reservation.name}
      </Text>
    </Button>
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
