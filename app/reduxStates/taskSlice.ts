import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

interface TaskObject {
  completed: boolean;
  content: string;
  createdBy: string;
  createdOn: string;
  due: string;
  id: string;
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
    modifyTaskPending: (state) => {
      state.loading = true;
    },
    modifyTaskError: (state, action: PayloadAction<string>) => {
      const error = action.payload;
      state.error = error;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  fetchTasksFulfilled,
  fetchTasksError,
  fetchTasksPending,
  modifyTaskPending,
  modifyTaskError,
} = taskSlice.actions;

export default taskSlice.reducer;
