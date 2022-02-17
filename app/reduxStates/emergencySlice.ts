import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
export interface emergencyState {
  active: boolean;
  description: string;
  isSafe: boolean;
  message: string;
  reportedAt: string;
  reportedBy: string;
  show: boolean;
}

const initialState: emergencyState = {
  active: false,
  description: "",
  isSafe: true,
  message: "",
  reportedAt: new Date().toString(),
  reportedBy: "",
  show: false,
};

export const endEmergency = () => {
  return async (dispatch: any, getState: any) => {
    const houseID = getState().auth.houses[0];
    await updateDoc(doc(db, `houses/${houseID}`), {
      emergency: {
        active: false,
        description: "",
        isSafe: true,
        message: "",
        reportedAt: new Date().toString(),
        reportedBy: "",
      },
    });
    dispatch(declareEmergencyOver());
  };
};

export const emergencySlice = createSlice({
  name: "emergency",
  initialState,
  reducers: {
    declareEmergencyOver: (state) => {
      state.active = false;
    },
    showEmergency: (state) => {
      state.show = true;
    },
    hideEmergency: (state) => {
      state.show = false;
    },
    declareEmergency: (state, action: PayloadAction<emergencyState>) => {
      state.active = action.payload.active;
      state.description = action.payload.description;
      state.isSafe = action.payload.isSafe;
      state.message = action.payload.message;
      if (state.reportedAt !== action.payload.reportedAt) {
        state.show = action.payload.show;
      }
      state.reportedAt = action.payload.reportedAt;
      state.reportedBy = action.payload.reportedBy;
    },
    clearEmergency: (state) => {
      state.active = initialState.active;
      state.description = initialState.description;
      state.isSafe = initialState.isSafe;
      state.message = initialState.message;
      state.reportedAt = initialState.reportedAt;
      state.reportedBy = initialState.reportedBy;
      state.show = initialState.show;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  declareEmergencyOver,
  hideEmergency,
  showEmergency,
  declareEmergency,
  clearEmergency,
} = emergencySlice.actions;

export default emergencySlice.reducer;
