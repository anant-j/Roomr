import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface usersState {
  tenants: object;
  landlord: object;
}

const initialState: usersState = {
  tenants: {},
  landlord: {},
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateTenants: (state, action: PayloadAction<object[]>) => {
      state.tenants = action.payload;
    },
    updateLandlord: (state, action: PayloadAction<object[]>) => {
      state.landlord = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTenants } = usersSlice.actions;

export default usersSlice.reducer;
