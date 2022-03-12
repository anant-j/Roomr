import * as React from "react";
import { Text, View, ButtonWithImage } from "components/Themed";
import { RootTabScreenProps } from "types";
import { Image, StyleSheet } from "react-native";
import TaskList from "components/TaskList";
import moment from "moment";

export default function HomeScreen({
  navigation,
}: RootTabScreenProps<"TabOne">) {
  return (
    <View style={styles.container}>
      {/* Added this scroll view to enable scrolling when list gets longer than the page */}

      <View style={styles.topContainer}>
        {/* Today's Tasks */}
        <Text style={styles.sectionSubTitle}>Tenant</Text>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>Upcoming Tasks</Text>
          </View>
          <TaskList
            selectedDate={moment(new Date()).format("MMMM YYYY")}
            hideCompleted={true}
          />
        </View>
      </View>

      <ButtonWithImage
        style={styles.btn}
        onPress={() => navigation.navigate("ViewTicket")}
      >
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>View Tickets</Text>
        </View>
        <Image
          source={require("assets/tenant/home_screen_1.png")}
          style={styles.img}
        />
      </ButtonWithImage>
      <ButtonWithImage
        style={styles.btn}
        onPress={() => navigation.navigate("CreateTicket")}
      >
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>Create Landlord</Text>
          <Text style={styles.buttonText}>Support Ticket</Text>
        </View>
        <Image
          source={require("assets/tenant/home_screen_2.png")}
          style={styles.img}
        />
      </ButtonWithImage>
      <ButtonWithImage
        style={styles.btn}
        onPress={() => navigation.navigate("ReportEmergency")}
      >
        <View style={styles.buttonTextView}>
          <Text style={styles.buttonText}>Report</Text>
          <Text style={styles.buttonText}>Emergency</Text>
        </View>
        <Image
          source={require("assets/tenant/home_screen_3.png")}
          style={styles.img}
        />
      </ButtonWithImage>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#E8EAED',
  },
  topContainer: {
    flex: 1,
    // maxHeight: "45%",
  },
  tasksWrapper: {
    paddingTop: 10,
    paddingHorizontal: 30,
    paddingBottom: 80,
  },
  sectionSubTitle: {
    fontSize: 17,
    // fontWeight: 'bold',
    color: "#8A8F9E",
    paddingTop: 15,
    paddingHorizontal: 30,
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
  buttonTextView: {
    paddingHorizontal: 10,
    marginTop: 40,
    // bottom: 0,
    backgroundColor: "transparent",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
  img: {},
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 10,
    marginHorizontal: 25,
    marginVertical: 5,
    padding: 15,
  },
});
