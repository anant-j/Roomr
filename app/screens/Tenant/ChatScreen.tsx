import * as React from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Button, Text, View, TextInput } from "components/Themed";
import { useAppDispatch, useAppSelector } from "hooks/typedHooks";
import { setActiveChat } from "reduxStates/chatSlice";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { sendMessage } from "../../firebase";

export default function ChatScreen() {
  const { allChats, loading, error, currentActiveChat, loadingMsg, errorMsg } =
    useAppSelector((state) => state.chats);

  const { email } = useAppSelector((state) => state.auth);
  const [message, onChangeMessage] = useState("");
  const [messageSendingInProgress, onChangeMessageSending] = useState(false);

  const dispatch = useAppDispatch();

  const onChatPress = (id: string) => {
    dispatch(setActiveChat(id));
  };

  const onBackToChat = () => {
    dispatch(setActiveChat(""));
  };

  const onSendMessage = async () => {
    onChangeMessageSending(true);
    sendMessage({
      to: currentActiveChat,
      message: message,
    })
      .then(() => {
        onChangeMessage("");
        onChangeMessageSending(false);
      })
      .catch((error) => {
        Alert.alert("An error occured", "Your message could not be sent");
        onChangeMessageSending(false);
      });
  };

  return (
    <View style={styles.container}>
      {!currentActiveChat ? (
        <View style={styles.topContainer}>
          <Text style={styles.sectionSubTitle}>Tenant</Text>
          <View style={styles.tasksWrapper}>
            <View style={styles.titleWrapper}>
              <Text style={styles.sectionTitle}>Chats</Text>
            </View>
            {error && (
              <Text style={styles.sectionTitle}>Error Fetching Chats</Text>
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
                  {Object.keys(allChats).map((item) => {
                    return (
                      <TouchableOpacity
                        // TODO: Better practice is to use unique ID of element as the key
                        key={item}
                        onPress={() => {
                          onChatPress(item);
                        }}
                      >
                        <ChatItem item={allChats[item]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      ) : (
        // Render message component here:
        <View style={styles.topContainer}>
          <View style={styles.tasksWrapper}>
            <Button onPress={() => onBackToChat()} style={styles.backbutton}>
              <Feather name="arrow-left" color={"white"} size={30} />
            </Button>
            <View style={styles.titleWrapper}>
              <Text style={styles.sectionTitle}>
                {/* <Text> */}
                {allChats[currentActiveChat].name}
              </Text>
            </View>
            {errorMsg && (
              <Text style={styles.sectionTitle}>Error Fetching Messages</Text>
            )}
            {loadingMsg ? (
              <Text style={styles.sectionTitle}>Loading...</Text>
            ) : (
              <KeyboardAvoidingView
                style={{ height: "100%" }}
                behavior="padding"
                enabled
              >
                <View style={{ height: "70%" }}>
                  <ScrollView
                    keyboardDismissMode="on-drag"
                    keyboardShouldPersistTaps={"always"}
                  >
                    <View style={styles.items}>
                      {allChats[currentActiveChat]["messages"] ? (
                        Object.keys(
                          allChats[currentActiveChat]["messages"],
                        ).map((item, index) => {
                          return (
                            <TouchableOpacity
                              // TODO: Better practice is to use unique ID of element as the key
                              key={index}
                            >
                              <MessageItem
                                content={
                                  allChats[currentActiveChat]["messages"][item]
                                    .content
                                }
                                name={allChats[currentActiveChat].name}
                                sender={
                                  allChats[currentActiveChat]["messages"][item]
                                    .from == email
                                }
                              />
                            </TouchableOpacity>
                          );
                        })
                      ) : (
                        <Text>No Messages</Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
                <View style={styles.textInputContainer}>
                  <TextInput
                    autoFocus={true}
                    blurOnSubmit={false}
                    style={styles.input}
                    onChangeText={onChangeMessage}
                    value={message}
                    onSubmitEditing={() => onSendMessage()}
                    placeholder="Enter Message"
                    autoCapitalize="sentences"
                  />
                  <View style={styles.sendButton}>
                    {!messageSendingInProgress ? (
                      <Feather
                        name={"send"}
                        size={25}
                        color="#878787"
                        onPress={() => onSendMessage()}
                      />
                    ) : (
                      <ActivityIndicator />
                    )}
                  </View>
                </View>
              </KeyboardAvoidingView>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const ChatItem = (props: any) => {
  const splitName = props.item.name.split(" ");
  const fnameInitial = splitName[0][0];
  const lNameInitial = splitName[1][0];
  return (
    <>
      <View style={chatItemStyles.item}>
        <View style={chatItemStyles.circle}>
          <Text style={chatItemStyles.initials}>
            {fnameInitial + lNameInitial}
          </Text>
        </View>
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
  );
};

const MessageItem = (props: any) => {
  const Initials = props.name.split(" ");
  const fInitial = Initials[0][0];
  const lInitial = Initials[1][0];
  const content = props.content;
  if (!props.sender) {
    return (
      <View style={messageItemStyles.bubbleLeft}>
        <View style={messageItemStyles.circle}>
          <Text style={messageItemStyles.initials}>{fInitial + lInitial}</Text>
        </View>

        <View style={messageItemStyles.received}>
          <Text style={messageItemStyles.contentFrom}>{content}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View style={messageItemStyles.bubbleRight}>
        <View style={messageItemStyles.sent}>
          <Text style={messageItemStyles.contentTo}>{content}</Text>
        </View>
      </View>
    );
  }
};

const chatItemStyles = StyleSheet.create({
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
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "bold",
    color: "#55BCF6",
  },
  received: {
    alignItems: "flex-start",
    borderRadius: 10,
    marginVertical: 5,
    marginLeft: "5%",
    padding: 10,
    backgroundColor: "#5B8DCA",
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
    borderRadius: 10,
    marginVertical: 5,
    padding: 10,
    backgroundColor: "#5B8DCA",
  },
  contentTo: {
    alignItems: "flex-end",
    flexDirection: "row-reverse",
    color: "white",
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
  backbutton: {
    borderRadius: 50,
    paddingLeft: 10,
    paddingRight: 10,
    width: 50,
    marginBottom: 10,
  },
  input: {
    height: 50,
    marginTop: 12,
    borderRadius: 10,
    // borderWidth: 2,
    // borderColor: "#5B8DCA",
    fontSize: 20,
    padding: 10,
  },
  textInputContainer: {
    bottom: 50,
    width: "100%",
    flex: 1,
  },
  sendButton: {
    alignSelf: "center",
    position: "absolute",
    right: 2,
    top: 3,
    backgroundColor: "transparent",
    margin: 10,
    padding: 10,
  },
});
