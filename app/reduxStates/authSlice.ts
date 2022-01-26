import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  loggedIn: boolean;
}

const initialState: AuthState = {
  loggedIn: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setActiveAuth: (state, action: PayloadAction<boolean>) => {
      state.loggedIn = action.payload;
    },
  },
});

export const { setActiveAuth } = authSlice.actions;

export default authSlice.reducer;
