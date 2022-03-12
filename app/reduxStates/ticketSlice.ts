import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import moment from "moment";
import { db } from "../firebase";

export interface TicketObject {
  content: string;
  notes: string;
  createdBy: string;
  createdOn: string;
  completed: boolean;
}

export interface TicketState {
  allTickets: TicketObject[];
  loading: boolean;
  error: any;
}

export interface CreateTicketObject {
  content: string;
  notes: string;
  email: string;
  houseID: string;
}

const initialState: TicketState = {
  allTickets: [],
  loading: false,
  error: null,
};

export const addTicket = (payload: CreateTicketObject) => {
  const { content, notes, email, houseID } = payload;
  return async (dispatch: any) => {
    dispatch(modifyTicketPending());
    try {
      await addDoc(collection(db, `houses/${houseID}/tickets`), {
        content: content,
        createdBy: email,
        createdOn: new Date(),
        notes: notes,
        completed: false,
      });
    } catch (error: any) {
      dispatch(modifyTicketError(error));
    }
  };
};

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
      const newTickets = action.payload.tickets;
      state.allTickets = newTickets;
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
export const { fetchTicketsFulfilled, modifyTicketPending, modifyTicketError } =
  ticketSlice.actions;

export default ticketSlice.reducer;
