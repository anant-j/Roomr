import * as React from "react";
import {
  ActivityIndicator,
  Keyboard,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Text, View, Button, TextInput } from "components/Themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import ErrorView from "components/ErrorView";
import Colors from "constants/Colors";
import { Entypo } from "@expo/vector-icons";
import useColorScheme from "hooks/useColorScheme";
import Checkbox from "expo-checkbox";
import { reportEmergency } from "../../firebase";
import { showEmergency } from "reduxStates/emergencySlice";

export default function ReportEmergency() {
  const navigation = useNavigation();
  const [emergencyName, setEmergencyName] = useState("");
  const [notes, setNotes] = useState("");
  const [errorCode, setErrorCode] = useState(null);
  const [isChecked, setChecked] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const houseID = useAppSelector((state) => state.auth.houses)[0];
  const email = useAppSelector((state) => state.auth.email);
  const dispatch = useAppDispatch();
  const colorScheme = useColorScheme();

  React.useEffect(() => {
    dispatch(showEmergency());
  }, []);

  const handleReportEmegency = () => {
    if(isLoading) return;
    setLoading(true);
    Keyboard.dismiss();
    if (!emergencyName || !notes) {
      setErrorCode("MISSING_REQUIRED_FIELDS");
      setLoading(false);
      return;
    }
    reportEmergency({
      message: emergencyName,
      description: notes,
      houseIsSafe: isChecked,
      houseID,
    }).then((result) => {
      if (result.data["status"] == "success") {
        navigation.goBack();
      } else {
        setErrorCode(result["code"]);
      }
      setLoading(false);
    });
  };

  const call911 = () => {
    if (Platform.OS === "ios") {
      return Linking.openURL(`tel:911`);
    }
    return Linking.openURL(`tel:911`);
  };

  return (
    <View style={styles.container}>
      <ErrorView errorCode={errorCode} setErrorCode={setErrorCode} />
      <TextInput
        style={styles.input}
        onChangeText={setEmergencyName}
        placeholder="What is your emergency?"
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
      <TouchableOpacity
        activeOpacity={1}
        style={styles.section}
        onPress={() => {
          setChecked(!isChecked);
        }}
      >
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? "#5B8DCA" : undefined}
        />
        <Text style={{ fontWeight: "bold" }}>House is safe to be in</Text>
      </TouchableOpacity>
      {!isChecked ? (
        <Text style={styles.textCentered}>
          Tenants need to leave house immediately and should not enter unless
          emergency is resolved.
        </Text>
      ) : (
        <Text style={styles.textCentered}>
          Tenants can enter and stay in house
        </Text>
      )}
      <Text></Text>
      <Text></Text>
      <Text style={styles.textCentered}>
        Reporting an emergency will notify all tenants and your landlord
      </Text>
      <Text></Text>
      <Button onPress={handleReportEmegency} style={styles.buttonContainer}>
        {!isLoading ? (
          <Text style={styles.buttonText}>Report</Text>
        ) : (
          <ActivityIndicator color={"black"}></ActivityIndicator>
        )}
      </Button>
      <Text></Text>
      <View style={styles.divider} />
      <Text style={styles.textCentered}>
        If you are in immediate danger, please call emergency services
      </Text>
      <Text></Text>
      <Button
        onPress={call911}
        style={[styles.buttonContainer, styles.call911]}
      >
        <Text style={styles.buttonText}>Call 911</Text>
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
