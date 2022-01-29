import * as React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ButtonWithImage, Text, View } from "components/Themed";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import Task from "components/Task";
import { messageObject } from "reduxStates/messageSlice";

export default function MessageScreen() {
  const { allChats, loading, error } = useAppSelector((state) => state.chats);
  
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.tasksWrapper}>
          <View style={styles.titleWrapper}>
            <Text style={styles.sectionTitle}>House 1</Text>
          </View>
          {error && (
            <Text style={styles.sectionTitle}>Error Fetching Messages</Text>
          )}
          {loading ? (
            <Text style={styles.sectionTitle}>Loading...</Text>
          ) : (
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
                      onPress={() => {
                        console.log(item);
                      }}
                    >
                    <MessageItem item={item} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
}

const MessageItem = (props: any) => {
  const splitName = props.item.name.split(" ");
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[1][0];
  return (
    <>
      <View style={messageItemStyles.bubbleLeft}>

        <View style={messageItemStyles.circle}>
            <Text style={messageItemStyles.initials}>
              {fnameInitial + lNameInitial}
            </Text>
          </View>
        
        <View style={messageItemStyles.received}>
          <View style={messageItemStyles.message}>
            <Text style={messageItemStyles.contentFrom}>
              no changes added to commit (use "git add" and/or "git commit -a")
            </Text>
          </View>
        </View>
        
      </View>

      <View style={messageItemStyles.bubbleRight}>
        <View style={messageItemStyles.sent}>
          <View style={messageItemStyles.message}>
            <Text style={messageItemStyles.contentTo}>
              no changes added to commit (use "git add" and/or "git commit -a")
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const InputBox = (props: any) => {
  return(
    <View>
      <Text style={messageItemStyles.contentTo}>
        Hello!
      </Text>
    </View>
  );
};

const messageItemStyles = StyleSheet.create({
  bubbleLeft: {
    borderRadius: 10,
    marginRight: "25%",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  circle: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderRadius: 50,
    borderColor: "#55BCF6",
    // Align initials horizontally and vertically
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "bold",
    color: "#55BCF6",
  },
	received: {
    //flex: 1,
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 5,
		marginLeft: "5%",
		padding: 10,
		backgroundColor: "#5B8DCA",
  },

  message: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  contentFrom: {
    backgroundColor: "#5B8DCA",
    flexDirection: "row",
    alignItems: "flex-start",
    color: "white",
  },
  
  bubbleRight: {
    borderRadius: 10,
    marginLeft: "30%",
    justifyContent: "space-between",
    backgroundColor: "aliceblue",
  },
  sent: {
    //flex: 1,
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
		marginLeft: "5%",
    alignItems: "flex-start",
    justifyContent: "space-between",
		backgroundColor: "aliceblue",
  },
  contentTo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "aliceblue",
  },
});

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
  },
});
