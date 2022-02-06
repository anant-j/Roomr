import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatState } from "./chatSlice";

// Each Message 
export interface messageObject {
  id: string;
  from: string;
  timeSent: string;
  content: string;
}

// Every message
export interface MessageState {
  allMessages: messageObject[];
  currentActiveChat: string;
  loading: boolean;
  sending: boolean;
  sent: boolean;
  error: boolean;
}

const initialState: MessageState = {
  allMessages: [],
  currentActiveChat: "",
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
    fetchMessagesSending: (state) => {
      state.sending = true;
    },
    fetchMessagesSent: (state) => {
      state.loading = false;
      state.sending = false;
      state.sent = true;
     },
    fetchMessagesError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      const nowChattingWith = action.payload;
      state.currentActiveChat = nowChattingWith;
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
