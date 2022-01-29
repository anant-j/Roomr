import { onSnapshot, doc, collection, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { fetchChatsFulfilled, fetchChatsPending } from "./chatSlice";
import { fetchMessagesFulfilled, fetchMessagesPending } from "./messageSlice";
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
    { name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    { name: "Chris G", lastMessageTimeElapsed: "53m", chatIcon: "url" },
    { name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
    { name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    { name: "Chris G", lastMessageTimeElapsed: "53m", chatIcon: "url" },
    { name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
    { name: "Mark J", lastMessageTimeElapsed: "27m", chatIcon: "url" },
    { name: "Chris G", lastMessageTimeElapsed: "53m", chatIcon: "url" },
    { name: "Kyle H", lastMessageTimeElapsed: "16m", chatIcon: "url" },
  ];
  dispatch(fetchChatsFulfilled(data));
};

// TODO: Use firestore data instead of mock data
const fetchMessageData = (dispatch: any) => {
  dispatch(fetchMessagesPending());
  const data = [
    {from: "Mark J", timeSent: "1:45pm", content: "hey what up"},
    {from: "Andy (currentUser)", timeSent: "1:46pm", content: "hey roomie"},
    {from: "Mark J", timeSent: "1:47pm", content: "lets go get food"},
  ];
  dispatch(fetchChatsFulfilled(data));
};

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
