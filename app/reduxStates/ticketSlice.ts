import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface TicketObject {
  completed: boolean;
  content: string;
  createdBy: string;
  createdOn: string;
  due: string;
  id: string;
  houseid: string;
}

export interface TicketState {
  allTasks: TicketObject[];
  loading: boolean;
  error: any;
}

const initialState: TicketState = {
  allTasks: [],
  loading: false,
  error: null,
};

/*
export const addTask = (payload: object) => {
  const { content, houseID, email, due, notes } = payload;
  return async (dispatch: any) => {
    dispatch(modifyTaskPending());
    try {
      await addDoc(collection(db, `houses/${houseID}/tasks`), {
        content: content,
        createdBy: email,
        createdOn: new Date(),
        due: new Date(due),
        notes: notes,
      });
    } catch (error: any) {
      dispatch(modifyTaskError(error));
    }
  };
};

export const completeTaskThunk = (taskID: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch(modifyTaskPending());
    const houseID = getState().auth.houses[0];
    deleteDoc(doc(db, `houses/${houseID}/tasks`, taskID))
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        dispatch(modifyTaskError(error));
      });
  };
};
*/
export const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    fetchTicketsFulfilled: (state, action) => {
      state.loading = false;
      const newTickets = action.payload.tasks;
      state.allTasks = newTickets;
    },
    fetchTicketsPending: (state) => {
      state.loading = true;
    },
    fetchTicketsError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
    modifyTicketPending: (state) => {
      state.loading = true;
    },
    modifyTicketError: (state, action: PayloadAction<string>) => {
      const error = action.payload;
      state.error = error;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchTicketsFulfilled,
  fetchTicketsError,
  fetchTicketsPending,
  modifyTicketPending,
  modifyTicketError,
} = ticketSlice.actions;

export default ticketSlice.reducer;
