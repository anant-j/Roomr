import { useAppSelector } from "hooks/typedHooks";
import * as React from "react";
import { useState } from "react";
import { Agenda, AgendaSchedule, DateData } from "react-native-calendars";
import AgendaScreen from "./AgendaScreen";
// import AgendaScreen from "./AgendaScreen";

interface AgendaState {
  items?: AgendaSchedule;
}

export default function CalendarScreen() {
  // return <AgendaScreen />;

  const { allTasks } = useAppSelector((state) => state.tasks);

  const initAgenda: AgendaState = { items: undefined };
  const [calendarItems, setCalendarItems] = useState({ items: undefined });

  return (
    <Agenda
      items={calendarItems}
      loadItemsForMonth={(day) => loadTasksThisMonth(day, allTasks)}
    />
  );
}

const loadTasksThisMonth = (day: DateData, allTasks) => {
  console.log(allTasks);
};
