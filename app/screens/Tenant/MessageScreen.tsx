import * as React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { ButtonWithImage, Text, View } from "components/Themed";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import Task from "components/Task";
import { messageObject } from "reduxStates/messageSlice";

export default function MessageScreen() {
  const { allMessages, loading, error } = useAppSelector((state) => state.messages);
  
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
                {allMessages.map((item, index) => {
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
  const splitName = props.item.from.split(" ");
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[1][0];
  const content = props.item.content;
  return (
    <>
      <View style={messageItemStyles.bubbleLeft}>

        <View style={messageItemStyles.circle}>
          <Text style={messageItemStyles.initials}>
            {fnameInitial + lNameInitial}
          </Text>
        </View>

        <View style={messageItemStyles.received}>
            <Text style={messageItemStyles.contentFrom}>
              {content}
            </Text>
        </View>
        
      </View>

      <View style={messageItemStyles.bubbleRight}>
        <View style={messageItemStyles.sent}>
            <Text style={messageItemStyles.contentTo}>
              {content}
            </Text>
        </View>
      </View>
    </>
  );
};
/*
<View style={messageItemStyles.sent}>
          <View style={messageItemStyles.message}>
            <Text style={messageItemStyles.contentTo}>
              Hello!
            </Text>
          </View>
        </View>
*/

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
    alignItems: "flex-start",
    //justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 5,
		marginLeft: "5%",
		padding: 10,
		backgroundColor: "#5B8DCA",
  },

  message: {
    //flexDirection: "row",
    //alignItems: "flex-start",
  },

  contentFrom: {
    alignItems: "flex-start",
    flexDirection: "row",
    color: "white",
  },
  
  bubbleRight: {
    borderRadius: 10,
    marginRight: "29%",
    flexDirection: "row-reverse",
  },
  sent: {
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    //justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
		backgroundColor: "aliceblue",
  },
  message2: {
    //flexDirection: "row-reverse",
    //alignItems: "flex-end",
  },
  contentTo: {
    alignItems: "flex-end",
    flexDirection: "row-reverse",
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
