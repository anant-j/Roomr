import { onSnapshot, doc, collection, query } from "firebase/firestore";
import { db } from "../firebase";
import { LogoutWithError } from "./authSlice";
import { fetchChatsFulfilled, fetchChatsPending } from "./chatSlice";
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
  const data = [];
  for (const tenant of Object.keys(tenants)) {
    // console.log(tenant);
    data.push({
      id: tenant,
      name: tenants[tenant],
      lastMessageTimeElapsed: "27m",
      chatIcon: "url",
    });
  }
  if (landlord) {
    data.push({
      id: landlord.email,
      name: landlord.name,
      lastMessageTimeElapsed: "27m",
      chatIcon: "url",
    });
  }
  dispatch(fetchChatsFulfilled(data));
};

// TODO: Use firestore data instead of mock data
const fetchMessageData = (dispatch: any) => {
  dispatch(fetchMessagesPending());
  const data2 = [
    {
      idMsg: "0",
      from: "Mark J",
      timeSent: "1:45pm",
      content: "hey what up hey what up hey w,",
    },
    { idMsg: "1", from: "Andy N", timeSent: "1:46pm", content: "hey roomie" },
    {
      idMsg: "2",
      from: "Mark J",
      timeSent: "1:47pm",
      content: "lets go get food",
    },
  ];
  dispatch(fetchMessagesFulfilled(data2));
};
//hey what up
// /hey roomie

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
    const q = query(collection(db, `houses/${houseID}/tasks`));
    const unsub2 = onSnapshot(
      q,
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
            dispatch(LogoutWithError("STORING_DB_DATA_LOCALLY" + error));
          }
        });
        const payload = { tasks: tasks };
        dispatch(fetchTasksFulfilled(payload));
      },
      (error) => {
        dispatch(fetchTasksError(error));
        dispatch(LogoutWithError("FETCH_USER_DATA_DB" + error));
      },
    );
    // fetchChatData(dispatch);

    listenerUnsubscribeList.push(unsub1);
    listenerUnsubscribeList.push(unsub2);
  };
};
