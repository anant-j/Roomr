import * as React from "react";
import { Text, View, Button } from "components/Themed";
import { StyleSheet } from "react-native";
import { useState } from "react";

import CircularProgress from "react-native-circular-progress-indicator";
import { useAppSelector } from "hooks/typedHooks";
import TaskList from "components/TaskList";
import { useNavigation } from "@react-navigation/native";
import DateTimePicker from "react-native-modal-datetime-picker";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { MaterialIcons } from "@expo/vector-icons";
import useColorScheme from "hooks/useColorScheme";
import moment from "moment";

export default function TicketScreen() {
  const { loading, error } = useAppSelector((state) => state.tasks);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  // TODO plan the logic of the percentage value and how it changes/to what
  const [percentage, setPercentage] = useState<number>(0);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // keep track of both the date object and date string states
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dateText, setDateText] = useState(
    moment(selectedDate).format("MMMM YYYY"),
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    const monthAndYear = moment(date).format("MMMM YYYY");
    setDateText(monthAndYear);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.sectionSubTitle}>Landlord</Text>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>All Tickets</Text>
            <Button
              onPress={showDatePicker}
              style={styles.monthPicker}
              darkColor={Colors.dark.textBackground}
              lightColor={Colors.light.textBackground}
            >
              <Text style={styles.dateText} lightColor="#fff">
                {dateText}
              </Text>
              <MaterialIcons
                name="date-range"
                size={18}
                color={Colors[colorScheme].text}
              />
            </Button>
          </View>
          <DateTimePicker
            isVisible={isDatePickerVisible}
            mode="date"
            // display="inline"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <View style={styles.circularWrapper}>
            <CircularProgress
              value={percentage}
              valueSuffix={"%"}
              titleFontSize={20}
              circleBackgroundColor="transparent"
              inActiveStrokeColor="gray"
              activeStrokeColor="#5B8DCA"
              radius={120}
              duration={2000}
              textColor={"#5B8DCA"}
              maxValue={100}
              title={"COMPLETE"}
              titleColor={"gray"}
              titleStyle={{
                fontSize: 15,
              }}
            />
          </View>
          {error && (
            <Text style={styles.sectionTitle}>Error Fetching Tickets</Text>
          )}
          {loading ? (
            <Text style={styles.sectionTitle}>Loading...</Text>
          ) : (
            <TaskList selectedDate={dateText} />
          )}
        </View>
      </View>
      <Button
        onPress={() => navigation.navigate({ name: "Create Ticket" })}
        style={styles.bottomContainer}
      >
        <Text style={styles.buttonText}>Create Ticket</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionSubTitle: {
    fontSize: 17,

    color: "#8A8F9E",
    paddingTop: 15,
    paddingHorizontal: 30,
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 30,
    fontWeight: "bold",
  },
  circularWrapper: {
    display: "flex",
    alignItems: "center",
  },
  topContainer: {
    maxHeight: "50%",
    marginBottom: "65%",
  },
  bottomContainer: {
    borderRadius: 10,
    padding: 10,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 25,
    fontWeight: "500",
    color: "white",
  },
  monthPicker: {
    padding: 6,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: { marginRight: 7, textTransform: "uppercase" },
});
