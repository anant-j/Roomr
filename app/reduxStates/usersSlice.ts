import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LandlordObject {
  name: string;
  email: string;
}
export interface usersState {
  tenants: object;
  landlord: LandlordObject;
}

const initialState: usersState = {
  tenants: {},
  landlord: {
    email: "",
    name: "",
  },
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    updateTenants: (state, action: PayloadAction<object[]>) => {
      state.tenants = action.payload;
    },
    updateLandlord: (state, action: PayloadAction<LandlordObject>) => {
      state.landlord = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateTenants, updateLandlord } = usersSlice.actions;

export default usersSlice.reducer;
