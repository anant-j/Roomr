import * as React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Text, View } from "components/Themed";
import { useAppSelector } from "hooks/typedHooks";
import Task from "components/Task";
import { chatObject } from "reduxStates/chatSlice";

export default function ChatScreen() {

  const { allChats, loading, error } = useAppSelector((state) => state.chats)

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.sectionSubTitle}>Tenant</Text>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>Chats</Text>
          </View>
          {error && <Text style={styles.sectionTitle}>Error Fetching Chats</Text>}
          {loading ? (<Text style={styles.sectionTitle}>Loading...</Text>) : (
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
                      <ChatItem item={item} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>)}
        </View>
      </View>
    </View>
  );
}

const ChatItem = (props: any) => {
  return <>
    <View style={chatItemStyles.item}>
      <View style={chatItemStyles.circle}></View>
      <View style={chatItemStyles.itemRight}>
        <View style={chatItemStyles.chatInfo}>
          <Text style={chatItemStyles.contactName}>{props.item.name}</Text>
          <Text>{props.item.lastMessageTimeElapsed} ago</Text>
        </View>
        <View
          style={chatItemStyles.chatSeparator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
      </View>
    </View>
  </>
}

const chatItemStyles = StyleSheet.create({
  chatInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactName: {
    marginBottom: 15
  },
  item: {
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: "space-around",
    marginBottom: 30
  },
  itemRight: {
    flex: 1,
    paddingHorizontal: 10,
    alignSelf: "center"
  },
  circle: {
    width: 40,
    height: 40,
    borderColor: '#55BCF6',
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 50,
  },
  chatSeparator: {
    height: 1,
    width: "100%",
  },
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  topContainer: {
    flex: 1,
    // maxHeight: "50%",
    marginBottom: "65%",
  },
});
