import { onSnapshot, doc, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { LogoutWithError } from "./authSlice";
import {
  fetchChatsFulfilled,
  fetchChatsPending,
  fetchMessagesFulfilled,
  fetchMessagesPending,
} from "./chatSlice";
import {
  fetchTasksPending,
  fetchTasksFulfilled,
  fetchTasksError,
} from "./taskSlice";
import { updateTenants, updateLandlord } from "./usersSlice";

const listenerUnsubscribeList = [];

// TODO: Use firestore data instead of mock data
const fetchChatData = (
  dispatch: any,
  tenants: any = null,
  landlord: any = null,
) => {
  dispatch(fetchChatsPending());
  const data = {};
  for (const tenant of Object.keys(tenants)) {
    // console.log(tenant);
    data[tenant] = {
      name: tenants[tenant],
      lastMessageTimeElapsed: "27m",
    };
  }
  if (landlord) {
    data[landlord.email] = {
      id: landlord.email,
      name: landlord.name,
      lastMessageTimeElapsed: "27m",
    };
  }
  // const emptyMessages = {};
  // for (const user of Object.keys(data)) {
  //   emptyMessages[user] = {};
  // }
  // dispatch(fetchMessagesFulfilled(emptyMessages));
  dispatch(fetchChatsFulfilled(data));
};

// TODO: Use firestore data instead of mock data
const fetchMessageData = (dispatch: any) => {
  dispatch(fetchMessagesPending());
  const messages = {
    "landlord@roomr.com": {
      "1234": {
        content: "hello",
        from: "tenant@roomr.com",
        to: ["lanlord@roomr.com"],
        sentAt: new Date().toString(),
      },
      "4567": {
        content: "test",
        from: "landlord@roomr.com",
        to: ["tenant@roomr.com"],
        sentAt: new Date().toString(),
      },
    },
  };
  dispatch(fetchMessagesFulfilled(messages));
};

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
            dispatch(updateLandlord(tenants));
          }
          fetchChatData(dispatch, tenants, landlord);
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

    // const messagesQuery = query(collection(db, `houses/${houseID}/chats`));
    // const unsub3 = onSnapshot(
    //   messagesQuery,
    //   (querySnapshot) => {
    //     const tasks = [];
    //     querySnapshot.forEach((doc) => {
    //       try {
    //       } catch (error) {
    //         dispatch(LogoutWithError("STORING_CHAT_DATA_LOCALLY" + error));
    //       }
    //     });
    //     const payload = { tasks: tasks };
    //     dispatch(fetchTasksFulfilled(payload));
    //   },
    //   (error) => {
    //     // dispatch(fetchTasksError(error));
    //     dispatch(LogoutWithError("FETCH_CHAT_DATA_DB" + error));
    //   },
    // );

    fetchMessageData(dispatch);
    listenerUnsubscribeList.push(unsub1);
    listenerUnsubscribeList.push(unsub2);
    // listenerUnsubscribeList.push(unsub3);
  };
};
