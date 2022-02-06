import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

interface TaskObject {
  completed: boolean;
  content: string;
  createdBy: string;
  createdOn: string;
  due: string;
}

export interface TaskState {
  allTasks: TaskObject[];
  loading: boolean;
  error: any;
}

const initialState: TaskState = {
  allTasks: [],
  loading: false,
  error: null,
};

export const addTask = (payload: string, houseID: string, email) => {
  return async (dispatch: any) => {
    dispatch(addTaskPending());
    try {
      await addDoc(collection(db, `houses/${houseID}/tasks`), {
        content: payload,
        createdBy: email,
        createdOn: new Date(),
        due: new Date(),
      });
    } catch (error: any) {
      dispatch(addTaskError(error));
    }
  };
};

export const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    // Redux Toolkit allows us to write "mutating" logic in reducers. It
    // doesn't actually mutate the state because it uses the Immer library,
    // which detects changes to a "draft state" and produces a brand new
    // immutable state based off those changes
    fetchTasksFulfilled: (state, action) => {
      state.loading = false;
      const newTasks = action.payload.tasks;
      state.allTasks = newTasks;
    },
    fetchTasksPending: (state) => {
      state.loading = true;
    },
    fetchTasksError: (state, action) => {
      const error = action.payload;
      state.error = error;
    },
    addTaskPending: (state) => {
      state.loading = true;
    },
    addTaskError: (state, action: PayloadAction<string>) => {
      const error = action.payload;
      state.error = error;
    },
    removeTask: (state, action: PayloadAction<number>) => {
      const indexToRemove = action.payload;
      state.allTasks = state.allTasks.filter(
        (_: any, index: number) => index !== indexToRemove,
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchTasksFulfilled,
  fetchTasksError,
  fetchTasksPending,
  addTaskPending,
  addTaskError,
  removeTask,
} = taskSlice.actions;

export default taskSlice.reducer;
