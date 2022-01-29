import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { setUserData, setEmail, cleanAuth } from "./authSlice";
import { onSnapshot, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const listenerUnsubscribeList = [];

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
            dispatch(setEmail(user.email));
            dispatch(setUserData(userData));
          } else dispatch(cleanAuth());
        });
      } else {
        dispatch(cleanAuth());
      }
    });
  };
};

export const listenToUserData = (email) => {
  return (dispatch: any) => {
    const unsub = onSnapshot(doc(db, "users", email), (doc: any) => {
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
        dispatch(cleanAuth());
      }
    });

    listenerUnsubscribeList.push(unsub);
  };
};
