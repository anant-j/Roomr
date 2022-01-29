import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface chatObject {
  id: string;
  name: string;
  lastMessageTimeElapsed: string;
  chatIcon: string;
}

export interface ChatState {
  allChats: chatObject[];
  currentActiveChat: string;
  loading: boolean;
  error: any;
}

const initialState: ChatState = {
  allChats: [],
  currentActiveChat: "",
  loading: false,
  error: null,
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
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchChatsFulfilled,
  fetchChatsError,
  fetchChatsPending,
  setActiveChat,
} = chatSlice.actions;

export default chatSlice.reducer;
