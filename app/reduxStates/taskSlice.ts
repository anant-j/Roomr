import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { collection, addDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
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
  completionPercentage: number;
  loading: boolean;
  error: any;
}

const initialState: TaskState = {
  allTasks: [],
  completionPercentage: 0,
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
        completed: false,
      });
    } catch (error: any) {
      dispatch(modifyTaskError(error));
    }
  };
};

export const completeTaskThunk = (task: object) => {
  return async (dispatch: any, getState: any) => {
    const { id, createdOn, due } = task;
    dispatch(modifyTaskPending());
    const houseID = getState().auth.houses[0];
    setDoc(doc(db, `houses/${houseID}/tasks`, id), {
      ...task,
      createdOn: new Date(createdOn),
      due: new Date(due),
      completed: true,
    })
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
    setCompletionPercentage: (state, action) => {
      const percentage = action.payload;
      state.completionPercentage = percentage;
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
  setCompletionPercentage,
} = taskSlice.actions;

export default taskSlice.reducer;
