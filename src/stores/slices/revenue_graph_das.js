import { createSlice } from "@reduxjs/toolkit";

const revenueSlice = createSlice({
    name: "revenueGraph",
    initialState: {
        revenueData: [],
    },
    reducers: {
        setRevenueData: (state, action) => {
            state.revenueData = action.payload;
        },
    },
});

export const { setRevenueData } = revenueSlice.actions;
export default revenueSlice.reducer;