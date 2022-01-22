import * as React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";
import { useAppSelector } from "hooks/typedHooks";
import Task from "components/Task";

export default function ChatScreen() {

  const { allChats, loading, error } = useAppSelector((state) => state.chats)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.items}>
          {allChats.map((item, index) => {
            return (
              <TouchableOpacity
                // TODO: Better practice is to use unique ID of element as the key
                key={index}
                onPress={() => { console.log(item) }}
              >
                <Text>{item.name}</Text>
                <View
                  style={styles.separator}
                  lightColor="#eee"
                  darkColor="rgba(255,255,255,0.1)"
                />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  items: {
    marginTop: 10,
    marginBottom: 10,
  }
});
