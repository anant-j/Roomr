import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";
import {
  fetchTasksPending,
  fetchTasksFulfilled,
  fetchTasksError,
} from "./taskSlice";

const listenerUnsubscribeList = [];

export const fetchData = () => {
  return (dispatch: any) => {
    dispatch(fetchTasksPending());
    const unsub = onSnapshot(
      doc(db, "user1", "data"),
      (doc: any) => {
        const updatedTasks = doc.data().taskList;
        dispatch(fetchTasksFulfilled(updatedTasks));
      },
      (error) => {
        dispatch(fetchTasksError(error));
      },
    );

    listenerUnsubscribeList.push(unsub);
  };
};
