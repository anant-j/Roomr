import { onSnapshot, doc, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { LogoutWithError } from "./authSlice";
import { createChats, updateMessage } from "./chatSlice";
import {
  fetchTasksPending,
  fetchTasksFulfilled,
  fetchTasksError,
} from "./taskSlice";
import { updateTenants, updateLandlord } from "./usersSlice";

const listenerUnsubscribeList = [];

export const fetchData = (houseID: string) => {
  return (dispatch: any) => {
    const unsub1 = onSnapshot(
      doc(db, "houses", houseID),
      (doc: any) => {
        if (doc.exists) {
          const tenants = doc.data().tenants;
          if (tenants) {
            dispatch(updateTenants(tenants));
          }
          const landlord = doc.data().landlord;
          if (landlord) {
            dispatch(updateLandlord(landlord));
          }
          dispatch(createChats(tenants, landlord));
        }
      },
      (error) => {
        console.log(error);
      },
    );

    dispatch(fetchTasksPending());
    const taskQuery = query(collection(db, `houses/${houseID}/tasks`));
    const unsub2 = onSnapshot(
      taskQuery,
      (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          try {
            const { completed, content, createdBy, createdOn, due } =
              doc.data();

            const createdOnDate = new Date(createdOn.seconds * 1000).toString();
            const dueOnDate = new Date(due.seconds * 1000).toString();

            const task = {
              completed,
              content,
              createdBy,
              createdOn: createdOnDate,
              due: dueOnDate,
              id: doc.id,
            };

            tasks.push(task);
          } catch (error) {
            dispatch(LogoutWithError("STORING_TASK_DB_DATA_LOCALLY" + error));
          }
        });
        const payload = { tasks: tasks };
        dispatch(fetchTasksFulfilled(payload));
      },
      (error) => {
        dispatch(fetchTasksError(error));
        dispatch(LogoutWithError("FETCH_TASK_DATA_DB" + error));
      },
    );

    const messagesQuery = query(collection(db, `houses/${houseID}/chats`));
    const unsub3 = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          try {
            dispatch(updateMessage(doc.id, doc.data()));
          } catch (error) {
            dispatch(LogoutWithError("STORING_CHAT_DATA_LOCALLY" + error));
          }
        });
      },
      (error) => {
        // dispatch(fetchTasksError(error));
        dispatch(LogoutWithError("FETCH_CHAT_DATA_DB" + error));
      },
    );

    listenerUnsubscribeList.push(unsub1);
    listenerUnsubscribeList.push(unsub2);
    listenerUnsubscribeList.push(unsub3);
  };
};
