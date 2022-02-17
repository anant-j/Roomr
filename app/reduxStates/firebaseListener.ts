import { onSnapshot, doc, collection, query, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { setUserData, setEmail, cleanAuth, updateExpoToken } from "./authSlice";
import { createChats, updateMessage } from "./chatSlice";
import {
  fetchTasksPending,
  fetchTasksFulfilled,
  fetchTasksError,
} from "./taskSlice";
import { updateTenants, updateLandlord } from "./usersSlice";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Alert } from "react-native";
import { logout } from "../firebase";
import { clearEmergency, declareEmergency } from "./emergencySlice";

const listeners = {
  houseListener: null,
  tasksListener: null,
  chatsListener: null,
  userDataListener: null,
};

const getSortedTasks = (allTasks) => {
  const sortedTasks = allTasks.slice().sort((a, b) => {
    const date1 = new Date(a.due);
    const date2 = new Date(b.due);
    if (date2 < date1) return 1;
    if (date2 > date1) return -1;
    return 0;
  });
  return sortedTasks;
};

export const fetchHouseData = (houseID: string) => {
  return (dispatch: any) => {
    if (!listeners.houseListener) {
      listeners["houseListener"] = onSnapshot(
        doc(db, "houses", houseID),
        (doc: any) => {
          if (doc.exists && doc.data()) {
            const tenants = doc.data().tenants;
            if (tenants) {
              dispatch(updateTenants(tenants));
            }
            const landlord = doc.data().landlord;
            if (landlord) {
              dispatch(updateLandlord(landlord));
            }
            dispatch(createChats(tenants, landlord));
            if (doc.data().emergency && doc.data().emergency.active) {
              const payload = doc.data().emergency;
              payload["show"] = true;
              payload["reportedAt"] = new Date(
                payload["reportedAt"],
              ).toString();
              dispatch(declareEmergency(payload));
            } else {
              dispatch(clearEmergency());
            }
          } else {
            dispatch(signout("HOUSE_NOT_FOUND"));
          }
        },
      );
    }

    if (!listeners.tasksListener) {
      dispatch(fetchTasksPending());
      const taskQuery = query(collection(db, `houses/${houseID}/tasks`));
      listeners["tasksListener"] = onSnapshot(taskQuery, (querySnapshot) => {
        const tasks = [];
        querySnapshot.forEach((doc) => {
          try {
            const {
              completed,
              content,
              createdBy,
              createdOn,
              notes,
              occurrences,
              repeatType,
              usersInvolved,
            } = doc.data();

            const createdOnDate = new Date(createdOn.seconds * 1000).toString();

            const task = {
              completed,
              content,
              createdBy,
              createdOn: createdOnDate,
              id: doc.id,
              notes,
              occurrences: occurrences,
              repeatType: repeatType,
              usersInvolved: usersInvolved,
            };

            tasks.push(task);
          } catch (error) {
            dispatch(signout("STORING_TASK_DB_DATA_LOCALLY" + error));
            dispatch(fetchTasksError(error));
          }
        });
        const aggregatedTasks = aggregateAllTasks(tasks);
        const payload = { tasks: getSortedTasks(aggregatedTasks) };
        dispatch(fetchTasksFulfilled(payload));
      });

      const aggregateAllTasks = (tasks) => {
        const aggregated = tasks.reduce(
          (acc, task) => reduceSingleTask(acc, task),
          [],
        );
        return aggregated;
      };

      const reduceSingleTask = (acc, task) => {
        // map over all occurrences of this task
        const listOfTasksPerOccurrence = Object.keys(task.occurrences).reduce(
          (acc, occurrence) => {
            const thisOccurrenceInfo = task.occurrences[occurrence];
            const taskObjectForOccurrence = {
              ...task,
              completed: thisOccurrenceInfo.completed,
              assignedTo: thisOccurrenceInfo.assignedTo,
              due: new Date(occurrence).toString(),
              occurrences: {},
            };
            const newAcc = [...acc, taskObjectForOccurrence];
            return newAcc;
          },
          [],
        );
        return [...acc, ...listOfTasksPerOccurrence];
      };
    }

    if (!listeners.chatsListener) {
      const messagesQuery = query(collection(db, `houses/${houseID}/chats`));
      listeners["chatsListener"] = onSnapshot(
        messagesQuery,
        (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            try {
              dispatch(updateMessage(doc.id, doc.data()));
            } catch (error) {
              dispatch(signout("STORING_CHAT_DATA_LOCALLY" + error));
            }
          });
        },
      );
    }
  };
};

export const fetchAuth = () => {
  return (dispatch: any) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const docRef = doc(db, "users", user.email);
        getDoc(docRef).then((doc) => {
          if (doc.exists) {
            const updatedUserData = doc.data();
            const userData = {
              type: updatedUserData.type,
              name: {
                first: updatedUserData.firstName,
                last: updatedUserData.lastName,
              },
              houses: updatedUserData.houses,
              approved: updatedUserData.approved,
            };
            const token = updatedUserData.expo_token;
            dispatch(setUserData(userData));
            dispatch(setEmail(user.email));
            dispatch(updateExpoToken(token));
          } else dispatch(signout("FETCH_DB_ON_AUTH"));
        });
      } else {
        dispatch(cleanAuth());
      }
    });
  };
};

export const listenToUserData = (email) => {
  return (dispatch: any) => {
    if (!listeners.userDataListener) {
      listeners["userDataListener"] = onSnapshot(
        doc(db, "users", email),
        (doc: any) => {
          if (doc.exists) {
            const updatedUserData = doc.data();
            const userData = {
              type: updatedUserData.type,
              name: {
                first: updatedUserData.firstName,
                last: updatedUserData.lastName,
              },
              houses: updatedUserData.houses,
              approved: updatedUserData.approved,
            };
            dispatch(setUserData(userData));
          } else {
            dispatch(signout("USER_DOESNT_EXIST_DB"));
          }
        },
      );
    }
  };
};

export const signout = (code: string = null) => {
  return async (dispatch: any) => {
    for (const key of Object.keys(listeners)) {
      if (listeners[key]) {
        listeners[key]();
      }
    }
    if (code) {
      Alert.alert(
        "An error occurred while fetching your user data.",
        "Please try again later \n\nError code: " + code,
      );
    }
    await logout();
    dispatch(cleanAuth());
  };
};
