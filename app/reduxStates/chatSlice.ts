import { createSlice, PayloadAction } from "@reduxjs/toolkit";
export interface ChatState {
  allChats: object;
  currentActiveChat: string;
  loading: boolean;
  error: boolean;
  loadingMsg: boolean;
  sendingMsg: boolean;
  sentMsg: boolean;
  errorMsg: boolean;
}

const initialState: ChatState = {
  allChats: {},
  currentActiveChat: "",
  loading: false,
  error: null,
  loadingMsg: false,
  sendingMsg: false,
  sentMsg: false,
  errorMsg: false,
};

export const createChats = (tenants, landlord) => {
  return async (dispatch: any, getState: any) => {
    dispatch(fetchChatsPending());
    const data = {};
    for (const tenant of Object.keys(tenants)) {
      if (tenant !== getState().auth.email) {
        // console.log(tenant);
        data[tenant] = {
          name: tenants[tenant],
          lastMessageTimeElapsed: "27m",
        };
      }
    }
    if (landlord) {
      data[landlord.email] = {
        id: landlord.email,
        name: landlord.name,
        lastMessageTimeElapsed: "27m",
      };
    }
    dispatch(fetchChatsFulfilled(data));
  };
};

export const updateMessage = (id: any, message: any) => {
  return async (dispatch: any, getState: any) => {
    dispatch(fetchMessagesPending());
    if (message.to[0] == getState().auth.email) {
      message["to"] = [message.from];
    }
    let makeNewMap = true;
    if (
      getState().chats.allChats &&
      getState().chats.allChats[message.to[0]] &&
      getState().chats.allChats[message.to[0]]["messages"]
    ) {
      makeNewMap = false;
    }
    message["sentAt"] = new Date().toString();
    dispatch(fetchMessagesFulfilled({ id, message, makeNewMap }));
  };
  // const messages = {
  //   "landlord@roomr.com": {
  //     "1234": {
  //       content: "hello",
  //       from: "tenant@roomr.com",
  //       to: ["lanlord@roomr.com"],
  //       sentAt: new Date().toString(),
  //     },
  //     "4567": {
  //       content: "Test",
  //       from: "landlord@roomr.com",
  //       to: ["tenant@roomr.com"],
  //       sentAt: new Date().toString(),
  //     },
  //   },
  // };
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
      if (!state.allChats[action.payload.message.to[0]]) {
        state.allChats[action.payload.message.to[0]] = {};
      }
      if (!state.allChats[action.payload.message.to[0]]["messages"]) {
        state.allChats[action.payload.message.to[0]]["messages"] = {};
      }
      state.allChats[action.payload.message.to[0]]["messages"][
        action.payload.id
      ] = {};
      state.allChats[action.payload.message.to[0]]["messages"][
        action.payload.id
      ] = action.payload.message;
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
