import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { setActiveAuth } from "./authSlice";

export const fetchAuth = () => {
  return (dispatch: any) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setActiveAuth(true));
      } else {
        dispatch(setActiveAuth(false));
      }
    });
  };
};
