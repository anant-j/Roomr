import * as React from "react";
import {
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useState } from "react";
import { useAppSelector, useAppDispatch } from "hooks/typedHooks";
import ErrorView from "components/ErrorView";
import Colors from "constants/Colors";
import { Entypo } from "@expo/vector-icons";
import useColorScheme from "hooks/useColorScheme";
import { addTicket } from "reduxStates/ticketSlice";

export default function CreateTicket() {
  const [Name, setName] = useState("");
  const [notes, setNotes] = useState("");
  const [errorCode, setErrorCode] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const colorScheme = useColorScheme();
  const dispatch = useAppDispatch();

  const handleCreateTicket = () => {
    if (isLoading) return;
    setLoading(true);
    Keyboard.dismiss();
    if (!Name) {
      setErrorCode("MISSING_REQUIRED_FIELDS");
      setLoading(false);
      return;
    }
    dispatch(
      addTicket({
        content: Name,
        notes: notes,
        email: email,
        houseID: houseID,
      }),
    );
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ErrorView errorCode={errorCode} setErrorCode={setErrorCode} />
      <TextInput
        style={styles.input}
        onChangeText={setName}
        placeholder="What is this ticket about?"
      />
      <View style={styles.notesContainer}>
        <TextInput
          style={[styles.input, styles.notesInput]}
          onChangeText={setNotes}
          placeholder="Enter more details"
          maxLength={100}
          returnKeyType="done"
          multiline={true}
          blurOnSubmit={true}
          onSubmitEditing={() => {
            Keyboard.dismiss();
          }}
        />
        <View style={styles.notesIconView}>
          <Entypo name="text" size={24} color={Colors[colorScheme].text} />
        </View>
      </View>
      {notes.length > 0 ? (
        <Text style={styles.notesLimit}>{notes.length}/100</Text>
      ) : (
        <Text style={styles.notesLimit}> </Text>
      )}
      <Text></Text>
      <Text></Text>
      <Text style={styles.textCentered}>
        Creating a ticket will notify your landlord and be visible to all
        tenants. {"\n"}
        Tickets are due 2 weeks from the day they are created
      </Text>
      <Text></Text>
      <Button onPress={handleCreateTicket} style={styles.buttonContainer}>
        {!isLoading ? (
          <Text style={styles.buttonText}>Create Ticket</Text>
        ) : (
          <ActivityIndicator color={"black"}></ActivityIndicator>
        )}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  textCentered: {
    textAlign: "center",
    width: "80%",
  },
  divider: {
    borderWidth: 1,
    width: "90%",
    borderColor: "black",
    margin: 10,
  },
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 35,
  },
  desc: {
    position: "absolute",
  },
  notesContainer: {
    flexDirection: "row",
    marginTop: 12,
  },
  notesLimit: {
    alignSelf: "flex-end",
    marginRight: 30,
    paddingTop: 12,
  },
  notesInput: {
    margin: 0,
    marginTop: 0,
    paddingRight: 40,
  },
  notesIconView: {
    alignSelf: "center",
    position: "absolute",
    right: 2,
    backgroundColor: "transparent",
    margin: 5,
    padding: 5,
  },
  input: {
    width: "90%",
    marginTop: 12,
    borderRadius: 10,
    fontSize: 20,
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  dateText: {
    fontSize: 20,
    fontWeight: "500",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "500",
    color: "white",
  },
  buttonContainer: {
    borderRadius: 10,
    padding: 10,
    // marginTop: 15,
    marginLeft: 50,
    marginRight: 50,
    alignItems: "center",
    width: "80%",
  },
  call911: {
    backgroundColor: "red",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    margin: 8,
  },
});
