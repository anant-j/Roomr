import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface emergencyState {
  active: boolean;
  description: string;
  isSafe: boolean;
  message: string;
  reportedAt: Date;
  reportedBy: string;
  showPage: boolean;
}

const initialState: emergencyState = {
  active: true,
  description: "",
  isSafe: false,
  message: "",
  reportedAt: new Date(),
  reportedBy: "",
  showPage: true,
};

export const emergencySlice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    declareEmergencyOver: (state) => {
      state.active = false;
    },
    hidePage: (state) => {
      state.showPage = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { declareEmergencyOver, hidePage } = emergencySlice.actions;

export default emergencySlice.reducer;
