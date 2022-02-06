import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface chatObject {
  id: string;
  name: string;
  lastMessageTimeElapsed: string;
  chatIcon: string;

  idMsg: string;
  from: string;
  timeSent: string;
  content: string;
}

export interface ChatState {
  allChats: chatObject[];
  currentActiveChat: string;
  loading: boolean;
  error: boolean;

  allMessages: chatObject[];
  loadingMsg: boolean;
  sendingMsg: boolean;
  sentMsg: boolean;
  errorMsg: boolean;
}

const initialState: ChatState = {
  allChats: [],
  currentActiveChat: "",
  loading: false,
  error: null,

  allMessages: [],
  loadingMsg: false,
  sendingMsg: false,
  sentMsg: false,
  errorMsg: false,
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    fetchChatsFulfilled: (state, action) => {
      state.loading = false;
      const currentChats = action.payload;
      state.allChats = currentChats;
    },
    fetchChatsPending: (state) => {
      state.loading = true;
    },
    fetchChatsError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
    setActiveChat: (state, action: PayloadAction<string>) => {
      const nowChattingWith = action.payload;
      state.currentActiveChat = nowChattingWith;
    },

    fetchMessagesFulfilled: (state, action) => {
      state.loadingMsg = false;
      const currentMessages = action.payload;
      state.allMessages = currentMessages;
    },
    fetchMessagesPending: (state) => {
      state.loadingMsg = true;
    },
    fetchMessagesSending: (state) => {
      state.sendingMsg = true;
    },
    fetchMessagesSent: (state) => {
      state.loadingMsg = false;
      state.sendingMsg = false;
      state.sentMsg = true;
    },
    fetchMessagesError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchChatsFulfilled,
  fetchChatsError,
  fetchChatsPending,
  setActiveChat,

  fetchMessagesFulfilled,
  fetchMessagesPending,
  fetchMessagesSending,
  fetchMessagesSent,
  fetchMessagesError,
} = chatSlice.actions;

export default chatSlice.reducer;
