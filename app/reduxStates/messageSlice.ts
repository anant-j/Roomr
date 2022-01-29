import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Each Message 
export interface messageObject {
  from: string;
  timeSent: string;
  content: string;
}

// Every message
export interface MessageState {
  allMessages: messageObject[];
  loading: boolean;
  sending: boolean;
  sent: boolean;
  error: boolean;
}

const initialState: MessageState = {
  allMessages: [],
  loading: false,
  sending: false,
  sent: false,
  error: false,
};

export const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    fetchMessagesFulfilled: (state, action) => {
      state.loading = false;
      const currentMessages = action.payload;
      state.allMessages = currentMessages;
    },
    fetchMessagesPending: (state) => {
      state.loading = true;
    },
    fetchMessagesError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchMessagesFulfilled,
  fetchMessagesError,
  fetchMessagesPending,
} = messageSlice.actions;

export default messageSlice.reducer;
