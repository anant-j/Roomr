import { onSnapshot, doc, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { fetchChatsFulfilled, fetchChatsPending, fetchMessagesFulfilled,
  fetchMessagesPending } from "./chatSlice";
import {
  fetchTasksPending,
  fetchTasksFulfilled,
  fetchTasksError,
} from "./taskSlice";

const listenerUnsubscribeList = [];

// TODO: Use firestore data instead of mock data
const fetchChatData = (dispatch: any) => {
  dispatch(fetchChatsPending());
  const data = [
    { id: "1", name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    {
      id: "2",
      name: "Chris G",
      lastMessageTimeElapsed: "53m",
      chatIcon: "url",
    },
    { id: "3", name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
    { id: "4", name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    {
      id: "5",
      name: "Chris G",
      lastMessageTimeElapsed: "53m",
      chatIcon: "url",
    },
    { id: "6", name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
    { id: "7", name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    {
      id: "8",
      name: "Chris G",
      lastMessageTimeElapsed: "53m",
      chatIcon: "url",
    },
    { id: "9", name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
  ];
  dispatch(fetchChatsFulfilled(data));
};

// TODO: Use firestore data instead of mock data
const fetchMessageData = (dispatch: any) => {
  dispatch(fetchMessagesPending());
  const data2 = [
    {idMsg: "0", from: "Mark J", timeSent: "1:45pm", content: "hey what up hey what up hey w,"},
    {idMsg: "1", from: "Andy N", timeSent: "1:46pm", content: "hey roomie"},
    {idMsg: "2", from: "Mark J", timeSent: "1:47pm", content: "lets go get food"},
  ];
  dispatch(fetchMessagesFulfilled(data2));
};
//hey what up
// /hey roomie

export const fetchData = (houseID: string) => {
  return (dispatch: any) => {
    dispatch(fetchTasksPending());
    const q = query(collection(db, `houses/${houseID}/tasks`));
    const unsub = onSnapshot(
      q,
      (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          tasks.push(doc.data().content);
        });
        dispatch(fetchTasksFulfilled(tasks));
      },
      (error) => {
        dispatch(fetchTasksError(error));
      },
    );

    // const unsub = onSnapshot(
    //   doc(db, "houses", houseID),
    //   (doc: any) => {
    //     const updatedTasks = doc.data().taskList;
    //     dispatch(fetchTasksFulfilled(updatedTasks));
    //   },
    //   (error) => {
    //     dispatch(fetchTasksError(error));
    //   },
    // );

    fetchChatData(dispatch);

    fetchMessageData(dispatch);

    listenerUnsubscribeList.push(unsub);
  };
};
