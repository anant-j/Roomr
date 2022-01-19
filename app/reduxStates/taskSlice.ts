import { AnyAction, createAsyncThunk, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit'
import { onSnapshot } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

const listenerUnsubscribeList = [];


export interface TaskState {
    allTasks: string[]
    loading: boolean
    error: any
}

const initialState: TaskState = {
    allTasks: [],
    loading: false,
    error: null
}

export const fetchTasks = () => {
    return (dispatch: any) => {

        dispatch(fetchTasksPending())
        const unsub = onSnapshot(
            doc(db, "user1", "data"),
            (doc: any) => {
                const updatedTasks = doc.data().taskList
                dispatch(fetchTasksFulfilled(updatedTasks))
            },
            error => { dispatch(fetchTasksError(error)) });

        listenerUnsubscribeList.push(unsub);

    }
}

export const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        fetchTasksFulfilled: (state, action) => {
            state.loading = false
            const newTasks = action.payload
            state.allTasks = newTasks
        },
        fetchTasksPending: (state) => {
            state.loading = true
        },
        fetchTasksError: (state, action) => {
            const error = action.payload
            state.error = error
        },
        addTask: (state, action: PayloadAction<string>) => {
            const newTask = action.payload
            state.allTasks = [...state.allTasks, newTask]
        },
        removeTask: (state, action: PayloadAction<number>) => {
            const indexToRemove = action.payload
            state.allTasks = state.allTasks.filter((_: any, index: number) => index !== indexToRemove)
        }
    }
})

// Action creators are generated for each case reducer function
export const { fetchTasksFulfilled, fetchTasksError, fetchTasksPending, addTask, removeTask } = taskSlice.actions

export default taskSlice.reducer