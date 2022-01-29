import * as React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { ButtonWithImage, Text, View } from "components/Themed";
import { useAppSelector } from "hooks/typedHooks";
import Task from "components/Task";
import { messageObject } from "reduxStates/messageSlice";

export default function MessageScreen() {
  const { allChats, loading, error } = useAppSelector((state) => state.chats);

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.sectionSubTitle}>Chats</Text>
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
  return (
    <>
      <View style={messageItemStyles.bubble}>
        <View style={messageItemStyles.user}>
            <Text style={messageItemStyles.initials}>
              MJ
            </Text>
          </View>
        <View style={messageItemStyles.received}>
          
          <View style={messageItemStyles.message}>
            <Text style={messageItemStyles.content}>
              Hello
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

const messageItemStyles = StyleSheet.create({
  bubble: {
    backgroundColor: "grey",
  },
	received: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    borderRadius: 10,
		marginRight: "40%",
    marginVertical: 5,
		paddingTop: 15,
		backgroundColor: "#8A8F9E",
  },
	user: {
		flexDirection: "row",
    alignItems: "flex-start",
		justifyContent: "space-between",
    borderRadius: 10,
    marginVertical: 5,
    paddingTop: 15,
	},
  message: {
    alignItems: "flex-start",
  },
  content: {
    alignItems: "flex-start",
  },
  
	test: {
		paddingTop: 40,
    paddingLeft: 15,
		borderRadius: 10,
		marginHorizontal: 25,
    marginVertical: 5,
    flexDirection: 'row',
		alignItems: "flex-start",
    justifyContent: 'flex-start',
		backgroundColor: "#8A8F9E",
	},
	buttonTextView: {
    paddingHorizontal: 10,
    marginTop: 40,
    // bottom: 0,
    backgroundColor: "transparent",
  },

  chatInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  contactName: {
    marginBottom: 25,
  },
  item: {
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    marginBottom: 30,
  },
  itemRight: {
    flex: 1,
    paddingHorizontal: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderColor: "#55BCF6",
    borderWidth: 2,
    opacity: 0.8,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  chatSeparator: {
    height: 1,
    width: "100%",
  },
  initials: {
    fontWeight: "bold",
    color: "#55BCF6",
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
