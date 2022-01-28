import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import {
  setActiveAuth,
  setAuthFlowDoneOnce,
  setUserData,
  setEmail,
} from "./authSlice";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../firebase";

const listenerUnsubscribeList = [];

export const fetchAuth = () => {
  return (dispatch: any) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setActiveAuth(true));
        dispatch(setEmail(user.email));
        dispatch(fetchUserData(user.email));
      } else {
        dispatch(setActiveAuth(false));
      }
      dispatch(setAuthFlowDoneOnce());
    });
  };
};

export const fetchUserData = (email) => {
  return (dispatch: any) => {
    const unsub = onSnapshot(doc(db, "users", email), (doc: any) => {
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
    });

    listenerUnsubscribeList.push(unsub);
  };
};
