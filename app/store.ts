import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "reduxStates/taskSlice";
import chatReducer from "reduxStates/chatSlice";
import authReducer from "reduxStates/authSlice";
import usersReducer from "reduxStates/usersSlice";
import emergencyReducer from "reduxStates/emergencySlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducer,
    chats: chatReducer,
    auth: authReducer,
    users: usersReducer,
    emergency: emergencyReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
