import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "reduxStates/taskSlice";
import chatReducer from "reduxStates/chatSlice";
import authReducer from "reduxStates/authSlice";
import messageReducer from "reduxStates/messageSlice";

export const store = configureStore({
  reducer: { tasks: taskReducer, chats: chatReducer, auth: authReducer, messages: messageReducer},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
