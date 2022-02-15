import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

export interface AuthState {
  expoToken: string;
  email: string;
  type: string;
  name: {
    first: string;
    last: string;
  };
  houses: string[];
  approved: boolean;
}

const initialState: AuthState = {
  expoToken: "",
  email: null,
  type: null,
  name: {
    first: "",
    last: "",
  },
  houses: [],
  approved: false,
};

export interface UserObject {
  type: string;
  name: {
    first: string;
    last: string;
  };
  houses: string[];
  approved: boolean;
}

export const registerExpoToken = (payload: string) => {
  return (dispatch: any) => {
    dispatch(setExpoToken(payload));
  };
};

export const updateExpoToken = (oldToken) => {
  return async (dispatch: any, getState: any) => {
    const newToken = getState().auth.expoToken;
    const email = getState().auth.email;
    if (oldToken !== newToken && email) {
      const userRef = doc(db, "users", email);
      await updateDoc(userRef, {
        expo_token: newToken,
      });
    }
  };
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setExpoToken: (state, action: PayloadAction<string>) => {
      state.expoToken = action.payload;
    },
    setUserData: (state, action: PayloadAction<UserObject>) => {
      state.approved = action.payload.approved;
      state.type = action.payload.type;
      state.name = action.payload.name;
      state.houses = action.payload.houses;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    cleanAuth: (state) => {
      state.approved = initialState.approved;
      state.type = initialState.type;
      state.name = initialState.name;
      state.houses = initialState.houses;
      state.email = initialState.email;
    },
  },
});

export const { setExpoToken, setUserData, setEmail, cleanAuth } =
  authSlice.actions;

export default authSlice.reducer;
