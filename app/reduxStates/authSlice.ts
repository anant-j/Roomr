import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  loggedIn: boolean;
  expoToken: string;
  authFlowDoneOnce: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
  expoToken: "",
  authFlowDoneOnce: false,
};

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
  },
});

export const { setActiveAuth, setExpoToken, setAuthFlowDoneOnce } =
  authSlice.actions;

export default authSlice.reducer;
