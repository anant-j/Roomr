import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import moment from "moment";
import { db } from "../firebase";

export interface TaskObject {
  completed: boolean;
  content: string;
  createdBy: string;
  createdOn: string;
  due: string;
  id: string;
  notes: string;
  repeatType: string;
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

const occurenceDateFormat = "MMMM DD YYYY";

export const addTask = (payload: object) => {
  const { content, houseID, email, notes, occurrences, repeatType } = payload;
  return async (dispatch: any) => {
    dispatch(modifyTaskPending());
    try {
      await addDoc(collection(db, `houses/${houseID}/tasks`), {
        content: content,
        createdBy: email,
        createdOn: new Date(),
        notes: notes,
        completed: false,
        repeatType: repeatType,
        occurrences: occurrences,
      });
    } catch (error: any) {
      dispatch(modifyTaskError(error));
    }
  };
};

export const completeTaskThunk = (task: object) => {
  return async (dispatch: any, getState: any) => {
    const { id, due, assignedTo, completed } = task;
    dispatch(modifyTaskPending());
    const houseID = getState().auth.houses[0];
    const thisDoc = doc(db, `houses/${houseID}/tasks`, id);
    const formattedDueDate = moment(new Date(due)).format(occurenceDateFormat);

    updateDoc(thisDoc, {
      [`occurrences.${formattedDueDate}`]: {
        assignedTo: assignedTo,
        completed: !completed,
      },
    }).catch((error) => {
      dispatch(modifyTaskError(error));
    });
  };
};

export const editTask = (task: object) => {
  return async (dispatch: any, getState: any) => {
    const {
      id,
      content,
      oldDueDate,
      newDueDate,
      notes,
      completed,
      assignedTo,
    } = task;
    dispatch(modifyTaskPending());

    const houseID = getState().auth.houses[0];
    const thisDoc = doc(db, `houses/${houseID}/tasks`, id);
    const formattedOldDueDate = moment(new Date(oldDueDate)).format(
      occurenceDateFormat,
    );
    const formattedNewDueDate = moment(new Date(newDueDate)).format(
      occurenceDateFormat,
    );

    updateDoc(thisDoc, {
      content: content,
      notes: notes,
      [`occurrences.${formattedOldDueDate}`]: deleteField(),
      [`occurrences.${formattedNewDueDate}`]: {
        completed: completed,
        assignedTo: assignedTo,
      },
    }).catch((error) => {
      dispatch(modifyTaskError(error));
    });
  };
};

export const deleteAllTaskOccurrences = (taskID: string) => {
  return async (dispatch: any, getState: any) => {
    dispatch(modifyTaskPending());
    const houseID = getState().auth.houses[0];
    deleteDoc(doc(db, `houses/${houseID}/tasks`, taskID)).catch((error) => {
      dispatch(modifyTaskError(error));
    });
  };
};

export const deleteSingleTaskOccurrence = (task: TaskObject) => {
  return async (dispatch: any, getState: any) => {
    const { id, due } = task;
    const formattedDue = moment(new Date(due)).format(occurenceDateFormat);
    dispatch(modifyTaskPending());

    const houseID = getState().auth.houses[0];
    const thisDoc = doc(db, `houses/${houseID}/tasks`, id);

    updateDoc(thisDoc, {
      [`occurrences.${formattedDue}`]: deleteField(),
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
