import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TaskState {
    allTasks: string[]
}

const initialState: TaskState = {
    allTasks: [],
}

export const taskSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        // Redux Toolkit allows us to write "mutating" logic in reducers. It
        // doesn't actually mutate the state because it uses the Immer library,
        // which detects changes to a "draft state" and produces a brand new
        // immutable state based off those changes
        addTask: (state, action: PayloadAction<string>) => {
            console.log("push on: ", state.allTasks)
            state.allTasks.push(action.payload)
            console.log("res: ", state.allTasks)
        },
        removeTask: (state, action: PayloadAction<number>) => {
            const indexToRemove = action.payload
            state.allTasks = state.allTasks.filter((_, index) => index !== indexToRemove)
        }
    },
})

// Action creators are generated for each case reducer function
export const { addTask, removeTask } = taskSlice.actions

export default taskSlice.reducer