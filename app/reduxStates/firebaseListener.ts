import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import { fetchChatsFulfilled, fetchChatsPending } from "./chatSlice";
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

export const fetchData = (houseID: string) => {
  return (dispatch: any) => {
    dispatch(fetchTasksPending());
    const unsub = onSnapshot(
      doc(db, "houses", houseID),
      (doc: any) => {
        const updatedTasks = doc.data().taskList;
        dispatch(fetchTasksFulfilled(updatedTasks));
      },
      (error) => {
        dispatch(fetchTasksError(error));
      },
    );

    fetchChatData(dispatch);

    listenerUnsubscribeList.push(unsub);
  };
};
