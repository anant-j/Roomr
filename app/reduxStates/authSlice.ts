import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  loggedIn: boolean;
  expoToken: string;
  authFlowDoneOnce: boolean;
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
  loggedIn: false,
  expoToken: "",
  authFlowDoneOnce: false,
  email: "",
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

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveAuth: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
    setExpoToken: (state, action: PayloadAction<string>) => {
      state.expoToken = action.payload;
    },
    setAuthFlowDoneOnce: (state) => {
      state.authFlowDoneOnce = true;
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
  },
});

export const {
  setActiveAuth,
  setExpoToken,
  setAuthFlowDoneOnce,
  setUserData,
  setEmail,
} = authSlice.actions;

export default authSlice.reducer;
